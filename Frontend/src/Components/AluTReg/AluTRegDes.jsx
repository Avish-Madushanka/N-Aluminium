import React from "react";
import "./AluTRegDes.css";
import { FaCut, FaDoorOpen, FaHammer, FaTools, FaCogs, FaRecycle } from "react-icons/fa";

function AluTRegDes() {
  return (
    <div className="AluT-container">
      <header className="AluT-header">
        <h1 className="AluT-title">Aluminum Workshop Training</h1>
        <p className="AluT-subtitle">
          Learn hands-on aluminum fabrication skills — from precise cutting to elegant product design. 
          Join our beginner-friendly training courses and start your journey toward a professional aluminum career.
        </p>
      </header>

      <section className="AluT-grid">
        <div className="AluT-card">
          <FaCut className="AluT-icon" />
          <h2>Aluminum Cutting Techniques</h2>
          <p>
            Learn how to measure, mark, and cut aluminum profiles accurately using hand and machine tools.
            Focus on precision, edge finishing, and tool safety.
          </p>
        </div>

        <div className="AluT-card">
          <FaDoorOpen className="AluT-icon" />
          <h2>Window & Door Fabrication</h2>
          <p>
            Gain knowledge in designing and assembling modern aluminum doors and windows
            with practical installation guidance.
          </p>
        </div>

        <div className="AluT-card">
          <FaHammer className="AluT-icon" />
          <h2>Frame Assembly & Fittings</h2>
          <p>
            Understand how to assemble aluminum frames securely and efficiently with professional finishing standards.
          </p>
        </div>

        <div className="AluT-card">
          <FaCogs className="AluT-icon" />
          <h2>Pantry Cupboards & Custom Designs</h2>
          <p>
            Master the creation of pantry cupboards, cabinets, and decorative furniture using stylish aluminum frames.
          </p>
        </div>

        <div className="AluT-card">
          <FaTools className="AluT-icon" />
          <h2>Tool Handling & Safety</h2>
          <p>
            Learn how to properly use workshop tools and ensure personal and environmental safety during operations.
          </p>
        </div>

        <div className="AluT-card">
          <FaRecycle className="AluT-icon" />
          <h2>Recycling & Sustainability</h2>
          <p>
            Discover the importance of recycling leftover materials and using eco-friendly methods 
            to reduce industrial waste.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AluTRegDes;
