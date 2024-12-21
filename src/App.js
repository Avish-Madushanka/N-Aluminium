import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Index from "./pages/index"; 
import Signup from "./pages/signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} /> 
        <Route path="/" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
