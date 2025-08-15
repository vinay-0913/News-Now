require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// CORS configuration
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Helper function for API requests
async function makeApiRequest(url) {
  try {
    const response = await axios.get(url);
    return {
      status: 200,
      success: true,
      message: "Successfully fetched the data",
      data: response.data.results || [], // NewsData.io returns `results`
      nextPage: response.data.nextPage || null,
      totalResults: response.data.totalResults || 0
    };
  } catch (error) {
    console.error("API request error:", error.response ? error.response.data : error);
    return {
      status: 500,
      success: false,
      message: "Failed to fetch data from the API",
      error: error.response ? error.response.data : error.message,
    };
  }
}

// ✅ Fetch latest news
app.get("/all-news", async (req, res) => {
  let size = parseInt(req.query.size) || 10; // Max 10 for free plan
  let page = req.query.page || "";
  let q = req.query.q || "world";

  let url = `https://newsdata.io/api/1/latest?apikey=${process.env.API_KEY}&q=${encodeURIComponent(q)}&language=en&size=${size}`;
  if (page) url += `&page=${page}`;

  const result = await makeApiRequest(url);
  res.status(result.status).json(result);
});

// ✅ Fetch latest top headlines (category-based, optionally country-specific)
app.get("/category/:category", async (req, res) => {
  let size = parseInt(req.query.size) || 10;
  const category = req.params.category;
  const page = req.query.page || ""; 
  const country = req.query.country ? req.query.country.toLowerCase() : null; // optional

  // Build API URL
  let url = `https://newsdata.io/api/1/latest?apikey=${process.env.API_KEY}&category=${category}&language=en&size=${size}`;
  if (country) url += `&country=${country}`;
  if (page) url += `&page=${page}`;

  const result = await makeApiRequest(url);
  res.status(result.status).json(result);
});





// ✅ Fetch country-specific news
app.get("/country/:iso", async (req, res) => {
  let size = parseInt(req.query.size) || 10;
  let page = req.query.page || "";
  const country = req.params.iso.toLowerCase();

  let url = `https://newsdata.io/api/1/news?apikey=${process.env.API_KEY}&country=${country}&language=en&size=${size}`;
  if (page) url += `&page=${page}`;

  const result = await makeApiRequest(url);
  res.status(result.status).json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`🚀 Server is running at port ${PORT}`);
});
