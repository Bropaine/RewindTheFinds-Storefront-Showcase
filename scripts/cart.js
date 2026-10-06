// scripts/cart.js

// --- Cart API ---
const CART_KEY = 'rewind_showcase_cart_v1';

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  try { const parsed = cart ? JSON.parse(cart) : []; return Array.isArray(parsed) ? parsed : []; } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add an item (productId as string, quantity as int)
function addToCart(productId, quantity = 1) {
  let cart = getCart();
  const product = window.products.find(p => p.id === productId);
  if (!product || product.status === "sold") return; // Product not found, do nothing

  const maxAvailable = (product.status === "coming-soon" ? 99 : product.quantity || 1); // Fallback to 1 if not set
  const item = cart.find(i => i.productId === productId);

  if (item) {
    item.quantity = Math.min(item.quantity + quantity, maxAvailable);
  } else {
    cart.push({ productId, quantity: Math.min(quantity, maxAvailable) });
  }
  saveCart(cart);
}


// Remove an item
function removeFromCart(productId) {
  let cart = getCart().filter(i => i.productId !== productId);
  saveCart(cart);
}

// Set exact quantity
function setCartQuantity(productId, quantity) {
  let cart = getCart();
  const product = window.products.find(p => p.id === productId);
  if (!product || product.status === "sold") return; // Product not found, do nothing

  const maxAvailable = (product.status === "coming-soon" ? 99 : product.quantity || 1);
  const item = cart.find(i => i.productId === productId);

  if (item) {
    item.quantity = Math.max(1, Math.min(quantity, maxAvailable)); // No less than 1
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.productId !== productId);
    }
    saveCart(cart);
  }
}


// Clear all items
function clearCart() {
  saveCart([]);
}

// Get total items (sum of quantities)
function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}


// Export for use elsewhere (optional if using <script> directly)
window.cartAPI = {
  getCart,
  addToCart,
  removeFromCart,
  setCartQuantity,
  clearCart,
  getCartCount
};

function updateCartCountDisplay() {
  // Handles multiple navs on same page (if any)
  document.querySelectorAll('#cart-count').forEach(el => {
    el.textContent = window.cartAPI.getCartCount();
  });
}

function removeOutOfStockFromCart(showAlert = true) {
  const cart = getCart();
  const updatedProducts = window.products || [];
  let prunedCart = [];
  let removedItems = [];

  for (const cartItem of cart) {
    const product = updatedProducts.find(p => p.id == cartItem.productId);
    if (product && (product.status === "coming-soon" || (typeof product.quantity === "number" && product.quantity > 0))) {
      prunedCart.push(cartItem);
    } else if (product && typeof product.quantity === "number" && product.quantity <= 0) {
      removedItems.push(product.name || product.id);
    } else if (product && typeof product.quantity !== "number") {
      prunedCart.push(cartItem);
    } else {
      prunedCart.push(cartItem); // Or skip to prune orphans
    }
  }

  saveCart(prunedCart);
  if (window.cartAPI.updateCartCountDisplay) window.cartAPI.updateCartCountDisplay();
  // Optionally rerender cart UI here
  if (typeof renderCart === "function") renderCart();
  if (showAlert && removedItems.length) alert("Unavailable items removed: " + removedItems.join(", "));
}


window.cartAPI.removeOutOfStockFromCart = removeOutOfStockFromCart;


// Make available globally
window.cartAPI.updateCartCountDisplay = updateCartCountDisplay;

window.addEventListener('storage', function(event) {
  if (event.key === CART_KEY) {
    if (window.cartAPI && window.cartAPI.updateCartCountDisplay) {
      window.cartAPI.updateCartCountDisplay();
    }
    // Optionally rerender the cart
    // if (typeof renderCart === "function") renderCart();
  }
});



