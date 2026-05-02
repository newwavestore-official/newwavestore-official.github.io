const scriptURL ='https://script.google.com/macros/s/AKfycbxM3b2yxhn3Hf6fZ-Z_3GcAHv__RiYWCaaQV-urW3hOPicxGPo4NhVYrfuZsjE2XoBZ/exec';
const dropDate = new Date("2026-07-01T00:00:00").getTime();

const interval = setInterval(function () {
    const now = new Date().getTime();
    const distance = dropDate - now;

    if (distance <= 0) {
        clearInterval(interval);
        document.getElementById('countdown').innerHTML = "WE ARE LIVE";
        unlockShop();
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
}, 1000);

function unlockShop() {
    const btn = document.getElementById('enter-btn');
    btn.classList.remove('locked');
    btn.classList.add('unlocked');
    btn.disabled = false;
    btn.onclick = function () {
        window.location.href = 'Shop.html';
    };
}

function submitEmail() {
    const email = document.getElementById('email-input').value.trim();
    const msg = document.getElementById('notify-msg');
    const btn = document.getElementById('notify-btn');

    if (!email || !email.includes('@')) {
        msg.style.color = '#ff4444';
        msg.innerText = 'ENTER A VALID EMAIL.';
        return;
    }

    btn.innerText = 'SENDING...';
    btn.disabled = true;

    fetch(scriptURL + '?email=' + encodeURIComponent(email), {
        method: 'GET',
        mode: 'no-cors'
    }).then(() => {
        msg.style.color = '#fff';
        msg.style.letterSpacing = '2px';
        msg.style.fontWeight = '900';
        msg.innerText = "YOU'RE ON THE LIST!";
        document.getElementById('email-input').value = '';
        btn.innerText = 'NOTIFY ME';
        btn.disabled = false;
    }).catch(() => {
        msg.style.color = '#ff4444';
        msg.innerText = 'SOMETHING WENT WRONG. TRY AGAIN.';
        btn.innerText = 'NOTIFY ME';
        btn.disabled = false;
    });
}
