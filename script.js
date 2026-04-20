// NEW WAVE - Advanced WhatsApp Checkout Script
let cartCount = 0;
let totalPrice = 0;
let cartItems = []; // This stores the details of every item added

document.addEventListener('DOMContentLoaded', () => {
    const cartDisplay = document.querySelector('.cart-count');
    const grandTotalDisplay = document.getElementById('grand-total');
    const checkoutBar = document.getElementById('checkout-bar');
    const addButtons = document.querySelectorAll('.add-btn');

    // 1. SIZE & COLOR SELECTION LOGIC
    const optionButtons = document.querySelectorAll('.opt-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 2. ADD TO CART LOGIC
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').innerText;
            const priceText = productCard.querySelector('.price').innerText;
            const priceValue = parseInt(priceText.replace(/[^0-9]/g, ''));

            const selectedSize = productCard.querySelector('.size-btn.active');
            const selectedColor = productCard.querySelector('.color-btn.active');

            // Validation
            if (!selectedSize || !selectedColor) {
                alert("Please select both SIZE and COLOR first!");
                return;
            }

            const size = selectedSize.getAttribute('data-size');
            const color = selectedColor.getAttribute('data-color');

            // Push item details to our cart list
            cartItems.push({
                name: productName,
                size: size,
                color: color,
                price: priceText
            });

            // Update Totals
            cartCount++;
            totalPrice += priceValue;

            // Update UI
            cartDisplay.innerText = `🛒 [${cartCount}]`;
            grandTotalDisplay.innerText = `₦${totalPrice.toLocaleString()}`;
            checkoutBar.classList.add('active');

            // Feedback animation
            button.innerText = "ADDED";
            button.style.background = "#fff";
            button.style.color = "#000";
            setTimeout(() => { 
                button.innerText = "ADD TO CART"; 
                button.style.background = ""; 
                button.style.color = "";
            }, 1000);
        });
    });

    // 3. GENERATE DETAILED WHATSAPP MESSAGE
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        const phoneNumber = "2348029913798";
        
        // Build the item list string
        let itemDetails = "";
        cartItems.forEach((item, index) => {
            itemDetails += `${index + 1}. ${item.name} (${item.color}, Size ${item.size}) - ${item.price}\n`;
        });

        const fullMessage = `Hello New Wave! 🌊\n\nI'd like to order:\n${itemDetails}\nTOTAL: ₦${totalPrice.toLocaleString()}\n\nPlease confirm availability!`;
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`;
        window.open(whatsappUrl, '_blank');
    });
});
