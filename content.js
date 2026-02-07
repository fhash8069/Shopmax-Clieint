// Amazon Review Scraper Content Script
// This script runs on Amazon pages and performs the actual scraping

// Main scraping function
function scrapeReviewsFromPage() {
  // CAPTCHA Detection (mandatory check)
  if (document.title.includes("Robot Check")) {
    throw new Error("Amazon CAPTCHA detected");
  }

  // Extract product metadata
  const asin =
    location.pathname.match(/\/product-reviews\/([A-Z0-9]{10})/)?.[1] ||
    location.pathname.match(/\/dp\/([A-Z0-9]{10})/)?.[1] ||
    null;

  const productTitle =
    document.querySelector("#productTitle")?.innerText?.trim() || null;

  // Extract product description
  const productDescription =
    document.querySelector("#feature-bullets")?.innerText?.trim() ||
    document.querySelector("#productDescription p")?.innerText?.trim() ||
    null;

  // Extract product specifications
  const specifications = {};
  document.querySelectorAll("#productDetails_detailBullets_sections1 tr, .prodDetTable tr, #detailBullets_feature_div li").forEach(row => {
    const label = row.querySelector("th, .label")?.innerText?.trim();
    const value = row.querySelector("td, .value")?.innerText?.trim();
    if (label && value) {
      specifications[label] = value;
    }
  });

  // Scrape reviews using stable Amazon selectors
  const reviews = [];

  document.querySelectorAll('[data-hook="review"]').forEach(review => {
    reviews.push({
      id: review.id || null,
      rating: review
        .querySelector('[data-hook="review-star-rating"]')
        ?.innerText?.split(" ")[0] || null,
      title: review
        .querySelector('[data-hook="review-title"] span')
        ?.innerText || null,
      body: review
        .querySelector('[data-hook="review-body"] span')
        ?.innerText || null,
      verified: Boolean(
        review.querySelector('[data-hook="avp-badge"]')
      ),
      date: review
        .querySelector('[data-hook="review-date"]')
        ?.innerText || null
    });
  });

  // Validation: fail if no reviews found
  if (reviews.length === 0) {
    throw new Error("No reviews found on page");
  }

  // Return data in exact contract format
  return {
    asin: asin,
    productTitle: productTitle,
    description: productDescription,
    specifications: Object.keys(specifications).length > 0 ? specifications : null,
    reviews: reviews
  };
}

// Message listener for popup communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapeReviews') {
    try {
      const data = scrapeReviewsFromPage();
      sendResponse({ success: true, data: data });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  
  // Return true to indicate async response
  return true;
});
