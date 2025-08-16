import { React, useState, useEffect } from "react";
import EverythingCard from "./EverythingCard";
import Loader from "./Loader";
import axios from "axios";

function AllNews({ onRecommendationsUpdate }) {
  const [data, setData] = useState([]);
  const [pageToken, setPageToken] = useState(""); // NewsData.io pagination token
  const [totalResults, setTotalResults] = useState(0);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // ✅ New state for load more
  const [error, setError] = useState(null);

  const pageSize = 9; // NewsData.io free tier max
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const RECOMMEND_BASE = import.meta.env.VITE_RECOMMEND_BASE_URL;
  
  // Fetch initial news
  useEffect(() => {
    fetchNews(false);
  }, []);

  const fetchNews = async (loadMore = false) => {
    if (loadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/all-news?size=${pageSize}${loadMore && pageToken ? `&page=${pageToken}` : ""}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const myJson = await response.json();

      if (myJson.success) {
        let latestArticles = myJson.data.sort(
          (a, b) => new Date(b.pubDate) - new Date(a.pubDate)
        );

        setTotalResults(myJson.totalResults || 0);

        if (loadMore) {
          // Append new articles
          setData((prev) => [...prev, ...latestArticles]);
        } else {
          // Replace with first page
          setData(latestArticles);
        }

        setNextPageToken(myJson.nextPage || null);
        setPageToken(myJson.nextPage || "");
      } else {
        throw new Error(myJson.message || "An error occurred");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch news. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const fetchRecommendations = async (article) => {
    if (!article.title || article.title.trim() === "") {
      console.error("Article title is missing. Cannot fetch recommendations.");
      return;
    }

    const payload = {
      title: article.title.trim(),
      description: article.description || "",
      clicked_urls: [article.link] // NewsData.io uses `link` for URL
    };

    try {
      const response = await axios.post(`${RECOMMEND_BASE}/recommend`, payload);
      const newRecommendations = response.data?.articles || [];

      onRecommendationsUpdate((prevRecommendations) => {
        const updatedRecommendations = [...newRecommendations, ...prevRecommendations];
        const uniqueRecommendations = Array.from(
          new Map(updatedRecommendations.map((a) => [a.link, a])).values()
        );
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
      {error && <div className="text-red-500 mb-10">{error}</div>}

      <div className="my-24 cards grid lg:place-content-center md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xs:grid-cols-1 xs:gap-4 md:gap-10 lg:gap-14 md:px-16 xs:p-3">
        {!isLoading ? (
          data.map((article, index) => (
            <div key={index} onClick={() => fetchRecommendations(article)} className="cursor-pointer">
              <EverythingCard
                title={article.title}
                description={article.description}
                imgUrl={article.image_url}
                publishedAt={article.pubDate}
                url={article.link}
                author={article.creator ? article.creator.join(", ") : "Unknown"}
                source={article.source_id || "Unknown"}
              />
            </div>
          ))
        ) : (
          <Loader />
        )}
      </div>

      {/* Load More Button */}
      {!isLoading && nextPageToken && (
        <div className="flex justify-center my-10">
          <button
            className="pagination-btn hover:bg-blue-600 text-center"
            onClick={() => fetchNews(true)}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}

export default AllNews;
