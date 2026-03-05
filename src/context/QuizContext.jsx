import React, { createContext, useContext, useState } from 'react'
import { questions} from '../data/questions'
const QuizContext = createContext(null)

export const QuizProvider = ({ children }) => {
  const [playerName,       setPlayerName]       = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentQuestion,  setCurrentQuestion]  = useState(0)
  const [answers,          setAnswers]           = useState([])
  const [score,            setScore]             = useState(0)
  const [quizCompleted,    setQuizCompleted]     = useState(false)
  const [timeSpent,        setTimeSpent]         = useState(0)
  const [leaderboard,      setLeaderboard]       = useState(() => {
    const saved = localStorage.getItem('quizLeaderboard')
    return saved ? JSON.parse(saved) : [
      { name: 'Alex',   score: 95, category: 'Science & Nature',  time: 142, date: '2024-01-15' },
      { name: 'Sam',    score: 90, category: 'Technology',        time: 158, date: '2024-01-14' },
      { name: 'Jordan', score: 85, category: 'General Knowledge', time: 175, date: '2024-01-13' },
      { name: 'Casey',  score: 80, category: 'History',           time: 190, date: '2024-01-12' },
      { name: 'Riley',  score: 75, category: 'Technology',        time: 210, date: '2024-01-11' },
    ]
  })

  const startQuiz = (category, name) => {
    setSelectedCategory(category)
    setPlayerName(name)
    setCurrentQuestion(0)
    setAnswers([])
    setScore(0)
    setQuizCompleted(false)
    setTimeSpent(0)
  }

 
const submitAnswer = (questionIndex, selectedOption, isCorrect, points) => {
  const earnedPoints = isCorrect ? points : 0
  const newAnswer = {
    questionIndex,
    selectedOption,
    isCorrect,
    points: earnedPoints,
  }
  setAnswers(prev => {
    const exists = prev.find(a => a.questionIndex === questionIndex) // ← NEW
    if (exists) return prev                                          // ← NEW
    return [...prev, newAnswer]
  })
  if (isCorrect) {
    setScore(prev => prev + earnedPoints)
  }
}

  const completeQuiz = (totalTime) => {
    setTimeSpent(totalTime)
    setQuizCompleted(true)

    if (playerName && selectedCategory) {
      const questions = quizData.questions[selectedCategory.id]
      const maxScore  = questions.reduce((sum, q) => sum + q.points, 0)
      const percentage = Math.round((score / maxScore) * 100)

      const entry = {
        name:     playerName,
        score:    percentage,
        category: selectedCategory.name,
        time:     totalTime,
        date:     new Date().toISOString().split('T')[0],
      }

      const updated = [...leaderboard, entry]
        .sort((a, b) => b.score - a.score || a.time - b.time)
        .slice(0, 20)

      setLeaderboard(updated)
      localStorage.setItem('quizLeaderboard', JSON.stringify(updated))
    }
  }

  const resetQuiz = () => {
    setSelectedCategory(null)
    setCurrentQuestion(0)
    setAnswers([])
    setScore(0)
    setQuizCompleted(false)
    setTimeSpent(0)
  }

  return (
    <QuizContext.Provider value={{
      playerName,       setPlayerName,
      selectedCategory, setSelectedCategory,
      currentQuestion,  setCurrentQuestion,
      answers,
      score,
      quizCompleted,
      timeSpent,
      leaderboard,
      startQuiz,
      submitAnswer,
      completeQuiz,
      resetQuiz,
    }}>
      {children}
    </QuizContext.Provider>
  )
}

// Custom hook — import this in any page/component
export const useQuiz = () => {
  const context = useContext(QuizContext)
  if (!context) throw new Error('useQuiz must be used inside <QuizProvider>')
  return context
}

export default QuizContext