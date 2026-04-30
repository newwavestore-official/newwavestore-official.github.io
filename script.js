// NEW WAVE - Official Paystack + WhatsApp Checkout Script
let cartCount = 0;
let totalPrice = 0;
let cartItems = [];

document.addEventListener('DOMContentLoaded', () => {
    const cartDisplay = document.querySelector('.cart-count');
    const grandTotalDisplay = document.getElementById('grand-total');
    const checkoutBar = document.getElementById('checkout-bar');
    const checkoutBtn = document.getElementById('main-checkout-btn');
    const customerInfo = document.getElementById('customer-info');
    const addButtons = document.querySelectorAll('.add-btn');

    // 1. SELECTION LOGIC (SIZE & COLOR)
    const optionButtons = document.querySelectorAll('.opt-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Find the closest options container to isolate Size from Color
            const group = this.closest('.options');
            group.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
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

            // Validation: Must select both
            if (!selectedSize || !selectedColor) {
                alert("Please select both SIZE and COLOR first!");
                return;
            }

            const size = selectedSize.getAttribute('data-size');
            const color = selectedColor.getAttribute('data-color');

            // Update Cart Array
            cartItems.push({
                name: productName,
                size: size,
                color: color,
                price: priceText
            });

            // Update UI & Math
            cartCount++;
            totalPrice += priceValue;

            if (cartDisplay) cartDisplay.innerText = cartCount;
            if (grandTotalDisplay) grandTotalDisplay.innerText = `₦${totalPrice.toLocaleString()}`;
            
            // Slide up the checkout bar
            checkoutBar.classList.add('active');

            // Visual Feedback
            const originalText = button.innerText;
            button.innerText = "ADDED";
            button.style.background = "#fff";
            button.style.color = "#000";
            
            setTimeout(() => { 
                button.innerText = originalText; 
                button.style.background = ""; 
                button.style.color = "";
            }, 1000);
        });
    });

    // 3. PAYSTACK + WHATSAPP INTEGRATION
    checkoutBtn.addEventListener('click', () => {
        // Step A: Reveal Customer Form on first click
        if (customerInfo.style.display === "none" || customerInfo.style.display === "") {
            customerInfo.style.display = "flex";
            checkoutBtn.innerText = "CONFIRM & PAY";
            customerInfo.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Step B: Get form values
        const name = document.getElementById('customer-name').value;
        const email = document.getElementById('email-address').value;
        const phone = document.getElementById('phone-number').value;
        const address = document.getElementById('delivery-address').value;

        // Step C: Form Validation
        if (!name || !email || !phone || !address) {
            alert("Please fill in all delivery details!");
            return;
        }

        // Step D: Initialize Paystack
        const handler = PaystackPop.setup({
            key: 'pk_live_98019618f5c7ca1a06b239a9dc75f41b71783ad7',
            email: email,
            amount: totalPrice * 100, // Amount in Kobo
            currency: 'NGN',
            ref: 'NW-' + Math.floor((Math.random() * 1000000000) + 1),
            callback: function(response) {
                // Success! Construct WhatsApp Message
                const myNumber = "2348029913798";
                
                let itemDetails = "";
                cartItems.forEach((item, index) => {
                    itemDetails += `${index + 1}. ${item.name} (${item.color}, Size ${item.size}) - ${item.price}%0A`;
                });

                const fullMessage = 
                    `*NEW WAVE ORDER* ✅%0A` +
                    `*Status:* PAID%0A` +
                    `*Ref:* ${response.reference}%0A` +
                    `--------------------------%0A` +
                    `*CUSTOMER INFO*%0A` +
                    `*Name:* ${name}%0A` +
                    `*Phone:* ${phone}%0A` +
                    `*Address:* ${address}%0A%0A` +
                    `*ITEMS:*%0A${itemDetails}%0A` +
                    `*TOTAL PAID:* ₦${totalPrice.toLocaleString()}%0A` +
                    `--------------------------%0A` +
                    `Please process for delivery! 🌊`;
                
                window.location.href = `https://wa.me/${myNumber}?text=${fullMessage}`;
            },
            onClose: function() {
                alert('Payment cancelled. Your items are still saved in your cart.');
            }
        });

        // CRITICAL: This is the part that was missing to actually start the payment!
        handler.openIframe();
    });
});
