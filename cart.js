
"use strict";

// ========================================
// FreshMart - Shopping Cart
// ========================================

const CART_STORAGE_KEY = "cart";

function loadCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY) || "[]"
        );

        if (!Array.isArray(savedCart)) return [];

        return savedCart
            .filter(function (product) {
                return (
                    product &&
                    typeof product.name === "string" &&
                    product.name.trim() !== "" &&
                    Number.isFinite(Number(product.price)) &&
                    Number(product.price) >= 0 &&
                    Number.isFinite(Number(product.quantity)) &&
                    Number(product.quantity) > 0
                );
            })
            .map(function (product) {
                return {
                    name: product.name.trim(),
                    price: Number(product.price),
                    quantity: Math.floor(Number(product.quantity))
                };
            })
            .filter(function (product) {
                return product.quantity > 0;
            });
    } catch (error) {
        console.error("Could not load the saved cart:", error);
        return [];
    }
}

let cart = loadCart();

// Save the current cart.
function saveCart() {
    try {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );
    } catch (error) {
        console.error("Could not save the cart:", error);
    }
}

// Format amounts consistently in Indian rupees.
function formatMoney(amount) {
    return Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Calculate the number of items and the total price.
function getCartSummary() {
    return cart.reduce(
        function (summary, product) {
            summary.count += product.quantity;
            summary.total += product.price * product.quantity;
            return summary;
        },
        { count: 0, total: 0 }
    );
}

// Update any cart badges on the current page.
function updateCartBadges() {
    const summary = getCartSummary();

    document.querySelectorAll(".cart-count").forEach(function (badge) {
        badge.textContent = summary.count;
        badge.setAttribute(
            "aria-label",
            summary.count + " items in cart"
        );
    });
}

// Add a product or increase its quantity.
function addToCart(name, price) {
    const existingProduct = cart.find(function (product) {
        return product.name.toLowerCase() === name.toLowerCase();
    });

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();
    updateCards();
}

// Attach add-to-cart events on index.html.
document.querySelectorAll(".productCard .btn").forEach(function (button) {
    button.addEventListener("click", function () {
        const card = button.closest(".productCard");
        if (!card) return;

        // Find the product's price text.
        const paragraphs = Array.from(card.querySelectorAll("p"));
        const priceElement = paragraphs.find(function (paragraph) {
            return paragraph.textContent.includes("₹");
        });

        const priceText = priceElement
            ? priceElement.textContent.trim()
            : "";

        // Supports prices such as ₹120, ₹1,200, and ₹12.50.
        const priceMatch = priceText.match(
            /₹\s*([\d,]+(?:\.\d+)?)/
        );

        // Prefer the existing product title class when available.
        const titleElement = card.querySelector(".product-title");

        const name = titleElement
            ? titleElement.textContent.trim()
            : priceText.split("₹")[0].trim();

        if (!name || !priceMatch) {
            console.error(
                "Could not find the product name or price.",
                card
            );
            return;
        }

        const price = Number(priceMatch[1].replace(/,/g, ""));

        if (!Number.isFinite(price) || price < 0) {
            console.error("Invalid product price:", priceText);
            return;
        }

        addToCart(name, price);

        // Brief feedback without an alert popup.
        const originalText = button.textContent;
        button.textContent = "✓ Added";
        button.classList.add("added");

        window.setTimeout(function () {
            button.textContent = originalText;
            button.classList.remove("added");
        }, 900);
    });
});

// Create a clear-cart button without editing cart.html.
function setupClearCartButton() {
    const cartSection = document.getElementById("cart");
    const totalHeading = cartSection?.querySelector("h3");

    if (!cartSection || !totalHeading) return;

    let clearButton = cartSection.querySelector(".clear-cart-btn");

    if (!clearButton) {
        clearButton = document.createElement("button");
        clearButton.type = "button";
        clearButton.className = "clear-cart-btn";
        clearButton.textContent = "Clear Cart";
        clearButton.addEventListener("click", clearCart);

        cartSection.insertBefore(clearButton, totalHeading);
    }

    clearButton.disabled = cart.length === 0;
}

// Display the cart items, quantity controls, and totals.
function updateCards() {
    updateCartBadges();

    const countElement = document.getElementById("cart-count");
    const itemsElement = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    // The product page may not have cart details.
    if (!countElement || !itemsElement || !totalElement) {
        return;
    }

    const summary = getCartSummary();

    countElement.textContent = summary.count;
    totalElement.textContent = formatMoney(summary.total);

    itemsElement.replaceChildren();
    itemsElement.classList.toggle("is-empty", cart.length === 0);

    if (cart.length === 0) {
        itemsElement.textContent = "Your cart is empty.";
        setupClearCartButton();
        return;
    }

    cart.forEach(function (product, index) {
        const item = document.createElement("div");
        item.className = "cart-item";

        // Product information.
        const details = document.createElement("div");
        details.className = "cart-item-details";

        const name = document.createElement("strong");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = "₹" + formatMoney(product.price) + " each";

        const subtotal = document.createElement("p");
        subtotal.className = "cart-subtotal";
        subtotal.textContent =
            "Subtotal: ₹" +
            formatMoney(product.price * product.quantity);

        details.append(name, price, subtotal);

        // Quantity controls.
        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";

        const decreaseButton = document.createElement("button");
        decreaseButton.type = "button";
        decreaseButton.textContent = "−";
        decreaseButton.className = "quantity-btn";
        decreaseButton.setAttribute(
            "aria-label",
            "Decrease " + product.name + " quantity"
        );

        const quantity = document.createElement("span");
        quantity.className = "quantity-value";
        quantity.textContent = product.quantity;
        quantity.setAttribute("aria-live", "polite");

        const increaseButton = document.createElement("button");
        increaseButton.type = "button";
        increaseButton.textContent = "+";
        increaseButton.className = "quantity-btn";
        increaseButton.setAttribute(
            "aria-label",
            "Increase " + product.name + " quantity"
        );

        decreaseButton.addEventListener("click", function () {
            if (!cart[index]) return;

            cart[index].quantity--;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }

            saveCart();
            updateCards();
        });

        increaseButton.addEventListener("click", function () {
            if (!cart[index]) return;

            cart[index].quantity++;
            saveCart();
            updateCards();
        });

        quantityControls.append(
            decreaseButton,
            quantity,
            increaseButton
        );

        // Remove product completely.
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.className = "remove-btn";
        removeButton.setAttribute(
            "aria-label",
            "Remove " + product.name + " from cart"
        );

        removeButton.addEventListener("click", function () {
            if (!cart[index]) return;

            cart.splice(index, 1);
            saveCart();
            updateCards();
        });

        item.append(details, quantityControls, removeButton);
        itemsElement.appendChild(item);
    });

    setupClearCartButton();
}

// Clear every product from the cart.
function clearCart() {
    cart = [];
    saveCart();
    updateCards();
}

// Refresh the cart when the page opens.
updateCards();
