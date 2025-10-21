import React from 'react';
import './AluTRegMain.css';
import {
  FaRecycle,
  FaLightbulb,
  FaTools,
  FaBuilding,
  FaClipboardList,
  FaCheckCircle,
  FaFileAlt,
  FaUserEdit
} from 'react-icons/fa';

function AluTRegMain() {
  return (
    <div className="AluTRegMain">
      <section className="Alu-hero-container">
      <div className="Alu-hero-left">
        <p className="Alu-hero-subtitle">Welcome to</p>
        <h1 className="Alu-hero-title">
          Our Aluminum <br />
          <span>Training Program</span>
        </h1>
        <p className="Alu-hero-description">
          Through this program, participants will gain practical knowledge of aluminum collection, sorting, recycling processes, and reuse applications that support a cleaner environment and stronger economy. Whether you’re a student, an industry worker, or simply passionate about sustainability, our training sessions will help you develop valuable skills and become a part of the circular economy movement.
        </p>
      </div>

      <div className="Alu-hero-right">
        <div className="Alu-hero-card">
          <img
            src="https://img.freepik.com/free-photo/factory-worker-working-warehouse-handling-metal-material-production_342744-213.jpg"
          />
        </div>
        <div className="Alu-hero-card">
          <img
            src="https://www.reynaers.se/sites/default/files/public/styles/image_square/public/2023-09/_RVV0365.jpg?h=fb602626&itok=qNZA7v1q"
          />
        </div>
        <div className="Alu-hero-card">
          <img
            src="https://uk.aluk.com/uploads/editor/images/Academy-Training-AluK.JPG"
          />
        </div>
      </div>
    </section>
    </div>
  );
}

export default AluTRegMain;
