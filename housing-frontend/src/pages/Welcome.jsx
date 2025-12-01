import React, { useState } from "react";
import "./Welcome.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getRedirectRoute } from "../utils/roleRedirect";

const Welcome = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [step, setStep] = useState(1);

  // DIFFERENT QUESTIONS BASED ON ROLE
  const [data, setData] = useState({
    preferred_city: "",
    preferred_state: "",
    property_interest: "",
    budget: "",
    preferred_type: "",
  });

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  // SKIP IMMEDIATELY
  const skipAll = () => {
    navigate(getRedirectRoute(role));
  };

  // SUBMIT ONBOARDING
  const finish = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/complete-onboarding",
        {
          preferred_city: data.preferred_city,
          preferred_state: data.preferred_state,
          property_interest: data.property_interest,
          budget: data.budget,
          preferred_type: data.preferred_type,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✓ Onboarding saved:", response.data);

      // update user locally
      const updated = { ...user, has_completed_onboarding: true };
      localStorage.setItem("user", JSON.stringify(updated));

      const route = getRedirectRoute(role);
      console.log("Redirecting to:", route);

      // 👇 small delay so react fully updates localStorage before redirect
      setTimeout(() => {
        navigate(route, { replace: true });
      }, 300);

    } catch (err) {
      console.log("Onboarding error:", err.response?.data || err);
    }
  };


  return (
    <div className="welcome-container">
      <div className="welcome-card fade-in">
        {/* HEADER */}
        <div className="welcome-header">
          <h2>
            {step === 1 && "Welcome 👋"}
            {step === 2 && "Your Location"}
            {step === 3 && "What Are You Looking For?"}
            {step === 4 && "Preferences"}
            {step === 5 && "You're All Set!"}
          </h2>

          <p>
            {step === 1 && "Let's personalize your experience."}
            {step === 2 && "Where do you mostly operate or search?"}
            {step === 3 && "Tell us what you want to do on the platform."}
            {step === 4 && "Set your preferences so we match results better."}
            {step === 5 && "You've completed onboarding 🎉"}
          </p>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="step-body fade-in">
            <button onClick={next} className="welcome-btn primary">
              Start Onboarding
            </button>
            <button onClick={skipAll} className="welcome-btn ghost">
              Skip
            </button>
          </div>
        )}

        {/* STEP 2 – LOCATION */}
        {step === 2 && (
          <div className="step-body fade-in">
            <input
              type="text"
              placeholder="City (e.g., Lagos)"
              value={data.preferred_city}
              onChange={(e) =>
                setData({ ...data, preferred_city: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="State (e.g., Lagos State)"
              value={data.preferred_state}
              onChange={(e) =>
                setData({ ...data, preferred_state: e.target.value })
              }
            />

            <div className="step-actions">
              <button className="welcome-btn ghost" onClick={back}>
                Back
              </button>
              <button className="welcome-btn primary" onClick={next}>
                Continue
              </button>
              <button className="skip-link" onClick={skipAll}>
                Skip All
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 – USERS SEE RENT/BUY | AGENT/MANAGER/OWNER SEE MANAGE OPTIONS */}
        {step === 3 && (
          <div className="step-body fade-in">
            <div className="options-grid">
              {(role === "user" || role === "tenant") &&
                ["Rent", "Buy", "Shortlet"].map((item) => (
                  <div
                    key={item}
                    className={`option-card ${data.property_interest === item ? "selected" : ""
                      }`}
                    onClick={() =>
                      setData({ ...data, property_interest: item })
                    }
                  >
                    {item}
                  </div>
                ))}

              {(role === "agent" ||
                role === "manager" ||
                role === "owner") &&
                ["Manage Properties", "Find Tenants"].map((item) => (
                  <div
                    key={item}
                    className={`option-card ${data.property_interest === item ? "selected" : ""
                      }`}
                    onClick={() =>
                      setData({ ...data, property_interest: item })
                    }
                  >
                    {item}
                  </div>
                ))}
            </div>

            <div className="step-actions">
              <button className="welcome-btn ghost" onClick={back}>
                Back
              </button>
              <button className="welcome-btn primary" onClick={next}>
                Continue
              </button>
              <button className="skip-link" onClick={skipAll}>
                Skip All
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 – GENERAL PREFERENCES */}
        {step === 4 && (
          <div className="step-body fade-in">
            {(role === "user" || role === "tenant") && (
              <>
                <input
                  type="number"
                  placeholder="Your Budget (₦)"
                  value={data.budget}
                  onChange={(e) =>
                    setData({ ...data, budget: e.target.value })
                  }
                />

                <select
                  value={data.preferred_type}
                  onChange={(e) =>
                    setData({ ...data, preferred_type: e.target.value })
                  }
                >
                  <option value="">Choose Property Type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Self-contain">Self-contain</option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Office Space">Office Space</option>
                </select>
              </>
            )}

            {(role === "agent" ||
              role === "owner" ||
              role === "manager") && (
                <p className="info-text">
                  Great! We will configure your dashboard for property
                  management, tenant tracking, and listings.
                </p>
              )}

            <div className="step-actions">
              <button className="welcome-btn ghost" onClick={back}>
                Back
              </button>
              <button className="welcome-btn primary" onClick={next}>
                Continue
              </button>
              <button className="skip-link" onClick={skipAll}>
                Skip All
              </button>
            </div>
          </div>
        )}

        {/* STEP 5 – FINISH */}
        {step === 5 && (
          <div className="step-body fade-in">
            <h3>You're ready 🎉</h3>
            <p>Click below to proceed to your dashboard.</p>

            <button className="welcome-btn primary" onClick={finish}>
              Finish & Continue
            </button>

            <button className="welcome-btn ghost" onClick={skipAll}>
              Skip
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
