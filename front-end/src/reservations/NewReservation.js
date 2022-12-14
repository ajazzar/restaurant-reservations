import React, { useState, useEffect } from "react";
import { createReservations } from "../utils/api";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";
import tables from "../images/tables-bg.jpg";

export default function NewReservation() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const history = useHistory();
  const [formData, setFormData] = useState({ ...initialFormState });
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    const abortController = new AbortController();
    async function getData() {
      try {
        setFormData({ ...initialFormState });
      } catch (error) {
        setError(error);
      }
    }
    getData();
    return () => abortController.abort();
    // eslint-disable-next-line
  }, []);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleNumber = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: Number(target.value),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const controller = new AbortController();
    try {
      await createReservations(formData, controller.signal);
      history.push(`/dashboard?date=${formData.reservation_date}`);
      setFormData({ ...initialFormState });
    } catch (error) {
      setError(error);
    }
    return () => controller.abort();
  };

  return (
    <div
      style={{ backgroundImage: `url(${tables})` }}
      className="w-full h-full min-h-screen bg-no-repeat bg-cover bg-top"
    >
      <h2 className="font-bold text-teal-700 text-center text-3xl md:text-5xl mx-2 p-3">
        Create a Reservation
      </h2>

      <ErrorAlert error={error} />
      <ReservationForm
        handleSubmit={handleSubmit}
        handleNumber={handleNumber}
        handleChange={handleChange}
        formData={formData}
        history={history}
      />
    </div>
  );
}
