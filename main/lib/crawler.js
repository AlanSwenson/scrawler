const axios = require("axios");
const cheerio = require("cheerio");
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getRoot(url) {
    var re = new RegExp(/^.+?[^\/:](?=[?\/]|$)/);
    var match = re.exec(url);
    if (match) {
        console.log(match[0]);
        return match[0];
    }

}

export async function crawl(url, maxPages = 5) {
    // initialized with the first webpage to visit 
    // test url is https://scrapeme.live/shop
    const URLsToVisit = [url];
    const visitedURLs = [];
    const rootURLs = new Set();
    const productURLs = new Set();

    const config = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        },
    };

    // iterating until the queue is empty 
    // or the iteration limit is hit 
    while (
        URLsToVisit.length !== 0 &&
        visitedURLs.length <= maxPages
    ) {
        // the current webpage to crawl 
        const nextURL = URLsToVisit.pop();
        let root = await getRoot(nextURL);

        rootURLs.add(root);

        // retrieving the HTML content from nextURL 
        const pageHTML = await axios.get(nextURL, config);

        // adding the current webpage to the 
        // web pages already crawled 
        visitedURLs.push(nextURL);

        // initializing cheerio on the current webpage 
        const $ = cheerio.load(pageHTML.data);

        $("a").each((i, element) => {
            let href = $(element).attr("href");


            if (
                !href == '' &&
                !href.startsWith('#') &&
                !URLsToVisit.includes(href) &&
                !visitedURLs.includes(href)
            ) {
                console.log(href);
                URLsToVisit.push(href)
            }

        });
        console.log(URLsToVisit);
        // let allLinks = await findAllLinks($);

        // retrieving the pagination URLs 
        // $(".page-numbers a").each((index, element) => {
        //     const nextURL = $(element).attr("href");

        //     // adding the pagination URL to the queue 
        //     // of web pages to crawl, if it wasn't yet crawled 
        //     if (
        //         !visitedURLs.includes(nextURL) &&
        //         !URLsToVisit.includes(nextURL)
        //     ) {
        //         URLsToVisit.push(nextURL);
        //     }
        // });

        // retrieving the product URLs 
        // $("li.product a.woocommerce-LoopProduct-link").each((index, element) => {
        //     const productURL = $(element).attr("href");
        //     productURLs.add(productURL);
        // });
    }

    // logging the crawling results 
    // console.log([...productURLs]);

    // use productURLs for scraping purposes... 
    await prisma.rootURL.createMany({
        data: [...rootURLs].map(url => ({ url }))
    })

}


