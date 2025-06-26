from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Download necessary NLTK data
nltk.download("punkt")
nltk.download("stopwords")
nltk.download("wordnet")

app = Flask(__name__)
CORS(app)

API_KEY = "19ce48bc535f470cafac8da42038e504"
API_URL = "https://newsapi.org/v2/everything"
TOP_HEADLINES_URL = "https://newsapi.org/v2/top-headlines"

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words("english"))

def preprocess_text(text):
    """Tokenize, remove stopwords, and lemmatize text."""
    words = word_tokenize(text.lower())
    words = [lemmatizer.lemmatize(word) for word in words if word.isalnum() and word not in stop_words]
    return " ".join(words)

def fetch_news(query="latest", max_results=20):
    """Fetch latest news articles from NewsAPI dynamically."""
    params = {
        "q": query,
        "apiKey": API_KEY,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": max_results
    }
    response = requests.get(API_URL, params=params)

    if response.status_code == 200:
        data = response.json()
        return data.get("articles", [])
    else:
        print(f"❌ Failed to fetch news: {response.status_code}")
        return []

def fetch_top_headlines(category="general", max_results=20):
    """Fetch top headlines from NewsAPI by category."""
    params = {
        "category": category,
        "apiKey": API_KEY,
        "language": "en",
        "pageSize": max_results
    }
    response = requests.get(TOP_HEADLINES_URL, params=params)

    if response.status_code == 200:
        data = response.json()
        return data.get("articles", [])
    else:
        print(f"❌ Failed to fetch top headlines: {response.status_code}")
        return []

@app.route("/allnews", methods=["GET"])
def all_news():
    """Fetch and return latest news articles dynamically."""
    articles = fetch_news()
    return jsonify({"articles": articles})

@app.route("/top-headlines", methods=["GET"])
def top_headlines():
    """Fetch and return top headlines by category."""
    category = request.args.get("category", "general")
    articles = fetch_top_headlines(category)
    return jsonify({"articles": articles})

@app.route("/recommend", methods=["POST"])
def recommend():
    """Provide news recommendations based on article similarity."""
    try:
        data = request.get_json()
        
        if not data or "title" not in data:
            return jsonify({"error": "Valid title is required"}), 400
        
        clicked_title = data["title"].strip()
        clicked_description = data.get("description", "").strip()
        
        if not clicked_title:
            return jsonify({"error": "Title cannot be empty"}), 400

        query_keywords = " ".join(clicked_title.split()[:5])
        news_articles = fetch_news(query_keywords)
        
        if not news_articles:
            return jsonify({"error": "No relevant articles found"}), 500

        processed_title = preprocess_text(clicked_title + " " + clicked_description)
        article_texts = {}
        corpus = [processed_title]

        for article in news_articles:
            full_text = article["title"] + " " + (article.get("description") or "")
            processed_text = preprocess_text(full_text)
            
            if processed_text not in article_texts:
                article_texts[processed_text] = article
                corpus.append(processed_text)

        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(corpus)
        similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

        recommended_articles = []
        for i in np.argsort(similarity_scores)[::-1]:
            if similarity_scores[i] > 0.2:
                article = list(article_texts.values())[i]
                if article["title"] != clicked_title:
                    recommended_articles.append(article)
            if len(recommended_articles) >= 3:
                break

        return jsonify({"articles": recommended_articles})

    except Exception as e:
        print("🚨 Error in /recommend:", str(e))
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
