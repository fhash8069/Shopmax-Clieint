# Amazon Review Scraper - Chrome Extension

A simple Chrome extension that scrapes Amazon product reviews and displays them in a clean, formatted page.

## Features

- 🔍 Scrapes reviews directly from Amazon product pages
- ✅ Extracts verified purchase badges
- ⭐ Displays star ratings
- 📅 Shows review dates
- 🎨 Clean, modern UI for viewing results
- 🚫 CAPTCHA detection
- 📱 Responsive design

## Installation

1. **Download or clone this repository**

2. **Open Chrome and navigate to:**
   ```
   chrome://extensions/
   ```

3. **Enable "Developer mode"** (toggle in top-right corner)

4. **Click "Load unpacked"**

5. **Select the extension folder** (the folder containing `manifest.json`)

6. **The extension icon should appear** in your Chrome toolbar

Note: You'll need to add icon images (`icon16.png`, `icon48.png`, `icon128.png`) to the extension folder, or remove the icon references from `manifest.json` to avoid warnings.

## Usage

1. **Navigate to an Amazon product page** or reviews page
   - Product page: `https://www.amazon.com/dp/{ASIN}`
   - Reviews page: `https://www.amazon.com/product-reviews/{ASIN}`

2. **Click the extension icon** in your Chrome toolbar

3. **Click "Scrape Reviews"** button

4. **View results** - A new tab will open with all scraped reviews formatted nicely

## Data Extracted

For each review, the extension extracts:

| Field | Description |
|-------|-------------|
| **Rating** | Star rating (1-5) |
| **Title** | Review headline |
| **Body** | Full review text |
| **Date** | Review publication date |
| **Verified** | Verified purchase badge status |
| **ID** | Amazon review ID |

Product metadata:
- **ASIN** - Amazon Standard Identification Number
- **Product Title** - Name of the product

## Technical Details

### Architecture

- **Manifest V3** - Latest Chrome extension standard
- **Content Script** (`content.js`) - Runs on Amazon pages, accesses DOM
- **Popup UI** (`popup.html`, `popup.js`) - Extension interface
- **No backend** - All processing happens client-side

### Stable Selectors Used

The extension uses Amazon's stable `data-hook` attributes:
- `[data-hook="review"]` - Review container
- `[data-hook="review-star-rating"]` - Star rating
- `[data-hook="review-title"]` - Review title
- `[data-hook="review-body"]` - Review text
- `[data-hook="avp-badge"]` - Verified purchase badge
- `[data-hook="review-date"]` - Review date

### Permissions

- `activeTab` - Access current tab to inject content script
- `scripting` - Execute content script programmatically
- `host_permissions` - Access Amazon.com pages

## Limitations

- ✅ Works on Amazon.com (US)
- ⚠️ Only scrapes reviews visible on current page (no pagination)
- ⚠️ Won't work if Amazon shows CAPTCHA ("Robot Check")
- ⚠️ Results page uses blob URL (temporary, closes when tab closes)

## Error Messages

| Error | Meaning |
|-------|---------|
| "Amazon CAPTCHA detected" | Amazon is blocking automated access |
| "No reviews found on page" | Page has no reviews or wrong page type |
| "Please navigate to an Amazon product or reviews page" | Extension opened on non-Amazon site |

## Files Structure

```
extendo/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic & HTML generation
├── content.js            # Amazon page scraping logic
├── results-template.html # Reference template for results page
└── README.md            # This file
```

## Future Enhancements

Possible improvements (not yet implemented):
- Multi-page scraping (pagination)
- Export to CSV/JSON
- Filter by rating
- Sort by date
- International Amazon sites support
- Save scraped data locally

## Troubleshooting

**Extension doesn't appear:**
- Make sure Developer mode is enabled
- Check that all files are in the folder
- Reload the extension from `chrome://extensions/`

**"No reviews found" error:**
- Make sure you're on a product page with visible reviews
- Try the dedicated reviews page (`/product-reviews/` URL)
- Scroll down to load reviews before clicking button

**CAPTCHA errors:**
- Amazon has detected automated access
- Close extension and browse normally for a while
- Try again later from a different IP if persistent

## License

This is a demonstration project. Use responsibly and in accordance with Amazon's Terms of Service.
