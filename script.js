const products = [
  { id: 1, name: "UrbanStep Air 1", price: 999, category: "Running Shoes", badge: "New", color: "blue", image: "urbanstep-air-1.png", sizes: "6, 7, 8, 9, 10", colour: "White & Blue" },
  { id: 2, name: "UrbanStep FlexRun", price: 1199, category: "Running Shoes", badge: "Best Seller", color: "gray", image: "flexrun.jpg", sizes: "6, 7, 8, 9, 10", colour: "White" },
  { id: 3, name: "UrbanStep Swift", price: 1099, category: "Running Shoes", badge: "Trending", color: "gray", image: "swift.jpg", sizes: "6, 7, 8, 9, 10", colour: "Black & White" },
  { id: 4, name: "UrbanStep Classic", price: 1049, category: "Casual Shoes", badge: "New", color: "cream", image: "classic.jpg", sizes: "6, 7, 8, 9, 10", colour: "Cream & Tan" },
  { id: 5, name: "UrbanStep Volt", price: 1249, category: "Sports Shoes", badge: "Best Seller", color: "gray", image: "volt.jpg", sizes: "6, 7, 8, 9, 10", colour: "Black & White" },
  { id: 6, name: "UrbanStep Breeze", price: 1099, category: "Sports Shoes", badge: "New", color: "gray", image: "breeze.jpg", sizes: "6, 7, 8, 9, 10", colour: "White & Grey" },
  { id: 7, name: "UrbanStep Rogue", price: 1199, category: "Casual Sneakers", badge: "Trending", color: "gray", image: "rogue.jpg", sizes: "6, 7, 8, 9, 10", colour: "Black & Red" },
  { id: 8, name: "UrbanStep Motion", price: 1149, category: "Casual Sneakers", badge: "New", color: "green", image: "motion.jpg", sizes: "6, 7, 8, 9, 10", colour: "White & Green" },
  { id: 9, name: "UrbanStep Prime", price: 1299, category: "Sneakers", badge: "Best Seller", color: "blue", image: "prime.jpg", sizes: "6, 7, 8, 9, 10", colour: "Navy Blue" },
  { id: 10, name: "UrbanStep Apex", price: 1099, category: "Sneakers", badge: "New", color: "cream", image: "apex.jpg", sizes: "6, 7, 8, 9, 10", colour: "White & Black" }
];

let cart = [];

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

function money(value) {
  return "₹" + value.toLocaleString("en-IN");
}

function shoeHTML() {
  return `
    <div class="shoe-illustration">
      <div class="shoe-body"></div>
      <div class="shoe-laces"></div>
      <div class="shoe-sole"></div>
    </div>
  `;
}

function renderProducts(list = products) {
  if (!list.length) {
    productGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 10px;color:#777;">
        No products found.
      </div>
    `;
    return;
  }

  productGrid.innerHTML = list.map(product => `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-image ${product.color}">
        <img class="catalog-product-image" src="${product.image}" alt="${product.name} - ${product.colour}">
        <span class="product-badge">${product.badge}</span>
        <button class="add-btn" data-add="${product.id}" aria-label="Add ${product.name} to bag">+</button>
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-category">${product.category} · ${product.colour}</div>
        <div class="product-price">${money(product.price)}</div>
        <div class="product-meta">Sizes: ${product.sizes}</div>
      </div>
    </article>
  `).join("");
}

function filterProducts(category, clickedButton) {
  document.querySelectorAll(".filter").forEach(btn => btn.classList.remove("active"));
  clickedButton.classList.add("active");

  const filtered = category === "All"
    ? products
    : products.filter(product => product.category === category);

  renderProducts(filtered);
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  cart.push(product);
  updateCart();
  showToast(`${product.name} added to your bag`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  cartCount.textContent = cart.length;

  if (!cart.length) {
    cartItems.innerHTML = `<p class="empty-message">Your bag is empty.</p>`;
  } else {
    cartItems.innerHTML = cart.map((product, index) => `
      <div class="cart-item">
        <span>
          <strong>${product.name}</strong><br>
          ${product.category}
        </span>
        <span>
          ${money(product.price)}
          <button class="remove-item" data-remove="${index}">×</button>
        </span>
      </div>
    `).join("");
  }

  const total = cart.reduce((sum, product) => sum + product.price, 0);
  cartTotal.textContent = money(total);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

/* Panels */
const overlay = document.getElementById("overlay");
const cartPanel = document.getElementById("cartPanel");
const searchPanel = document.getElementById("searchPanel");

function closePanels() {
  cartPanel.classList.remove("open");
  searchPanel.classList.remove("open");
  overlay.classList.remove("show");
  document.body.classList.remove("no-scroll");
}

function openPanel(panel) {
  closePanels();
  panel.classList.add("open");
  overlay.classList.add("show");
  document.body.classList.add("no-scroll");
}

/* Search */
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

searchBtn.addEventListener("click", () => {
  openPanel(searchPanel);
  setTimeout(() => searchInput.focus(), 50);
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    searchResults.textContent = 'Try “sneakers”, “running” or “hiking”.';
    return;
  }

  const results = products.filter(product =>
    `${product.name} ${product.category}`.toLowerCase().includes(query)
  );

  if (!results.length) {
    searchResults.textContent = "No products found.";
    return;
  }

  searchResults.innerHTML = results.map(product => `
    <div class="search-result">
      <strong>${product.name}</strong> · ${money(product.price)}
    </div>
  `).join("");
});

/* Cart */
document.getElementById("cartBtn").addEventListener("click", () => {
  openPanel(cartPanel);
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Your bag is empty");
    return;
  }

  showToast("Demo checkout — payment gateway can be connected next.");
});

overlay.addEventListener("click", closePanels);

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", closePanels);
});

/* Product interactions */
document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest(".filter");
  if (!button) return;

  filterProducts(button.dataset.category, button);
});

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  addToCart(Number(button.dataset.add));
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;

  removeFromCart(Number(button.dataset.remove));
});

/* Mobile navigation */
const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.getElementById("navLinks");

mobileMenu.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

/* Newsletter */
document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();

  const emailInput = document.getElementById("emailInput");

  if (!emailInput.value.trim()) return;

  emailInput.value = "";
  showToast("You're on the list. Welcome to UrbanStep!");
});

/* Escape key */
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closePanels();
    navLinks.classList.remove("open");
  }
});

/* Initial render */
renderProducts();
updateCart();


/* ================= Product Detail ================= */
let selectedDetailProduct = null;
let selectedDetailSize = null;

function openProductDetail(productId) {
  const product = products.find(p => String(p.id) === String(productId));
  if (!product) return;

  selectedDetailProduct = product;
  const modal = document.getElementById("productModal");
  if (!modal) return;

  const image = document.getElementById("detailImage");
  const badge = document.getElementById("detailBadge");
  const category = document.getElementById("detailCategory");
  const name = document.getElementById("detailName");
  const price = document.getElementById("detailPrice");
  const colour = document.getElementById("detailColour");
  const sizes = document.getElementById("detailSizes");
  const description = document.getElementById("detailDescription");

  image.src = product.image;
  image.alt = `${product.name} - ${product.colour}`;
  badge.textContent = product.badge || "UrbanStep";
  category.textContent = product.category;
  name.textContent = product.name;
  price.textContent = money(product.price);
  colour.textContent = `Colour: ${product.colour}`;

  const descriptions = {
    "Running Shoes": "Lightweight everyday running shoes designed for a comfortable, energetic stride.",
    "Sports Shoes": "Comfort-first sports footwear made for active days, training and everyday movement.",
    "Casual Shoes": "Clean everyday styling with a comfortable fit for work, travel and casual outings.",
    "Casual Sneakers": "Modern street-ready sneakers combining easy styling with all-day comfort.",
    "Sneakers": "Versatile UrbanStep sneakers with a modern silhouette for everyday looks."
  };
  description.textContent = descriptions[product.category] || "Designed for everyday comfort and effortless UrbanStep style.";

  const sizeList = String(product.sizes || "6, 7, 8, 9, 10").split(",").map(s => s.trim()).filter(Boolean);
  selectedDetailSize = sizeList[0] || null;
  sizes.innerHTML = sizeList.map(size =>
    `<button type="button" class="detail-size-btn ${size === selectedDetailSize ? "selected" : ""}" data-detail-size="${size}">${size}</button>`
  ).join("");

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("product-modal-open");
}

function closeProductDetail() {
  const modal = document.getElementById("productModal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("product-modal-open");
}

document.addEventListener("click", function(e) {
  const card = e.target.closest(".product-card");
  if (card && !e.target.closest("[data-add]") && !e.target.closest("button, a")) {
    const id = card.getAttribute("data-product-id") || card.dataset.id;
    if (id) openProductDetail(id);
  }

  const sizeBtn = e.target.closest("[data-detail-size]");
  if (sizeBtn) {
    selectedDetailSize = sizeBtn.getAttribute("data-detail-size");
    document.querySelectorAll(".detail-size-btn").forEach(btn => btn.classList.remove("selected"));
    sizeBtn.classList.add("selected");
  }

  if (e.target.closest("[data-close-product]")) closeProductDetail();

  if (e.target.id === "detailAdd") {
    if (!selectedDetailProduct) return;
    const item = {...selectedDetailProduct, selectedSize: selectedDetailSize};
    if (typeof cart !== "undefined") {
      cart.push(item);
      if (typeof updateCart === "function") updateCart();
      if (typeof showToast === "function") showToast(`${selectedDetailProduct.name} added to cart`);
    }
    closeProductDetail();
  }

  if (e.target.id === "detailBuy") {
    if (!selectedDetailProduct) return;
    closeProductDetail();
    if (typeof openCheckout === "function") {
      openCheckout();
    } else if (typeof showToast === "function") {
      showToast("Demo checkout opened");
    }
  }
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeProductDetail();
});
