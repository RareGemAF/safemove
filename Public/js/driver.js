// Driver dashboard functionality
let earningsChart = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeDriverApp();
});

function initializeDriverApp() {
    loadDashboardData();
    loadRideRequests();
    loadTripHistory();
    setupEventListeners();
    
    // Refresh data every 30 seconds
    setInterval(loadDashboardData, 30000);
}

function setupEventListeners() {
    // Incident form handling
    const incidentForm = document.getElementById('incidentForm');
    if (incidentForm) {
        incidentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await submitIncident();
        });
    }
}

async function loadDashboardData() {
    try {
        // Load stats for the dashboard
        const response = await fetch('/driver/api/stats');
        const result = await response.json();
        
        if (result.success) {
            updateDashboardStats(result.earnings);
            initializeEarningsChart(result.earnings);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showMessage('Failed to load dashboard data', 'error');
    }
}

function updateDashboardStats(earningsData) {
    // Update the stats from the server-rendered data
    // These values are already set in the template from server-side rendering
    console.log('Dashboard stats updated');
}

function initializeEarningsChart(earningsData) {
    const ctx = document.getElementById('earningsChart')?.getContext('2d');
    if (!ctx) return;
    
    if (earningsChart) {
        earningsChart.destroy();
    }
    
    const labels = earningsData.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const earnings = earningsData.map(item => item.earnings);
    
    earningsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Earnings (UGX)',
                data: earnings,
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Earnings: ${context.parsed.y.toLocaleString()} UGX`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' UGX';
                        }
                    }
                }
            }
        }
    });
}

async function loadRideRequests() {
    try {
        const tbody = document.getElementById('rideRequestsBody');
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Loading ride requests...</td></tr>';
        
        // Since ride requests are server-rendered, we'll refresh via page reload for now
        // In a real app, you would fetch from an API endpoint
        
        showMessage('Use refresh button to update ride requests', 'info');
        
    } catch (error) {
        console.error('Error loading ride requests:', error);
        document.getElementById('rideRequestsBody').innerHTML = 
            '<tr><td colspan="7" style="text-align: center; color: #ef4444;">Failed to load ride requests</td></tr>';
    }
}

async function loadTripHistory() {
    try {
        const tbody = document.getElementById('tripHistoryBody');
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Loading trip history...</td></tr>';
        
        // Trip history is server-rendered, so we'll just show a message
        // In a real app, you would fetch from an API endpoint
        
        showMessage('Trip history loaded from server', 'info');
        
    } catch (error) {
        console.error('Error loading trip history:', error);
        document.getElementById('tripHistoryBody').innerHTML = 
            '<tr><td colspan="6" style="text-align: center; color: #ef4444;">Failed to load trip history</td></tr>';
    }
}

async function acceptRide(rideId) {
    try {
        const response = await fetch(`/driver/accept-ride/${rideId}`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Ride accepted successfully!', 'success');
            // Refresh the ride requests
            setTimeout(() => {
                location.reload();
            }, 2000);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Error accepting ride:', error);
        showMessage('Failed to accept ride', 'error');
    }
}

async function declineRide(rideId) {
    try {
        const response = await fetch(`/driver/decline-ride/${rideId}`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Ride declined', 'success');
            // Refresh the ride requests
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Error declining ride:', error);
        showMessage('Failed to decline ride', 'error');
    }
}

async function submitIncident() {
    const form = document.getElementById('incidentForm');
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/driver/report-incident', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            form.reset();
            setTimeout(() => {
                showSection('dashboard');
            }, 2000);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Error submitting incident:', error);
        showMessage('Failed to submit incident report', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function refreshDashboard() {
    loadDashboardData();
    loadRideRequests();
    loadTripHistory();
    showMessage('Dashboard refreshed', 'success');
}

function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    messageContainer.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/logout';
    }
}

// Section navigation (keep the existing function)
window.showSection = function(sectionId) {
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
    
    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Update URL hash without scrolling
    history.pushState(null, '', `#${sectionId}`);
    
    // Load section-specific data
    switch(sectionId) {
        case 'ride-requests':
            loadRideRequests();
            break;
        case 'trip-history':
            loadTripHistory();
            break;
        case 'dashboard':
            loadDashboardData();
            break;
    }
};

// Handle initial hash in URL
document.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    showSection(hash);
});