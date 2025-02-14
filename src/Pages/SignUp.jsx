import React from 'react';
import RegistrationForm from '../Components/RegistrationForm/RegistrationForm';
import BOwnerForm from '../Components/RegistrationForm/BOwnerForm';
import ClientForm from '../Components/RegistrationForm/ClientForm';

const SignUp = () => {
  return (
    <div>
      <RegistrationForm />
      <BOwnerForm />
      <ClientForm />
    </div>
  );
};

export default SignUp;