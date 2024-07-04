import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Home from "./Components/Home";
import BookingForm from "./Components/BookingForm";
import TripResults from "./Components/TripResults";

function App() {
  const [count, setCount] = useState(0);
  const [currentView, setCurrentView] = useState("home");
  const [formData, setFormData] = useState({
    travellers: 1,
    departure: "",
    destination: "",
    fromDate: "",
    toDate: "",
    budget: `$ `,
  });

  const goToBookingForm = () => setCurrentView("bookingForm");
  const goToTripResults = () => setCurrentView("tripResults");
  const planAgain = () => {
    localStorage.removeItem("formData");
    setCurrentView("bookingForm");
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-[390px] h-screen px-4 ">
        {currentView === "home" && <Home onBegin={goToBookingForm} />}
        {currentView === "bookingForm" && (
          <BookingForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={goToTripResults}
          />
        )}
        {currentView === "tripResults" && (
          <TripResults formData={formData} onEnd={planAgain} />
        )}
      </div>
    </div>
  );
}

export default App;
