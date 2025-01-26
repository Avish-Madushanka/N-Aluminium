import { useState } from 'react'
import './App.css'
import Home from './pages/Home'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <Routes>
          <Route path="/" element={<Home />} />
      </Routes>
      </div>
      
    </>
  )
}

export default App
