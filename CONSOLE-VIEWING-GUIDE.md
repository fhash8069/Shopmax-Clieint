# How to View Console Logs

## For the Results Page (Blob URL)

When you click "Scrape Reviews" and the results page opens, follow these steps to see the console:

### Method 1: Right-click Menu (Easiest)
1. **Right-click anywhere** on the results page
2. Select **"Inspect"** or **"Inspect Element"**
3. The DevTools panel will open at the bottom or side
4. Click the **"Console"** tab at the top of DevTools
5. You should see debug logs like:
   ```
   === SCRIPT LOADED ===
   Formatted data length: 1234
   ✓ Formatted data stored successfully in localStorage
   ✓ Event listener attached to copy button
   ```

### Method 2: Keyboard Shortcut (Fastest)
1. On the results page, press:
   - **Windows/Linux**: `F12` or `Ctrl + Shift + I`
   - **Mac**: `Cmd + Option + I`
2. Click the **"Console"** tab

### Method 3: Chrome Menu
1. On the results page, click the **three dots** menu (⋮) in the top-right of Chrome
2. Go to **More Tools** → **Developer Tools**
3. Click the **"Console"** tab

## What to Look For

When you click the "Copy Formatted JSON" button, you should see:

```
=== COPY BUTTON CLICKED ===
Data to copy length: 1234
Data to copy (first 300 chars): === Section 1 - Product Information ===...
Full data to copy: [entire formatted text]
Clipboard API available: true
Attempting to copy with Clipboard API...
✓ Successfully copied to clipboard!
```

## If the Console Shows Errors

### Error: "Copy button not found in DOM!"
- The button HTML wasn't rendered properly
- Try refreshing the extension and scraping again

### Error: "Clipboard API failed"
- The browser blocked clipboard access
- The fallback method should activate automatically
- Look for: "Trying fallback method..."

### Error: "No data available to copy"
- The data wasn't stored properly
- Check if you see: "✓ Formatted data stored successfully"
- If not, there's an issue with data generation

## For the Extension Popup Console

If you want to see logs from the popup itself (not the results page):

1. **Right-click the extension icon** in Chrome toolbar
2. Select **"Inspect popup"**
3. A new DevTools window opens showing popup console logs
4. Keep this window open, then click your extension icon
5. You'll see logs like:
   ```
   Scraping reviews...
   Formatted data stored in chrome.storage
   ✓ Successfully scraped 10 reviews!
   ```

## Quick Troubleshooting

### Console is blank
- Click the "Clear console" button (🚫) to make sure it's not hidden
- Check the filter dropdown says "All levels" not "Errors only"
- Try clicking the copy button again

### Can't find Console tab
- Look for tabs: Elements, Console, Sources, Network, etc.
- Console is usually the 2nd tab
- If you only see "Elements", click the `>>` arrows to show more tabs

## Useful Console Commands

While in the console, you can type these to check data manually:

```javascript
// Check what's stored
localStorage.getItem('amazonReviewData')

// Check button element
document.getElementById('copyJsonBtn')

// Check clipboard permissions
navigator.permissions.query({name: 'clipboard-write'})

// Manually copy data
navigator.clipboard.writeText(localStorage.getItem('amazonReviewData'))
```

## Screenshot Reference

```
┌─────────────────────────────────────────────────────┐
│ [Your Results Page with formatted JSON sections]   │
│                                                     │
│ === Section 1 - Product Information ===            │
│ Product Name: Example Product                      │
│                                                     │
└─────────────────────────────────────────────────────┘
                        ↓ Right-click here
┌─────────────────────────────────────────────────────┐
│ Elements │ Console │ Sources │ Network │ ...        │ ← Click Console
├─────────────────────────────────────────────────────┤
│ 🔍 Filter                                  ⚙️ ⋮     │
├─────────────────────────────────────────────────────┤
│ === SCRIPT LOADED ===                               │
│ Formatted data length: 1234                         │
│ ✓ Formatted data stored successfully                │
│ === COPY BUTTON CLICKED ===                         │
│ ✓ Successfully copied to clipboard!                 │
└─────────────────────────────────────────────────────┘
```

---

**Quick Test**: After opening the console, click the copy button and you should immediately see debug messages appear!
