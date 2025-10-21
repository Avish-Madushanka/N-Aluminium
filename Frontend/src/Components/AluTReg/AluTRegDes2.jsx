import React from 'react';
import './AluTRegDes2.css';
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

function AluTRegDes2() {
  return (
    <div className="AluTRegMain">
      <div className="Alu-Container">

        <section className="Alu-Section Alu-Schedule">
          <h2 className="Alu-SectionTitle">📅 Training Schedule & Duration</h2>
          <ul className="Alu-ScheduleList">
            <li className="Alu-ScheduleItem"><strong className="Alu-ScheduleLabel">Frequency:</strong> Weekly and Monthly sessions available.</li>
            <li className="Alu-ScheduleItem"><strong className="Alu-ScheduleLabel">Mode:</strong> Online and On-Site (select based on preference).</li>
            <li className="Alu-ScheduleItem"><strong className="Alu-ScheduleLabel">Duration:</strong> Each training session lasts 2–3 hours.</li>
            <li className="Alu-ScheduleItem"><strong className="Alu-ScheduleLabel">Trainers:</strong> Certified recycling experts and environmental professionals.</li>
          </ul>
          <p className="Alu-ScheduleNote">
            You’ll receive all session details via email after successful registration.
          </p>
        </section>

        <section className="Alu-Section Alu-WhyJoin">
          <h2 className="Alu-SectionTitle">💡 Why Join Our Program?</h2>
          <ul className="Alu-WhyJoinList">
            <li className="Alu-WhyJoinItem">✅ Learn from certified professionals in the recycling industry.</li>
            <li className="Alu-WhyJoinItem">✅ Earn a Digital Certificate after completion.</li>
            <li className="Alu-WhyJoinItem">✅ Get real-world insights into aluminum recovery and reuse.</li>
            <li className="Alu-WhyJoinItem">✅ Network with other recyclers, entrepreneurs, and sustainability advocates.</li>
            <li className="Alu-WhyJoinItem">✅ Participate in live demonstrations and case studies.</li>
          </ul>
        </section>

        <section className="Alu-Section Alu-RegistrationGuidelines">
          <h2 className="Alu-SectionTitle">🧾 Registration Guidelines</h2>
          <p className="Alu-SectionContent">
            Before registering, please make sure you:
          </p>
          <ul className="Alu-GuidelineList">
            <li className="Alu-GuidelineItem">Have a valid email and contact number.</li>
            <li className="Alu-GuidelineItem">Choose your preferred training category and date.</li>
            <li className="Alu-GuidelineItem">Upload a valid ID or proof of occupation (optional).</li>
            <li className="Alu-GuidelineItem">Read the terms and conditions before submitting.</li>
          </ul>
          <p className="Alu-SectionContent">After registration, you will receive:</p>
          <ul className="Alu-GuidelineList">
            <li className="Alu-GuidelineItem">A confirmation email with your session details.</li>
            <li className="Alu-GuidelineItem">A QR code or registration ID for verification at the venue.</li>
          </ul>
        </section>  
      </div>
    </div>
  );
}

export default AluTRegDes2;
