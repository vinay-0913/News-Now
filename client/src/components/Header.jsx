import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import countries from "./countries";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowDown } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const [active, setActive] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light-theme");


  const categories = ["business", "education", "entertainment", "health", "lifestyle", "science", "sports", "technology", "politics", "world"];

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prevTheme => (prevTheme === "light-theme" ? "dark-theme" : "light-theme"));
  }

  return (
    <header>
      <nav
        className="fixed top-0 left-0 w-full h-[70px] z-10 flex items-center justify-around backdrop-blur transition-all duration-300 border-b"
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--txt)",
          borderColor: "rgba(100, 100, 100, 0.2)"
        }}
      >
        <h3 className="title relative heading font-bold md:basis-1/6 xs:basis-4/12 z-50 mb-5 mt-5">
          <Link
           
            to="/"
            onClick={() => setActive(false)}
          >
            <img
              src="/logo.png"
              alt="News Aggregator Logo"
              className="h-auto w-40"
            />
          </Link>
        </h3>


        <ul className={`nav-ul flex gap-11 md:gap-14 xs:gap-12 lg:basis-3/6 md:basis-4/6 md:justify-end ${active ? "active" : ""}`}>
          <li>
            <Link
              className="title no-underline font-semibold"
              to="/"
              onClick={() => setActive(false)}
              style={{ color: "var(--txt)" }}
            >
              All News
            </Link>
          </li>
          <li>
            <Link
              className="title no-underline font-semibold"
              to="/recommendations"
              onClick={() => setActive(false)}
              style={{ color: "var(--txt)" }}
            >
              Recommendations
            </Link>
          </li>

          {/* Top Headlines Dropdown */}
          <li className="dropdown-li">
            <button
              className="title no-underline font-semibold flex items-center gap-2"
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowCountryDropdown(false);
              }}
              style={{ color: "var(--txt)" }}
            >
              Category
              <FontAwesomeIcon
                className={showCategoryDropdown ? "down-arrow-icon down-arrow-icon-active" : "down-arrow-icon"}
                icon={faCircleArrowDown}
              />
            </button>
            <ul className={showCategoryDropdown ? "dropdown p-2 show-dropdown" : "dropdown p-2"}>
              {categories.map((category, index) => (
                <li key={index} onClick={() => setShowCategoryDropdown(false)}>
                  <Link
                    to={`/category/${category}`}
                    className="flex gap-3 capitalize"
                    onClick={() => setActive(false)}
                    style={{ color: "var(--txt)" }}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Country Dropdown */}
          <li className="dropdown-li">
            <button
              className="title no-underline font-semibold flex items-center gap-2"
              onClick={() => {
                setShowCountryDropdown(!showCountryDropdown);
                setShowCategoryDropdown(false);
              }}
              style={{ color: "var(--txt)" }}
            >
              Country
              <FontAwesomeIcon
                className={showCountryDropdown ? "down-arrow-icon down-arrow-icon-active" : "down-arrow-icon"}
                icon={faCircleArrowDown}
              />
            </button>
            <ul className={showCountryDropdown ? "dropdown p-2 show-dropdown" : "dropdown p-2"}>
              {countries.map((element, index) => (
                <li key={index} onClick={() => setShowCountryDropdown(false)}>
                  <Link
                    to={`/country/${element?.iso_2_alpha}`}
                    className="flex gap-3"
                    onClick={() => setActive(false)}
                    style={{ color: "var(--txt)" }}
                  >
                    <img
                      src={element?.png}
                      srcSet={`https://flagcdn.com/32x24/${element?.iso_2_alpha}.png 2x`}
                      alt={element?.countryName}
                    />
                    <span>{element?.countryName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* 🌗 Theme Toggle */}
          <li>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox"
                id="checkbox"
                checked={theme === "dark-theme"}
                onChange={toggleTheme}
              />
              <label htmlFor="checkbox" className="checkbox-label">
                <i className="fas fa-moon"></i>
                <i className="fas fa-sun"></i>
                <span className="ball"></span>
              </label>
            </div>
          </li>
        </ul>

        {/* 🍔 Hamburger */}
        <div
          className={`ham-burger z-index-100 ${active ? "ham-open" : ""}`}
          onClick={() => setActive(!active)}
        >
          <span className="lines line-1"></span>
          <span className="lines line-2"></span>
          <span className="lines line-3"></span>
        </div>
      </nav>
    </header>

  );
}

export default Header;
