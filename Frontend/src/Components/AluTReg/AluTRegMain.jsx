import React from 'react';
import './AluTRegMain.css';
import { Link } from "react-router-dom";
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
            Through this program, participants will gain practical knowledge of aluminum collection,
            sorting, recycling processes, and reuse applications that support a cleaner environment
            and stronger economy. Whether you’re a student, an industry worker, or simply passionate
            about sustainability, our training sessions will help you develop valuable skills and become
            a part of the circular economy movement.
          </p>

          <a href="/AluTRegForm" className="Alu-hero-btn">
            Register Now
          </a>
          <a href="/AluRegVideoUp" className="Alu-hero-btn1">
            Register Now
          </a>
        </div>

        <div className="Alu-hero-right">
          <div className="Alu-hero-card">
            <img
              src="https://img.freepik.com/free-photo/factory-worker-working-warehouse-handling-metal-material-production_342744-213.jpg"
              alt="Aluminum Workshop"
            />
          </div>
          <div className="Alu-hero-card">
            <img
              src="https://media.istockphoto.com/id/2048609690/photo/professional-man-worker-engaged-in-assembly-of-pvc-doors-and-windows.jpg?s=612x612&w=0&k=20&c=qudVdpjl43XYSHE7UjhVWWiDXlf1AQ6F-L27IMJHR_c="
              alt="Worker Assembling Windows"
            />
          </div>
          <div className="Alu-hero-card">
            <img
              src="https://www.reynaers.se/sites/default/files/public/styles/image_square/public/2023-09/_RVV0365.jpg?h=fb602626&itok=qNZA7v1q"
              alt="Aluminum Frame Production"
            />
          </div>
        </div>
      </section>

       <div className="AT4-cta-bar">
      <div className="AT4-content">
        <p className="AT4-subheading">GET A QUOTE —</p>
        <h2 className="AT4-heading">HAVE A QUESTION? WE’RE HAPPY TO HELP!</h2>
        <p className="AT4-description">
          Our team is ready to assist you with any inquiries or custom requirements.
          Reach out today to get personalized guidance and the best solutions for your aluminum recycling or training needs.
        </p>
      </div>
        <Link to="/ContactUs">
          <button className="AT4-button">CONTACT US</button>
        </Link>
    </div>
    </div>
  );
}

export default AluTRegMain;