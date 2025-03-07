import { React, useState, useEffect } from "react";
import EverythingCard from "./EverythingCard";
import Loader from "./Loader";
import axios from "axios";

function AllNews({ onRecommendationsUpdate }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const pageSize = 12;

  useEffect(() => {
    setData([]); // Reset old data before fetching
    setIsLoading(true);
    setError(null);
  
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://news-aggregator-dusky.vercel.app/all-news?page=${page}&pageSize=${pageSize}`
        );
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const myJson = await response.json();
  
        if (myJson.success) {
          let latestArticles = myJson.data.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
          setTotalResults(myJson.data.totalResults);
          setData(latestArticles);
        } else {
          throw new Error(myJson.message || "An error occurred");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to fetch news. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchNews();
  }, [page]);
  

  const fetchRecommendations = async (article) => {
    if (!article.title || article.title.trim() === "") {
      console.error("Article title is missing. Cannot fetch recommendations.");
      return;
    }

    const payload = {
      title: article.title.trim(),
      description: article.description || "" // Include description if available
    };

    console.log("🔵 Sending payload:", payload);

    try {
      const response = await axios.post("http://127.0.0.1:5000/recommend", payload);
      const newRecommendations = response.data?.articles || [];

      onRecommendationsUpdate((prevRecommendations) => {
        const updatedRecommendations = [...newRecommendations, ...prevRecommendations];
        const uniqueRecommendations = Array.from(new Map(updatedRecommendations.map((a) => [a.url, a])).values());
        return uniqueRecommendations;
      });
    } catch (error) {
      console.error("❌ Error fetching recommendations:", error);
      if (error.response) {
        console.error("🔴 Server Response Data:", error.response.data);
      }
    }
  };

  return (
    <>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="my-10 cards grid lg:place-content-center md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xs:grid-cols-1 xs:gap-4 md:gap-10 lg:gap-14 md:px-16 xs:p-3">
        {!isLoading ? (
          data.map((article, index) => (
            <div key={index} onClick={() => fetchRecommendations(article)} className="cursor-pointer">
              <EverythingCard
                title={article.title}
                description={article.description}
                imgUrl={article.urlToImage}
                publishedAt={article.publishedAt}
                url={article.url}
                author={article.author}
                source={article.source.name}
              />
            </div>
          ))
        ) : (
          <Loader />
        )}
      </div>

      {!isLoading && data.length > 0 && (
        <div className="pagination flex justify-center gap-14 my-10 items-center">
          <button disabled={page <= 1} className="pagination-btn text-center" onClick={() => setPage(page - 1)}>
            &larr; Prev
          </button>
          <p className="font-semibold opacity-80">
            {page} of {Math.ceil(totalResults / pageSize)}
          </p>
          <button className="pagination-btn text-center" disabled={page >= Math.ceil(totalResults / pageSize)} onClick={() => setPage(page + 1)}>
            Next &rarr;
          </button>
        </div>
      )}
    </>
  );
}

export default AllNews;
