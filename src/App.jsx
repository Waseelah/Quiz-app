import React from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/navbar";
import Footer from "./components/footer";

// Pages
import Home from "./pages/home";
import Quiz from "./pages/Quiz";
import Results from "./pages/result";
import Leaderboard from "./pages/leaderboard";

// Context
import { QuizProvider } from "./context/QuizContext";

const App = () => {
  return (
      <QuizProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Navbar always visible on every page */}
          <Navbar />

          {/* Page Content */}
          
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/results" element={<Results />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>

          {/* Footer always visible on every page */}
          <Footer />
        </div>
      </QuizProvider>
  );
};

export default App;
