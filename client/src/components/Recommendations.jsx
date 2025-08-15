import React, { useState, useEffect } from "react";
import EverythingCard from "./EverythingCard";
import Loader from "./Loader";

function Recommendations({ recommendations }) {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12); // Initial articles to show
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // When recommendations prop changes, reset visibleCount
  useEffect(() => {
    setData(recommendations || []);
    setVisibleCount(9);
  }, [recommendations]);

  // Slice the data for current view
  const visibleData = data.slice(0, visibleCount);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 12); // Load 12 more articles each time
      setIsLoading(false);
    }, 500); // Simulate small delay
  };

  return (
    <>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="my-24 cards grid lg:place-content-center md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xs:grid-cols-1 xs:gap-4 md:gap-10 lg:gap-14 md:px-16 xs:p-3">
        {!isLoading && data.length === 0 && (
          <p className="text-center text-gray-500">
            No recommendations yet. Click on articles to get recommendations!
          </p>
        )}

        {visibleData.length > 0 ? (
          visibleData.map((article, index) => (
            <EverythingCard
                title={article.title}
                description={article.description}
                imgUrl={article.image_url}
                publishedAt={article.pubDate}
                url={article.link}
                author={article.creator ? article.creator.join(", ") : "Unknown"}
                source={article.source_id || "Unknown"}
              />
          ))
        ) : (
          !isLoading && <p>No recommended articles found.</p>
        )}
      </div>

      {/* Loader while fetching */}
      {isLoading && <Loader />}

      {/* Load More Button */}
      {!isLoading && visibleCount < data.length && (
        <div className="flex justify-center my-10">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}

export default Recommendations;
