// Existing DOM elements
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

// reviewMaxx button has been removed from HTML

// Show status message
function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = type;
}

// Display AI results in the popup
function displayResultsInPopup(aiResponse) {
  const resultsSection = document.getElementById('resultsSection');
  const aiResponseContent = document.getElementById('aiResponseContent');
  
  try {
    // Try to parse as JSON
    const data = JSON.parse(aiResponse);
    
    // Check if we have recommendations
    if (data.recommendationsByCategory && Array.isArray(data.recommendationsByCategory)) {
      // Create formatted HTML
      let html = '';
      
      data.recommendationsByCategory.forEach((rec, index) => {
        html += `
          <div class="product-recommendation">
            <div class="product-category">${escapeHtml(rec.category)}</div>
            <div class="product-name">${escapeHtml(rec.bestProductName)}</div>
            <div class="product-reasoning">${escapeHtml(rec.reasoning)}</div>
          </div>
        `;
      });
      
      aiResponseContent.innerHTML = html;
    } else {
      // Fallback to plain text if structure is different
      aiResponseContent.textContent = aiResponse;
    }
  } catch (e) {
    // If not JSON, display as plain text
    aiResponseContent.textContent = aiResponse;
  }
  
  // Show the results section
  resultsSection.style.display = 'block';
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Hide results section
function hideResultsSection() {
  const resultsSection = document.getElementById('resultsSection');
  resultsSection.style.display = 'none';
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
    showStatus('Comparing Products...', 'info');

    try {
      const backendResponse = await fetch('http://shopmaxx-server.aedify.ai/cartMaxx', 
        {
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

      // Display results in the popup
      displayResultsInPopup(aiResponse);

      showStatus(`✓ AI analysis complete for ${response.data.length} items!`, 'success');

    } catch (backendError) {
      console.error('Backend error:', backendError);
      showStatus(`Backend error: ${backendError.message}`, 'error');
      
      // Fallback: show error message in results
      displayResultsInPopup(`Error: ${backendError.message}\n\nPlease make sure the backend server is running on http://localhost:4000`);
    }

  } catch (error) {
    console.error('Cart scraping error:', error);
    showStatus(`Error: ${error.message}`, 'error');
  } finally {
    cartBtn.disabled = false;
  }
}

// Add click event listeners
cartBtn.addEventListener('click', scrapeCart);

// Close results button
const closeResultsBtn = document.getElementById('closeResultsBtn');
closeResultsBtn.addEventListener('click', hideResultsSection);
