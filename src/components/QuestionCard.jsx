import React  from 'react'
import Timer  from './Timer'

const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  selectedAnswer,
  showResult,
  timeLeft,
  totalTime,
}) => {

  // Safety check
  if (!question) return null

  const optionLabels = ['A', 'B', 'C', 'D']

  // ── Get styles for each option button ─────────────────────────────────────
  const getOptionClasses = (index) => {
    // Base classes always applied
    const base = `
      w-full flex items-center gap-3 p-4 rounded-xl border-2
      text-left transition-all duration-200 select-none
    `

    // Before answering
    if (!showResult) {
      if (selectedAnswer === index) {
        return base + ' border-indigo-500 bg-indigo-50 shadow-md'
      }
      return base + ' border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer'
    }

    // After answering — show correct/wrong
    if (index === question.correct) {
      return base + ' border-green-500 bg-green-50'
    }
    if (selectedAnswer === index && index !== question.correct) {
      return base + ' border-red-400 bg-red-50'
    }
    return base + ' border-gray-100 bg-gray-50 opacity-50'
  }

  // ── Get styles for the letter label ───────────────────────────────────────
  const getLabelClasses = (index) => {
    const base = `
      w-10 h-10 rounded-xl flex items-center justify-center
      font-bold text-sm flex-shrink-0 transition-colors
    `
    if (showResult && index === question.correct) {
      return base + ' bg-green-500 text-white'
    }
    if (showResult && selectedAnswer === index && index !== question.correct) {
      return base + ' bg-red-400 text-white'
    }
    if (!showResult && selectedAnswer === index) {
      return base + ' bg-indigo-500 text-white'
    }
    return base + ' bg-gray-100 text-gray-600'
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
      }}
    >

      {/* ── Purple Header with question + timer ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          padding: '24px',
          color: 'white',
        }}
      >
        <div className="flex items-start justify-between gap-4">

          {/* Left side: badges + question text */}
          <div className="flex-1">

            {/* Badges row */}
            <div className="flex items-center gap-2 mb-3">
              <span
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '4px 12px',
                  borderRadius: '999px',
                }}
              >
                Q{questionNumber} of {totalQuestions}
              </span>
              <span
                style={{
                  background: 'rgba(250,204,21,0.85)',
                  color: '#713f12',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '4px 12px',
                  borderRadius: '999px',
                }}
              >
                ⭐ {question.points} pts
              </span>
            </div>

            {/* Question text */}
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '600',
                lineHeight: '1.5',
                color: 'white',
                margin: 0,
              }}
            >
              {question.question}
            </h2>

          </div>

          {/* Right side: timer */}
          <Timer timeLeft={timeLeft} totalTime={totalTime} />

        </div>
      </div>

      {/* ── Options ── */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                if (!showResult) onAnswer(index)
              }}
              disabled={showResult}
              className={getOptionClasses(index)}
            >
              {/* Letter label */}
              <span className={getLabelClasses(index)}>
                {optionLabels[index]}
              </span>

              {/* Option text */}
              <span
                style={{
                  flex: 1,
                  textAlign: 'left',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                {option}
              </span>

              {/* Result icons */}
              {showResult && index === question.correct && (
                <span style={{ fontSize: '20px', color: '#22c55e' }}>✓</span>
              )}
              {showResult && selectedAnswer === index
                && index !== question.correct && (
                <span style={{ fontSize: '20px', color: '#ef4444' }}>✗</span>
              )}

            </button>
          ))}
        </div>

        {/* ── Explanation box (after answering) ── */}
        {showResult && (
          <div
            style={{
              marginTop: '16px',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: selectedAnswer === question.correct
                ? '#f0fdf4'
                : '#fff7ed',
              border: selectedAnswer === question.correct
                ? '1px solid #86efac'
                : '1px solid #fdba74',
            }}
          >
            <div className="flex items-start gap-3">

              <span style={{ fontSize: '24px', flexShrink: 0 }}>
                {selectedAnswer === question.correct ? '🎉' : '💡'}
              </span>

              <div>
                <p
                  style={{
                    fontWeight: '700',
                    fontSize: '14px',
                    marginBottom: '4px',
                    color: selectedAnswer === question.correct
                      ? '#166534'
                      : '#9a3412',
                  }}
                >
                  {selectedAnswer === question.correct
                    ? 'Correct! Well done!'
                    : selectedAnswer === null
                    ? `⏱️ Time's up! Answer: ${question.options[question.correct]}`
                    : `Incorrect! Answer: ${question.options[question.correct]}`
                  }
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#4b5563',
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  {question.explanation}
                </p>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  )
}

export default QuestionCard