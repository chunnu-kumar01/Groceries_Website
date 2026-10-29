document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-box input");
    const searchButton = document.querySelector(".search-box button");
    const products = [...document.querySelectorAll(".product-card")];

    if (!searchInput) return;

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();

        if (query === "") {
            // Restore the normal page
            document.body.classList.remove("search-mode");

            products.forEach(product => {
                product.classList.remove("search-hidden");
            });

            return;
        }

        // Hide hero and categories, keep navbar visible
        document.body.classList.add("search-mode");

        let matchCount = 0;

        products.forEach(product => {
            const matches = product.textContent
                .toLowerCase()
                .includes(query);

            product.classList.toggle("search-hidden", !matches);

            if (matches) matchCount++;
        });

        // Show a message when no products match
        let message = document.querySelector(".no-search-results");

        if (!message) {
            message = document.createElement("p");
            message.className = "no-search-results";
            message.textContent = "No products found.";
            message.style.textAlign = "center";
            message.style.padding = "30px";
            document.body.appendChild(message);
        }

        message.style.display = matchCount === 0 ? "block" : "none";
    }

    searchInput.addEventListener("focus", () => {
        if (searchInput.value.trim() !== "") {
            performSearch();
        }
    });

    searchInput.addEventListener("input", performSearch);

    if (searchButton) {
        searchButton.addEventListener("click", performSearch);
    }

    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            performSearch();
        }

        if (event.key === "Escape") {
            searchInput.value = "";
            performSearch();
        }
    });
});