import React, { useState } from 'react'
import { useNavigate }     from 'react-router-dom'
import { useQuiz }         from '../context/QuizContext'

const Leaderboard = () => {
  const navigate = useNavigate()
  const { leaderboard, playerName } = useQuiz()

  const [filter, setFilter] = useState('All')
  const categories = ['All', ...new Set(leaderboard.map(e => e.category))]
  const filtered   = filter === 'All'
    ? leaderboard
    : leaderboard.filter(e => e.category === filter)

  const medals       = ['🥇', '🥈', '🥉']
  const formatTime   = (s) => s >= 60 ? `${Math.floor(s/60)}m ${s%60}s` : `${s}s`
  const getScoreColor = (s) =>
    s >= 90 ? 'text-green-600' : s >= 70 ? 'text-blue-600'
    : s >= 50 ? 'text-yellow-600' : 'text-red-500'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">🏆</div>
        <h1 className="text-4xl font-black text-gray-900">Leaderboard</h1>
        <p className="text-gray-500 mt-2">Top performers across all categories</p>
      </div>

      {/* Top 3 Podium */}
      {filtered.length >= 3 && (
        <div className="flex items-end justify-center space-x-4 mb-8">
          {/* 2nd */}
          <PodiumCard entry={filtered[1]} medal="🥈" rank={2}
                      height="h-24" bg="bg-gray-100 border-gray-300" />
          {/* 1st */}
          <PodiumCard entry={filtered[0]} medal="🥇" rank={1}
                      height="h-32" bg="bg-indigo-500 border-indigo-500"
                      textColor="text-white" highlight />
          {/* 3rd */}
          <PodiumCard entry={filtered[2]} medal="🥉" rank={3}
                      height="h-20" bg="bg-orange-50 border-orange-200" />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-5 justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === cat
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100
                      overflow-hidden mb-6">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50
                        border-b border-gray-100 text-xs font-semibold
                        text-gray-500 uppercase tracking-wide">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-4">Player</div>
          <div className="col-span-3">Category</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-2 text-center">Time</div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-4xl mb-2">📭</p>
            <p className="font-medium">No entries yet. Be the first!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((entry, index) => {
              const isMe = entry.name === playerName
              return (
                <div
                  key={index}
                  className={`grid grid-cols-12 gap-2 px-4 py-3.5 items-center
                              border-l-4 transition-colors ${
                    index === 0 ? 'bg-yellow-50 border-yellow-300'
                    : index === 1 ? 'bg-gray-50 border-gray-300'
                    : index === 2 ? 'bg-orange-50 border-orange-200'
                    : isMe ? 'bg-indigo-50 border-indigo-400'
                    : 'bg-white border-transparent'
                  }`}
                >
                  <div className="col-span-1 text-center">
                    {index < 3
                      ? <span className="text-lg">{medals[index]}</span>
                      : <span className="text-sm font-bold text-gray-400">
                          {index + 1}
                        </span>
                    }
                  </div>
                  <div className="col-span-4 flex items-center space-x-2 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center
                                    justify-center text-xs font-bold flex-shrink-0 ${
                      index === 0
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {entry.name}
                      </p>
                      {isMe && (
                        <p className="text-indigo-500 text-xs font-medium">You</p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <p className="text-xs text-gray-500 truncate">{entry.category}</p>
                    <p className="text-xs text-gray-400">{entry.date}</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`font-black text-base ${getScoreColor(entry.score)}`}>
                      {entry.score}%
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-xs text-gray-500 font-medium">
                      {formatTime(entry.time)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Players', value: leaderboard.length,          icon: '👥' },
          { label: 'Avg Score',
            value: leaderboard.length
              ? Math.round(leaderboard.reduce((s,e) => s + e.score, 0)
                           / leaderboard.length) + '%'
              : '—',
            icon: '📊' },
          { label: 'Top Score',
            value: leaderboard.length
              ? Math.max(...leaderboard.map(e => e.score)) + '%'
              : '—',
            icon: '⭐' },
        ].map(stat => (
          <div key={stat.label}
               className="bg-white rounded-xl p-4 text-center shadow-sm
                          border border-gray-100">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                     px-8 py-3 rounded-xl font-bold hover:opacity-90
                     transition-all hover:shadow-lg active:scale-95"
        >
          🎮 Play Now & Climb the Board
        </button>
      </div>
    </div>
  )
}

// Small podium card sub-component
const PodiumCard = ({ entry, medal, height, bg, textColor = 'text-gray-800', highlight }) => (
  <div className="text-center flex-1 max-w-[140px]">
    <div className={`w-12 h-12 ${highlight
        ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
        : 'bg-gray-200'} rounded-full mx-auto flex items-center justify-center
        text-xl font-bold ${highlight ? 'text-white' : 'text-gray-700'} mb-2`}>
      {entry.name.charAt(0).toUpperCase()}
    </div>
    <div className={`${bg} border-2 rounded-t-xl ${height}
                    flex flex-col items-center justify-center px-2`}>
      <div className="text-2xl mb-1">{medal}</div>
      <p className={`font-bold text-xs truncate w-full text-center ${textColor}`}>
        {entry.name}
      </p>
      <p className={`font-black text-lg ${highlight ? 'text-white' : 'text-gray-700'}`}>
        {entry.score}%
      </p>
    </div>
  </div>
)

export default Leaderboard