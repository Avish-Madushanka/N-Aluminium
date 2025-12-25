import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PromoCode from './PromoCode.jsx';
import PaymentMethod from './PaymentMethod.jsx';
import UserDetails from './UserDetails.jsx';
import './PaymentMethod.css';

const Payments = () => {
    const location = useLocation();
    const { selectedSeats, totalPrice, selectedDate, selectedTime, showtimeSeatIds, showtimeId, movieTitle, userId } = location.state || {};
    const [discountedPrice, setDiscountedPrice] = useState(totalPrice)
      const [paymentSuccess, setPaymentSuccess] = useState(false);


    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="section">
                    <h1 className="mn-title">{movieTitle}</h1>
                    <p>Date: {selectedDate} | Time: {selectedTime}</p>
                    <p>Selected Seats: {selectedSeats ? selectedSeats.join(', ') : 'No seats selected'}</p>
                    <div className="summary-row summary-total">
                        <span>Total: </span>
                         <span>Rs. {discountedPrice}</span>
                    </div>
                </div>

                 <PromoCode setDiscountedPrice={setDiscountedPrice} totalPrice={totalPrice} />
                <UserDetails />
                  {paymentSuccess ? (
                    <div style={{ color: 'green' }}>Payment and Booking Successful!</div>
                   ) : (
                     <PaymentMethod
                         discountedPrice={discountedPrice}
                         movieTitle={movieTitle}
                         selectedDate={selectedDate}
                         selectedTime={selectedTime}
                          selectedSeats={selectedSeats}
                           userId={userId}
                           showtimeId={showtimeId}
                          showtimeSeatIds={showtimeSeatIds}
                           setPaymentSuccess={setPaymentSuccess}
                        />
                    )}
            </div>
        </div>
    );
};

export default Payments;