// Sidebar Navigation Control
const navDashboard = document.getElementById('navDashboard');
const navIncidents = document.getElementById('navIncidents');
const navUsers = document.getElementById('navUsers');
const navAnalytics = document.getElementById('navAnalytics');

const sections = {
  adminDashboard: document.getElementById('adminDashboard'),
  adminIncidents: document.getElementById('adminIncidents'),
  adminUsers: document.getElementById('adminUsers'),
  adminAnalytics: document.getElementById('adminAnalytics'),
};

function showSection(sectionId) {
  Object.keys(sections).forEach(id => {
    sections[id].classList.add('hidden');
  });
  sections[sectionId].classList.remove('hidden');

  // Update sidebar active state
  document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));
  document.querySelector(`#nav${sectionId.replace('admin', '')}`).classList.add('active');
}

// Add event listeners
navDashboard.addEventListener('click', () => showSection('adminDashboard'));
navIncidents.addEventListener('click', () => showSection('adminIncidents'));
navUsers.addEventListener('click', () => showSection('adminUsers'));
navAnalytics.addEventListener('click', () => showSection('adminAnalytics'));

// Logout Function
function logout() {
  alert('Logging out...');
  window.location.href = '/login.html';
}
// Import Chart.js from CDN dynamically
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/chart.js";
document.head.appendChild(script);

script.onload = () => {
  const ctx = document.getElementById('passengerChart').getContext('2d');
  const passengerChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Passengers per Day',
        data: [120, 180, 150, 200, 250, 300, 280],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // Handle filter dropdown
  document.getElementById('filterPeriod').addEventListener('change', (e) => {
    const period = e.target.value;
    if (period === 'week') {
      passengerChart.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      passengerChart.data.datasets[0].data = [800, 950, 1100, 1200];
    } else if (period === 'month') {
      passengerChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      passengerChart.data.datasets[0].data = [3000, 3400, 3200, 3600, 4000];
    } else {
      passengerChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      passengerChart.data.datasets[0].data = [120, 180, 150, 200, 250, 300, 280];
    }
    passengerChart.update();
  });
};
 const incidentFilter = document.getElementById('incidentFilter');
  const incidentTable = document.getElementById('incidentTable').getElementsByTagName('tbody')[0];

  incidentFilter.addEventListener('change', () => {
    const filterValue = incidentFilter.value;

    for (let row of incidentTable.rows) {
      const severity = row.getAttribute('data-severity');
      if (filterValue === 'all' || severity === filterValue) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  });

  

// ===== Revenue Bar Chart =====
const revenueCtx = document.getElementById('revenueChart').getContext('2d');
const revenueChart = new Chart(revenueCtx, {
    type: 'bar',
    data: {
        labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets: [{
            label: 'Revenue (UGX)',
            data: [8500000, 9200000, 7800000, 10000000, 9700000, 11000000, 10500000],
            backgroundColor: '#10b981'
        }]
    },
    options: { responsive: true }
});

// ===== Driver Status Pie Chart =====
const driverCtx = document.getElementById('driverChart').getContext('2d');
const driverChart = new Chart(driverCtx, {
    type: 'pie',
    data: {
        labels: ['Onboarded', 'Left'],
        datasets: [{
            label: 'Drivers',
            data: [45, 5],
            backgroundColor: ['#2563eb', '#ef4444']
        }]
    },
    options: { responsive: true }
});

// ===== Rides per Hour Line Chart =====
const ridesCtx = document.getElementById('ridesChart').getContext('2d');
const ridesChart = new Chart(ridesCtx, {
    type: 'line',
    data: {
        labels: ['6AM','8AM','10AM','12PM','2PM','4PM','6PM','8PM'],
        datasets: [{
            label: 'Rides per Hour',
            data: [5, 15, 25, 20, 30, 35, 25, 15],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.2)',
            fill: true,
            tension: 0.3
        }]
    },
    options: { responsive: true }
});

// ===== Passenger Feedback Doughnut Chart =====
const feedbackCtx = document.getElementById('feedbackChart').getContext('2d');
const feedbackChart = new Chart(feedbackCtx, {
    type: 'doughnut',
    data: {
        labels: ['Positive','Neutral','Negative'],
        datasets: [{
            label: 'Feedback',
            data: [120, 30, 15],
            backgroundColor: ['#10b981','#fbbf24','#ef4444']
        }]
    },
    options: { responsive: true }
});
