// ==========================================================
// FandomVerse - app.js
// Clean, Beginner-Friendly JavaScript
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

// Starts the real-time digital clock and updates every second
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
    var clockElement = document.getElementById("liveClock");
    if (clockElement) {
      clockElement.textContent = timeString;
    }
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

  var counterElement = document.getElementById("visitorCounter");
  if (counterElement) {
    counterElement.textContent = count.toLocaleString();
  }
}

// ==========================================================
// 2. NAVBAR & ACTIVE LINK HIGHLIGHTING
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

// ==========================================================
// 3. BOOKMARK SYSTEM (localStorage)
// ==========================================================

// Get all bookmarks from localStorage as an array
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
    return item.id === id && item.type === type;
  });
}

// Toggle bookmark: adds if not present, removes if present
function toggleBookmark(item) {
  var bookmarks = getBookmarks();
  var existingIndex = bookmarks.findIndex(function (b) {
    return b.id === item.id && b.type === item.type;
  });

  if (existingIndex !== -1) {
    bookmarks.splice(existingIndex, 1);
    localStorage.setItem("fv_bookmarks", JSON.stringify(bookmarks));
    alert("'" + item.title + "' was removed from your bookmarks.");
  } else {
    bookmarks.push(item);
    localStorage.setItem("fv_bookmarks", JSON.stringify(bookmarks));
    alert("'" + item.title + "' was added to your bookmarks!");
  }

  // Update modal bookmark button text if modal is open
  updateModalBookmarkButton(item);

  // If on bookmarks.html, refresh the display
  if (document.getElementById("bookmarks-grid")) {
    displayBookmarks();
  }
}

// Updates the bookmark button label inside the modal
function updateModalBookmarkButton(item) {
  var btn = document.getElementById("modalBookmarkBtn");
  if (btn) {
    if (isBookmarked(item.id, item.type)) {
      btn.innerHTML = "★ Bookmarked (Remove)";
      btn.className = "btn btn-gold";
    } else {
      btn.innerHTML = "☆ Add Bookmark";
      btn.className = "btn btn-outline-fv";
    }
  }
}

// ==========================================================
// 4. SHARED DETAILS MODAL POPUP
// ==========================================================

// Opens the details modal with full item information
function openDetailsModal(item) {
  if (!item) return;

  var titleEl = document.getElementById("modalTitle");
  var imgEl = document.getElementById("modalImage");
  var catEl = document.getElementById("modalCategory");
  var typeEl = document.getElementById("modalType");
  var descEl = document.getElementById("modalDescription");
  var tagsEl = document.getElementById("modalTags");
  var metaEl = document.getElementById("modalMeta");
  var bookmarkBtn = document.getElementById("modalBookmarkBtn");

  if (titleEl) titleEl.textContent = item.title || item.name;
  if (imgEl) {
    imgEl.src = item.image || item.thumbnail || "assets/images/banner.jpg";
    imgEl.alt = item.title || item.name;
  }
  if (catEl) catEl.textContent = item.category || "Fandom";
  if (typeEl) typeEl.textContent = item.type || item.role || item.releaseStatus || "Featured";

  if (descEl) {
    descEl.textContent = item.fullBio || item.fullDetails || item.description || "";
  }

  if (tagsEl) {
    var tags = item.tags || item.abilities || [];
    var tagsHtml = "";
    tags.forEach(function (tag) {
      tagsHtml += '<li class="tag">' + tag + '</li>';
    });
    tagsEl.innerHTML = tagsHtml;
  }

  if (metaEl) {
    var metaText = "";
    if (item.date) metaText += "Date: " + item.date + " | ";
    if (item.popularity) metaText += "Popularity: " + item.popularity + " | ";
    if (item.location) metaText += "Location: " + item.location + " | ";
    if (item.price) metaText += "Price: $" + item.price.toFixed(2) + " | ";
    if (metaText.endsWith(" | ")) {
      metaText = metaText.substring(0, metaText.length - 3);
    }
    metaEl.textContent = metaText;
  }

  if (bookmarkBtn) {
    var normalizedItem = {
      id: item.id,
      title: item.title || item.name,
      category: item.category,
      type: item.type || item.role || "item",
      image: item.image || item.thumbnail || "assets/images/banner.jpg",
      description: item.description || ""
    };

    updateModalBookmarkButton(normalizedItem);

    // Remove any previous listener by cloning
    var newBtn = bookmarkBtn.cloneNode(true);
    bookmarkBtn.parentNode.replaceChild(newBtn, bookmarkBtn);
    newBtn.addEventListener("click", function () {
      toggleBookmark(normalizedItem);
    });
  }

  var modalElement = document.getElementById("detailsModal");
  if (modalElement && typeof bootstrap !== "undefined") {
    var modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.show();
  }
}

// ==========================================================
// 5. CHATBOT / FAQ SYSTEM
// ==========================================================

function initChatbot() {
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
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      chatWindow.classList.remove("open");
    });
  }

  function appendMessage(sender, text) {
    var msgBox = document.getElementById("chatbotMessages");
    if (!msgBox) return;

    var bubble = document.createElement("div");
    bubble.className = "chat-bubble " + sender;
    bubble.textContent = text;
    msgBox.appendChild(bubble);
    msgBox.scrollTop = msgBox.scrollHeight;
  }

  function handleQuestion(userText) {
    if (!userText || userText.trim() === "") return;

    appendMessage("user", userText);

    var cleanQuery = userText.toLowerCase().trim();
    var match = null;

    if (chatbotData && chatbotData.length > 0) {
      match = chatbotData.find(function (entry) {
        return entry.keywords.some(function (k) {
          return cleanQuery.includes(k.toLowerCase());
        });
      });
    }

    setTimeout(function () {
      if (match) {
        appendMessage("bot", match.answer);
      } else {
        appendMessage(
          "bot",
          "I'm your FandomVerse assistant! Try asking about categories, bookmarks, merchandise, events, or how to search."
        );
      }
    }, 400);
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

  var badge = document.getElementById("cartCountBadge");
  if (badge) {
    badge.textContent = totalItems;
  }
}

function addToCart(product) {
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
  alert("Added '" + product.title + "' to your cart!");
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
  initChatbot();
  updateCartBadge();
});
