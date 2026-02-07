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

// Cart scraping function
function scrapeCartFromPage() {
  // CAPTCHA Detection (mandatory check)
  if (document.title.includes("Robot Check")) {
    throw new Error("Amazon CAPTCHA detected");
  }

  // Validate we're on a cart page
  if (!location.pathname.includes('/cart') && !location.pathname.includes('/gp/cart')) {
    throw new Error("Please navigate to the Amazon shopping cart page");
  }

  // Find the active items list
  const activeCart = document.querySelector('ul[data-name="Active Items"]');
  
  if (!activeCart) {
    throw new Error("Could not find active items section on page.");
  }

  // Get all list items and extract only the product title from each
  const items = [...activeCart.querySelectorAll('li')]
    .map(li => {
      // Extract only the product title from the truncate-cut span
      const titleSpan = li.querySelector('span.a-truncate-cut[aria-hidden="true"]');
      return titleSpan ? titleSpan.innerText.trim() : null;
    })
    .filter(Boolean);

  if (items.length === 0) {
    throw new Error("No items found in active cart.");
  }

  return items;
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
    // Don't return true - response is sent synchronously
  }
  
  if (request.action === 'scrapeCart') {
    try {
      const data = scrapeCartFromPage();
      sendResponse({ success: true, data: data });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    // Don't return true - response is sent synchronously
  }
});
