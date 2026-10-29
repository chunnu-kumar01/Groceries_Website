
const productList = document.getElementById("product-list");

function displayProducts() {
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="image">
                ${product.isNew ? "<span>New</span>" : ""}

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </div>

            <h3>${product.name}</h3>

            <div>
                ★★★★☆ <span>(${product.rating})</span>
            </div>

            <p>₹${product.price} / ${product.unit}</p>

            <button class="btn" onclick="addToCart(${product.id})">
                + Add to Cart
            </button>
        </div>
    `).join("");
}

function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (product) {
        alert(product.name + " added to cart!");
    }
}

displayProducts();
