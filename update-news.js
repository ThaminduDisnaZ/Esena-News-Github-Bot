const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = "https://esena-news-api-v3.vercel.app/";

function sanitizeFilename(name) {
    return name.replace(/[\/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_');
}

async function fetchAndSaveNews() {
    console.log(`Fetching latest news from your API: ${API_URL}`);
    try {
        const response = await axios.get(API_URL);
        const articles = response.data.news_data.data;

        if (!articles || articles.length === 0) {
            console.log('No articles found in the API response.');
            return;
        }

        console.log(`Found ${articles.length} articles. Processing...`);

        for (const article of articles) {
            const publishedDate = new Date(article.published);
            const year = publishedDate.getFullYear();
            const month = String(publishedDate.getMonth() + 1).padStart(2, '0');
            const day = String(publishedDate.getDate()).padStart(2, '0');
            const dateFolder = `${year}-${month}-${day}`;

            const dirPath = path.join('News', dateFolder);
            const sanitizedTitle = sanitizeFilename(article.titleSi);

            const MAX_TITLE_LENGTH = 100; 
            const truncatedTitle = sanitizedTitle.length > MAX_TITLE_LENGTH 
                ? sanitizedTitle.substring(0, MAX_TITLE_LENGTH) 
                : sanitizedTitle;
            
            const fileName = `${article.id}-${truncatedTitle}.md`;
          
            
            const filePath = path.join(dirPath, fileName);

            if (fs.existsSync(filePath)) {
                continue;
            }

            console.log(`Creating new article: ${filePath}`);

            let markdownContent = `---
title: "${article.titleSi.replace(/"/g, '\\"')}"
date: ${article.published}
---

# ${article.titleSi}

![Thumbnail](${article.thumb})

`;

            if (article.contentSi) {
                article.contentSi.forEach(block => {
                    if (block.type === 'text' && block.data) {
                        const cleanText = block.data.replace(/<[^>]*>?/gm, '');
                        markdownContent += `${cleanText}\n\n`;
                    } else if (block.type === 'image') {
                        markdownContent += `![Image](${block.data})\n\n`;
                    } else if (block.type === 'iframe') {
                        markdownContent += `[Watch Video](${block.data})\n\n`;
                    }
                });
            }

            fs.mkdirSync(dirPath, { recursive: true });
            fs.writeFileSync(filePath, markdownContent);
        }
        console.log('News update process finished.');

    } catch (error) {
        console.error('Error fetching or saving news:', error.message);
        process.exit(1);
    }
}

fetchAndSaveNews();