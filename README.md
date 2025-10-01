# Unofficial Helakuru Esana News API

[![API Status](https://img.shields.io/website?label=API%20Status&style=for-the-badge&up_message=Online&url=https://esena-news-api-v3.vercel.app/)](https://esena-news-api-v3.vercel.app/)

An unofficial, free, and fast API to fetch the latest news articles from Helakuru Esana, Sri Lanka's leading news provider. This API serves as a proxy, fetching live data from the official Helakuru JSON endpoint, ensuring the information is always up-to-date.

## Base URL

All requests should be made to the following base URL:

```
https://esena-news-api-v3.vercel.app/
```

---

## Endpoints

### Get Latest News

Retrieves a list of the most recent news articles published on Helakuru Esana.

- **Method:** `GET`
- **Endpoint:** `/`
- **Parameters:** None

#### Example Request (cURL)

```bash
curl https://esena-news-api-v3.vercel.app/
```

---

## Response Object

The API returns a JSON object containing developer information and the nested news data from the official source.

### Main Object Structure
| Key              | Type   | Description                                           |
| ---------------- | ------ | ----------------------------------------------------- |
| `developer_info` | Object | Information about the API developer.                  |
| `news_data`      | Object | The original, unmodified response from the Helakuru source API. |

### `news_data.data` Array Object
Each object inside the `news_data.data` array represents a single news article and has the following structure:

| Key         | Type    | Description                                       |
| ----------- | ------- | ------------------------------------------------- |
| `id`        | Integer | The unique ID of the news article.                |
| `titleSi`   | String  | The title of the article in Sinhala.              |
| `titleEn`   | String  | The title of the article in English.              |
| `contentSi` | Array   | An array of objects representing the article body in Sinhala (can contain text, images, iframes). |
| `thumb`     | String  | URL for the article's thumbnail image.            |
| `cover`     | String  | URL for the article's cover image.                |
| `published` | String  | The publication timestamp (e.g., `2025-10-01 20:00:00`). |
| `share_url` | String  | The original share URL for the article.           |
| `reactions` | Object  | An object containing counts for different reactions (`like`, `love`, etc.). |
| `comments`  | Integer | The total number of comments.                     |

---

## Code Examples

### JavaScript (Fetch API)

```javascript
const apiUrl = 'https://esena-news-api-v3.vercel.app/';

async function getEsanaNews() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // The actual list of articles is inside news_data.data
    const articles = data.news_data.data;
    
    articles.forEach(article => {
      console.log(`Title: ${article.titleSi}`);
      console.log(`Link: ${article.share_url}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

getEsanaNews();
```

### Python (requests)

```python
import requests

api_url = 'https://esena-news-api-v3.vercel.app/'

try:
    response = requests.get(api_url)
    response.raise_for_status()  # Raise an exception for bad status codes
    
    data = response.json()
    
    # Access the nested list of articles
    articles = data.get('news_data', {}).get('data', [])
    
    for article in articles:
        print(f"Title: {article.get('titleSi')}")
        print(f"Link: {article.get('share_url')}")
        print("---")

except requests.exceptions.RequestException as e:
    print(f"Error fetching news: {e}")

```

---

## Fair Use Policy

This is a free API that relies on another service. Please use it responsibly.
- Cache responses on your end whenever possible.
- Avoid making an excessive number of requests in a short period. A polling interval of 2-5 minutes is recommended.
- Abusive usage may result in your IP address being blocked.

## Disclaimer

This is an unofficial API and is not affiliated with, endorsed, or sponsored by Bhasha Lanka (Pvt) Ltd or Helakuru. It relies on a publicly available JSON endpoint which could change or become unavailable at any time.

## Developer Information

- **API Developed By:** Thamindu Disna
- **Website:** [www.thamindudisna.com](http://www.thamindudisna.com)
