const amazonPaapi = require('amazon-paapi');

export interface RequestParameters {
    Keywords: string;
    SearchIndex: string;
    ItemCount: number;
    Resources: string[];
}

export interface CommonParameters {
    AccessKey: string;
    SecretKey: string;
    PartnerTag: string;
    PartnerType: string;
    Marketplace: string;
}

const commonParameters: CommonParameters = {
    AccessKey: process.env.AMAZON_ACCESS_KEY,
    SecretKey: process.env.AMAZON_SECRET_KEY,
    PartnerTag: process.env.AMAZON_ASSOCIATE_TAG,
    PartnerType: 'Associates', // Default value is Associates.
    Marketplace: 'www.amazon.com', // Default value is US. Note: Host and Region are predetermined based on the marketplace value. There is no need for you to add Host and Region as soon as you specify the correct Marketplace value. If your region is not US or .com, please make sure you add the correct Marketplace value.
};

export const requestParameters: RequestParameters = {
    Keywords: 'Harry Potter',
    SearchIndex: 'Books',
    ItemCount: 2,
    Resources: [
        'Images.Primary.Medium',
        'ItemInfo.Title',
        'Offers.Listings.Price',
    ],
};

export async function getAmazonProducts(requestParameters: RequestParameters) {
    const response = await amazonPaapi.SearchItems(commonParameters, requestParameters).catch((error: any) => {
        console.log('Error: ', error);
    });
    console.log('Response: ', response);
    return response;
}