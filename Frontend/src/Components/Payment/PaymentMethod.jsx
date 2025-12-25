import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const PaymentMethod = ({ discountedPrice }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const paypalRef = useRef();

  const {
    userId,
    movieTitle,
    selectedSeats = [],
    showtimeId,
    selectedDate,
    selectedTime,
  } = location.state || {};

  const API_BASE_URL = "http://localhost:5000/api";

  const [user, setUser] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [error, setError] = useState(null);

  const seatsArray = Array.isArray(selectedSeats) ? selectedSeats : [];
  const seatsText = seatsArray.length ? seatsArray.join(", ") : "N/A";
  const priceUSD = ((discountedPrice || 0) / 300).toFixed(2);

  useEffect(() => {
    if (!userId || !showtimeId) {
      setError("Invalid booking data");
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await fetch(`${API_BASE_URL}/auth/${userId}`);
        const showRes = await fetch(`${API_BASE_URL}/showtimes/${showtimeId}`);

        if (!userRes.ok || !showRes.ok) throw new Error("Fetch failed");

        setUser(await userRes.json());
        setShowtime(await showRes.json());
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [userId, showtimeId]);

  useEffect(() => {
    if (error || !user || !showtime) return;

    if (window.paypal) {
      renderButtons();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD`;
    script.onload = renderButtons;
    document.body.appendChild(script);
  }, [user, showtime, error]);

  const renderButtons = () => {
    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: { value: priceUSD },
              description: `Movie: ${movieTitle || "N/A"} | Seats: ${seatsText} | Date: ${selectedDate || "N/A"} | Time: ${selectedTime || "N/A"}`,
            },
          ],
        });
      },

      onApprove: async (data, actions) => {
        const details = await actions.order.capture();

        await fetch(`${API_BASE_URL}/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            showtimeId,
            seats: seatsArray,
            paymentId: details.id,
            amount: discountedPrice,
          }),
        });

        emailjs.send(
          "YOUR_SERVICE_ID",
          "YOUR_TEMPLATE_ID",
          {
            to_email: user.email,
            movie: movieTitle,
            seats: seatsText,
            date: selectedDate,
            time: selectedTime,
          },
          "YOUR_PUBLIC_KEY"
        );

        navigate("/BookingConfirmation");
      },

      onError: (err) => {
        console.error("PayPal Error:", err);
      },
    }).render(paypalRef.current);
  };

  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return <div ref={paypalRef}></div>;
};

export default PaymentMethod;
