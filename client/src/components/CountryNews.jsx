import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EverythingCard from "./EverythingCard";
import Loader from "./Loader";

function CountryNews({ onRecommendationsUpdate }) {
  const params = useParams();
  const [data, setData] = useState([]);
  const [pageToken, setPageToken] = useState("");
  const [nextPageToken, setNextPageToken] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const pageSize = 9;
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const RECOMMEND_BASE = import.meta.env.VITE_RECOMMEND_BASE_URL; 

  useEffect(() => {
    setData([]);
    setPageToken("");
    fetchArticles(false);
  }, [params.iso]);

  const fetchArticles = async (loadMore = false) => {
    if (loadMore) setIsLoadingMore(true);
    else setIsLoading(true);

    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/country/${params.iso}?size=${pageSize}${
          loadMore && pageToken ? `&page=${pageToken}` : ""
        }`
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const myJson = await response.json();

      if (myJson.success || myJson.results) {
        const articles = myJson.results || myJson.data || [];
        articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        setTotalResults(myJson.totalResults || articles.length);

        if (loadMore) setData((prev) => [...prev, ...articles]);
        else setData(articles);

        setNextPageToken(myJson.nextPage || null);
        setPageToken(myJson.nextPage || "");
      } else {
        throw new Error(myJson.message || "An error occurred");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch news. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const fetchRecommendations = async (article) => {
    if (!article.title || article.title.trim() === "") return;

    const payload = {
      title: article.title.trim(),
      description: article.description || "",
      clicked_urls: [article.link],
    };

    try {
      const response = await axios.post(`${RECOMMEND_BASE}/recommend`, payload);
      const newRecommendations = response.data?.articles || [];

      onRecommendationsUpdate((prevRecommendations) => {
        const updated = [...newRecommendations, ...prevRecommendations];
        return Array.from(new Map(updated.map((a) => [a.link, a])).values());
      });
    } catch (err) {
      console.error("❌ Error fetching recommendations:", err);
      if (err.response) console.error("🔴 Server Response Data:", err.response.data);
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

      {!isLoading && nextPageToken && (
        <div className="flex justify-center my-10">
          <button
            className="pagination-btn hover:bg-blue-600 text-center"
            onClick={() => fetchArticles(true)}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}

export default CountryNews;
