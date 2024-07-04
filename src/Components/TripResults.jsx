import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import { functions, handleFunctionCall } from "../tools";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const messages = [
  {
    role: "system",
    content:
      "You are a helpful AI agent. Give highly specific answers based on the information you're provided. Prefer to gather information with the tools provided to you rather than giving basic, generic answers. keep the response not more than two lines and specific to the question",
  },
];

async function agent(query) {
  messages.push({
    role: "user",
    content: query,
  });

  const runner = openai.beta.chat.completions
    .runTools({
      model: "gpt-3.5-turbo",
      messages,
      tools: functions,
    })
    .on("function_call", async (message) => {
      const { name, parameters } = message;
      try {
        const result = await handleFunctionCall(name, parameters);
        runner.handleFunctionCallResult(result);
      } catch (error) {
        runner.handleFunctionCallError(error.message);
      }
    })
    .on("message", (message) => console.log(message));

  const finalContent = await runner.finalContent();
  messages.push({ role: "system", content: finalContent });

  return finalContent;
}

function TripResults({ onEnd }) {
  const formData = JSON.parse(localStorage.getItem("formData"));

  const weatherQuery = `Please provide the weather in ${formData.destination}. Do not include the forecast in the repsonse. Strictly response should contain only weather `;

  const flightQuery = `Please recommend the best available flight from ${formData.departure} to ${formData.destination} on ${formData.fromDate}. Include flight times, airlines, and prices. Do not mention anything to do with weather here. Response should not be more than two lines. final response should only include information about the flight`;

  const hotelQuery = `Recommend the best hotel in ${formData.destination} checkin date ${formData.fromDate}. Provide the recommendation in not more than two lines. don't include weather information in the response. final response should not be more that three lines`;

  const [weatherResponse, setWeatherResponse] = useState("");
  const [flightResponse, setFlightResponse] = useState("");
  const [hotelResponse, setHotelResponse] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const weather = await agent(weatherQuery);
        setWeatherResponse(weather);

        const flight = await agent(flightQuery);
        setFlightResponse(flight);

        const hotel = await agent(hotelQuery);
        setHotelResponse(hotel);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResponses();
  }, [weatherQuery, flightQuery, hotelQuery]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-center font-bold text-5xl py-6">Your Trip</h1>
      <div className="flex justify-between">
        <div className="bg-[#BBF7F7] w-40 h-10  shadow-xl rounded-3xl flex items-center justify-center gap-1 font-bold border-2 border-slate-100">
          <p>
            <i className="fas fa-arrow-right text-sm"></i>
          </p>
          <p className=" text-xl">{formData.fromDate}</p>
        </div>

        <div className="bg-[#BBF7F7] w-40 h-10 shadow-xl rounded-3xl flex items-center justify-center gap-1 font-bold border-2 border-slate-100">
          <p className=" text-xl">{formData.toDate}</p>
          <p>
            <i className="fas fa-arrow-left text-sm"></i>
          </p>
        </div>
      </div>

      <div className="bg-[#BBF7F7]  shadow-xl rounded-3xl flex items-center justify-center gap-2 h-16 font-bold border-2 border-slate-100">
        <p className=" text-xl">{formData.departure} </p>
        <p>
          <i className="fas fa-arrow-right text-sm"></i>
        </p>
        <p className=" text-xl">{formData.destination}</p>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-center font-bold text-3xl">Weather</h1>
        <div className="bg-[#BBF7F7]  shadow-xl rounded-3xl  gap-2 min-h-20 border-2 border-slate-100 px-6 py-3">
          <p className=" text-base">{weatherResponse}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-center font-bold text-3xl">Flights</h1>
        <div className="flex flex-col bg-[#BBF7F7]  shadow-xl rounded-3xl  gap-2 min-h-20 border-2 border-slate-100 px-6 py-3">
          <p className=" text-base">{flightResponse}</p>
          <button className="py-1 border-2 border-black rounded-2xl bg-[#4BDCB0] font-semibold">
            Book
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-center font-bold text-3xl">Hotel</h1>
        <div className="flex flex-col bg-[#BBF7F7]  shadow-xl rounded-3xl  gap-2 min-h-20 border-2 border-slate-100 px-6 py-3">
          <p className=" text-base">{hotelResponse}</p>
          <button className="py-1 border-2 border-black rounded-2xl bg-[#4BDCB0] font-semibold">
            Book
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <button
          onClick={onEnd}
          className="py-1 border-2 border-black rounded-2xl bg-[#4BDCB0] font-semibold">
          Plan again!
        </button>
      </div>
    </div>
  );
}
export default TripResults;
