/* NEW WAVE | PORTAL.JS 
   Target Drop: July 1, 2026 
*/

// 1. CONFIGURATION
const correctPass = "WAVE01";
const scriptURL = 'https://script.google.com/macros/s/AKfycbywh_pxPPPSORKJSog4xOLiFruHknGrvR8ohHR4smqjGpL1Kf8ffnBOluxz5J8mgmk/exec'; 
const dropDateString = "July 1, 2026 00:00:00"; 

// 2. SELECT ELEMENTS
const form = document.getElementById('accessForm');
const msg = document.getElementById('msg');
const loginBox = document.querySelector('.login-box');

// 3. THE MAIN EVENT
form.addEventListener('submit', function(e) {
    e.preventDefault(); 

    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const inputPass = document.getElementById('passcode').value.trim();

    if (inputPass === correctPass) {
        // --- SUCCESS PATH ---

        // Log data to Google Sheets
        if (scriptURL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({
                    "name": name,
                    "phone": phone,
                    "status": "SUCCESS"
                })
            }).catch(err => console.log("Logging failed."));
        }

        // Transform UI
        loginBox.style.opacity = "0"; 

        setTimeout(() => {
            loginBox.innerHTML = `
                <div class="logo-container">
                    <img src="Logo.png" alt="Logo" class="logo" style="width:100%; max-width:180px; margin: 0 auto; display: block;">
                </div>
                <h2 style="color: #fff; letter-spacing: 5px; margin-top: 25px; font-weight: 900;">ACCESS GRANTED</h2>
                <p style="color: #666; font-size: 11px; margin-bottom: 20px; letter-spacing: 1px;">WELCOME TO THE WAVE, ${name.toUpperCase()}</p>
                
                <div style="height: 1px; width: 40px; background: #333; margin: 20px auto;"></div>

                <div id="countdown" style="color: #fff; font-family: 'Courier New', monospace; font-size: 28px; margin: 20px 0; font-weight: bold; letter-spacing: 2px;">
                    00d 00h 00m 00s
                </div>

                <p style="color: #444; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">TIME UNTIL DROP 01</p>
                <p style="color: #888; font-size: 11px; margin-top: 20px;">Identity Verified: ${phone}</p>
            `;
            loginBox.style.opacity = "1";
            loginBox.style.transition = "opacity 0.5s ease-in";

            startCountdown(); // Start the July 1st timer
        }, 400);

    } else {
        // --- FAILURE PATH ---
        msg.style.display = 'block';
        msg.style.color = '#ff4444';
        msg.innerText = "Invalid Passcode. Access Denied.";

        setTimeout(() => { msg.style.display = 'none'; }, 3000);
    }
});

// 4. THE COUNTDOWN ENGINE
function startCountdown() {
    const targetDate = new Date(dropDateString).getTime();

    const interval = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const timerElement = document.getElementById("countdown");
        if (!timerElement) return; 

        timerElement.innerHTML = 
            (days < 10 ? "0" + days : days) + "d " + 
            (hours < 10 ? "0" + hours : hours) + "h " + 
            (minutes < 10 ? "0" + minutes : minutes) + "m " + 
            (seconds < 10 ? "0" + seconds : seconds) + "s ";

        if (distance < 0) {
            clearInterval(interval);
            timerElement.innerHTML = "DROP IS LIVE";
        }
    }, 1000);
}
