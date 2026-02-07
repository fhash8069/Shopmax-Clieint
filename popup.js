// Existing DOM elements
const scrapeBtn = document.getElementById('scrapeBtn');
const statusDiv = document.getElementById('status');

// --- Category & Bubbles Functionality ---
const addCategoryBtn = document.getElementById('addCategoryBtn');
const categoryInput = document.getElementById('categoryInput');
const categoriesContainer = document.getElementById('categoriesContainer');

addCategoryBtn.addEventListener('click', () => {
  const categoryName = categoryInput.value.trim();
  if (!categoryName) return;

  // Create category card
  const card = document.createElement('div');
  card.className = 'category-card';

  const header = document.createElement('div');
  header.className = 'category-header';
  header.textContent = categoryName;
  card.appendChild(header);

  // Bubble input
  const bubbleInputDiv = document.createElement('div');
  bubbleInputDiv.className = 'bubble-input';

  const bubbleInput = document.createElement('input');
  bubbleInput.type = 'text';
  bubbleInput.placeholder = 'Add word/phrase';

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

    // Delete button
    const del = document.createElement('span');
    del.className = 'delete-bubble';
    del.textContent = '×';
    del.addEventListener('click', () => bubble.remove());
    bubble.appendChild(del);

    bubble.addEventListener('mouseenter', () => del.style.display = 'block');
    bubble.addEventListener('mouseleave', () => del.style.display = 'none');

    bubblesContainer.appendChild(bubble);
    bubbleInput.value = '';
    bubbleInput.focus();
  });

  // Insert new category at top
  categoriesContainer.prepend(card);

  // Clear input
  categoryInput.value = '';
  categoryInput.focus();
});

// --- Existing scraping logic ---
// ... keep all your scrapeReviews, showStatus, generateFormattedTextData, generateResultsHTML, etc.
// (Paste the rest of your original popup.js content here as-is)
