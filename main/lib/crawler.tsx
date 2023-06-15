import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client'
import { chromium } from 'playwright-core';
import chalk from 'chalk';

const prisma = new PrismaClient()

export function getRoot(url) {
    var re = new RegExp(/^.+?[^\/:](?=[?\/]|$)/);
    var match = re.exec(url);
    if (match) {
        return match[0].replace('www.', '')
    }
}

function compareRoot(url: string, root: string) : boolean {
    var newRoot = getRoot(url);
    if (newRoot == root) return true;
    else return false;
}

function isShop($: cheerio.CheerioAPI) : string {
    let shop: string = 'no'
    if ($('.woocommerce').length) shop = 'woocommerce'
    return shop;
}

export async function crawl(url: string, maxPages: number = 5) : Promise<number> {
    // initialized with the first webpage to visit 
    // test url is https://scrapeme.live/shop
    if (!url) url = 'https://scrapeme.live/shop';
    if (!url.startsWith('http') && !url.startsWith('https')) url = 'https://' + url;
    const URLsToVisit: string[] = [url];
    const visitedURLs: string[] = [];
    const rootURLs = new Set<string>();

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
        const nextURL: string = URLsToVisit.pop();
        let root: string = getRoot(nextURL);

        // retrieving the HTML content from nextURL 
        try {

            await page.goto(nextURL)
            rootURLs.add(root);
            const pageHTML = await page.content()
            // adding the current webpage to the 
            // web pages already crawled 
            visitedURLs.push(nextURL);
            console.log("Visited: ", visitedURLs.length);
            // initializing cheerio on the current webpage 
            const $ = cheerio.load(pageHTML);
            let shop: string = isShop($);
            if (shop != 'no') shop = chalk.green(shop);
            else shop = chalk.red(shop);
            console.log("Shop? ", shop);

            $("a").each((i, element) => {
                let href: string = $(element).attr("href");
                let validURL: boolean = false
                if (href && href.startsWith('http')) {
                    validURL = !(compareRoot(href, root));
                }

                if (
                    validURL &&
                    !URLsToVisit.includes(href) &&
                    !visitedURLs.includes(href)
                ) {
                    console.log(chalk.blue("adding: ", href));
                    URLsToVisit.push(href)
                }

            });
        } catch (error) {
            console.error(error);
        }




    }
    await browser.close();
    // use productURLs for scraping purposes... 
    const addedCount = await prisma.rootURL.createMany({
        data: [...rootURLs].map(url => {
            return ({ url: url.replace('https://', '').replace('http://', '') });
        }),
        skipDuplicates: true,
    })
    return addedCount.count;

}


