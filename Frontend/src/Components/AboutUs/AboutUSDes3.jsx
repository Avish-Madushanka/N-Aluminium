import React, { useState } from 'react';
import { Plus, Minus, ArrowRight, Leaf } from 'lucide-react';
import './AboutUSDes3.css';

const AboutUSDes3 = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  const faqData = [
    {
      id: 1,
      question: "How do I get started?",
      answer: "Simply create an account on ALUX and choose your service. You can request aluminum fabrication, schedule scrap collection, or explore the marketplace based on your needs."
    },
    {
      id: 2,
      question: "What services does ALUX provide?",
      answer: "ALUX offers aluminum fabrication, scrap collection, real-time pricing, and a digital marketplace for buying and selling aluminum products and materials."
    },
    {
      id: 3,
      question: "What types of aluminum products can be fabricated?",
      answer: "We support fabrication of aluminum doors, windows, frames, panels, and custom designs based on user requirements and project needs."
    },
    {
      id: 4,
      question: "Can I request custom aluminum designs?",
      answer: "Yes, users can submit custom design requirements. Our platform helps connect with fabrication services to create tailored aluminum products."
    },
    {
      id: 5,
      question: "Does ALUX provide price updates?",
      answer: "Yes, the system provides real-time aluminum price updates to help users make better decisions when selling or purchasing materials."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="FAQ-main-container">
      <div className="FAQ-content-wrapper">
        
        <div className="FAQ-left-side">
          <div className="FAQ-tag">
            <span>Question & Answer</span>
          </div>
          <h2 className="FAQ-title">
            Frequently Asked <br /> Question <span className="FAQ-q-mark">?</span>
          </h2>
          <p className="FAQ-subtitle">
            We work to protect and restore the natural environment through sustainable aluminum practices.
          </p>
          
          <button className="FAQ-ask-btn">
            <span>Have You Any Questions?</span>
            <div className="FAQ-btn-circle">
              <ArrowRight size={18} />
            </div>
          </button>

          <div className="FAQ-user-social">
            <div className="FAQ-avatar-group">
              <img src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png"/>
              <img src="https://cdn-icons-png.flaticon.com/128/13482/13482193.png"/>
              <div className="FAQ-avatar-plus">+</div>
            </div>
          </div>
        </div>

        <div className="FAQ-right-side">
          {faqData.map((item) => (
            <div 
              key={item.id} 
              className={`FAQ-accordion-item ${activeIndex === item.id ? 'active' : ''}`}
              onClick={() => toggleAccordion(item.id)}
            >
              <div className="FAQ-accordion-header">
                <span className="FAQ-number">{item.id}.</span>
                <h3 className="FAQ-question-text">{item.question}</h3>
                <div className={`FAQ-toggle-icon ${activeIndex === item.id ? 'is-minus' : ''}`}>
                  {activeIndex === item.id ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </div>
              <div className="FAQ-accordion-body">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutUSDes3;