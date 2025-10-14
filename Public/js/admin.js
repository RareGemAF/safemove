// Admin dashboard functionality
let charts = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    loadDashboardData();
    initializeCharts();
    setupFormHandlers();
    
    // Auto-refresh data every 30 seconds
    setInterval(loadDashboardData, 30000);
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionName = this.getAttribute('data-section');
            
            // Update active nav
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => section.classList.add('hidden'));
            document.getElementById(`admin${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`)?.classList.remove('hidden');
            
            // Load section data
            loadSectionData(sectionName);
        });
    });
}

function setupFormHandlers() {
    // Driver form handling
    const driverForm = document.getElementById('addDriverForm');
    if (driverForm) {
        driverForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await addNewDriver();
        });
    }
}

async function loadDashboardData() {
    try {
        console.log('Loading dashboard data...');
        const response = await fetch('/admin/api/stats');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const stats = await response.json();
        console.log('Stats loaded:', stats);
        updateStats(stats);
        
        // Load drivers for dashboard
        await loadDrivers();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showMessage('Failed to load dashboard data. Please check console for details.', 'error');
    }
}

async function loadSectionData(sectionName) {
    console.log('Loading section:', sectionName);
    
    switch(sectionName) {
        case 'incidents':
            await loadIncidents();
            break;
        case 'users':
            await loadUsers();
            break;
        case 'analytics':
            await loadAnalytics();
            break;
    }
}

function updateStats(stats) {
    if (stats.activeRides !== undefined) {
        document.getElementById('activeRides').textContent = stats.activeRides;
    }
    if (stats.totalUsers !== undefined) {
        document.getElementById('totalUsers').textContent = stats.totalUsers;
    }
    if (stats.safetyAlerts !== undefined) {
        document.getElementById('safetyAlerts').textContent = stats.safetyAlerts;
    }
    if (stats.revenue !== undefined) {
        document.getElementById('revenueToday').textContent = formatCurrency(stats.revenue) + ' UGX';
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-UG').format(amount);
}

async function addNewDriver() {
    const form = document.getElementById('addDriverForm');
    const formData = new FormData(form);
    const messageDiv = document.getElementById('driverFormMessage');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Adding Driver...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/admin/add-driver', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            messageDiv.innerHTML = `<div class="success-message">✅ ${result.message}</div>`;
            form.reset();
            await loadDrivers(); // Refresh drivers list
            await loadDashboardData(); // Refresh stats
        } else {
            messageDiv.innerHTML = `<div class="error-message">❌ ${result.message}</div>`;
        }
    } catch (error) {
        console.error('Add driver error:', error);
        messageDiv.innerHTML = `<div class="error-message">❌ Failed to add driver. Please try again.</div>`;
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Clear message after 5 seconds
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 5000);
    }
}

async function loadDrivers() {
    try {
        const response = await fetch('/admin/api/drivers');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const drivers = await response.json();
        updateDriversTable(drivers);
    } catch (error) {
        console.error('Error loading drivers:', error);
        document.getElementById('driversTableBody').innerHTML = 
            '<tr><td colspan="6" style="text-align: center; color: #ef4444;">Failed to load drivers</td></tr>';
    }
}

function updateDriversTable(drivers) {
    const tbody = document.getElementById('driversTableBody');
    
    if (!drivers || drivers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No drivers registered yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = drivers.map(driver => `
        <tr>
            <td>${driver.name}</td>
            <td>${driver.email}</td>
            <td>${driver.phone || 'Not provided'}</td>
            <td>${driver.nin || 'Not provided'}</td>
            <td><span class="status-badge ${driver.status}">${driver.status}</span></td>
            <td>${new Date(driver.createdAt).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

async function loadIncidents() {
    try {
        const response = await fetch('/admin/api/rides');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rides = await response.json();
        updateIncidentsTable(rides);
    } catch (error) {
        console.error('Error loading incidents:', error);
        document.getElementById('incidentsTableBody').innerHTML = 
            '<tr><td colspan="7" style="text-align: center; color: #ef4444;">Failed to load incidents</td></tr>';
    }
}

function updateIncidentsTable(rides) {
    const tbody = document.getElementById('incidentsTableBody');
    
    const incidents = rides.filter(ride => ride.incidentReport && ride.incidentReport !== 'none');
    
    if (incidents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No incidents reported</td></tr>';
        return;
    }
    
    tbody.innerHTML = incidents.map(ride => {
        const severity = getIncidentSeverity(ride.incidentReport);
        const severityClass = `severity-${severity.toLowerCase()}`;
        
        return `
            <tr>
                <td>${new Date(ride.createdAt).toLocaleDateString()}</td>
                <td>${formatIncidentType(ride.incidentReport)}</td>
                <td>${ride.incidentDescription || 'No description provided'}</td>
                <td>${ride.pickupLocation?.address || 'Location not specified'}</td>
                <td>${ride.delayMinutes || 0}</td>
                <td class="${severityClass}">${severity}</td>
                <td>
                    <button class="btn-danger btn-sm" onclick="deleteRide('${ride._id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

async function deleteRide(rideId) {
    if (!confirm('Are you sure you want to delete this ride? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/admin/rides/${rideId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Ride deleted successfully!', 'success');
            await loadIncidents();
            await loadDashboardData();
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Delete ride error:', error);
        showMessage('Failed to delete ride.', 'error');
    }
}

function getIncidentSeverity(type) {
    const severityMap = {
        'accident': 'HIGH',
        'unsafe_driving': 'HIGH',
        'complaint': 'MEDIUM',
        'delay': 'LOW',
        'other': 'MEDIUM'
    };
    return severityMap[type] || 'MEDIUM';
}

function formatIncidentType(type) {
    const typeMap = {
        'accident': 'Accident',
        'unsafe_driving': 'Unsafe Driving',
        'complaint': 'Complaint',
        'delay': 'Delay',
        'other': 'Other'
    };
    return typeMap[type] || type;
}

async function loadUsers() {
    try {
        const response = await fetch('/admin/api/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const users = await response.json();
        updateUsersTable(users);
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersTableBody').innerHTML = 
            '<tr><td colspan="6" style="text-align: center; color: #ef4444;">Failed to load users</td></tr>';
    }
}

function updateUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    
    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No users registered yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="role-badge ${user.role}">${user.role}</span></td>
            <td><span class="status-badge ${user.status}">${user.status}</span></td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                ${user.role !== 'admin' ? `<button class="btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>` : ''}
            </td>
        </tr>
    `).join('');
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/admin/users/${userId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('User deleted successfully!', 'success');
            await loadUsers();
            await loadDashboardData();
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Delete user error:', error);
        showMessage('Failed to delete user.', 'error');
    }
}

function initializeCharts() {
    const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
    if (revenueCtx) {
        charts.revenue = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Daily Revenue (UGX)',
                    data: [],
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
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
    
    // Initialize other charts
    const ridesCtx = document.getElementById('ridesChart')?.getContext('2d');
    if (ridesCtx) {
        charts.rides = new Chart(ridesCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Rides per Hour',
                    data: [],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)'
                }]
            }
        });
    }
    
    const driverCtx = document.getElementById('driverChart')?.getContext('2d');
    if (driverCtx) {
        charts.driver = new Chart(driverCtx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        'rgb(34, 197, 94)',
                        'rgb(249, 115, 22)',
                        'rgb(239, 68, 68)'
                    ]
                }]
            }
        });
    }
    
    const feedbackCtx = document.getElementById('feedbackChart')?.getContext('2d');
    if (feedbackCtx) {
        charts.feedback = new Chart(feedbackCtx, {
            type: 'doughnut',
            data: {
                labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        'rgb(239, 68, 68)',
                        'rgb(249, 115, 22)',
                        'rgb(234, 179, 8)',
                        'rgb(34, 197, 94)',
                        'rgb(21, 128, 61)'
                    ]
                }]
            }
        });
    }
}

async function loadAnalytics() {
    try {
        const response = await fetch('/admin/api/analytics');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        updateCharts(data);
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function updateCharts(analyticsData) {
    // Update revenue chart
    if (charts.revenue && analyticsData.revenue) {
        charts.revenue.data.labels = analyticsData.revenue.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        charts.revenue.data.datasets[0].data = analyticsData.revenue.map(item => item.revenue);
        charts.revenue.update();
    }
    
    // Update rides per hour chart
    if (charts.rides && analyticsData.rides) {
        charts.rides.data.labels = analyticsData.rides.map(item => {
            const hour = item.hour;
            return hour === 0 ? '12 AM' : 
                   hour < 12 ? `${hour} AM` : 
                   hour === 12 ? '12 PM' : `${hour - 12} PM`;
        });
        charts.rides.data.datasets[0].data = analyticsData.rides.map(item => item.count);
        charts.rides.update();
    }
    
    // Update driver status chart
    if (charts.driver && analyticsData.drivers) {
        charts.driver.data.labels = analyticsData.drivers.map(item => item._id || 'Unknown');
        charts.driver.data.datasets[0].data = analyticsData.drivers.map(item => item.count);
        charts.driver.update();
    }
    
    // Update feedback chart
    if (charts.feedback && analyticsData.feedback) {
        const feedbackCounts = [0, 0, 0, 0, 0];
        analyticsData.feedback.forEach(item => {
            if (item.rating >= 1 && item.rating <= 5) {
                feedbackCounts[item.rating - 1] = item.count;
            }
        });
        charts.feedback.data.datasets[0].data = feedbackCounts;
        charts.feedback.update();
    }
}

function showMessage(message, type) {
    // Create a simple message display
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = '#10b981';
    } else {
        messageDiv.style.background = '#ef4444';
    }
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/logout';
    }
}