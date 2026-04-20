// 1. COUNTDOWN TIMER
// Set your specific July launch date here
const launchDate = new Date("July 1, 2026 00:00:00").getTime();

const timer = setInterval(function() {
    const now = new Date().getTime();
    const diff = launchDate - now;

    // If the countdown finishes
    if (diff < 0) {
        clearInterval(timer);
        document.getElementById("countdown").innerHTML = "COLLECTION LIVE";
        return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    // Displays as 00 : 00 : 00 : 00
    document.getElementById("countdown").innerHTML = 
        `${d.toString().padStart(2, '0')} : ${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
}, 1000);

// 2. WHATSAPP WAITLIST FUNCTION
function joinWaitlist() {
    const phone = "2348029913798";
    const msg = "I'm ready for the New Wave drop. Add me to the early access list.";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
}

// 3. SECRET ACCESS CODE (NO REDIRECT)
function checkCode() {
    const input = document.getElementById("accessCode").value.toUpperCase();
    const correctCode = "WAVE01"; // You can change this to your desired code
    
    if (input === correctCode) {
        // Target the 'gate' section and replace its content
        const gateSection = document.querySelector('.gate');
        
        // This removes the input box/button and shows a locked-in message
        gateSection.innerHTML = `
            <div style="padding: 20px; border: 1px solid #fff; animation: fadeIn 1s ease;">
                <p style="color: #fff; letter-spacing: 3px; font-size: 14px; margin: 0 0 10px 0;">ACCESS GRANTED</p>
                <p style="color: #666; font-size: 10px; letter-spacing: 1px; line-height: 1.5;">
                    YOUR IDENTITY HAS BEEN VERIFIED.<br>
                    YOU ARE ON THE LIST FOR JULY.<br>
                    WATCH YOUR WHATSAPP FOR UPDATES.
                </p>
            </div>
        `;
    } else {
        alert("INVALID ACCESS CODE.");
    }
}
