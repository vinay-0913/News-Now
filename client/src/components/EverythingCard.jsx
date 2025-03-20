import React, { useState } from "react";
import { Calendar, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

function Card(props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  function handleArticleClick() {
    const clickedArticle = props.title;
    if (!clickedArticle) return;

    let storedArticles = JSON.parse(localStorage.getItem("clickedArticles")) || [];
    if (!storedArticles.includes(clickedArticle)) {
      storedArticles.push(clickedArticle);
      localStorage.setItem("clickedArticles", JSON.stringify(storedArticles));
    }
  }

  // Format the published date
  const formattedDate = props.publishedAt
    ? format(new Date(props.publishedAt), "MMM d, yyyy")
    : "Unknown date";

  // Use placeholder image if article image is null or loading fails
  const placeholderImage = "/placeholder.svg";

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all mt-10">
      {/* Image Section */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {props.imgUrl && !imageError ? (
          <>
            {!imageLoaded && <div className="absolute inset-0 bg-gray-200 shimmer" />}
            <img
              src={props.imgUrl}
              alt={props.title}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } group-hover:scale-105`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <img src={placeholderImage} alt="No image available" className="w-16 h-16 opacity-30" />
          </div>
        )}

        {/* Source Badge */}
        {props.source && (
        <div className="absolute top-2 left-2 bg-white text-black !important text-xs font-semibold px-3 py-1 rounded-md shadow-lg bg-opacity-95">
        {props.source}
        </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Date above title */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          <Calendar className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>

        <a
          href={props.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleArticleClick}
          className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-all"
        >
          {props.title}
        </a>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {props.description || "No description available."}
        </p>

        {/* Read More below description */}
        <div className="mt-4">
          <a href={props.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
            Read More <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Card;
