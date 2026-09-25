# FandomVerse - Web Development Project

A modern, clean, and professional multi-page fandom hub celebrating seven core entertainment universes: **Anime, Gaming, Movies, TV Shows, K-Pop, Comics, and Manga**.

---

## 🌟 Tech Stack & Architecture
- **HTML5**: Semantic, accessible markup structured across 16 dedicated pages.
- **CSS3 & Bootstrap 5.3.3**: Modern Dark Navy aesthetic (`#0a0f1d`), custom cards, clean borders, responsive grid, and gentle CSS keyframe animations.
- **Vanilla JavaScript (ES6)**: Beginner-friendly, easy to explain during viva presentations (`document.getElementById()`, `addEventListener()`, `forEach()`, `innerHTML`, `localStorage`, and `fetch()`).
- **JSON Data**: Structured, dynamic content storage in `data/*.json`.

---

## 📁 Project Structure

```
fandom-verse/
├── index.html            # Main home page with hero banner & highlights
├── categories.html       # Overview of all 7 universes
├── category.html         # Universe-specific hub (characters, media, events)
├── gallery.html          # HD visual gallery with lightbox modal
├── characters.html       # 35 original fictional characters (5 per universe)
├── articles.html         # In-depth essays and set retrospectives
├── events.html           # 21 fan conventions and gatherings (3 per universe)
├── trailers.html         # Video trailers with playable modal & status filter
├── videos.html           # Video guides & HTML5 audio soundtrack player
├── merchandise.html      # Fan gear with temporary localStorage cart modal
├── search.html           # Global search with category/type filters & sorting
├── bookmarks.html        # Saved items manager powered by localStorage
├── about.html            # Platform mission and 7 universes breakdown
├── contact.html          # Validated contact form and Google Maps embed
├── login.html            # Member login portal with client-side validation
├── signup.html           # Free fan registration with client-side validation
├── css/
│   └── style.css         # Custom dark navy theme & animations
├── js/
│   └── app.js            # Core JS (Clock, Counter, Modals, Cart, Bookmarks, Chatbot)
├── data/
│   ├── categories.json   # 7 core universes meta & counts
│   ├── characters.json   # 35 characters with backstories & abilities
│   ├── content.json      # 28 articles, trailers, and media entries
│   ├── events.json       # 21 conventions & concerts
│   ├── trailers.json     # 11 video trailers with status tags
│   ├── merchandise.json  # 8 collectible products
│   └── chatbot.json      # FAQ questions and instant answers
└── assets/
    └── images/           # High-resolution original character & category artwork
```

---

## ✨ Key Features
1. **Unified Responsive Navbar**: Consistent across all 16 pages with working dropdowns, mobile hamburger collapse, and active page highlighting.
2. **Dynamic Details Modal**: Clicking cards across the site opens an interactive Bootstrap modal with large image, description, lore, badges, and bookmarking.
3. **Global Search**: Search by title, description, category, and tags with A-Z, Newest, and Popularity sorting.
4. **Temporary Shopping Cart**: Fully functional in-browser cart using `localStorage` on the Merchandise page with quantity controls and total calculation.
5. **Bookmark System**: Save characters, articles, trailers, and events to `localStorage` and manage them on `bookmarks.html`.
6. **FAQ Chatbot**: Floating assistant widget answering common user inquiries using `data/chatbot.json`.
7. **Real-time Digital Clock & Visitor Counter**: Live updating clock (AM/PM) and persistent local visitor counter in the footer.

---

## 🚀 How to Run
1. Open the project directory in **VS Code**.
2. Right-click [index.html](file:///c:/Users/hamdan/Videos/fandom-verse/index.html) and select **"Open with Live Server"** (or run `npx serve .` / any local HTTP server).
3. Browse and enjoy!
