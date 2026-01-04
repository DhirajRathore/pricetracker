import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FirecrawlAppV1 } from "@mendable/firecrawl-js";

// Load .env manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const firecrawl = new FirecrawlAppV1({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

async function scrapeProduct(url) {
  try {
    console.log(`\n🔍 Scraping: ${url}\n`);
    const result = await firecrawl.scrapeUrl(url, {
      formats: ["extract"],
      onlyMainContent: false,
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
      console.error("❌ No extract data returned from Firecrawl");
      console.log("Full result:", JSON.stringify(result, null, 2));
      throw new Error("No data extracted from URL");
    }

    return extractedData;
  } catch (error) {
    console.error("❌ Firecrawl scrape error:", error.message);
    throw error;
  }
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node scripts/test-scrape.mjs "<url>"');
    process.exit(1);
  }

  if (!process.env.FIRECRAWL_API_KEY) {
    console.error('❌ FIRECRAWL_API_KEY not set in .env');
    process.exit(1);
  }

  try {
    const res = await scrapeProduct(url);
    console.log('✅ Scrape result:');
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('❌ Scrape failed:', err.message);
    process.exit(2);
  }
}

main();
