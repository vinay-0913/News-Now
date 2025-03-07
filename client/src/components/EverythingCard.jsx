import React from "react";

function Card(props) {
  function handleArticleClick() {
    const clickedArticle = props.title;
    if (!clickedArticle) return;

    let storedArticles = JSON.parse(localStorage.getItem("clickedArticles")) || [];
    if (!storedArticles.includes(clickedArticle)) {
      storedArticles.push(clickedArticle);
      localStorage.setItem("clickedArticles", JSON.stringify(storedArticles));
    }
  }

  return (
    <div className="card mt-10 border border-gray-300 shadow-lg rounded-lg p-5 transition-transform transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl min-h-[500px] flex flex-col">
      <div className="card-content flex flex-col flex-grow">
        {/* Title Clickable */}
        <a
          href={props.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleArticleClick}
          className="title text-lg font-bold hover:text-blue-500 transition-colors"
        >
          {props.title}
        </a>

        {/* Image Clickable */}
        <div className="card-img mx-auto my-3">
          <a href={props.url} target="_blank" rel="noopener noreferrer" onClick={handleArticleClick}>
            <img
              className="w-full h-[180px] object-cover cursor-pointer rounded-md"
              src={props.imgUrl}
              alt="News"
            />
          </a>
        </div>

        {/* Description with Fixed Height */}
        <div className="description flex-grow min-h-[60px] overflow-hidden">
          <p className="leading-6 text-gray-700 line-clamp-3">
            {props.description ? props.description.substring(0, 200) : "No description available."}
          </p>
        </div>

        {/* Footer with Fixed Layout */}
        <div className="info mt-3">
          <div className="source-info flex items-center gap-2">
            <span className="font-semibold">Source:</span>
            <a
              href={props.url}
              target="_blank"
              className="link underline break-words"
              onClick={handleArticleClick}
              rel="noopener noreferrer"
            >
              {props.source || "Unknown"}
            </a>
          </div>
          <div className="origin flex flex-col mt-1">
            <p className="origin-item">
              <span className="font-semibold">Author:</span> {props.author || "Unknown"}
            </p>
            <p className="origin-item">
              <span className="font-semibold">Published At:</span> {props.publishedAt || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
