// src/components/Timer.jsx
import React from "react";
const Timer = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isWarning  = timeLeft <= 10;
  const isDanger   = timeLeft <= 5;

  const circumference = 2 * Math.PI * 20;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClass = isDanger
    ? "text-red-600"
    : isWarning
    ? "text-orange-500"
    : "text-indigo-600";

  const strokeColor = isDanger ? "#dc2626" : isWarning ? "#f97316" : "#667eea";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 h-14">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4" />
          <circle
            cx="24" cy="24" r="20"
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center font-bold text-sm ${colorClass} ${isWarning ? "timer-warning" : ""}`}>
          {timeLeft}
        </div>
      </div>
      <span className="text-xs text-gray-500 mt-1 font-medium">seconds</span>
    </div>
  );
};

window.Timer = Timer;
export default Timer; 