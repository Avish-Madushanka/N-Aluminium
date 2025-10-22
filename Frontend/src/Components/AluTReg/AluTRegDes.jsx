import React from "react";
import "./AluTRegDes.css";

function AluTRegDes() {
  const cards = [
    {
      title: "Aluminum Cutting Techniques",
      desc: "Learn how to measure, mark, and cut aluminum profiles accurately using hand and machine tools. Focus on precision, edge finishing, and tool safety.",
      icon: "https://cdn-icons-png.flaticon.com/128/3306/3306000.png",
    },
    {
      title: "Window & Door Fabrication",
      desc: "Gain knowledge in designing and assembling modern aluminum doors and windows with practical installation guidance.",
      icon: "https://cdn-icons-png.flaticon.com/128/1353/1353091.png",
    },
    {
      title: "Frame Assembly & Fittings",
      desc: "Understand how to assemble aluminum frames securely and efficiently with professional finishing standards.",
      icon: "https://cdn-icons-png.flaticon.com/128/2703/2703995.png",
    },
    {
      title: "Pantry Cupboards & Custom Designs",
      desc: "Master the creation of pantry cupboards, cabinets, and decorative furniture using stylish aluminum frames.",
      icon: "https://cdn-icons-png.flaticon.com/128/18126/18126311.png",
    },
    {
      title: "Tool Handling & Safety",
      desc: "Learn how to properly use workshop tools and ensure personal and environmental safety during operations.",
      icon: "https://cdn-icons-png.flaticon.com/128/972/972998.png",
    },
    {
      title: "Recycling & Sustainability",
      desc: "Discover the importance of recycling leftover materials and using eco-friendly methods to reduce industrial waste.",
      icon: "https://cdn-icons-png.flaticon.com/128/91/91394.png",
    },
  ];

  return (
    <div className="AluT-container">
      <header className="AluT-header">
        <h1 className="AluT-title">Aluminum Workshop Training</h1>
        <p className="AluT-subtitle">
          Learn hands-on aluminum fabrication skills — from precise cutting to
          elegant product design. Join our beginner-friendly training courses
          and start your journey toward a professional aluminum career.
        </p>
      </header>

      <section className="AluT-grid">
        {cards.map((card, index) => (
          <div className="AluT-card" key={index}>
            <div className="AluT-icon">
              <img src={card.icon} alt={card.title} />
            </div>
            <h2>{card.title}</h2>
            <p>{card.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default AluTRegDes;
