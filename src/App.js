import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Index from "./pages/index"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
