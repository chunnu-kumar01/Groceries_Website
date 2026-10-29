const srhInput = document.getElementById("search");

srhInput.addEventListener("input", function () {

    const srhText = srhInput.value.toLowerCase().trim();
    const products = document.querySelectorAll(".product-card");

    products.forEach(function (card) {
        const productName = card.querySelector("h3").textContent.toLocaleLowerCase();

        if (productName.includes(srhText)) {
            card.style.display = "";

        } else {
            card.style.display = "none";
        }

    });
});