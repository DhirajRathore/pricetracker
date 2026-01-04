import { FirecrawlAppV1 } from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlAppV1({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
  try {
    // First, try with enhanced options for dynamic content
    const result = await firecrawl.scrapeUrl(url, {
      formats: ["extract"],
      onlyMainContent: false, // Include all content
      extract: {
        prompt: `You are extracting product data from an e-commerce website.
        
Extract and return ONLY valid JSON with these fields:
- productName: (string) The product title/name. Look in h1, title, or "product-title" elements. REQUIRED, cannot be empty
- currentPrice: (number) JUST the numeric price value. Look for large numbers, prices in ₹ or $ symbols. REQUIRED, must be > 0. If you see "₹1,299" extract as 1299
- currencyCode: (string) The currency (INR for ₹, USD for $, EUR for €, GBP for £). REQUIRED
- productImageUrl: (string, optional) Main product image URL

If any required field is empty or 0, the extraction failed.
Return valid JSON only.`,
        schema: {
          type: "object",
          properties: {
            productName: { type: "string" },
            currentPrice: { type: "number" },
            currencyCode: { type: "string" },
            productImageUrl: { type: "string" },
          },
          required: ["productName", "currentPrice", "currencyCode"],
        },
      },
    });

    const extractedData = result.extract;

    if (!extractedData) {
      throw new Error("No extract data returned from Firecrawl");
    }

    const { productName, currentPrice, currencyCode, productImageUrl } = extractedData;

    if (!productName || productName.trim() === "" || productName.trim().length < 3) {
      throw new Error(`Product name invalid: "${productName}"`);
    }

    if (typeof currentPrice !== "number" || currentPrice <= 0) {
      throw new Error(`Invalid price: ${currentPrice}`);
    }

    if (!currencyCode || currencyCode.trim() === "") {
      throw new Error(`Currency code invalid: "${currencyCode}"`);
    }

    return {
      productName: productName.trim(),
      currentPrice,
      currencyCode: currencyCode.trim(),
      productImageUrl: productImageUrl ? productImageUrl.trim() : null,
    };
  } catch (error) {
    console.error("Firecrawl scrape error:", error.message);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}