import {} from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home'
import Homemain from './Components/Homecomponents/Homemain';


function App() {

  return (
      <div>
       <Router>
       <Routes>
          <Route path="/" element={<Home />} />
          <Route path="Homemain" element={<Homemain />} />
      </Routes>
      </Router>
      </div>
      
  )
}

export default App
