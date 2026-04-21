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

            // Push item details
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

    // 3. PAYSTACK + WHATSAPP INTEGRATION
    checkoutBtn.addEventListener('click', () => {
        // Toggle form visibility on first click
        if (customerInfo.style.display === "none") {
            customerInfo.style.display = "flex";
            checkoutBtn.innerText = "PAY NOW";
            return;
        }

        // Get delivery details from the form
        const name = document.getElementById('customer-name').value;
        const email = document.getElementById('email-address').value;
        const phone = document.getElementById('phone-number').value;
        const address = document.getElementById('delivery-address').value;

        // Final Validation
        if (!name || !email || !phone || !address) {
            alert("Please fill in all delivery details before paying!");
            return;
        }

        // Trigger Paystack Popup
        let handler = PaystackPop.setup({
            key: 'pk_live_98019618f5c7ca1a06b239a9dc75f41b71783ad7', // <-- CHANGE THIS TO YOUR LIVE KEY
            email: email,
            amount: totalPrice * 100, // Paystack uses Kobo
            currency: 'NGN',
            ref: 'NW-' + Math.floor((Math.random() * 1000000000) + 1),
            callback: function(response) {
                // Success! Redirect to WhatsApp with receipt
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
                
                const whatsappUrl = `https://wa.me/${myNumber}?text=${fullMessage}`;
                window.open(whatsappUrl, '_blank');
            },
            onClose: function() {
                alert('Payment window closed. Your items are still in the cart.');
            }
        });

        handler.openIframe();
    });
});
