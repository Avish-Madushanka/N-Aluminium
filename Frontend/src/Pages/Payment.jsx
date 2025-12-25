import React from 'react'
import PaymentMethod from '../Components/Payment/PaymentMethod'
import Payments from '../Components/Payment/Payments'
import PromoCode from '../Components/Payment/PromoCode'
import UserDetails from '../Components/Payment/UserDetails'

const Payment = () => {
  return (
    <>
      <PaymentMethod />
      <Payments />
      <PromoCode />
      <UserDetails />
    </>
  )
}

export default Payment