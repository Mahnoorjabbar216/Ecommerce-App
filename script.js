// Load cart from localStorage or start empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productList = document.getElementById('product-list');
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const closeCartBtn = document.getElementById('close-cart');
const cartCount = document.getElementById('cart-count');

// Show modal function
function showModal(id) {
    document.getElementById(id).style.display = "flex";
}

// Close modals
document.getElementById("close-variant-modal").addEventListener("click", () => {
    document.getElementById("variant-modal").style.display = "none";
});
document.getElementById("close-empty-cart-modal").addEventListener("click", () => {
    document.getElementById("empty-cart-modal").style.display = "none";
});
document.getElementById("close-success-modal").addEventListener("click", () => {
    document.getElementById("success-modal").style.display = "none";
});

// Load products
fetch("products.json")
  .then(response => response.json())
  .then(data => {
      data.forEach(product => {
          const card = document.createElement('div');
          card.classList.add('product-card');

          // Create variant buttons dynamically
          let variantButtons = "";
          product.variants.forEach(variant => {
              variantButtons += `<button class="variant-btn" onclick="selectVariant(this)" data-variant="${variant}">
              ${variant}</button>`;
          });

          card.innerHTML = `
              <img src="${product.image}" alt="${product.name}">
              <h3 class="product-name">${product.name}</h3>
              <p class="price">$${product.price}</p>
              <div class="variants">${variantButtons}</div>
              <button class="add-cart-btn" 
                      onclick="addToCart(${product.id}, '${product.name}', ${product.price}, this)">
                Add to Cart
              </button>
          `;
          productList.appendChild(card);
      });
      updateCartCount();
  });

// Select variant
function selectVariant(button) {
    const parent = button.parentElement;
    parent.querySelectorAll('.variant-btn').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

// Add to cart
function addToCart(id, name, price, btn) {
    const card = btn.parentElement;
    const selectedVariant = card.querySelector('.variant-btn.selected');

    if (!selectedVariant) {
        showModal("variant-modal");
        return;
    }

    const variant = selectedVariant.getAttribute('data-variant');
    const image = card.querySelector('img').src;

    let existingItem = cart.find(item => item.id === id && item.variant === variant);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({id, name, price, variant, quantity: 1, image});
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    cartSidebar.classList.add('open');
    renderCart();
}

// Show/hide cart sidebar
cartBtn.addEventListener('click', () => {
    cartSidebar.classList.toggle('open');
    renderCart();
});

closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

// Render cart
function renderCart() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        cartTotal.textContent = 'Total: $0';
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Variant: ${item.variant}</p>
                <p>Price: $${item.price}</p>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = `Total: $${total}`;
}

// Change item quantity
function changeQty(index, amount) {
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Update cart icon count
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Scroll to products
function scrollToProducts() {
    document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
}

// Checkout
document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        showModal("empty-cart-modal");
        return;
    }

    showModal("success-modal");
    cart = [];
    localStorage.removeItem("cart");
    updateCartCount();
    renderCart();
    cartSidebar.classList.remove('open');
});
