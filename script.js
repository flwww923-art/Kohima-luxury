// ================================
// KOUIM LUXURY
// JavaScript
// ================================

let cartCount = 0;

function addToCart() {
    cartCount++;

    const cartCounter = document.getElementById("cart-count");

    if (cartCounter) {
        cartCounter.textContent = cartCount;
    }

    alert("Produit ajouté au panier !");
}
