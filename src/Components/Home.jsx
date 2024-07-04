import React from "react";

function Home({ onBegin }) {
  return (
    <div className="flex flex-col justify-center  h-full">
      <img src={"images/aiTravelAgent.png"} alt="travel agent" />
      <button
        onClick={onBegin}
        className={
          " text-2xl py-1 font-semibold border-2 border-black bg-[#4BDCB0] rounded-3xl"
        }>
        Let's Begin
      </button>
    </div>
  );
}

export default Home;
