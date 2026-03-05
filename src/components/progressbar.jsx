// src/components/ProgressBar.jsx
import React from "react";
const ProgressBar = ({ current, total, score }) => {
  const percentage = Math.round(((current) / total) * 100);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-700">
            Question {current} of {total}
          </span>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
            {percentage}%
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-yellow-500 text-sm">⭐</span>
          <span className="text-sm font-bold text-gray-700">{score} pts</span>
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-full gradient-bg rounded-full transition-all duration-500 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < current
                ? "bg-indigo-500 scale-110"
                : i === current
                ? "bg-indigo-300"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

window.ProgressBar = ProgressBar;
export default ProgressBar