const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = "https://helakuru.bhashalanka.com/esana/news/recent-news.json";

// File නමකට ගැලපෙන විදියට title එක sanitize කරන function එක
function sanitizeFilename(name) {
    return name.replace(/[\/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_');
}

async function fetchAndSaveNews() {
    console.log('Fetching latest news...');
    try {
        const response = await axios.get(API_URL);
        const articles = response.data.data;

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
            const fileName = `${article.id}-${sanitizedTitle}.md`;
            const filePath = path.join(dirPath, fileName);

            // ෆයිල් එක දැනටමත් තියෙනවදැයි පරීක්ෂා කිරීම
            if (fs.existsSync(filePath)) {
                // console.log(`Skipping existing article: ${fileName}`);
                continue; // තියෙනවා නම්, ඊළඟ article එකට යනවා
            }

            console.log(`Creating new article: ${filePath}`);

            // Markdown content එක සකස් කිරීම
            let markdownContent = `---
title: "${article.titleSi.replace(/"/g, '\\"')}"
date: ${article.published}
---

# ${article.titleSi}

![Thumbnail](${article.thumb})

`;

            article.contentSi.forEach(block => {
                if (block.type === 'text') {
                    markdownContent += `${block.data.replace(/<[^>]*>?/gm, '')}\n\n`;
                } else if (block.type === 'image') {
                    markdownContent += `![Image](${block.data})\n\n`;
                } else if (block.type === 'iframe') {
                    markdownContent += `[Watch Video](${block.data})\n\n`;
                }
            });

            // Directory එක සාදා, ෆයිල් එක ලිවීම
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