// Get DOM elements
const scrapeBtn = document.getElementById('scrapeBtn');
const statusDiv = document.getElementById('status');

// Show status message
function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = type;
}

// Generate HTML page from scraped data
function generateResultsHTML(data) {
  const timestamp = new Date().toLocaleString();
  
  // Generate star rating HTML
  function generateStars(rating) {
    const numStars = parseFloat(rating) || 0;
    const fullStars = Math.floor(numStars);
    const hasHalfStar = numStars % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsHTML += '★';
      } else if (i === fullStars && hasHalfStar) {
        starsHTML += '★';
      } else {
        starsHTML += '☆';
      }
    }
    return starsHTML;
  }

  // Generate reviews HTML
  const reviewsHTML = data.reviews.map(review => `
    <div class="review-card">
      <div class="review-header">
        <div class="rating" title="${review.rating || 'N/A'} stars">
          <span class="stars">${generateStars(review.rating)}</span>
          <span class="rating-text">${review.rating || 'N/A'}</span>
        </div>
        ${review.verified ? '<span class="verified-badge">✓ Verified Purchase</span>' : ''}
      </div>
      <h3 class="review-title">${escapeHtml(review.title || 'No title')}</h3>
      <p class="review-date">${escapeHtml(review.date || 'No date')}</p>
      <p class="review-body">${escapeHtml(review.body || 'No review text')}</p>
      ${review.id ? `<p class="review-id">ID: ${escapeHtml(review.id)}</p>` : ''}
    </div>
  `).join('');

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Amazon Reviews - ${escapeHtml(data.productTitle || 'Unknown Product')}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #f5f5f5;
      color: #333;
      line-height: 1.6;
      padding: 20px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }

    .header {
      border-bottom: 3px solid #ff9900;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    h1 {
      color: #232f3e;
      font-size: 28px;
      margin-bottom: 10px;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      color: #666;
      font-size: 14px;
      margin-top: 10px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .review-count {
      font-weight: 600;
      color: #ff9900;
      font-size: 18px;
    }

    .review-card {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      transition: box-shadow 0.2s;
    }

    .review-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stars {
      color: #ff9900;
      font-size: 18px;
      letter-spacing: 2px;
    }

    .rating-text {
      font-weight: 600;
      color: #333;
    }

    .verified-badge {
      background: #067d62;
      color: white;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .review-title {
      font-size: 18px;
      color: #232f3e;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .review-date {
      color: #666;
      font-size: 13px;
      margin-bottom: 12px;
    }

    .review-body {
      color: #333;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 10px;
    }

    .review-id {
      color: #999;
      font-size: 12px;
      font-family: monospace;
    }

    .no-reviews {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-reviews h2 {
      font-size: 24px;
      margin-bottom: 10px;
    }

    @media (max-width: 768px) {
      body {
        padding: 10px;
      }

      .container {
        padding: 20px;
      }

      h1 {
        font-size: 22px;
      }

      .review-card {
        padding: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${escapeHtml(data.productTitle || 'Unknown Product')}</h1>
      <div class="meta">
        <div class="meta-item">
          <span>ASIN:</span>
          <strong>${escapeHtml(data.asin || 'N/A')}</strong>
        </div>
        <div class="meta-item">
          <span>Reviews Found:</span>
          <span class="review-count">${data.reviews.length}</span>
        </div>
        <div class="meta-item">
          <span>Scraped:</span>
          <span>${timestamp}</span>
        </div>
      </div>
    </div>

    <div class="reviews">
      ${reviewsHTML || '<div class="no-reviews"><h2>No reviews found</h2></div>'}
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Main scraping logic
async function scrapeReviews() {
  try {
    // Disable button and show loading
    scrapeBtn.disabled = true;
    showStatus('Scraping reviews...', 'info');

    // Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Validate Amazon URL
    if (!tab.url || !tab.url.includes('amazon.com')) {
      throw new Error('Please navigate to an Amazon product or reviews page');
    }

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'scrapeReviews' });

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error('No data received from content script');
    }

    // Generate HTML from scraped data
    const resultsHTML = generateResultsHTML(response.data);

    // Create blob URL
    const blob = new Blob([resultsHTML], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);

    // Open in new tab
    await chrome.tabs.create({ url: blobUrl });

    showStatus(`✓ Successfully scraped ${response.data.reviews.length} reviews!`, 'success');

  } catch (error) {
    console.error('Scraping error:', error);
    showStatus(`Error: ${error.message}`, 'error');
  } finally {
    scrapeBtn.disabled = false;
  }
}

// Add click event listener
scrapeBtn.addEventListener('click', scrapeReviews);
