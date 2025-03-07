import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AllNews from "./components/AllNews";
import TopHeadlines from "./components/TopHeadlines";
import CountryNews from "./components/CountryNews";
import Recommendations from "./components/Recommendations";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [recommendations, setRecommendations] = useState([]);

  // Function to update recommendations safely
  const handleRecommendationsUpdate = (updateFn) => {
    setRecommendations((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const newRecommendations = updateFn(safePrev);
      return Array.isArray(newRecommendations) ? newRecommendations : [];
    });
  };

  return (
    <div className="w-full">
      <BrowserRouter>
        <Header /> {/* Removed unnecessary prop */}
        
        <Routes>
          {/* Main News Page */}
          <Route path="/" element={<AllNews onRecommendationsUpdate={handleRecommendationsUpdate} />} />
          
          {/* Category-based Headlines */}
          <Route path="/top-headlines/:category" element={<TopHeadlines onRecommendationsUpdate={handleRecommendationsUpdate} />} />
          
          {/* Country-specific News */}
          <Route path="/country/:iso" element={<CountryNews />} />
          
          {/* Recommended Articles Page */}
          <Route path="/recommendations" element={<Recommendations recommendations={recommendations} />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
