import React, { useState } from 'react'
import { useNavigate }     from 'react-router-dom' 
import { useQuiz }         from '../context/QuizContext'
import {categories }     from '../data/questions'

const Home = () => {
  const navigate = useNavigate()
  const { startQuiz, leaderboard } = useQuiz()

  const [name,      setName]      = useState('')
  const [nameError, setNameError] = useState('')
  const [selected,  setSelected]  = useState(null)
  const [catError,  setCatError]  = useState('')
  const [showModal, setShowModal] = useState(false)

  const topPlayer = leaderboard[0]

  const handleStart = () => {
    let valid = true
    if (!name.trim()) { setNameError('Please enter your name.'); valid = false }
    else setNameError('')
    if (!selected)    { setCatError('Please select a category.'); valid = false }
    else setCatError('')
    if (!valid) return

    startQuiz(selected, name.trim())
    navigate('/quiz')              // ← React Router navigation
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20
                        bg-gradient-to-br from-indigo-500 to-purple-600
                        rounded-3xl shadow-xl mb-5">
          <span className="text-4xl">🧠</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
          Quiz
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600
                           bg-clip-text text-transparent">
            Master Pro
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Challenge yourself with hundreds of questions. Track your score,
          beat the clock, and climb the leaderboard!
        </p>

        {topPlayer && (
          <div className="inline-flex items-center mt-4 bg-yellow-50 border
                          border-yellow-200 text-yellow-800 px-4 py-2
                          rounded-full text-sm font-medium">
            🏆 Top Player: <strong className="mx-1">{topPlayer.name}</strong>
            — {topPlayer.score}% in {topPlayer.category}
          </div>
        )}
      </div>

      {/* Name Input */}
      <div className="max-w-md mx-auto mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          👤 Your Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setNameError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          placeholder="Enter your name to begin..."
          maxLength={30}
          className={`w-full px-4 py-3 rounded-xl border-2 outline-none
                      transition-all text-gray-800 placeholder-gray-400 ${
            nameError
              ? 'border-red-400 bg-red-50'
              : 'border-gray-200 focus:border-indigo-500 bg-gray-50'
          }`}
        />
        {nameError && (
          <p className="text-red-500 text-xs mt-1">{nameError}</p>
        )}
      </div>

      {/* Category Grid */}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          📚 Choose a Category
        </h2>
        {catError && (
          <p className="text-red-500 text-xs">{catError}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelected(cat); setCatError('') }}
            className={`text-left p-6 rounded-2xl border-2 transition-all
                        relative overflow-hidden hover:-translate-y-1
                        hover:shadow-lg ${
              selected?.id === cat.id
                ? 'border-indigo-500 shadow-lg bg-indigo-50'
                : 'border-gray-100 bg-white hover:border-indigo-300 shadow-sm'
            }`}
          >
            {/* Checkmark */}
            {selected?.id === cat.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-500
                              rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <div className="flex items-start space-x-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${cat.color}
                              rounded-2xl flex items-center justify-center
                              text-2xl shadow-md flex-shrink-0`}>
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base">{cat.name}</h3>
                <p className="text-gray-500 text-xs mt-1 leading-snug">
                  {cat.description}
                </p>
                <div className="flex items-center space-x-2 mt-3">
                  <span className="text-xs bg-gray-100 text-gray-600
                                   px-2 py-0.5 rounded-full font-medium">
                    {cat.questionCount} Questions
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    cat.difficulty === 'Hard'
                      ? 'bg-red-100 text-red-700'
                      : cat.difficulty === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {cat.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <button
          onClick={() => setShowModal(true)}
          className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-200
                     text-gray-600 font-semibold hover:bg-gray-50
                     transition-all text-sm"
        >
          ℹ️ How to Play
        </button>
        <button
          onClick={handleStart}
          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600
                     text-white py-3 px-6 rounded-xl font-bold
                     hover:opacity-90 transition-all hover:shadow-xl
                     active:scale-95 text-sm" link="/quiz"
        >
          🚀 Start Quiz
        </button>
      </div>

      {/* How to Play Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center
                     justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">How to Play</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center
                           justify-center text-gray-500 hover:bg-gray-200"
              >✕</button>
            </div>
            <ul className="space-y-3">
              {[
                ['🖊️', 'Enter your name and select a quiz category'],
                ['❓', 'Answer 10 questions, each with 4 options'],
                ['⏱️', 'You have 30 seconds per question'],
                ['⭐', 'Earn points for each correct answer'],
                ['💡', 'Read the explanation after each answer'],
                ['🏆', 'Your score is saved to the leaderboard'],
              ].map(([icon, text]) => (
                <li key={text} className="flex items-start space-x-3">
                  <span className="text-xl">{icon}</span>
                  <span className="text-gray-700 text-sm">{text}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-gradient-to-r from-indigo-500
                         to-purple-600 text-white py-3 rounded-xl
                         font-semibold hover:opacity-90 transition-all"
            >
              Got it! Let's Play 🎮
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home