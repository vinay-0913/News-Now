import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import EverythingCard from './EverythingCard'
import Loader from "./Loader";
import axios from "axios";

function TopHeadlines({ onRecommendationsUpdate }) {
  const params = useParams();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function handlePrev() {
    setPage(page - 1);
  }

  function handleNext() {
    setPage(page + 1);
  }

  let pageSize = 6;

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const categoryParam = params.category ? `&category=${params.category}` : "";
    fetch(`https://news-aggregator-dusky.vercel.app/top-headlines?language=en${categoryParam}&page=${page}&pageSize=${pageSize}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((json) => {
        if (json.success) {
          setTotalResults(json.data.totalResults);
          setData(json.data.articles);
        } else {
          setError(json.message || 'An error occurred');
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError('Failed to fetch news. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, params.category]);

  const fetchRecommendations = async (article) => {
    if (!article.title || article.title.trim() === "") {
      console.error("Article title is missing. Cannot fetch recommendations.");
      return;
    }

    const payload = {
      title: article.title.trim(),
      description: article.description || "",
    };

    try {
      const response = await axios.post("http://127.0.0.1:5000/recommend", payload);
      const newRecommendations = response.data?.articles || [];

      onRecommendationsUpdate((prevRecommendations) => {
        const updatedRecommendations = [...newRecommendations, ...prevRecommendations];
        const uniqueRecommendations = Array.from(new Map(updatedRecommendations.map((a) => [a.url, a])).values());
        return uniqueRecommendations;
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      if (error.response) {
        console.error("Server Response Data:", error.response.data);
      }
    }
  };

  return (
    <>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className='my-10 cards grid lg:place-content-center md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xs:grid-cols-1 xs:gap-4 md:gap-10 lg:gap-14 md:px-16 xs:p-3 '>
        {!isLoading ? (
          data.length > 0 ? (
            data.map((element, index) => (
              <div key={index} onClick={() => fetchRecommendations(element)} className="cursor-pointer">
                <EverythingCard
                  title={element.title}
                  description={element.description}
                  imgUrl={element.urlToImage}
                  publishedAt={element.publishedAt}
                  url={element.url}
                  author={element.author}
                  source={element.source.name}
                />
              </div>
            ))
          ) : (
            <p>No articles found for this category or criteria.</p>
          )
        ) : (
          <Loader />
        )}
      </div>
      {!isLoading && data.length > 0 && (
        <div className="pagination flex justify-center gap-14 my-10 items-center">
          <button disabled={page <= 1} className='pagination-btn' onClick={handlePrev}>Prev</button>
          <p className='font-semibold opacity-80'>{page} of {Math.ceil(totalResults / pageSize)}</p>
          <button className='pagination-btn' disabled={page >= Math.ceil(totalResults / pageSize)} onClick={handleNext}>Next</button>
        </div>
      )}
    </>
  );
}

export default TopHeadlines;
