import React          from 'react'
import { Link }       from 'react-router-dom'
import { useQuiz }    from '../context/QuizContext'

const Footer = () => {
  const { resetQuiz } = useQuiz()

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center
                        justify-between gap-4">

          {/* Brand */}
          <Link
            to="/"
            onClick={resetQuiz}
            className="flex items-center space-x-2"
          >
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500
                            to-purple-600 rounded-lg flex items-center
                            justify-center">
              <span className="text-white font-bold text-xs">Q</span>
            </div>
            <span className="font-bold text-gray-700 text-sm">
              QuizMaster Pro
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <Link
              to="/"
              onClick={resetQuiz}
              className="hover:text-indigo-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/leaderboard"
              className="hover:text-indigo-600 transition-colors font-medium"
            >
              Leaderboard
            </Link>
          </div>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} QuizMaster Pro. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  )
}

export default Footer