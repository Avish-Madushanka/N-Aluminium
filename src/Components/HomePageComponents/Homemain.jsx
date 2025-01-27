import React from 'react';
import Slider from '../../Components/HomePageComponents/HomeSliding';
import '../../css/Homemain.css'

function App() {
  return (
    <div className="App">
      <Slider>
        <div className='slide1'>
          <h1>Slide 1</h1>
          <p>This is the first slide.</p>
          <img src="https://placekitten.com/600/400" alt="Cat 1" />
        </div>
        <div className='slide2'>
          <h1>Slide 2</h1>
          <p>This is the second slide.</p>
            <img src="https://placekitten.com/600/401" alt="Cat 2" />
        </div>
        <div className='slide3'>
          <h1>Slide 3</h1>
            <p>This is the third slide.</p>
             <img src="https://placekitten.com/600/402" alt="Cat 3" />
        </div>
      </Slider>
    </div>
  );
}

export default App;