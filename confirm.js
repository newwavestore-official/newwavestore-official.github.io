const order = JSON.parse(localStorage.getItem('nwOrder'));

if (!order) {
    window.location.href = 'Shop.html';
}

document.getElementById('conf-ref').innerText = order.reference;
document.getElementById('conf-name').innerText = order.name;
document.getElementById('conf-phone').innerText = order.phone;
document.getElementById('conf-address').innerText = order.address;
document.getElementById('conf-total').innerText = '₦' + order.total.toLocaleString();

const itemsContainer = document.getElementById('conf-items');
order.items.forEach(item => {
    itemsContainer.innerHTML += `
        <div class="conf-item">
            <div class="conf-item-name">
                <p>${item.name}</p>
                <p class="conf-item-detail">${item.size} / ${item.color} &times; ${item.quantity}</p>
            </div>
            <p class="conf-item-price">₦${(item.price * item.quantity).toLocaleString()}</p>
        </div>
    `;
});

document.getElementById('conf-whatsapp-btn').addEventListener('click', function () {
    let itemsStr = "";
    order.items.forEach(item => {
        itemsStr += `(${item.quantity}x) ${item.name} - ${item.size}/${item.color}%0A`;
    });
    const msg = `*NEW WAVE ORDER*%0A*Status:* PAID%0A*Ref:* ${order.reference}%0A-----------------%0A*Name:* ${order.name}%0A*Phone:* ${order.phone}%0A*Address:* ${order.address}%0A%0A*ITEMS:*%0A${itemsStr}%0A*TOTAL:* ₦${order.total.toLocaleString()}`;
    localStorage.removeItem('nwOrder');
    window.location.href = `https://wa.me/2348029913798?text=${msg}`;
});
