let cart = JSON.parse(localStorage.getItem('newWaveCart')) || [];
let currentProduct = null; // Used to track modal selection

document.addEventListener('DOMContentLoaded', () => {
    updateUI();

    // 1. Checkout Button Logic (With Empty Cart Check)
    document.getElementById('main-checkout-btn').addEventListener('click', () => {
        // Validation: Block if bag is empty
        if (cart.length === 0) {
            alert("YOUR BAG IS EMPTY");
            return;
        }

        const form = document.getElementById('customer-info');
        if (form.style.display === "none" || form.style.display === "") {
            form.style.display = "flex";
            document.getElementById('main-checkout-btn').innerText = "CONFIRM & PAY";
            return;
        }

        const name = document.getElementById('customer-name').value;
        const email = document.getElementById('email-address').value;
        const phone = document.getElementById('phone-number').value;
        const address = document.getElementById('delivery-address').value;

        if (!name || !email || !phone || !address) {
            alert("FILL ALL DETAILS");
            return;
        }

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const handler = PaystackPop.setup({
            key: 'pk_live_98019618f5c7ca1a06b239a9dc75f41b71783ad7',
            email: email,
            amount: total * 100,
            currency: 'NGN',
            callback: function(res) {
                let itemsStr = "";
                cart.forEach(item => {
                    itemsStr += `(${item.quantity}x) ${item.name} - ${item.size}/${item.color}%0A`;
                });

                const msg = `*NEW WAVE ORDER*%0A*Status:* PAID%0A*Ref:* ${res.reference}%0A-----------------%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Address:* ${address}%0A%0A*ITEMS:*%0A${itemsStr}%0A*TOTAL:* ₦${total.toLocaleString()}`;
                
                // Clear cart after success
                cart = [];
                saveAndRefresh();
                window.location.href = `https://wa.me/2348029913798?text=${msg}`;
            }
        });
        handler.openIframe();
    });
});

// --- MODAL LOGIC ---
function openProductModal(card) {
    const name = card.querySelector('h3').innerText;
    const priceText = card.querySelector('.price').innerText;
    const img = card.querySelector('img').src;
    
    // Copy the existing size/color buttons into the modal
    const selectionContainer = card.querySelector('.selection-container').cloneNode(true);
    
    currentProduct = { name, priceText, img };

    document.getElementById('modal-name').innerText = name;
    document.getElementById('modal-price').innerText = priceText;
    document.getElementById('modal-img').src = img;
    
    const container = document.getElementById('modal-options-target');
    container.innerHTML = "";
    container.appendChild(selectionContainer);

    // Re-attach listeners to the cloned buttons
    container.querySelectorAll('.opt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const group = btn.closest('.options');
            group.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.getElementById('modal-qty-num').innerText = "1";
    document.getElementById('product-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function changeModalQty(change) {
    let num = document.getElementById('modal-qty-num');
    let val = parseInt(num.innerText) + change;
    if (val < 1) val = 1;
    num.innerText = val;
}

function confirmAddToCart() {
    const modal = document.getElementById('product-modal');
    const size = modal.querySelector('.size-btn.active')?.dataset.size;
    const color = modal.querySelector('.color-btn.active')?.dataset.color;
    const qty = parseInt(document.getElementById('modal-qty-num').innerText);

    if (!size || !color) {
        alert("SELECT SIZE & COLOR");
        return;
    }

    const price = parseInt(currentProduct.priceText.replace(/[^0-9]/g, ''));
    const existing = cart.find(i => i.name === currentProduct.name && i.size === size && i.color === color);

    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({ 
            name: currentProduct.name, 
            price: price, 
            size: size, 
            color: color, 
            img: currentProduct.img, 
            quantity: qty 
        });
    }

    saveAndRefresh();
    closeModal();
    toggleCart(true);
}

// --- CORE UTILITIES ---
function toggleControls(card) {
    // We now use this to trigger the Modal instead of just revealing buttons
    openProductModal(card);
}

function toggleCart(forceOpen = false) {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.querySelector('.cart-overlay');
    if(forceOpen) {
        sidebar.classList.add('open');
        overlay.style.display = 'block';
    } else {
        sidebar.classList.toggle('open');
        overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
    }
}

function updateQty(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('newWaveCart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    const container = document.getElementById('cart-items-container');
    const count = document.querySelector('.cart-count');
    const sideTotal = document.getElementById('sidebar-total-price');
    const stickyTotal = document.getElementById('grand-total');

    container.innerHTML = "";
    let total = 0;
    let itemsTotal = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        itemsTotal += item.quantity;
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" class="cart-thumb">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.size} / ${item.color}</p>
                    <div class="qty-ctrl">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <span class="qty-num">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                    </div>
                </div>
            </div>`;
    });

    count.innerText = itemsTotal;
    sideTotal.innerText = `₦${total.toLocaleString()}`;
    stickyTotal.innerText = `₦${total.toLocaleString()}`;

    // Reset checkout button if cart is emptied
    if (cart.length === 0) {
        document.getElementById('customer-info').style.display = "none";
        document.getElementById('main-checkout-btn').innerText = "CHECKOUT";
    }
}

function openCheckout() {
    if (cart.length === 0) {
        alert("BAG IS EMPTY");
        return;
    }
    toggleCart();
    document.getElementById('checkout-bar').classList.add('active');
}

function closeCheckout() {
    document.getElementById('checkout-bar').classList.remove('active');
}
