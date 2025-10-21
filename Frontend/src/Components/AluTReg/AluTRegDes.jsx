import React from "react";
import "./AluTRegDes.css";
import { FaCheckCircle, FaHandsHelping, FaTools, FaRecycle, FaUsers } from "react-icons/fa"; 

function AluTRegDes() {
  return (
    <div className="practice-areas-page">
      <div className="practice-areas-header">
        <h1 className="main-title">Practice areas</h1>
        <p className="description">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod<br />
          tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      <div className="practice-areas-grid">
        <div className="practice-area-card">
          <span className="card-number">01</span>
          <h2 className="card-title">Domestic Assault</h2>
          <div className="card-underline"></div>
          <p className="card-description">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat duis aute.
          </p>
        </div>

        <div className="practice-area-card">
          <span className="card-number">02</span>
          <h2 className="card-title">Weapons Offences</h2>
          <div className="card-underline"></div>
          <p className="card-description">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat duis aute.
          </p>
        </div>

        <div className="practice-area-card">
          <span className="card-number">03</span>
          <h2 className="card-title">Drug Offences</h2>
          <div className="card-underline"></div>
          <p className="card-description">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat duis aute.
          </p>
        </div>

        <div className="practice-area-card">
          <span className="card-number">04</span>
          <h2 className="card-title">Bail Hearings</h2>
          <div className="card-underline"></div>
          <p className="card-description">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat duis aute.
          </p>
        </div>

        <div className="practice-area-card">
          <span className="card-number">05</span>
          <h2 className="card-title">Property Crime</h2>
          <div className="card-underline"></div>
          <p className="card-description">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat duis aute.
          </p>
        </div>

        <div className="practice-area-card">
          <span className="card-number">06</span>
          <h2 className="card-title">Criminal Harassment</h2>
          <div className="card-underline"></div>
          <p className="card-description">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat duis aute.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AluTRegDes;