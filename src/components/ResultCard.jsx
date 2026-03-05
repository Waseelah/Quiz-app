// src/components/ResultCard.jsx
const ResultCard = ({ score, maxScore, totalTime, answers, questions, onRetry, onHome, onLeaderboard }) => {
  const percentage = Math.round((score / maxScore) * 100);
  const correct    = answers.filter((a) => a.isCorrect).length;
  const wrong      = answers.length - correct;
  const mins       = Math.floor(totalTime / 60);
  const secs       = totalTime % 60;

  const getGrade = () => {
    if (percentage >= 90) return { grade: "A+", label: "Outstanding!", color: "text-green-600",  bg: "bg-green-50",  emoji: "🏆" };
    if (percentage >= 80) return { grade: "A",  label: "Excellent!",   color: "text-green-500",  bg: "bg-green-50",  emoji: "🥇" };
    if (percentage >= 70) return { grade: "B",  label: "Great Job!",   color: "text-blue-600",   bg: "bg-blue-50",   emoji: "🥈" };
    if (percentage >= 60) return { grade: "C",  label: "Good Effort!", color: "text-yellow-600", bg: "bg-yellow-50", emoji: "🥉" };
    if (percentage >= 50) return { grade: "D",  label: "Keep Going!",  color: "text-orange-600", bg: "bg-orange-50", emoji: "💪" };
    return                       { grade: "F",  label: "Try Again!",   color: "text-red-600",    bg: "bg-red-50",    emoji: "📚" };
  };

  const { grade, label, color, bg, emoji } = getGrade();

  return (
    <div className="space-y-6 fade-in">
      {/* Score Hero */}
      <div className={`${bg} rounded-2xl p-8 text-center border border-gray-100 shadow-sm`}>
        <div className="text-6xl mb-3">{emoji}</div>
        <h2 className={`text-5xl font-black ${color} mb-1`}>{grade}</h2>
        <p className="text-2xl font-bold text-gray-800 mb-1">{label}</p>
        <p className="text-gray-500 text-sm">You scored {score} out of {maxScore} points</p>

        {/* Circular Progress */}
        <div className="flex justify-center mt-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke={percentage >= 70 ? "#22c55e" : percentage >= 50 ? "#f59e0b" : "#ef4444"}
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - percentage / 100)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${color}`}>{percentage}%</span>
              <span className="text-xs text-gray-500 font-medium">Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Correct",   value: correct,                    icon: "✅", color: "text-green-600",  bg: "bg-green-50"  },
          { label: "Wrong",     value: wrong,                      icon: "❌", color: "text-red-600",    bg: "bg-red-50"    },
          { label: "Score",     value: `${score}/${maxScore}`,     icon: "⭐", color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Time",      value: `${mins}m ${secs}s`,        icon: "⏱️", color: "text-blue-600",   bg: "bg-blue-50"   },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4 text-center border border-gray-100`}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Question Review */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">📋 Question Review</h3>
          <span className="text-xs text-gray-500">{correct}/{questions.length} correct</span>
        </div>
        <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
          {questions.map((q, i) => {
            const answer = answers[i];
            const isCorrect = answer?.isCorrect;
            return (
              <div key={i} className={`p-4 ${isCorrect ? "hover:bg-green-50/50" : "hover:bg-red-50/50"} transition-colors`}>
                <div className="flex items-start space-x-3">
                  <span className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {isCorrect ? "✓" : "✗"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 mb-1 leading-snug">{q.question}</p>
                    {!isCorrect && answer && (
                      <p className="text-xs text-red-500">
                        Your answer: <span className="font-medium">{q.options[answer.selectedOption]}</span>
                      </p>
                    )}
                    <p className="text-xs text-green-600">
                      Correct: <span className="font-medium">{q.options[q.correct]}</span>
                    </p>
                  </div>
                  <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isCorrect ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {isCorrect ? `+${q.points}` : "0"} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetry}
          className="flex-1 gradient-bg text-white py-3.5 px-6 rounded-xl font-semibold hover:opacity-90 transition-all hover:shadow-lg active:scale-95"
        >
          🔄 Try Again
        </button>
        <button
          onClick={onLeaderboard}
          className="flex-1 bg-yellow-400 text-yellow-900 py-3.5 px-6 rounded-xl font-semibold hover:bg-yellow-500 transition-all hover:shadow-lg active:scale-95"
        >
          🏆 Leaderboard
        </button>
        <button
          onClick={onHome}
          className="flex-1 bg-gray-100 text-gray-700 py-3.5 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all active:scale-95"
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
};

window.ResultCard = ResultCard;
export default ResultCard;