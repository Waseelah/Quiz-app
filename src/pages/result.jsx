import React      from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz }     from '../context/QuizContext'
import { questions as allQuestions } from '../data/questions'
import ResultCard  from '../components/ResultCard'

const Results = () => {
  const navigate = useNavigate()
  const {
    selectedCategory, score, answers,
    timeSpent, playerName, startQuiz, resetQuiz,
  } = useQuiz()

  // Guard
  React.useEffect(() => {
    if (!selectedCategory) navigate('/')
  }, [selectedCategory, navigate])

  if (!selectedCategory) return null

  const questionList = allQuestions[selectedCategory.id]
  const maxScore     = questionList.reduce((sum, q) => sum + q.points, 0)

  const handleRetry = () => {
    startQuiz(selectedCategory, playerName)
    navigate('/quiz')              // ← React Router navigation
  }

  const handleHome = () => {
    resetQuiz()
    navigate('/')                  // ← React Router navigation
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-gray-900">
          Quiz Complete! 🎊
        </h1>
        {playerName && (
          <p className="text-gray-500 mt-1">
            Well done,{' '}
            <span className="font-semibold text-indigo-600">{playerName}</span>!
          </p>
        )}
      </div>

      <ResultCard
        score={score}
        maxScore={maxScore}
        totalTime={timeSpent}
        answers={answers}
        questions={questionList}
        onRetry={handleRetry}
        onHome={handleHome}
        onLeaderboard={() => navigate('/leaderboard')}  // ← React Router
      />
    </div>
  )
}

export default Results