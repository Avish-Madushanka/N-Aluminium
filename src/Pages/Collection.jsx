import React from 'react';
import WasteHeader from '../Components/WasteCollect/WasteHeader';
import WasteDes from '../Components/WasteCollect/WasteDes';
import WastePickForm from '../Components/WasteCollect/WastePickForm';
import Calendar from '../Components/WasteCollect/Calendar';

const Collection = () => {
  return (
    <div>
      <WasteHeader />
      <WasteDes />
      <WastePickForm />
      <Calendar />
    </div>
  );
};

export default Collection;