
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)
CORS(app)

API_KEY = "pub_0ff4570dceb5481991e28dbe6d23c8e8"
BASE_URL = "https://newsdata.io/api/1"

# ------------------ FETCH HELPERS ------------------

def fetch_news(query="latest", max_results=10):
    """Fetch news articles from NewsData.io dynamically."""
    if query == "latest":
        url = f"{BASE_URL}/latest"
        params = {
            "apikey": API_KEY,
            "language": "en",
            "size": max_results
        }
    else:
        url = f"{BASE_URL}/news"
        params = {
            "apikey": API_KEY,
            "q": query,
            "language": "en",
            "size": max_results
        }
    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        return data.get("results", [])
    else:
        print(f"❌ Failed to fetch news: {response.status_code}")
        return []


def fetch_by_category(category="world", max_results=10):
    """Fetch headlines from NewsData.io by category."""
    url = f"{BASE_URL}/latest"
    params = {
        "apikey": API_KEY,
        "category": category,
        "language": "en",
        "size": max_results
    }
    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        return data.get("results", [])
    else:
        print(f"❌ Failed to fetch category news: {response.status_code}")
        return []


def fetch_by_country(country_code="in", max_results=10, query=None):
    """Fetch news articles from NewsData.io by country and optional query."""
    if query:
        url = f"{BASE_URL}/news"
        params = {
            "apikey": API_KEY,
            "country": country_code,
            "q": query,
            "language": "en",
            "size": max_results
        }
    else:
        url = f"{BASE_URL}/latest"
        params = {
            "apikey": API_KEY,
            "country": country_code,
            "language": "en",
            "size": max_results
        }
    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        return data.get("results", [])
    else:
        print(f"❌ Failed to fetch country news: {response.status_code}")
        return []

# ------------------ ROUTES ------------------

@app.route("/allnews", methods=["GET"])
def all_news():
    articles = fetch_news()
    return jsonify({"articles": articles})


@app.route("/category", methods=["GET"])
def category():
    category_name = request.args.get("category", "general")
    articles = fetch_by_category(category_name)
    return jsonify({"articles": articles})


@app.route("/country", methods=["GET"])
def country():
    """Fetch news articles for a specific country."""
    country_code = request.args.get("country", "in")  # Default to India
    articles = fetch_by_country(country_code)
    return jsonify({"articles": articles})


@app.route("/recommend", methods=["POST"])
def recommend():
    """Provide news recommendations based on article similarity (title only)."""
    try:
        data = request.get_json()

        if not data or "title" not in data:
            return jsonify({"error": "Valid title is required"}), 400

        clicked_title = data["title"].strip()

        if not clicked_title:
            return jsonify({"error": "Title cannot be empty"}), 400

        # Step 1: Query only with title
        query_text = clicked_title
        news_articles = fetch_news(query_text)

        if not news_articles:
            return jsonify({"error": "No relevant articles found"}), 500

        # --- Deduplicate by normalized title ---
        unique_articles = {}
        corpus = [clicked_title]  # Use only title for similarity

        for article in news_articles:
            normalized_title = article["title"].strip().lower()
            if normalized_title not in unique_articles:
                unique_articles[normalized_title] = article
                corpus.append(article["title"])  # Only title, no description

        # Vectorize text
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform(corpus)
        similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

        # Allowed fields
        allowed_fields = [
            "article_id", "title", "description", "link", "image_url", "pubDate",
            "source_id", "source_name", "source_url", "category", "country", "language"
        ]

        # Sort and select recommendations
        recommended_articles = []
        articles_list = list(unique_articles.values())
        for idx in np.argsort(similarity_scores)[::-1]:
            if similarity_scores[idx] >= 0.1:
                article = articles_list[idx]
                if (
                    article["title"].strip().lower() != clicked_title.strip().lower()
                    and article.get("link", "").strip() not in data.get("clicked_urls", [])
                ):
                    clean_article = {k: article[k] for k in allowed_fields if k in article}
                    recommended_articles.append(clean_article)
            if len(recommended_articles) >= 3:
                break

        return jsonify({"articles": recommended_articles})

    except Exception as e:
        print("🚨 Error in /recommend:", str(e))
        return jsonify({"error": "Internal server error"}), 500


# ------------------ MAIN ENTRY ------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
