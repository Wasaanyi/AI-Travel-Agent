import axios from "axios";

const getLocationData = async (location) => {
  const locationData = JSON.parse(location);
  const endpoint = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    locationData.location
  )}&count=1`;

  try {
    const response = await axios.get(endpoint);
    const data = response.data.results;
    console.log(data);

    if (!data || data.length === 0) {
      throw new Error("Location not found");
    }

    const { latitude, longitude } = data[0];
    return { latitude, longitude };
  } catch (error) {
    console.error(`Error fetching location data: ${error}`);
    throw error;
  }
};

const getWeatherData = async (data) => {
  const dataObject = JSON.parse(data);
  const { longitude, latitude } = dataObject;

  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&current_weather=true&timezone=auto`;

  try {
    const response = await axios.get(endpoint);
    const data = response.data;

    const currentTemperature = data.current_weather.temperature;
    const dailyForecast = data.daily.time.map((date, index) => ({
      date,
      temperature_max: data.daily.temperature_2m_max[index],
      temperature_min: data.daily.temperature_2m_min[index],
      weathercode: data.daily.weathercode[index],
    }));

    return { currentTemperature, dailyForecast };
  } catch (error) {
    console.error(`Error fetching weather data: ${error}`);
    throw error;
  }
};

export const functions = [
  {
    type: "function",
    function: {
      function: getLocationData,
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "Name of the location",
          },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      function: getWeatherData,
      parameters: {
        type: "object",
        properties: {
          latitude: {
            type: "number",
            description: "Latitude of the location",
          },
          longitude: {
            type: "number",
            description: "Longitude of the location",
          },
        },
        required: ["latitude", "longitude"],
      },
    },
  },
];

export const handleFunctionCall = async (functionName, parameters) => {
  switch (functionName) {
    case "getLocationData":
      return await getLocationData(parameters.location);
    case "getWeatherData":
      return await getWeatherData(parameters.latitude, parameters.longitude);
    default:
      throw new Error(`Unknown function: ${functionName}`);
  }
};
