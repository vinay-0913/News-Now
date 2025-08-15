import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import AllNews from "./components/AllNews";
import Category from "./components/Category";
import CountryNews from "./components/CountryNews";
import Recommendations from "./components/Recommendations";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";

// Wrapper for Category to pass URL params + selectedCountry
function CategoryWrapper({ selectedCountry, onRecommendationsUpdate }) {
  const { category } = useParams();
  return (
    <Category
      category={category}
      country={selectedCountry}
      onRecommendationsUpdate={onRecommendationsUpdate}
    />
  );
}

// Wrapper for CountryNews to update selectedCountry in App
function CountryWrapper({ setSelectedCountry, onRecommendationsUpdate }) {
  const { iso } = useParams();

  useEffect(() => {
    setSelectedCountry(iso);
  }, [iso, setSelectedCountry]);

  return <CountryNews onRecommendationsUpdate={onRecommendationsUpdate} />;
}

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

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
        <Header />

        <Routes>
          {/* Main News Page */}
          <Route
            path="/" element={<AllNews onRecommendationsUpdate={handleRecommendationsUpdate} />}
          />

          {/* Category-based Headlines */}
          <Route
            path="/category/:category"
            element={
              <CategoryWrapper selectedCountry={selectedCountry} onRecommendationsUpdate={handleRecommendationsUpdate} />
            }
          />

          {/* Country-specific News */}
          <Route
            path="/country/:iso"
            element={
              <CountryWrapper setSelectedCountry={setSelectedCountry} onRecommendationsUpdate={handleRecommendationsUpdate}
              />
            }
          />

          {/* Recommended Articles Page */}
          <Route
            path="/recommendations"
            element={<Recommendations recommendations={recommendations} />}
          />
        </Routes>

        
      </BrowserRouter>
    </div>
  );
}

export default App;
