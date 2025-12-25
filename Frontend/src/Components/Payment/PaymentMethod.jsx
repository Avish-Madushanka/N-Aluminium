import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const PaymentMethod = ({ discountedPrice, movieTitle, selectedDate, selectedTime, selectedSeats, userId, showtimeId, showtimeSeatIds, setPaymentSuccess }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [scriptError, setScriptError] = useState(false);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [showtimeDetails, setShowtimeDetails] = useState(null);


     const API_BASE_URL = 'http://localhost:27017/api';

    useEffect(() => {
       const fetchUserDetails = async () => {
            try{
              const response = await fetch(`${API_BASE_URL}/auth/${userId}`)
              if(!response.ok){
               throw new Error(`HTTP error! status: ${response.status}`)
             }
              const data = await response.json();
              setUserDetails(data);
             }
             catch(error){
                console.error("Failed to fetch user details:", error);
             }
         }
          const fetchShowtimeDetails = async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/showtimes/${showtimeId}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
                setShowtimeDetails(data);
            } catch (error) {
                console.error("Failed to fetch showtime details:", error);
            }
        };


         fetchUserDetails();
         fetchShowtimeDetails();

    }, [userId, showtimeId]);

    useEffect(() => {
        const existingScript = document.querySelector('script[src*="paypal"]');

        const handleScriptLoad = () => {
            setScriptLoaded(true);
            if (window.paypal) {
                const buttonContainer = document.getElementById('paypal-button-container');
                if (buttonContainer) {
                    buttonContainer.innerHTML = '';
                }
                window.paypal.Buttons({
                    style: {
                        layout: 'vertical',
                        color: 'gold',
                        shape: 'rect',
                        label: 'paypal'
                    },
                    createOrder: (data, actions) => {
                        const usdAmount = discountedPrice / 300;

                        const description = `Movie: ${movieTitle}, Date: ${selectedDate}, Time: ${selectedTime}, Seats: ${selectedSeats.join(', ')}`;

                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: usdAmount.toFixed(2),
                                    currency_code: 'USD'
                                },
                                description: description
                            }]
                        });
                    },
                    onApprove: async (data, actions) => {
                        try {
                            const order = await actions.order.capture();
                            console.log("Payment successful!", order);

                            const bookingData = {
                                userId: userId,
                                showtimeId: showtimeId,
                                showtimeSeatIds: showtimeSeatIds
                            };

                            const response = await fetch('http://localhost:27017/api/bookings/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(bookingData)
                            });

                             if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(`Booking creation failed: ${errorData.message || 'Unknown error'}`);
                            }

                            const newBooking = await response.json();
                            setPaymentSuccess(true);
                            console.log("Booking successful!", newBooking);

                            // send email
                            if (userDetails && showtimeDetails) {
                              sendEmail(newBooking, userDetails, showtimeDetails);
                            }


                            navigate(`/BookingConfirmation?bookingId=${newBooking._id}`);
                        } catch (error) {
                            console.error("Payment failed or Booking failed:", error);
                            setScriptError(true);
                        }
                    },
                    onError: (err) => {
                        console.error("PayPal Error:", err);
                        setScriptError(true);
                    }
                }).render('#paypal-button-container')
                    .catch(err => {
                        console.error("Render error:", err);
                        setScriptError(true);
                    });
            }
        };

        const handleScriptError = () => {
            console.error("PayPal script failed to load");
            setScriptError(true);
        };

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=AfIVO7Ti9-VJzpR6sKoU1ympvAdOcNwogZY9zGOYXmQroAAVadJtukjeOK51go2ek_e6esOXAW_cVEvH&currency=USD&intent=capture`;
            script.async = true;
            script.onload = handleScriptLoad;
            script.onerror = handleScriptError;
            document.body.appendChild(script);
        } else {
            handleScriptLoad();
        }
    }, [discountedPrice, movieTitle, selectedDate, selectedTime, selectedSeats, userId, showtimeId, showtimeSeatIds, setPaymentSuccess, navigate, userDetails, showtimeDetails]);


   const sendEmail = async (booking, userDetails, showtimeDetails) => {
     const templateParams = {
      ticketNo: booking.ticketNo,
      movieTitle: movieTitle,
      TheatreLocation: showtimeDetails?.screenId?.theatreId?.location || "Unknown Location",
       seatcount: booking.seatCount,
        format: showtimeDetails?.screenId?.format || "Unknown Format",
       seats: selectedSeats.join(","),
       showtime_date: selectedDate,
        showtime_time: selectedTime,
        firstName: userDetails.firstName,
       lastName: userDetails.lastName,
        mobile: userDetails.mobile,
       email: userDetails.email
    };
      try {
        const response = await emailjs.send('service_yfr9uzr', 'template_83lg98t', templateParams, '5kn-C6AOOsXF5Hp_k');

        console.log('Email sent successfully', response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
  };


    return (
        <div className="payment-section">
            <h2 className="text-white text-2xl font-bold mb-6">SELECT YOUR PAYMENT MODE</h2>
            <div className="bg-[#2a2a2a] p-6 rounded-lg">
                <div id="paypal-button-container" className="max-w-md mx-auto" />
                {scriptError && (
                    <div className="text-red-500 text-center mt-4">
                        Something went wrong. Please try again later.
                    </div>
                )}
                {!scriptLoaded && !scriptError && (
                    <div className="text-gray-400 text-center mt-4">
                        Loading payment options...
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentMethod;