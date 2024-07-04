import React, { useState } from "react";


function BookingForm({ formData, setFormData, onSubmit }) {
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  function handleSubmit(e) {
    e.preventDefault;
    // error handling
    for (let item in formData) {
      if (formData[item] === 0 || formData[item] === "") {
        setFormError(`Fill ${item}`);
        return;
      }
    }
    setFormError("");
    console.log(formData);
    localStorage.setItem("formData", JSON.stringify(formData));
    setFormData({
      travellers: 1,
      departure: "",
      destination: "",
      fromDate: "",
      toDate: "",
      budget: `$ `,
    });

    // moving to results page
    onSubmit();
  }

  return (
    <form className="flex flex-col mt-6">
      {formError && (
        <div className="flex flex-col items-center w-full mt-4">
          <p className="text-red-500">{formError}</p>
        </div>
      )}

      <div className="flex flex-col items-center w-full mt-4">
        <label htmlFor="travellers" className="font-semibold text-xl">
          Number of travellers
        </label>
        <div className="flex justify-between px-2 border-2 border-gray-900 rounded-3xl w-full text-black">
          <div className="px-2 py-1 my-1 bg-gray-900 text-white rounded-full inline-block">
            <i className="fas fa-minus"></i> {/* Rounded coffee icon */}
          </div>
          <input
            id="travellers"
            name="travellers"
            value={formData.travellers}
            onChange={(e) => handleChange(e)}
            className="w-full focus:outline-none text-center"
          />
          <div className="px-2 py-1 my-1 bg-gray-900 text-white rounded-full inline-block">
            <i className="fas fa-plus"></i> {/* Rounded user icon */}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full mt-4">
        <label htmlFor="departure" className="font-semiblod text-xl">
          Flying from
        </label>
        <input
          id="departure"
          placeholder="New York City"
          name="departure"
          value={formData.departure}
          onChange={(e) => handleChange(e)}
          className="w-full focus:outline-none text-center border-2 border-gray-900 rounded-3xl px-2 py-2   text-black my-1"
        />
      </div>

      <div className="flex flex-col items-center w-full">
        <label htmlFor="destination" className="font-semiblod text-xl">
          Flying to
        </label>
        <input
          id="destination"
          placeholder="Paris"
          name="destination"
          value={formData.destination}
          onChange={(e) => handleChange(e)}
          className="w-full focus:outline-none text-center border-2 border-gray-900 rounded-3xl px-2 py-2   text-black my-1"
        />
      </div>
      <div className="flex flex-col items-center w-full mt-4">
        <label htmlFor="fromDate" className="font-semiblod text-xl">
          From Date
        </label>
        <input
          id="fromDate"
          placeholder="2023-11-24"
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={(e) => handleChange(e)}
          className="w-full focus:outline-none text-center border-2 border-gray-900 rounded-3xl px-2 py-2   text-black my-1"
        />
      </div>
      <div className="flex flex-col items-center w-full">
        <label htmlFor="toDate" className="font-semiblod text-xl">
          To Date
        </label>
        <input
          id="toDate"
          placeholder="2023-12-05"
          type="date"
          name="toDate"
          value={formData.toDate}
          onChange={(e) => handleChange(e)}
          className="w-full focus:outline-none text-center border-2 border-gray-900 rounded-3xl px-2 py-2   text-black my-1"
        />
      </div>
      <div className="flex flex-col items-center w-full mt-4">
        <label htmlFor="budget" className="font-semiblod text-xl">
          Budget
        </label>
        <input
          id="budget"
          placeholder="5000"
          name="budget"
          type="text"
          value={formData.budget}
          onChange={(e) => handleChange(e)}
          className="w-full focus:outline-none text-center border-2 border-gray-900 rounded-3xl px-2 py-2   text-black my-1"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className={
          " mt-4 text-2xl py-1 font-semibold border-2 border-black bg-[#4BDCB0] rounded-3xl"
        }>
        Plan my Trip!
      </button>
    </form>
  );
}

export default BookingForm;
