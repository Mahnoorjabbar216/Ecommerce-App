let products = [];

// Load products from JSON or localStorage
function loadProducts() {
    fetch("products.json")
        .then(res => res.json())
        .then(data => {
            let savedProducts = JSON.parse(localStorage.getItem("products")) || [];
            // Prefer updated JSON but keep newly added local items
            products = [...data, ...savedProducts.filter(lp => !data.some(dp => dp.id === lp.id))];
            displayProducts();
        });
}

// Display all products in admin panel
function displayProducts() {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = "<p>No products available.</p>";
        return;
    }

    products.forEach((p, index) => {
        container.innerHTML += `
            <div class="product-item">
                <div>
                <img src="${p.image}" alt="${p.name}" class="product-img">
                    <strong>${p.name}</strong> - $${p.price} <br>
                    <small>Variants: ${p.variants.join(", ")}</small>
                </div>
                <button class="delete-btn" onclick="deleteProduct(${index})">Delete</button>
            </div>
        `;
    });
}

// Add new product
document.getElementById("add-product-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const newProduct = {
        id: products.length + 1,
        name: document.getElementById("name").value,
        price: parseFloat(document.getElementById("price").value),
        image: document.getElementById("image").value,
        variants: document.getElementById("variants").value.split(",").map(v => v.trim())
    };

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();

    // Clear form
    e.target.reset();
});

// Delete product
function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
}

// Initialize
loadProducts();
