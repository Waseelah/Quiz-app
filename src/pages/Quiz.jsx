import React, { useState, useEffect, useRef } from 'react'
import { useNavigate }                         from 'react-router-dom'
import { useQuiz }                             from '../context/QuizContext'
import { questions as allQuestions }           from '../data/questions'
import ProgressBar                             from '../components/progressbar'
import QuestionCard                            from '../components/QuestionCard'

const TIME_PER_QUESTION = 30

const Quiz = () => {
  const navigate = useNavigate()
  const {
    selectedCategory,
    currentQuestion,
    setCurrentQuestion,
    submitAnswer,
    completeQuiz,
    resetQuiz,
    score,
    answers,
    isLastQuestion,
  } = useQuiz()

  const [timeLeft,       setTimeLeft]       = useState(TIME_PER_QUESTION)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult,     setShowResult]     = useState(false)

  const localAnswers  = useRef([])        // ← NEW
const localScore    = useRef(0)         // ← NEW
const timerRef      = useRef(null)
const quizStartTime = useRef(Date.now())
  // ✅ Guard inside useEffect — never call navigate during render
  useEffect(() => {
    if (!selectedCategory) {
      navigate('/')
    }
  }, [])

  useEffect(() => {
  localAnswers.current = answers          // ← NEW
  localScore.current   = score            // ← NEW
}, [answers, score])
  // ✅ Get questions safely
  const questionList = selectedCategory && allQuestions[selectedCategory.id]
    ? allQuestions[selectedCategory.id]
    : []

  const question = questionList[currentQuestion] ?? null

  // ✅ Timer in useEffect — never triggers setState during render
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (!selectedCategory || !question || showResult) return

    setTimeLeft(TIME_PER_QUESTION)

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          submitAnswer(currentQuestion, null, false, 0)
          setShowResult(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [currentQuestion, showResult, selectedCategory])

  const handleAnswer = (optionIndex) => {
    if (showResult) return
    clearInterval(timerRef.current)
    const isCorrect = optionIndex === question.correct
    setSelectedAnswer(optionIndex)
    submitAnswer(
      currentQuestion,
      optionIndex,
      isCorrect,
      isCorrect ? question.points : 0
    )
    setShowResult(true)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      const totalTime = Math.round(
        (Date.now() - quizStartTime.current) / 1000
      )
      completeQuiz(totalTime)
      navigate('/results')
    } else {
      // ✅ setCurrentQuestion inside event handler — NOT during render
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const handleQuit = () => {
    clearInterval(timerRef.current)
    resetQuiz()
    navigate('/')
  }

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (!selectedCategory) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-gray-500 font-medium">Redirecting...</p>
        </div>
      </div>
    )
  }

  if (questionList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm
                        border border-red-100 max-w-sm w-full">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Questions Not Found
          </h2>
          <code className="block bg-red-50 text-red-700 px-3 py-2
                           rounded-lg text-sm font-mono mb-6">
            id: "{selectedCategory.id}"
          </code>
          <button
            onClick={() => { resetQuiz(); navigate('/') }}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600
                       text-white py-3 rounded-xl font-semibold
                       hover:opacity-90 transition-all"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">❓</div>
          <p className="text-gray-500 font-medium">Loading question...</p>
        </div>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={handleQuit}
          className="flex items-center space-x-1.5 text-gray-500
                     hover:text-red-500 transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Quit</span>
        </button>

        <div className="flex items-center space-x-2 bg-white px-3 py-1.5
                        rounded-full shadow-sm border border-gray-100">
          <span>{selectedCategory.icon}</span>
          <span className="font-semibold text-gray-700 text-sm">
            {selectedCategory.name}
          </span>
        </div>

        <div className="text-sm font-semibold text-indigo-600
                        bg-indigo-50 px-3 py-1.5 rounded-full">
          {currentQuestion + 1} / {questionList.length}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <ProgressBar
          current={currentQuestion}
          total={questionList.length}
          score={score}
        />
      </div>

      {/* Question */}
      <QuestionCard
        question={question}
        questionNumber={currentQuestion + 1}
        totalQuestions={questionList.length}
        onAnswer={handleAnswer}
        selectedAnswer={selectedAnswer}
        showResult={showResult}
        timeLeft={timeLeft}
        totalTime={TIME_PER_QUESTION}
      />

      {/* Next Button */}
      {showResult && (
        <div className="mt-5">
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600
                       text-white py-4 rounded-xl font-bold hover:opacity-90
                       transition-all hover:shadow-lg active:scale-95"
          >
            {isLastQuestion ? '🎉 See My Results' : 'Next Question →'}
          </button>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center justify-between mt-4
                      text-xs text-gray-400">
        <span>✅ {answers.length} answered</span>
        <span>{questionList.length - answers.length} remaining</span>
        <span>⭐ {score} pts</span>
      </div>

    </div>
  )
}

export default Quiz