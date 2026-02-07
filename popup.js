// Existing DOM elements
const scrapeBtn = document.getElementById('scrapeBtn');
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

// --- Existing scraping logic ---
// ... keep all your scrapeReviews, showStatus, generateFormattedTextData, generateResultsHTML, etc.
// (Paste the rest of your original popup.js content here as-is)
