import React, { useState }            from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom' // ← Import Link for logo navigation
import { useQuiz }                    from '../context/QuizContext'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate                = useNavigate()   // ✅ hook instead of prop
  const { playerName, resetQuiz } = useQuiz()

  const navItems = [
    { path: '/',            label: 'Home',        icon: '🏠' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ]

  const handleHomeClick = () => {
    resetQuiz()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ── Logo ── */}
          <button
            onClick={handleHomeClick}
            className="flex items-center space-x-2 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500
                            to-purple-600 rounded-xl flex items-center
                            justify-center shadow-md group-hover:shadow-lg
                            transition-shadow">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r
                             from-indigo-600 to-purple-600
                             bg-clip-text text-transparent">
              QuizMaster Pro
            </span>
          </button>

          {/* ── Desktop Links ── */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={item.path === '/' ? resetQuiz : undefined}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}

            {/* Player badge */}
            {playerName && (
              <div className="flex items-center ml-4 pl-4
                              border-l border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500
                                to-purple-600 rounded-full flex items-center
                                justify-center text-white font-bold
                                text-sm shadow">
                  {playerName.charAt(0).toUpperCase()}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {playerName}
                </span>
              </div>
            )}
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600
                       hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100
                        px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (item.path === '/') resetQuiz()
                setMenuOpen(false)
              }}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg font-medium
                 text-sm w-full transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          {playerName && (
            <div className="flex items-center pt-2 border-t
                            border-gray-100 mt-2 px-2">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500
                              to-purple-600 rounded-full flex items-center
                              justify-center text-white font-bold text-xs">
                {playerName.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                Playing as <strong>{playerName}</strong>
              </span>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar