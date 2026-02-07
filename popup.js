// Existing DOM elements
const scrapeBtn = document.getElementById('scrapeBtn');
const cartBtn = document.getElementById('cartBtn');
const statusDiv = document.getElementById('status');

// --- Category & Bubbles Functionality ---
const addCategoryBtn = document.getElementById('addCategoryBtn');
const categoryInput = document.getElementById('categoryInput');
const categoriesContainer = document.getElementById('categoriesContainer');

// Array to store categories and their associated preferences
const categoriesData = [];

// Add Category Button Logic
addCategoryBtn.addEventListener('click', () => {
  const categoryName = categoryInput.value.trim();
  if (!categoryName) return;

  // Check if category already exists
  const existingCategory = categoriesData.find(cat => cat.categoryName === categoryName);
  if (existingCategory) {
    alert("Category already exists!");
    return;
  }

  // Add new category to the array
  const newCategory = { categoryName, preferences: [] };
  categoriesData.push(newCategory);

  // Create category card
  const card = document.createElement('div');
  card.className = 'category-card';

  // Category header with delete button
  const header = document.createElement('div');
  header.className = 'category-header';
  header.textContent = categoryName;

  // Delete button
  const deleteBtn = document.createElement('span');
  deleteBtn.textContent = '×';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.style.fontWeight = 'bold';
  deleteBtn.style.fontSize = '16px';
  deleteBtn.style.color = '#c62828';
  deleteBtn.style.marginLeft = '8px';
  deleteBtn.style.display = 'none'; // hide by default

  deleteBtn.addEventListener('click', () => {
    card.remove();
    // Remove category from the array
    const index = categoriesData.findIndex(cat => cat.categoryName === categoryName);
    if (index > -1) {
      categoriesData.splice(index, 1);
    }
  });

  header.appendChild(deleteBtn);

  // Show delete button on hover
  header.addEventListener('mouseenter', () => {
    deleteBtn.style.display = 'inline';
  });
  header.addEventListener('mouseleave', () => {
    deleteBtn.style.display = 'none';
  });

  card.appendChild(header);

  // Bubble input
  const bubbleInputDiv = document.createElement('div');
  bubbleInputDiv.className = 'bubble-input';

  const bubbleInput = document.createElement('input');
  bubbleInput.type = 'text';
  bubbleInput.placeholder = 'Add preference';

  const addBubbleBtn = document.createElement('button');
  addBubbleBtn.textContent = 'Add';

  bubbleInputDiv.appendChild(bubbleInput);
  bubbleInputDiv.appendChild(addBubbleBtn);
  card.appendChild(bubbleInputDiv);

  // Bubbles container
  const bubblesContainer = document.createElement('div');
  bubblesContainer.className = 'bubbles';
  card.appendChild(bubblesContainer);

  // Add bubble on click
  addBubbleBtn.addEventListener('click', () => {
    const text = bubbleInput.value.trim();
    if (!text) return;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;

    // Delete button for bubble
    const del = document.createElement('span');
    del.className = 'delete-bubble';
    del.textContent = '×';
    del.addEventListener('click', () => {
      bubble.remove();
      // Remove word from category preferences
      const category = categoriesData.find(cat => cat.categoryName === categoryName);
      if (category) {
        const index = category.preferences.indexOf(text);
        if (index > -1) {
          category.preferences.splice(index, 1);
        }
      }
    });
    bubble.appendChild(del);

    bubble.addEventListener('mouseenter', () => del.style.display = 'block');
    bubble.addEventListener('mouseleave', () => del.style.display = 'none');

    bubblesContainer.appendChild(bubble);

    // Add word to category preferences
    const category = categoriesData.find(cat => cat.categoryName === categoryName);
    if (category) {
      category.preferences.push(text);
    }

    bubbleInput.value = '';
    bubbleInput.focus();
  });

  // Insert new category at top
  categoriesContainer.prepend(card);

  // Clear input
  categoryInput.value = '';
  categoryInput.focus();
});

// Remove the reviewMaxx button
const reviewMaxxBtn = document.getElementById('scrapeBtn');
if (reviewMaxxBtn) {
  reviewMaxxBtn.remove();
}

// Show status message
function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = type;
}

// Generate simple HTML page for cart data (no styling)
function generateCartResultsHTML(cartDataArray) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cart Items</title>
</head>
<body>
<pre>${JSON.stringify(cartDataArray, null, 2)}</pre>
</body>
</html>`.trim();
}

// Generate HTML page for AI-processed cart results
function generateAIResultsHTML(aiResponse, productNames) {
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cart Analysis - AI Results</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 {
      color: #232f3e;
      border-bottom: 3px solid #ff9900;
      padding-bottom: 10px;
    }
    .ai-response {
      background: #f9f9f9;
      border-left: 4px solid #ff9900;
      padding: 20px;
      margin: 20px 0;
      white-space: pre-wrap;
    }
    .products {
      background: #fff;
      border: 1px solid #ddd;
      padding: 15px;
      margin-top: 20px;
    }
    .products h2 {
      font-size: 18px;
      color: #666;
      margin-bottom: 10px;
    }
    .product-list {
      list-style: none;
      padding: 0;
    }
    .product-list li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .product-list li:last-child {
      border-bottom: none;
    }
  </style>
</head>
<body>
  <h1>Cart Analysis Results</h1>
  
  <div class="ai-response">
    ${escapeHtml(aiResponse)}
  </div>

  <div class="products">
    <h2>Analyzed Products (${productNames.length})</h2>
    <ul class="product-list">
      ${productNames.map(name => `<li>${escapeHtml(name)}</li>`).join('')}
    </ul>
  </div>
</body>
</html>`.trim();
}

// Main cart scraping logic
async function scrapeCart() {
  try {
    // Disable button and show loading
    cartBtn.disabled = true;
    showStatus('Scraping cart...', 'info');

    // Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Validate Amazon URL
    if (!tab.url || !tab.url.match(/amazon\.(com|co\.uk|ca|de|fr|es|it|co\.jp)/)) {
      throw new Error('Please navigate to an Amazon cart page');
    }

    // Try to send message to content script
    let response;
    try {
      response = await chrome.tabs.sendMessage(tab.id, { action: 'scrapeCart' });
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
          response = await chrome.tabs.sendMessage(tab.id, { action: 'scrapeCart' });
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

    // Send cart data to backend
    showStatus('Sending to backend...', 'info');

    try {
      const backendResponse = await fetch('http://localhost:4000/cartMaxx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: response.data
          // preferences not included - backend will use defaults
        })
      });

      if (!backendResponse.ok) {
        throw new Error(`Backend returned ${backendResponse.status}`);
      }

      const aiResponse = await backendResponse.text();

      // Generate HTML with AI response instead of raw JSON
      const resultsHTML = generateAIResultsHTML(aiResponse, response.data);

      // Create blob URL and open in new tab
      const blob = new Blob([resultsHTML], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      await chrome.tabs.create({ url: blobUrl });

      showStatus(`✓ AI analysis complete for ${response.data.length} items!`, 'success');

    } catch (backendError) {
      console.error('Backend error:', backendError);
      showStatus(`Backend error: ${backendError.message}`, 'error');
      
      // Fallback: show raw data if backend fails
      const cartHTML = generateCartResultsHTML(response.data);
      const blob = new Blob([cartHTML], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      await chrome.tabs.create({ url: blobUrl });
    }

  } catch (error) {
    console.error('Cart scraping error:', error);
    showStatus(`Error: ${error.message}`, 'error');
  } finally {
    cartBtn.disabled = false;
  }
}

// Add click event listeners
scrapeBtn.addEventListener('click', scrapeReviews);
cartBtn.addEventListener('click', scrapeCart);
