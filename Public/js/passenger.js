document.addEventListener('DOMContentLoaded', function() {
    initializePassengerApp();
});

function initializePassengerApp() {
    setupEventListeners();
    checkActiveRide();
    loadRideHistory();
}

function setupEventListeners() {
    const requestRideForm = document.getElementById('requestRideForm');
    if (requestRideForm) {
        requestRideForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await requestRide();
        });
    }

    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await submitFeedback();
        });
    }

    const incidentForm = document.getElementById('incidentForm');
    if (incidentForm) {
        incidentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await reportIncident();
        });
    }
}

function showRideForm() {
    document.getElementById('rideForm').style.display = 'block';
    document.getElementById('requestRideCard').scrollIntoView({ behavior: 'smooth' });
}

function hideRideForm() {
    document.getElementById('rideForm').style.display = 'none';
}

async function requestRide() {
    const form = document.getElementById('requestRideForm');
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Requesting...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/passenger/request-ride', {
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
            hideRideForm();
            setTimeout(() => location.reload(), 2000);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Failed to request ride. Please try again.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function checkRideStatus() {
    try {
        const response = await fetch('/passenger/ride-status');
        const result = await response.json();
        
        if (result.success && result.ride) {
            const ride = result.ride;
            let message = `Ride Status: ${ride.status}`;
            if (ride.driver) {
                message += ` | Driver: ${ride.driver.name}`;
            }
            if (ride.status === 'in_progress') {
                message += ' | Your ride is on the way!';
            }
            showMessage(message, 'success');
        } else {
            showMessage('No active ride found.', 'info');
        }
    } catch (error) {
        showMessage('Failed to check ride status.', 'error');
    }
}

async function cancelRide(rideId) {
    if (!confirm('Are you sure you want to cancel this ride?')) {
        return;
    }
    
    try {
        const response = await fetch('/passenger/cancel-ride', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ rideId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            setTimeout(() => location.reload(), 1500);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Failed to cancel ride.', 'error');
    }
}

async function sendSOS() {
    const description = prompt('Please describe the emergency situation:');
    
    if (description === null) return;
    
    try {
        const response = await fetch('/passenger/send-sos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ description })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Failed to send SOS. Please call emergency services immediately!', 'error');
    }
}

function showFeedbackForm(rideId) {
    document.getElementById('feedbackRideId').value = rideId;
    document.getElementById('feedbackModal').style.display = 'block';
}

function showIncidentForm(rideId) {
    document.getElementById('incidentRideId').value = rideId;
    document.getElementById('incidentModal').style.display = 'block';
}

async function submitFeedback() {
    const form = document.getElementById('feedbackForm');
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/passenger/submit-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            closeModal('feedbackModal');
            form.reset();
            setTimeout(() => location.reload(), 1500);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Failed to submit feedback.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function reportIncident() {
    const form = document.getElementById('incidentForm');
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Reporting...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/passenger/report-incident', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            closeModal('incidentModal');
            form.reset();
            setTimeout(() => location.reload(), 1500);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Failed to report incident.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
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

function checkActiveRide() {
    setInterval(async () => {
        try {
            const response = await fetch('/passenger/ride-status');
            const result = await response.json();
            
            if (result.success && result.ride) {
                const activeRideElement = document.querySelector('.active-ride');
                if (!activeRideElement) {
                    location.reload();
                }
            }
        } catch (error) {
        }
    }, 10000);
}

async function loadRideHistory() {
    try {
        const response = await fetch('/passenger/ride-history');
        const result = await response.json();
        
        if (result.success) {
            updateRideHistoryTable(result.rides);
        }
    } catch (error) {
    }
}

function updateRideHistoryTable(rides) {
    const tbody = document.querySelector('#rideHistoryTable tbody');
    if (!tbody) return;
    
    if (!rides || rides.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No ride history yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = rides.map(ride => `
        <tr>
            <td>${new Date(ride.createdAt).toLocaleDateString()}</td>
            <td>${ride.pickupLocation.address} → ${ride.destination.address}</td>
            <td>${ride.fare.toLocaleString()} UGX</td>
            <td><span class="status-badge completed">Completed</span></td>
            <td>
                <button class="btn-sm" onclick="showFeedbackForm('${ride._id}')">Feedback</button>
                <button class="btn-sm" onclick="showIncidentForm('${ride._id}')">Report</button>
            </td>
        </tr>
    `).join('');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/logout';
    }
}

window.onclick = function(event) {
    const feedbackModal = document.getElementById('feedbackModal');
    const incidentModal = document.getElementById('incidentModal');
    
    if (event.target === feedbackModal) {
        closeModal('feedbackModal');
    }
    if (event.target === incidentModal) {
        closeModal('incidentModal');
    }
}