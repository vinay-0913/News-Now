# News Aggregator

This is a news aggregator project built using the MERN stack (MongoDB, Express, React, Node.js) and the NewsAPI.org API. The project allows users to view news articles from various sources.

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js and npm installed on your machine
- A NewsAPI.org API key

### Installation

1. Fork the repository on GitHub.
2. Clone the repository to your local machine.
3. Navigate to the server directory and create a new file named `.env`.
4. Add your NewsAPI.org API key to the `.env` file in the following format: `API_KEY=your_news_api_key`.
5. In the server directory, run `npm install` to install the necessary dependencies.
6. In the server directory, run `.venv\Scripts\activate` to activate (.venv). And then run python `app.py`.
6. Start the server by running `node server.js`.
7. Navigate to the client directory and run `npm install` to install the necessary dependencies.
8. Start the client by running `npm run dev`.
Make sure you replace with your API key. So when clicking news articles in AllNews section and Top-Headlines section, related news artilces are shown in Recommendation section (If not, relvent new are not found).

## Note - Currently NewsAPI.org only support `us` country news. So in Country Section, other country news are not returning any news articles. 

## Usage

Once the project is set up and running, you can view news articles from various sources on the client side.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
