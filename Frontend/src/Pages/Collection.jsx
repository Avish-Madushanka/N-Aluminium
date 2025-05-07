import React from 'react';
import WasteHeader from '../Components/WasteCollect/WasteHeader';
import WasteMain from '../Components/WasteCollect/WasteMain';
import CollectMap from '../Components/Maps/CollectMap';

const Collection = () => {
  return (
    <div>
      <WasteHeader />
      <WasteMain />
      <CollectMap />
    </div>
  );
};

export default Collection;