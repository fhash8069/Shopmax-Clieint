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
