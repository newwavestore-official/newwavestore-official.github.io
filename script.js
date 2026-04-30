let cartItems = JSON.parse(localStorage.getItem("nw_cart")) || [];
let cartCount = 0;
let totalPrice = 0;

let currentProduct = {};
let selectedSize = null;
let selectedColor = null;

document.addEventListener("DOMContentLoaded", () => {

    // ===================== ELEMENTS =====================
    const cartDisplay = document.querySelector(".cart-count");
    const grandTotal = document.getElementById("grand-total");

    const modal = document.getElementById("product-modal");
    const modalImg = document.getElementById("modal-img");
    const modalName = document.getElementById("modal-name");
    const modalPrice = document.getElementById("modal-price");
    const closeModal = document.getElementById("close-modal");
    const modalAddBtn = document.getElementById("modal-add-btn");

    const summaryList = document.getElementById("summary-list");
    const summaryContainer = document.getElementById("cart-items-preview");

    const toast = document.getElementById("toast");

    const checkoutBtn = document.getElementById("main-checkout-btn");

    // ===================== TOAST =====================
    function showToast(msg = "Item added ✓") {
        toast.innerText = msg;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 1500);
    }

    // ===================== OPEN MODAL =====================
    document.querySelectorAll(".img-box").forEach(img => {
        img.addEventListener("click", () => {

            const card = img.closest(".product-card");

            currentProduct = {
                name: card.querySelector("h3").innerText,
                priceText: card.querySelector(".price").innerText,
                price: parseInt(card.querySelector(".price").innerText.replace(/[^0-9]/g, "")),
                img: img.querySelector("img").src
            };

            modalImg.src = currentProduct.img;
            modalName.innerText = currentProduct.name;
            modalPrice.innerText = currentProduct.priceText;

            modal.style.display = "flex";
        });
    });

    // CLOSE MODAL
    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (e) => {
        if (e.target == modal) modal.style.display = "none";
    };

    // ===================== SIZE SELECT =====================
    document.querySelectorAll(".size-btn").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedSize = btn.dataset.size;
        };
    });

    // ===================== COLOR SELECT =====================
    document.querySelectorAll(".color-btn").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedColor = btn.dataset.color;
        };
    });

    // ===================== ADD TO CART =====================
    modalAddBtn.onclick = () => {

        if (!selectedSize || !selectedColor) {
            alert("Select size and color");
            return;
        }

        let existing = cartItems.find(item =>
            item.name === currentProduct.name &&
            item.size === selectedSize &&
            item.color === selectedColor
        );

        if (existing) {
            existing.qty += 1;
        } else {
            cartItems.push({
                name: currentProduct.name,
                size: selectedSize,
                color: selectedColor,
                price: currentProduct.price,
                qty: 1
            });
        }

        modal.style.display = "none";

        selectedSize = null;
        selectedColor = null;

        updateCart();

        showToast("Item added ✓");
    };

    // ===================== UPDATE CART =====================
    function updateCart() {

        cartCount = 0;
        totalPrice = 0;

        summaryList.innerHTML = "";

        cartItems.forEach((item, index) => {

            cartCount += item.qty;
            totalPrice += item.price * item.qty;

            summaryList.innerHTML += `
                <div class="summary-item">
                    <span>${item.name} (${item.color}, ${item.size})</span>

                    <div>
                        <button onclick="decrease(${index})">-</button>
                        <span>${item.qty}</span>
                        <button onclick="increase(${index})">+</button>
                        <button onclick="removeItem(${index})">🗑</button>
                    </div>

                    <span>₦${item.price * item.qty}</span>
                </div>
            `;
        });

        cartDisplay.innerText = cartCount;
        grandTotal.innerText = `₦${totalPrice.toLocaleString()}`;

        localStorage.setItem("nw_cart", JSON.stringify(cartItems));

        summaryContainer.style.display = cartItems.length ? "block" : "none";
    }

    // ===================== CART CONTROLS =====================
    window.increase = (i) => {
        cartItems[i].qty++;
        updateCart();
    };

    window.decrease = (i) => {
        if (cartItems[i].qty > 1) {
            cartItems[i].qty--;
        } else {
            cartItems.splice(i, 1);
        }
        updateCart();
    };

    window.removeItem = (i) => {
        cartItems.splice(i, 1);
        updateCart();
    };

    // ===================== PAYSTACK CHECKOUT =====================
    checkoutBtn.addEventListener("click", () => {

        const name = document.getElementById("customer-name").value;
        const email = document.getElementById("email-address").value;
        const phone = document.getElementById("phone-number").value;
        const address = document.getElementById("delivery-address").value;

        if (!name || !email || !phone || !address) {
            alert("Please fill in all delivery details!");
            return;
        }

        let handler = PaystackPop.setup({
            key: "pk_live_98019618f5c7ca1a06b239a9dc75f41b71783ad7",
            email: email,
            amount: totalPrice * 100,
            currency: "NGN",
            ref: "NW-" + Math.floor(Math.random() * 1000000000),

            callback: function (response) {

                const myNumber = "2348029913798";

                let itemDetails = "";

                cartItems.forEach((item, index) => {
                    itemDetails += `${index + 1}. ${item.name} (${item.color}, ${item.size}) x${item.qty} - ₦${item.price * item.qty}%0A`;
                });

                const message =
                    `*NEW WAVE ORDER* ✅%0A` +
                    `*PAID*%0A` +
                    `Ref: ${response.reference}%0A%0A` +
                    `Name: ${name}%0A` +
                    `Phone: ${phone}%0A` +
                    `Address: ${address}%0A%0A` +
                    `ITEMS:%0A${itemDetails}%0A` +
                    `TOTAL: ₦${totalPrice.toLocaleString()}`;

                cartItems = [];
                localStorage.removeItem("nw_cart");
                updateCart();

                window.location.href = `https://wa.me/${myNumber}?text=${message}`;
            },

            onClose: function () {
                alert("Payment cancelled");
            }
        });

        handler.openIframe();
    });

    // INIT CART ON LOAD
    updateCart();
});
