import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import countries from "./countries";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const [active, setActive] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [theme, setTheme] = useState("light-theme");

  const navigate = useNavigate();

  const categories = ["business", "entertainment", "general", "health", "science", "sports", "technology", "politics"];

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "light-theme" ? "dark-theme" : "light-theme");
  }

  return (
    <header>
      <nav className="fixed top-0 left-0 w-full h-auto bg-gray-800 z-10 flex items-center justify-around">
        <h3 className="relative heading font-bold md:basis-1/6 text-2xl xs:basis-4/12 z-50 mb-5 mt-5">
          News Aggregator
        </h3>
        
        <ul className={`nav-ul flex gap-11 md:gap-14 xs:gap-12 lg:basis-3/6 md:basis-4/6 md:justify-end ${active ? "active" : ""}`}>
          <li>
            <Link className="no-underline font-semibold" to="/" onClick={() => setActive(false)}>All News</Link>
          </li>
          <li>
            <Link className="no-underline font-semibold" to="/recommendations" onClick={() => setActive(false)}>
              Recommendations
            </Link>
          </li>

          {/* Top Headlines Dropdown */}
          <li className="dropdown-li">
            <button 
              className="no-underline font-semibold flex items-center gap-2" 
              onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowCountryDropdown(false); }}
              aria-label="Top Headlines"
            >
              Top-Headlines
              <FontAwesomeIcon className={showCategoryDropdown ? "down-arrow-icon down-arrow-icon-active" : "down-arrow-icon"} icon={faCircleArrowDown} />
            </button>
            <ul className={showCategoryDropdown ? "dropdown p-2 show-dropdown" : "dropdown p-2"}>
              {categories.map((category, index) => (
                <li key={index} onClick={() => setShowCategoryDropdown(false)}>
                  <Link to={`/top-headlines/${category}`} className="flex gap-3 capitalize" onClick={() => setActive(false)}>
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Country Dropdown */}
          <li className="dropdown-li">
            <button 
              className="no-underline font-semibold flex items-center gap-2" 
              onClick={() => { setShowCountryDropdown(!showCountryDropdown); setShowCategoryDropdown(false); }}
              aria-label="Select Country"
            >
              Country
              <FontAwesomeIcon className={showCountryDropdown ? "down-arrow-icon down-arrow-icon-active" : "down-arrow-icon"} icon={faCircleArrowDown} />
            </button>
            <ul className={showCountryDropdown ? "dropdown p-2 show-dropdown" : "dropdown p-2"}>
              {countries.map((element, index) => (
                <li key={index} onClick={() => setShowCountryDropdown(false)}>
                  <Link to={`/country/${element?.iso_2_alpha}`} className="flex gap-3" onClick={() => setActive(false)}>
                    <img src={element?.png} srcSet={`https://flagcdn.com/32x24/${element?.iso_2_alpha}.png 2x`} alt={element?.countryName} />
                    <span>{element?.countryName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Dark Mode Toggle */}
          <li>
            
            <Link className="no-underline font-semibold" to="#" onClick={toggleTheme}>
              <input type="checkbox" className="checkbox" id="checkbox" />
              <label htmlFor="checkbox" className="checkbox-label">
                <i className="fas fa-moon"></i>
                <i className="fas fa-sun"></i>
                <span className="ball"></span>
              </label>
              
            </Link>
            
          </li>
        </ul>

        {/* Hamburger Menu */}
        <div className={`ham-burger z-index-100 ${active ? "ham-open" : ""}`} onClick={() => setActive(!active)}>
          <span className="lines line-1"></span>
          <span className="lines line-2"></span>
          <span className="lines line-3"></span>
        </div>
      </nav>
    </header>
  );
}

export default Header;
