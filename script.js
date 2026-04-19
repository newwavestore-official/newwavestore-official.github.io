
// NEW WAVE - Naira Only Master Script
let cartCount = 0;
let totalPrice = 0;

document.addEventListener('DOMContentLoaded', () => {
    const cartDisplay = document.querySelector('.cart-count');
    const grandTotalDisplay = document.getElementById('grand-total');
    const checkoutBar = document.getElementById('checkout-bar');
    const addButtons = document.querySelectorAll('.add-btn');

    // 1. SIZE & COLOR SELECTION
    const optionButtons = document.querySelectorAll('.opt-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 2. ADD TO CART & NAIRA CALCULATION
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const priceText = productCard.querySelector('.price').innerText;
            
            // This strictly extracts the numbers from the Naira price (e.g. 15,000 -> 15000)
            const priceValue = parseInt(priceText.replace(/[^0-9]/g, ''));

            const selectedSize = productCard.querySelector('.size-btn.active');
            const selectedColor = productCard.querySelector('.color-btn.active');

            if (!selectedSize || !selectedColor) {
                alert("Please select both SIZE and COLOR first!");
                return;
            }

            cartCount++;
            totalPrice += priceValue;

            // UI Update - Strictly ₦
            cartDisplay.innerText = `🛒 [${cartCount}]`;
            grandTotalDisplay.innerText = `₦${totalPrice.toLocaleString()}`;

            checkoutBar.classList.add('active');

            // Button Feedback
            button.innerText = "ADDED";
            setTimeout(() => { button.innerText = "ADD TO CART"; }, 1000);
        });
    });

    // 3. WHATSAPP REDIRECT (Naira Format)
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        const phoneNumber = "2348029913798"; // Put your number here
        const message = `Hello New Wave! I'm ready to checkout. Total Order: ₦${totalPrice.toLocaleString()}.`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
});
