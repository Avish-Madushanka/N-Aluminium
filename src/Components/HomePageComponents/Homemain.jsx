import React from 'react';
import Slider from '../../Components/HomePageComponents/HomeSliding';
import '../../css/Homemain.css'

function App() {
  return (
    <div className="App">
      <Slider>
        <div className='slide1'>
        <img src="https://www.bradnams.com.au/wp-content/uploads/2020/02/Two-White-Double-Hinged-Doors.jpg" alt="Cat 1" />
        </div>
        <div className='slide2'>
            <img src="https://www.swisstekaluminium.com/wp-content/uploads/2022/11/Door-Banner.jpg" alt="Cat 2" />
        </div>
        <div className='slide3'>
            <img src="https://www.bramptonwindows.co.uk/wp-content/uploads/2023/08/Aluminium-Slider-Doors-Black.jpg" alt="Cat 3" /> 
        </div>
      </Slider>
    </div>
  );
}

export default App;