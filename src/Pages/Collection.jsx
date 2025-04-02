import React from 'react';
import WasteHeader from '../Components/WasteCollect/WasteHeader';
import WasteMain from '../Components/WasteCollect/WasteMain';
import CollectMap from '../Components/Maps/CollectMap';
import Calculator from '../Components/Calculate/Calculate';


const Collection = () => {
  return (
    <div>
      <WasteHeader />
      \<WasteMain />
      <CollectMap />
      <Calculator />
    </div>
  );
};

export default Collection;