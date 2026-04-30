let cart = JSON.parse(localStorage.getItem('newWaveCart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateUI();

    // 1. Selection Logic
    document.querySelectorAll('.opt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents closing the card tap
            const group = btn.closest('.options');
            group.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // 2. Add to Cart Logic
    document.querySelectorAll('.add-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = button.closest('.product-card');
            const name = card.querySelector('h3').innerText;
            const price = parseInt(card.querySelector('.price').innerText.replace(/[^0-9]/g, ''));
            const size = card.querySelector('.size-btn.active')?.dataset.size;
            const color = card.querySelector('.color-btn.active')?.dataset.color;

            if (!size || !color) {
                alert("SELECT SIZE & COLOR");
                return;
            }

            const existing = cart.find(i => i.name === name && i.size === size && i.color === color);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name, price, size, color, quantity: 1 });
            }

            saveAndRefresh();
            toggleCart(true); // Open sidebar
        });
    });

    // 3. Checkout Button Logic
    document.getElementById('main-checkout-btn').addEventListener('click', () => {
        const form = document.getElementById('customer-info');
        if (form.style.display === "none") {
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
                window.location.href = `https://wa.me/2348029913798?text=${msg}`;
            }
        });
        handler.openIframe();
    });
});

function toggleControls(card) {
    document.querySelectorAll('.product-card').forEach(c => { if(c !== card) c.classList.remove('active'); });
    card.classList.toggle('active');
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
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.size} / ${item.color}</p>
                </div>
                <div class="qty-ctrl">
                    <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                    <span class="qty-num">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                </div>
            </div>`;
    });

    count.innerText = itemsTotal;
    sideTotal.innerText = `₦${total.toLocaleString()}`;
    stickyTotal.innerText = `₦${total.toLocaleString()}`;
}

function openCheckout() {
    toggleCart();
    document.getElementById('checkout-bar').classList.add('active');
}

function closeCheckout() {
    document.getElementById('checkout-bar').classList.remove('active');
}
