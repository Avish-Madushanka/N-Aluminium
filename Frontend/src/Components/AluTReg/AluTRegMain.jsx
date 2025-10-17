import React from 'react';
import './AluTRegMain.css';
import { FaRecycle, FaLightbulb, FaTools, FaBuilding, FaCalendarAlt, FaCheckCircle, FaClipboardList, FaFileAlt, FaUserEdit } from 'react-icons/fa'; // Importing icons

function AluTRegMain() {
  return (
    <div className="Alu-Container">
      <header className="Alu-Header">
        <h1 className="Alu-Title">
          <FaRecycle className="Alu-HeaderIcon" /> Join Our Aluminum Training Program
        </h1>
        <p className="Alu-Tagline">
          Welcome to our Aluminum Training Program — a dedicated learning platform designed to educate individuals, recyclers, and businesses on the safe, efficient, and sustainable management of aluminum waste.
        </p>
        <p className="Alu-Introduction">
          Through this program, participants will gain practical knowledge of aluminum collection, sorting, recycling processes, and reuse applications that support a cleaner environment and stronger economy. Whether you’re a student, an industry worker, or simply passionate about sustainability, our training sessions will help you develop valuable skills and become a part of the circular economy movement.
        </p>
      </header>

      <section className="Alu-Section Alu-Purpose">
        <h2 className="Alu-SectionTitle">🎯 Purpose of the Training</h2>
        <p className="Alu-SectionContent">
          The main goal of this training is to empower individuals and organizations with the skills and awareness needed to manage aluminum scraps responsibly. We aim to promote eco-friendly practices, increase recycling efficiency, and encourage participants to take active roles in environmental protection.
        </p>
        <ul className="Alu-BenefitList">
          <li className="Alu-BenefitItem"><FaCheckCircle className="Alu-BenefitIcon" /> Learn modern recycling and scrap handling techniques.</li>
          <li className="Alu-BenefitItem"><FaCheckCircle className="Alu-BenefitIcon" /> Understand aluminum’s role in sustainable development.</li>
          <li className="Alu-BenefitItem"><FaCheckCircle className="Alu-BenefitIcon" /> Gain safety awareness in aluminum waste collection and processing.</li>
          <li className="Alu-BenefitItem"><FaCheckCircle className="Alu-BenefitIcon" /> Explore opportunities to reuse and resell aluminum items effectively.</li>
          <li className="Alu-BenefitItem"><FaCheckCircle className="Alu-BenefitIcon" /> Contribute to reducing pollution and conserving natural resources.</li>
        </ul>
      </section>

      <section className="Alu-Section Alu-Categories">
        <h2 className="Alu-SectionTitle">🧩 Training Categories</h2>
        <p className="Alu-SectionContent">
          Our program offers multiple categories based on your interests and experience level:
        </p>
        <div className="Alu-CategoryGrid">
          <div className="Alu-CategoryCard">
            <FaLightbulb className="Alu-CategoryCardIcon" />
            <h3 className="Alu-CategoryTitle">Basic Recycling Awareness</h3>
            <p className="Alu-CategoryDescription">
              Introduction to aluminum recycling, types of scrap materials, and environmental importance.
            </p>
          </div>
          <div className="Alu-CategoryCard">
            <FaClipboardList className="Alu-CategoryCardIcon" />
            <h3 className="Alu-CategoryTitle">Intermediate Recycling & Collection Management</h3>
            <p className="Alu-CategoryDescription">
              Covers sorting, collection, and storage methods for different aluminum types.
            </p>
          </div>
          <div className="Alu-CategoryCard">
            <FaTools className="Alu-CategoryCardIcon" />
            <h3 className="Alu-CategoryTitle">Advanced Processing & Safety Handling</h3>
            <p className="Alu-CategoryDescription">
              Focuses on advanced recovery techniques, smelting processes, and safety protocols.
            </p>
          </div>
          <div className="Alu-CategoryCard">
            <FaBuilding className="Alu-CategoryCardIcon" />
            <h3 className="Alu-CategoryTitle">Business and Reuse Training</h3>
            <p className="Alu-CategoryDescription">
              Learn how to identify, collect, and resell reusable aluminum items to generate income.
            </p>
          </div>
        </div>
      </section>

      <section className="Alu-Section Alu-Schedule">
        <h2 className="Alu-SectionTitle">📅 Training Schedule & Duration</h2>
        <ul className="Alu-ScheduleList">
          <li className="Alu-ScheduleItem">
            <strong className="Alu-ScheduleLabel">Frequency:</strong> Weekly and Monthly sessions available.
          </li>
          <li className="Alu-ScheduleItem">
            <strong className="Alu-ScheduleLabel">Mode:</strong> Online and On-Site (select based on preference).
          </li>
          <li className="Alu-ScheduleItem">
            <strong className="Alu-ScheduleLabel">Duration:</strong> Each training session lasts 2–3 hours.
          </li>
          <li className="Alu-ScheduleItem">
            <strong className="Alu-ScheduleLabel">Trainers:</strong> Certified recycling experts and environmental professionals.
          </li>
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
        <p className="Alu-SectionContent">
          After registration, you will receive:
        </p>
        <ul className="Alu-GuidelineList">
          <li className="Alu-GuidelineItem">A confirmation email with your session details.</li>
          <li className="Alu-GuidelineItem">A QR code or registration ID for verification at the venue.</li>
        </ul>
      </section>

      <section className="Alu-Section Alu-RegistrationForm">
        <h2 className="Alu-SectionTitle">🖊️ Register Now</h2>
        <p className="Alu-SectionContent">
          Fill out the form below to join the Aluminum Training Program. Our team will review your registration and confirm your participation through email within 24–48 hours.
        </p>
        <form className="Alu-Form">
          <div className="Alu-FormField">
            <label htmlFor="Alu-Name" className="Alu-Label">Full Name</label>
            <input type="text" id="Alu-Name" name="fullName" className="Alu-Input" required />
          </div>
          <div className="Alu-FormField">
            <label htmlFor="Alu-Email" className="Alu-Label">Email Address</label>
            <input type="email" id="Alu-Email" name="email" className="Alu-Input" required />
          </div>
          <div className="Alu-FormField">
            <label htmlFor="Alu-Phone" className="Alu-Label">Contact Number</label>
            <input type="tel" id="Alu-Phone" name="phoneNumber" className="Alu-Input" required />
          </div>
          <div className="Alu-FormField">
            <label htmlFor="Alu-Category" className="Alu-Label">Preferred Training Category</label>
            <select id="Alu-Category" name="category" className="Alu-Select" required>
              <option value="">Select a Category</option>
              <option value="basic">Basic Recycling Awareness</option>
              <option value="intermediate">Intermediate Recycling & Collection Management</option>
              <option value="advanced">Advanced Processing & Safety Handling</option>
              <option value="business">Business and Reuse Training</option>
            </select>
          </div>
          <div className="Alu-FormField">
            <label htmlFor="Alu-Date" className="Alu-Label">Preferred Training Date</label>
            <input type="date" id="Alu-Date" name="trainingDate" className="Alu-Input" required />
          </div>
          <div className="Alu-FormField">
            <label htmlFor="Alu-Mode" className="Alu-Label">Training Mode</label>
            <select id="Alu-Mode" name="mode" className="Alu-Select" required>
              <option value="">Select Mode</option>
              <option value="online">Online</option>
              <option value="on-site">On-Site</option>
            </select>
          </div>
          <div className="Alu-FormField Alu-IDUploadField">
            <label htmlFor="Alu-IDUpload" className="Alu-Label">
              <FaFileAlt className="Alu-FileUploadIcon" /> Upload ID/Proof of Occupation (Optional)
            </label>
            <input type="file" id="Alu-IDUpload" name="idUpload" className="Alu-FileInput" />
          </div>
          <div className="Alu-FormField Alu-CheckboxContainer">
            <input type="checkbox" id="Alu-Terms" name="terms" className="Alu-Checkbox" required />
            <label htmlFor="Alu-Terms" className="Alu-CheckboxLabel">I have read and agree to the terms and conditions.</label>
          </div>
          <button type="submit" className="Alu-SubmitButton">
            <FaUserEdit className="Alu-ButtonIcon" /> Register
          </button>
        </form>
      </section>

      <footer className="Alu-Footer">
        <p className="Alu-FooterText">🌱 Together, We Build a Sustainable Future</p>
        <p className="Alu-FooterMotto">
          Every individual effort counts. By joining this training, you are not only enhancing your skills but also contributing to a cleaner, more sustainable planet. Let’s make aluminum recycling smarter, safer, and more rewarding — for today and tomorrow.
        </p>
      </footer>
    </div>
  );
}

export default AluTRegMain;