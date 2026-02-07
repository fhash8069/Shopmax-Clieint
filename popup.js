// Get DOM elements
const scrapeBtn = document.getElementById('scrapeBtn');
const statusDiv = document.getElementById('status');

// Show status message
function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = type;
}

// Generate star rating text
function generateStarsText(rating) {
  const numStars = parseFloat(rating) || 0;
  const fullStars = Math.floor(numStars);
  const hasHalfStar = numStars % 1 >= 0.5;
  let starsText = '';
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsText += '*';
    } else if (i === fullStars && hasHalfStar) {
      starsText += '*';
    } else {
      starsText += '-';
    }
  }
  return starsText;
}

// Generate plain text formatted data for storage and copying
function generateFormattedTextData(data) {
  const timestamp = new Date().toLocaleString();
  let text = '';
  
  // Section 1: Product Information
  text += '=== Section 1 - Product Information ===\n';
  text += `Product Name: ${data.productTitle || 'N/A'}\n`;
  text += `ASIN: ${data.asin || 'N/A'}\n`;
  text += `Scraped Date: ${timestamp}\n`;
  if (data.description) {
    text += `Description: ${data.description}\n`;
  }
  if (data.specifications) {
    text += `Specifications: ${JSON.stringify(data.specifications, null, 2)}\n`;
  }
  text += '\n';
  
  // Section 2+: Reviews
  data.reviews.forEach((review, index) => {
    const sectionNum = index + 2;
    const rating = review.rating || 'N/A';
    const stars = generateStarsText(review.rating);
    
    text += `=== Section ${sectionNum} - Review ${index + 1} ===\n`;
    text += `Title: ${review.title || 'No title'}\n`;
    text += `Review: ${review.body || 'No review text'}\n`;
    text += `Date: ${review.date || 'No date'}\n`;
    text += `Verified: ${review.verified ? 'Yes' : 'No'}\n`;
    if (review.id) {
      text += `ID: ${review.id}\n`;
    }
    text += `Rating: ${rating}/5 ${stars}\n`;
    text += '\n';
  });
  
  return text;
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

  // Generate plain text formatted JSON sections for copying (use global function)
  const plainTextData = generateFormattedTextData(data);

  // Generate formatted JSON sections HTML
  function generateJsonSections() {
    let sections = '';
    
    // Section 1: Product Information
    sections += `
      <div class="json-section">
        <div class="json-section-title">Section 1 - Product Information</div>
        <div class="json-field"><span class="json-key">Product Name:</span> <span class="json-value">${escapeHtml(data.productTitle || 'N/A')}</span></div>
        <div class="json-field"><span class="json-key">ASIN:</span> <span class="json-value">${escapeHtml(data.asin || 'N/A')}</span></div>
        <div class="json-field"><span class="json-key">Scraped Date:</span> <span class="json-value">${timestamp}</span></div>
        ${data.description ? `<div class="json-field"><span class="json-key">Description:</span> <span class="json-value">${escapeHtml(data.description)}</span></div>` : ''}
        ${data.specifications ? `<div class="json-field"><span class="json-key">Specifications:</span> <span class="json-value">${escapeHtml(JSON.stringify(data.specifications, null, 2))}</span></div>` : ''}
      </div>
    `;
    
    // Section 2+: Reviews
    data.reviews.forEach((review, index) => {
      const sectionNum = index + 2;
      const stars = generateStars(review.rating);
      
      sections += `
        <div class="json-section">
          <div class="json-section-title">Section ${sectionNum} - Review ${index + 1}</div>
          <div class="json-field"><span class="json-key">Title:</span> <span class="json-value">${escapeHtml(review.title || 'No title')}</span></div>
          <div class="json-field"><span class="json-key">Review:</span> <span class="json-value">${escapeHtml(review.body || 'No review text')}</span></div>
          <div class="json-field"><span class="json-key">Date:</span> <span class="json-value">${escapeHtml(review.date || 'No date')}</span></div>
          <div class="json-field"><span class="json-key">Verified:</span> <span class="json-value">${review.verified ? 'Yes' : 'No'}</span></div>
          ${review.id ? `<div class="json-field"><span class="json-key">ID:</span> <span class="json-value">${escapeHtml(review.id)}</span></div>` : ''}
          <div class="json-field"><span class="json-key">Rating:</span> <span class="json-value">${review.rating || 'N/A'}/5</span> <span class="json-stars">${stars}</span></div>
        </div>
      `;
    });
    
    return sections;
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Escape JSON for embedding in script tag
  function escapeJsonForScript(obj) {
    return JSON.stringify(obj)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/\f/g, '\\f')
      .replace(/</g, '\\x3C')
      .replace(/>/g, '\\x3E');
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

    .action-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .btn {
      background: #ff9900;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn:hover {
      background: #e88900;
    }

    .btn:active {
      transform: scale(0.98);
    }

    .btn.success {
      background: #067d62;
    }

    .product-specs {
      background: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }

    .product-specs h2 {
      color: #232f3e;
      font-size: 20px;
      margin-bottom: 15px;
      border-bottom: 2px solid #ff9900;
      padding-bottom: 8px;
    }

    .product-desc {
      color: #333;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 10px;
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

    .json-display {
      background: #f9f9f9;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-top: 40px;
    }

    .json-display h2 {
      color: #232f3e;
      font-size: 22px;
      margin-bottom: 20px;
      border-bottom: 2px solid #ff9900;
      padding-bottom: 10px;
    }

    .json-section {
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 15px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.6;
    }

    .json-section-title {
      color: #ff9900;
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .json-field {
      margin-bottom: 8px;
      padding-left: 10px;
    }

    .json-key {
      color: #0066cc;
      font-weight: 600;
    }

    .json-value {
      color: #333;
    }

    .json-stars {
      color: #ff9900;
      font-size: 16px;
      margin-left: 10px;
    }

    .text-container {
      background: #2d2d2d;
      border: 2px solid #ff9900;
      border-radius: 8px;
      padding: 20px;
      margin-top: 40px;
    }

    .text-container h2 {
      color: #ff9900;
      font-size: 22px;
      margin-bottom: 15px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .text-box {
      background: #1e1e1e;
      border: 1px solid #444;
      border-radius: 6px;
      padding: 20px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.8;
      color: #e0e0e0;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 600px;
      overflow-y: auto;
      user-select: all;
      cursor: text;
    }

    .text-box:hover {
      background: #252525;
    }

    .copy-instruction {
      color: #999;
      font-size: 14px;
      margin-top: 10px;
      font-style: italic;
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

      .btn {
        width: 100%;
        justify-content: center;
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

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button class="btn" id="copyJsonBtn">
        📋 Copy Formatted JSON
      </button>
    </div>

    <!-- Formatted JSON Display Section -->
    <div class="json-display">
      <h2>Formatted Review Data</h2>
      ${generateJsonSections()}
    </div>

    <!-- Plain Text Container for Easy Copying -->
    <div class="text-container">
      <h2>📋 Copy Text Below (Select All with Ctrl+A)</h2>
      <div class="text-box" id="plainTextBox">${escapeHtml(plainTextData)}</div>
      <p class="copy-instruction">Click in the box above, press Ctrl+A (or Cmd+A on Mac) to select all, then Ctrl+C (or Cmd+C) to copy</p>
    </div>
  </div>

  <script>
    // Simple script to handle text box interaction
    document.addEventListener('DOMContentLoaded', function() {
      const textBox = document.getElementById('plainTextBox');
      const copyBtn = document.getElementById('copyJsonBtn');
      
      // Click text box to select all
      if (textBox) {
        textBox.addEventListener('click', function() {
          const range = document.createRange();
          range.selectNodeContents(textBox);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        });
      }
      
      // Copy button functionality
      if (copyBtn) {
        copyBtn.addEventListener('click', function() {
          const btn = this;
          const textToCopy = textBox ? textBox.textContent : '';
          
          if (!textToCopy) {
            alert('No text to copy!');
            return;
          }
          
          // Try to copy
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          
          try {
            const successful = document.execCommand('copy');
            if (successful) {
              const originalHTML = btn.innerHTML;
              btn.innerHTML = '✓ Copied!';
              btn.classList.add('success');
              
              setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('success');
              }, 2000);
            } else {
              alert('Copy failed. Please select the text manually and use Ctrl+C');
            }
          } catch (err) {
            alert('Copy failed. Please select the text manually and use Ctrl+C');
          } finally {
            document.body.removeChild(textarea);
          }
        });
      }
    });
  </script>
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
    if (!tab.url || !tab.url.match(/amazon\.(com|co\.uk|ca|de|fr|es|it|co\.jp)/)) {
      throw new Error('Please navigate to an Amazon product or reviews page');
    }

    // Try to send message to content script
    let response;
    try {
      response = await chrome.tabs.sendMessage(tab.id, { action: 'scrapeReviews' });
    } catch (error) {
      // Content script not loaded - try to inject it
      if (error.message.includes('Receiving end does not exist')) {
        showStatus('Injecting content script...', 'info');
        
        try {
          // Inject the content script
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          });
          
          // Wait a moment for script to initialize
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Try sending message again
          response = await chrome.tabs.sendMessage(tab.id, { action: 'scrapeReviews' });
        } catch (injectError) {
          throw new Error('Failed to load content script. Please refresh the Amazon page and try again.');
        }
      } else {
        throw error;
      }
    }

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error('No data received from content script');
    }

    // Generate formatted text data and store in chrome.storage (overwrite old data)
    const formattedTextData = generateFormattedTextData(response.data);
    await chrome.storage.local.set({ 
      amazonReviewData: formattedTextData,
      lastScrapedAsin: response.data.asin,
      lastScrapedDate: new Date().toISOString()
    });
    console.log('Formatted data stored in chrome.storage');

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
