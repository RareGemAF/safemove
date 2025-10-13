// Sidebar navigation
const links = document.querySelectorAll(".sidebar ul li a");
const sections = document.querySelectorAll(".section");

links.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove active from all
        links.forEach(l => l.classList.remove("active"));
        sections.forEach(s => s.classList.remove("active"));

        // Activate clicked link and section
        link.classList.add("active");
        const sectionId = link.getAttribute("data-section");
        document.getElementById(sectionId).classList.add("active");

        // Scroll to top
        window.scrollTo(0, 0);
    });
});

// Ride simulation
const startBtn = document.getElementById("startRide");
const endBtn = document.getElementById("endRide");
const tripStatus = document.getElementById("tripStatus");
const statusMessage = document.getElementById("statusMessage");

if (startBtn && endBtn && tripStatus && statusMessage) {
    startBtn.addEventListener("click", () => {
        startBtn.classList.add("hidden");
        endBtn.classList.remove("hidden");
        tripStatus.classList.remove("hidden");
        statusMessage.textContent = "Trip started... heading to destination 🚗";
    });

    endBtn.addEventListener("click", () => {
        tripStatus.classList.add("hidden");
        startBtn.classList.remove("hidden");
        endBtn.classList.add("hidden");
        alert("✅ Trip completed successfully!");
    });
}

// SOS simulation
document.getElementById("sosButton")?.addEventListener("click", () => {
    alert("🚨 SOS Alert Sent! Authorities notified.");
});

// Logout simulation
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    alert("You have been logged out successfully!");
    window.location.href = "driver.html";
});

// Toggle availability
function toggleAvailability() {
    const toggle = document.getElementById('availability-toggle');
    const statusText = document.getElementById('status-text');

    if (toggle.checked) {
        statusText.textContent = '🟢 You are Online';
        statusText.style.color = '#43e97b';
    } else {
        statusText.textContent = '🔴 You are Offline';
        statusText.style.color = '#f5576c';
    }
}

// Initialize datetime for incident report
window.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('incident-datetime')?.value = now.toISOString().slice(0, 16);
});

// ====== Chart.js Graph ======
const ctx = document.getElementById('tripsChart').getContext('2d');

const tripsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Today', 'This Week', 'This Month', 'This Year'],
        datasets: [{
            label: 'Number of Trips',
            data: [5, 24, 120, 1450],
            backgroundColor: [
                'rgba(102, 126, 234, 0.8)',
                'rgba(240, 147, 251, 0.8)',
                'rgba(79, 172, 254, 0.8)',
                'rgba(67, 233, 123, 0.8)'
            ],
            borderColor: [
                'rgba(102, 126, 234, 1)',
                'rgba(240, 147, 251, 1)',
                'rgba(79, 172, 254, 1)',
                'rgba(67, 233, 123, 1)'
            ],
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.5
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Trips',
                    color: '#1e3a8a',
                    font: { size: 14, weight: 'bold' }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Time Period',
                    color: '#1e3a8a',
                    font: { size: 14, weight: 'bold' }
                }
            }
        }
    }
});
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update active state in sidebar
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
}

function acceptRide(passengerName) {
    alert(`Ride accepted for ${passengerName}`);
    // Add your ride acceptance logic here
}

function declineRide() {
    alert('Ride declined');
    // Add your ride decline logic here
}

function messagePassenger() {
    // Add your messaging logic here
    alert('Opening message window...');
}

function contactSupport() {
    window.location.href = 'mailto:support@ridenova.com';
}

function viewFAQ() {
    window.location.href = '/faq';
}

// Add event listeners when document loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the first section as active
    showSection('dashboard');
    
    // Make all external links open in new tab
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
});