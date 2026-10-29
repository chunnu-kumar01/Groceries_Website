const cartButtons = document.querySelectorAll(".cart-btn");

cartButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        button.classList.add("orange");
    });
});