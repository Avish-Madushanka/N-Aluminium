import React from 'react';
import WasteHeader from '../Components/WasteCollect/WasteHeader';
import WasteDes from '../Components/WasteCollect/WasteDes';
import WastePickForm from '../Components/WasteCollect/WastePickForm';

const Collection = () => {
  return (
    <div>
      <WasteHeader />
      <WasteDes />
      <WastePickForm />
    </div>
  );
};

export default Collection;