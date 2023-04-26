const axios = require("axios");
const cheerio = require("cheerio");
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function crawl(url, maxPages = 50) {
    // initialized with the first webpage to visit 
    // test url is https://scrapeme.live/shop
    const paginationURLsToVisit = [url];
    const visitedURLs = [];

    const productURLs = new Set();

    const config = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        },
    };

    // iterating until the queue is empty 
    // or the iteration limit is hit 
    while (
        paginationURLsToVisit.length !== 0 &&
        visitedURLs.length <= maxPages
    ) {
        // the current webpage to crawl 
        const paginationURL = paginationURLsToVisit.pop();

        // retrieving the HTML content from paginationURL 
        const pageHTML = await axios.get(paginationURL, config);

        // adding the current webpage to the 
        // web pages already crawled 
        visitedURLs.push(paginationURL);

        // initializing cheerio on the current webpage 
        const $ = cheerio.load(pageHTML.data);

        // retrieving the pagination URLs 
        $(".page-numbers a").each((index, element) => {
            const paginationURL = $(element).attr("href");

            // adding the pagination URL to the queue 
            // of web pages to crawl, if it wasn't yet crawled 
            if (
                !visitedURLs.includes(paginationURL) &&
                !paginationURLsToVisit.includes(paginationURL)
            ) {
                paginationURLsToVisit.push(paginationURL);
            }
        });

        // retrieving the product URLs 
        $("li.product a.woocommerce-LoopProduct-link").each((index, element) => {
            const productURL = $(element).attr("href");
            productURLs.add(productURL);
        });
    }

    // logging the crawling results 
    console.log([...productURLs]);

    // use productURLs for scraping purposes... 
    await prisma.rootURL.createMany({
        data: [...productURLs].map(url => ({ url }))
    })

}


