import React, { useState, useEffect } from "react";
import EverythingCard from "./EverythingCard";
import Loader from "./Loader";

function Recommendations({ recommendations }) {
  const [data, setData] = useState(recommendations || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    setData(recommendations);
  }, [recommendations]);

  // Pagination logic
  const totalResults = data.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="my-10 cards grid lg:place-content-center md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xs:grid-cols-1 xs:gap-4 md:gap-10 lg:gap-14 md:px-16 xs:p-3">
        {!isLoading && data.length === 0 && (
          <p className="text-center text-gray-500">
            No recommendations yet. Click on articles to get recommendations!
          </p>
        )}

        {!isLoading ? (
          paginatedData.length > 0 ? (
            paginatedData.map((element, index) => (
              <EverythingCard
                key={element.url || index} // Use URL for uniqueness
                title={element.title}
                description={element.description}
                imgUrl={element.urlToImage}
                publishedAt={element.publishedAt}
                url={element.url}
                author={element.author}
                source={element.source.name}
              />
            ))
          ) : (
            <p>No recommended articles found.</p>
          )
        ) : (
          <Loader />
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && paginatedData.length > 0 && totalPages > 1 && (
        <div className="pagination flex justify-center gap-14 my-10 items-center">
          <button
            disabled={page <= 1}
            className="pagination-btn text-center"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            &larr; Prev
          </button>
          <p className="font-semibold opacity-80">
            {page} of {totalPages}
          </p>
          <button
            className="pagination-btn text-center"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next &rarr;
          </button>
        </div>
      )}
    </>
  );
}

export default Recommendations;
