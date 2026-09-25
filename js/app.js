// ==========================================================
// FandomVerse - app.js
// Clean, Beginner-Friendly Vanilla JavaScript
// Easy to explain during viva / presentations!
// ==========================================================

// Global storage for content loaded from JSON files
var allContent = [];
var allCharacters = [];
var allEvents = [];
var allTrailers = [];
var allMerchandise = [];
var chatbotData = [];

// ==========================================================
// 1. CLOCK & VISITOR COUNTER
// ==========================================================

// Starts the real-time digital clock and updates every second (12-hour format with AM/PM)
function initClock() {
  function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    var timeString = hours + ":" + minutes + ":" + seconds + " " + ampm;
    var clockElements = document.querySelectorAll("#liveClock, .live-clock");
    clockElements.forEach(function (el) {
      el.textContent = timeString;
    });
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// Local visitor counter using browser localStorage
function initVisitorCounter() {
  var count = localStorage.getItem("fv_visitor_count");
  if (!count) {
    count = 1042; // starting initial student visitor base
  } else {
    count = parseInt(count, 10) + 1;
  }
  localStorage.setItem("fv_visitor_count", count);

  var counterElements = document.querySelectorAll("#visitorCounter, .visitor-counter");
  counterElements.forEach(function (el) {
    el.textContent = count.toLocaleString();
  });
}

// ==========================================================
// 2. NAVBAR, ACTIVE LINK & NAVBAR GLOBAL SEARCH
// ==========================================================

function highlightCurrentPage() {
  var path = window.location.pathname;
  var page = path.split("/").pop();
  if (!page || page === "") {
    page = "index.html";
  }

  var navLinks = document.querySelectorAll(".fv-navbar .nav-link, .dropdown-item");
  navLinks.forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === page || (page === "index.html" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

// Initialize navbar quick search if present
function initNavbarSearch() {
  var navbarSearchForm = document.getElementById("navbarSearchForm");
  var navbarSearchInput = document.getElementById("navbarSearchInput");

  if (navbarSearchForm && navbarSearchInput) {
    navbarSearchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = navbarSearchInput.value.trim();
      if (q) {
        window.location.href = "search.html?q=" + encodeURIComponent(q);
      } else {
        window.location.href = "search.html";
      }
    });
  }
}

// ==========================================================
// 3. BOOKMARKS (localStorage) & PERSONAL NOTES (sessionStorage)
// ==========================================================

// Get all bookmarks from localStorage
function getBookmarks() {
  var saved = localStorage.getItem("fv_bookmarks");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  }
  return [];
}

// Check if an item is already bookmarked
function isBookmarked(id, type) {
  var bookmarks = getBookmarks();
  return bookmarks.some(function (item) {
    return item.id === id && (item.type === type || !type);
  });
}

// Toggle bookmark: adds if not present, removes if present
function toggleBookmark(item) {
  var bookmarks = getBookmarks();
  var existingIndex = bookmarks.findIndex(function (b) {
    return b.id === item.id && (b.type === item.type || !item.type);
  });

  var title = item.title || item.name || "Item";

  if (existingIndex !== -1) {
    bookmarks.splice(existingIndex, 1);
    localStorage.setItem("fv_bookmarks", JSON.stringify(bookmarks));
    alert("'" + title + "' was removed from your bookmarks.");
  } else {
    bookmarks.push(item);
    localStorage.setItem("fv_bookmarks", JSON.stringify(bookmarks));
    alert("'" + title + "' was added to your bookmarks!");
  }

  // Update modal bookmark button text if modal is open
  updateModalBookmarkButton(item);

  // If on bookmarks.html, refresh the display
  if (typeof displayBookmarks === "function") {
    displayBookmarks();
  }
}

// Updates the bookmark button label inside the modal
function updateModalBookmarkButton(item) {
  var btn = document.getElementById("modalBookmarkBtn");
  if (btn) {
    if (isBookmarked(item.id, item.type)) {
      btn.innerHTML = "★ Bookmarked (Remove)";
      btn.className = "btn btn-gold btn-sm";
    } else {
      btn.innerHTML = "☆ Add Bookmark";
      btn.className = "btn btn-outline-fv btn-sm";
    }
  }
}

// Personal Notes: stored in sessionStorage per item (active browser session only as per SRS)
function getPersonalNote(id, type) {
  var key = "fv_note_" + id + "_" + (type || "item");
  return sessionStorage.getItem(key) || "";
}

function savePersonalNote(id, type, noteText) {
  var key = "fv_note_" + id + "_" + (type || "item");
  sessionStorage.setItem(key, noteText);
}

// Export bookmarks as a formatted downloadable text file
function exportBookmarks() {
  var bookmarks = getBookmarks();
  if (bookmarks.length === 0) {
    alert("You have no saved bookmarks to export. Add some bookmarks first!");
    return;
  }

  var text = "==================================================\n";
  text += "        FANDOMVERSE - SAVED BOOKMARKS LIST        \n";
  text += "==================================================\n\n";
  text += "Exported on: " + new Date().toLocaleString() + "\n";
  text += "Total Bookmarked Items: " + bookmarks.length + "\n\n";

  bookmarks.forEach(function (item, idx) {
    text += "--------------------------------------------------\n";
    text += (idx + 1) + ". " + (item.title || item.name) + "\n";
    text += "   Category: " + (item.category || "General") + "\n";
    text += "   Type: " + (item.type || "Fandom Entry") + "\n";
    if (item.description) {
      text += "   Description: " + item.description + "\n";
    }
    var note = getPersonalNote(item.id, item.type);
    if (note) {
      text += "   Personal Note: " + note + "\n";
    }
    text += "\n";
  });

  text += "==================================================\n";
  text += "Visit FandomVerse to explore more fandom universes!\n";

  // Create downloadable text blob
  var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "fandomverse_bookmarks_" + Date.now() + ".txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==========================================================
// 4. DETAIL PAGE NAVIGATION (replaces modal popup)
// ==========================================================

// Routes to the standalone detail.html page instead of a modal popup
function openDetailsModal(item) {
  if (!item) return;
  var type = item.type || item.role || item.releaseStatus || "featured";
  var url = "detail.html?id=" + item.id + "&type=" + encodeURIComponent(type);
  window.location.href = url;
}


// ==========================================================
// 5. CHATBOT / VIRTUAL ASSISTANT SYSTEM
// ==========================================================

function initChatbot() {
  // Load pre-scripted rule-based dataset from data/chatbot.json
  fetch("data/chatbot.json")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      chatbotData = data;
    })
    .catch(function (err) {
      console.log("Chatbot data could not be loaded:", err);
    });

  var toggleBtn = document.getElementById("chatbotToggle");
  var chatWindow = document.getElementById("chatbotWindow");
  var closeBtn = document.getElementById("chatbotClose");
  var sendBtn = document.getElementById("chatbotSend");
  var inputEl = document.getElementById("chatbotInput");
  var chipsArea = document.getElementById("chatChips");

  if (!toggleBtn || !chatWindow) return;

  toggleBtn.addEventListener("click", function () {
    chatWindow.classList.toggle("open");
    if (chatWindow.classList.contains("open") && inputEl) {
      inputEl.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      chatWindow.classList.remove("open");
    });
  }

  // Appends a user or bot message bubble to the chat conversation
  function appendMessage(sender, text, linkText, linkUrl) {
    var msgBox = document.getElementById("chatbotMessages");
    if (!msgBox) return;

    var bubble = document.createElement("div");
    bubble.className = "chat-bubble " + sender;

    var textNode = document.createElement("div");
    textNode.textContent = text;
    bubble.appendChild(textNode);

    if (linkText && linkUrl) {
      var linkEl = document.createElement("a");
      linkEl.className = "chat-link-btn";
      linkEl.href = linkUrl;
      linkEl.textContent = linkText;
      bubble.appendChild(linkEl);
    }

    msgBox.appendChild(bubble);
    msgBox.scrollTop = msgBox.scrollHeight;
  }

  // Processes user question, applies keyword/synonym rules, and responds
  function handleQuestion(userText) {
    if (!userText || userText.trim() === "") return;

    appendMessage("user", userText);

    // Normalize input: lowercase, trim, remove excessive punctuation
    var cleanQuery = userText.toLowerCase().replace(/[?!.,'"]/g, " ").trim();
    var match = null;

    if (chatbotData && chatbotData.length > 0) {
      // Find matching rule from chatbot.json
      match = chatbotData.find(function (entry) {
        return entry.keywords.some(function (k) {
          var cleanK = k.toLowerCase().replace(/[?!.,'"]/g, " ").trim();
          return cleanQuery.includes(cleanK);
        });
      });
    }

    // Delayed bot response for realistic feel
    setTimeout(function () {
      if (match) {
        appendMessage("bot", match.answer, match.linkText, match.linkUrl);
      } else {
        // Helpful fallback response with guidance
        var fallbackText = "I'm not sure about that yet! Try asking me about Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga, Articles, Characters, Events, Trailers, Merchandise, or Upcoming Releases.";
        appendMessage("bot", fallbackText, "Explore All Categories →", "categories.html");
      }
    }, 350);
  }

  if (sendBtn && inputEl) {
    sendBtn.addEventListener("click", function () {
      var val = inputEl.value;
      inputEl.value = "";
      handleQuestion(val);
    });

    inputEl.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        var val = inputEl.value;
        inputEl.value = "";
        handleQuestion(val);
      }
    });
  }

  if (chipsArea) {
    chipsArea.addEventListener("click", function (e) {
      if (e.target.classList.contains("chat-chip")) {
        var question = e.target.textContent;
        handleQuestion(question);
      }
    });
  }
}

// ==========================================================
// 6. MERCHANDISE TEMPORARY CART (localStorage)
// ==========================================================

function getCart() {
  var cart = localStorage.getItem("fv_cart");
  if (cart) {
    try {
      return JSON.parse(cart);
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveCart(cart) {
  localStorage.setItem("fv_cart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  var cart = getCart();
  var totalItems = cart.reduce(function (sum, item) {
    return sum + item.quantity;
  }, 0);

  var badges = document.querySelectorAll("#cartCountBadge, .cart-badge");
  badges.forEach(function (b) {
    b.textContent = totalItems;
  });
}

function addToCart(product) {
  if (!product) return;

  var cart = getCart();
  var existing = cart.find(function (item) {
    return item.id === product.id;
  });

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart(cart);
  alert("Added '" + product.title + "' to your shopping cart!");
  renderCartModal();
}

function updateCartQuantity(id, delta) {
  var cart = getCart();
  var item = cart.find(function (i) {
    return i.id === id;
  });

  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(function (i) {
        return i.id !== id;
      });
    }
  }

  saveCart(cart);
  renderCartModal();
}

function clearCart() {
  if (confirm("Are you sure you want to clear your cart?")) {
    saveCart([]);
    renderCartModal();
  }
}

function renderCartModal() {
  var container = document.getElementById("cartItemsContainer");
  var totalEl = document.getElementById("cartGrandTotal");
  if (!container || !totalEl) return;

  var cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = '<p class="text-muted text-center py-4">Your shopping cart is currently empty.</p>';
    totalEl.textContent = "$0.00";
    return;
  }

  var grandTotal = 0;
  var html = '<div class="table-responsive"><table class="table table-dark align-middle"><thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th>Action</th></tr></thead><tbody>';

  cart.forEach(function (item) {
    var subtotal = item.price * item.quantity;
    grandTotal += subtotal;
    html += '<tr>' +
      '<td><div class="d-flex align-items-center gap-2"><img src="' + item.image + '" style="width: 45px; height: 45px; object-fit: cover; border-radius: 4px;" alt="' + item.title + '"><span>' + item.title + '</span></div></td>' +
      '<td>$' + item.price.toFixed(2) + '</td>' +
      '<td><div class="btn-group btn-group-sm"><button class="btn btn-outline-secondary btn-sm" onclick="updateCartQuantity(' + item.id + ', -1)">-</button><span class="btn btn-dark btn-sm disabled">' + item.quantity + '</span><button class="btn btn-outline-secondary btn-sm" onclick="updateCartQuantity(' + item.id + ', 1)">+</button></div></td>' +
      '<td>$' + subtotal.toFixed(2) + '</td>' +
      '<td><button class="btn btn-sm btn-outline-danger" onclick="updateCartQuantity(' + item.id + ', -9999)">✕</button></td>' +
      '</tr>';
  });

  html += '</tbody></table></div>';
  container.innerHTML = html;
  totalEl.textContent = "$" + grandTotal.toFixed(2);
}

// ==========================================================
// 7. INITIALIZE ON DOM READY
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
  initClock();
  initVisitorCounter();
  highlightCurrentPage();
  initNavbarSearch();
  initChatbot();
  updateCartBadge();
});
