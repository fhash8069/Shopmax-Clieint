# Extension Icons

The `manifest.json` references three icon sizes that need to be created:
- `icon16.png` - 16x16 pixels (toolbar icon, small)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store, installation)

## Option 1: Quick Start (Remove Icon References)

If you want to test the extension immediately without creating icons, edit `manifest.json` and remove or comment out these sections:

```json
"action": {
  "default_popup": "popup.html"
  // Remove the default_icon section
},

// Remove or comment out the icons section at the bottom
```

## Option 2: Create Simple Icons

You can create simple placeholder icons using any image editor:

1. **Use an online tool:**
   - Go to https://www.favicon-generator.org/
   - Upload any image or create a simple colored square
   - Download the generated icon pack
   - Rename and use the appropriate sizes

2. **Use GIMP/Photoshop/Paint:**
   - Create a new image with the required size
   - Add a simple design (letter "A", shopping cart, or star)
   - Use Amazon's colors: #FF9900 (orange) or #232F3E (dark blue)
   - Save as PNG

3. **Use Canva or Figma:**
   - Create a design in the required sizes
   - Export as PNG files

## Option 3: Use Unicode/Emoji Icons

Create a simple HTML file that renders an emoji as an image, then screenshot it:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 128px;
      height: 128px;
      background: #ff9900;
      font-size: 80px;
    }
  </style>
</head>
<body>⭐</body>
</html>
```

Open in browser, take a screenshot, resize to 16x16, 48x48, and 128x128.

## Recommended Design

For an Amazon review scraper, consider:
- ⭐ Star icon (represents ratings)
- 📝 Document/clipboard icon (represents reviews)
- 🛒 Shopping cart icon (represents Amazon)
- 🔍 Magnifying glass (represents scraping/searching)

Use Amazon's brand colors for consistency:
- Primary: #FF9900 (orange)
- Secondary: #232F3E (dark blue)
- Background: White or transparent
