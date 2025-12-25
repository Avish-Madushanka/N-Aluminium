import React, { useState } from 'react';

const PromoCode = ({ setDiscountedPrice, totalPrice }) => {
    const [promoCode, setPromoCode] = useState('');
    const [discountMessage, setDiscountMessage] = useState('');
    const [discountedAmount, setDiscountedAmount] = useState(0)

    const handleInputChange = (event) => {
        setPromoCode(event.target.value);
    };

    const applyPromoCode = () => {
      if (promoCode === 'DISCOUNT20') {
            const discount = totalPrice * 0.20;
            setDiscountedAmount(discount);
          setDiscountMessage('20% discount applied!');
          setDiscountedPrice(totalPrice - discount)

        } else if(promoCode === '') {
             setDiscountMessage('Please enter promo code')
             setDiscountedPrice(totalPrice)
              setDiscountedAmount(0)
        } else {
             setDiscountMessage('Invalid promo code.');
             setDiscountedPrice(totalPrice)
             setDiscountedAmount(0)

        }
    };

    return (
        <div className="section">
            <hr />
            <h2 className="title">Have A Promo Code?</h2>
            <div className="promo-code-input">
                <input
                    type="text"
                    placeholder="Have A Promo Code?"
                    className="input"
                    value={promoCode}
                    onChange={handleInputChange}
                />
                <button className="button button-primary" onClick={applyPromoCode}>
                    Submit
                </button>
            </div>
           {discountMessage && <p>{discountMessage}</p>}
        </div>
    );
};

export default PromoCode;