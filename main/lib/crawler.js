const axios = require("axios");
const cheerio = require("cheerio");
import { PrismaClient } from '@prisma/client'
import { chromium } from 'playwright-core';

const prisma = new PrismaClient()

export function getRoot(url) {
    var re = new RegExp(/^.+?[^\/:](?=[?\/]|$)/);
    var match = re.exec(url);
    if (match) {
        return match[0].replace('www.', '')
    }
}

function compareRoot(url, root) {
    var newRoot = getRoot(url);
    console.log("newRoot: ", newRoot, "root: ", root);
    if (newRoot == root) return true;
}

function isShop($) {
    let shop = 'no'
    if ($('.woocommerce').length) shop = 'woocommerce'
    return shop;
}

export async function crawl(url, maxPages = 5) {
    // initialized with the first webpage to visit 
    // test url is https://scrapeme.live/shop
    if (!url) url = 'https://scrapeme.live/shop';
    if (!url.startsWith('http') && !url.startsWith('https')) url = 'https://' + url;
    const URLsToVisit = [url];
    const visitedURLs = [];
    const rootURLs = new Set();

    const config = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        },
    };

    const browser = await chromium.launch({
        headless: true,
    });
    const page = await browser.newPage()


    // iterating until the queue is empty 
    // or the iteration limit is hit 
    while (
        URLsToVisit.length !== 0 &&
        visitedURLs.length < maxPages
    ) {
        // the current webpage to crawl 
        const nextURL = URLsToVisit.pop();
        let root = getRoot(nextURL);

        rootURLs.add(root);

        // retrieving the HTML content from nextURL 
        try {

            await page.goto(nextURL)
            const pageHTML = await page.content()
            console.log(typeof pageHTML)
            // const pageHTML = await axios.get(nextURL, config);
            // adding the current webpage to the 
            // web pages already crawled 
            visitedURLs.push(nextURL);
            console.log("Visited: ", visitedURLs.length);
            // initializing cheerio on the current webpage 
            const $ = cheerio.load(pageHTML);
            console.log("Shop? ", isShop($));

            $("a").each((i, element) => {
                let href = $(element).attr("href");
                let validURL = false
                if (href && href.startsWith('http')) {
                    validURL = !(compareRoot(href, root));
                }

                if (
                    validURL &&
                    !URLsToVisit.includes(href) &&
                    !visitedURLs.includes(href)
                ) {
                    console.log("adding: ", href);
                    URLsToVisit.push(href)
                }

            });
        } catch (error) {
            console.error(error);
        }




    }
    await browser.close();
    // use productURLs for scraping purposes... 
    await prisma.rootURL.createMany({
        data: [...rootURLs].map(url => ({ url: url.replace('https://', '').replace('http://', '') })),
        skipDuplicates: true,
    })

}


