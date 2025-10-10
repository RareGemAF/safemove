// === DEMO DRIVERS (for testing) ===
document.addEventListener("DOMContentLoaded", () => {
if (!localStorage.getItem("drivers")) {
  const demoDrivers = [
    {
      name: "John",
      email: "john@demo.com",
      phone: "+256700000001",
      permit: "U1234567",
      vehicle: "car",
      online: true
    },
    {
      name: "Mary",
      email: "mary@demo.com",
      phone: "+256700000002",
      permit: "U7654321",
      vehicle: "boda",
      online: true
    }
  ];
  localStorage.setItem("drivers", JSON.stringify(demoDrivers));
}
// === AUTO SIMULATION OF DRIVER STATUS ===
setInterval(() => {
  let drivers = JSON.parse(localStorage.getItem("drivers") || "[]");
  // Randomly toggle a few driver statuses
  drivers.forEach(driver => {
    // 50% chance to flip status
    if (Math.random() < 0.5) driver.online = !driver.online;
  });
  localStorage.setItem("drivers", JSON.stringify(drivers));

  // Notify any open rider pages about status change
  localStorage.setItem("driverStatusUpdate", Date.now());
}, 15000); // every 15 seconds


  /*** =================== DATA =================== ***/
  let riders = JSON.parse(localStorage.getItem("riders") || "[]");
  let drivers = JSON.parse(localStorage.getItem("drivers") || "[]");

  if (drivers.length === 0) {
    drivers = [
      { name: "John", vehicle: "car", online: false },
      { name: "Mary", vehicle: "boda", online: false },
      { name: "David", vehicle: "car", online: false },
      { name: "Grace", vehicle: "boda", online: false }
    ];
    localStorage.setItem("drivers", JSON.stringify(drivers));
  }

  /*** =================== HELPER FUNCTIONS =================== ***/
  function generateCode() {
    return Math.floor(1000 + Math.random() * 9000); // 4-digit code
  }

  function addToLocalStorageArray(key, value) {
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.push(value);
    localStorage.setItem(key, JSON.stringify(arr));
  }

  function loadAdminData() {
    const sosAlerts = JSON.parse(localStorage.getItem("sosAlerts") || "[]");
    const reports = JSON.parse(localStorage.getItem("incidentReports") || "[]");
    const feedbacks = JSON.parse(localStorage.getItem("userFeedbacks") || "[]");

    if (document.getElementById("sosList"))
      document.getElementById("sosList").innerHTML = sosAlerts.length
        ? sosAlerts.map(s => `<li>${s}</li>`).join("")
        : "<li class='empty'>No SOS alerts yet.</li>";

    if (document.getElementById("reportList"))
      document.getElementById("reportList").innerHTML = reports.length
        ? reports.map(r => `<li>${r}</li>`).join("")
        : "<li class='empty'>No incident reports yet.</li>";

    if (document.getElementById("feedbackList"))
      document.getElementById("feedbackList").innerHTML = feedbacks.length
        ? feedbacks.map(f => `<li>${f}</li>`).join("")
        : "<li class='empty'>No feedback yet.</li>";
  }

  function showRiderDashboard(rider) {
    document.getElementById("riderRegistration").classList.add("hidden");
    document.getElementById("riderLogin").classList.add("hidden");
    document.getElementById("riderDashboard").classList.remove("hidden");
    document.querySelector("#riderDashboard h2").textContent = `Welcome, ${rider.name} 🧍‍♀️`;
  }

  function showDriverDashboard(driver) {
    document.getElementById("driverRegistration").classList.add("hidden");
    document.getElementById("driverLogin").classList.add("hidden");
    document.getElementById("driverDashboard").classList.remove("hidden");
    document.getElementById("driverStatus").textContent = driver.online ? "Online" : "Offline";
    document.getElementById("toggleStatus").dataset.driver = driver.name;
    document.getElementById("toggleStatus").textContent = driver.online ? "Go Offline" : "Go Online";
  }

  /*** =================== RIDER =================== ***/
  if (document.getElementById("showLogin")) {
    document.getElementById("showLogin").addEventListener("click", () => {
      document.getElementById("riderRegistration").classList.add("hidden");
      document.getElementById("riderLogin").classList.remove("hidden");
    });
  }

  if (document.getElementById("showRegister")) {
    document.getElementById("showRegister").addEventListener("click", () => {
      document.getElementById("riderLogin").classList.add("hidden");
      document.getElementById("riderRegistration").classList.remove("hidden");
    });
  }

  if (document.getElementById("registerRider")) {
    document.getElementById("registerRider").addEventListener("click", () => {
      const name = document.getElementById("riderName").value.trim();
      const email = document.getElementById("riderEmail").value.trim();
      const phone = document.getElementById("riderPhone").value.trim();
      if (!name || !email || !phone) return alert("Please fill all fields.");
      if (riders.find(r => r.phone === phone)) return alert("Phone already registered.");
      const code = generateCode();
      riders.push({ name, email, phone, code });
      localStorage.setItem("riders", JSON.stringify(riders));
      alert(`Registered! Your code: ${code}`);
      document.getElementById("riderRegistration").classList.add("hidden");
      document.getElementById("riderLogin").classList.remove("hidden");
      document.getElementById("riderLoginPhone").value = phone;
      document.getElementById("riderLoginCode").value = "";
    });
  }

  if (document.getElementById("loginRider")) {
    document.getElementById("loginRider").addEventListener("click", () => {
      const phone = document.getElementById("riderLoginPhone").value.trim();
      const code = document.getElementById("riderLoginCode").value.trim();
      const rider = riders.find(r => r.phone === phone && r.code == code);
      if (!rider) return alert("Invalid phone or code.");
      showRiderDashboard(rider);
    });
  }

  if (document.getElementById("requestRideBtn")) {
    document.getElementById("requestRideBtn").addEventListener("click", () => {
      const vehicle = document.getElementById("vehicleType").value;
      drivers = JSON.parse(localStorage.getItem("drivers") || "[]");
      const availableDriver = drivers.find(d => d.vehicle === vehicle && d.online);
      if (!availableDriver) {
        document.getElementById("rideStatus").textContent = `No ${vehicle} drivers online.`;
        return;
      }
      const ride = { driver: availableDriver.name, vehicle: availableDriver.vehicle, status: "assigned", rider: "You" };
      localStorage.setItem("currentRide", JSON.stringify(ride));
      document.getElementById("rideStatus").textContent = `Driver ${availableDriver.name} (${availableDriver.vehicle}) is on the way!`;
    });
  }

  if (document.getElementById("sosBtn")) {
    document.getElementById("sosBtn").addEventListener("click", () => {
      const sos = `🚨 Rider SOS at ${new Date().toLocaleTimeString()}`;
      addToLocalStorageArray("sosAlerts", sos);
      alert("✅ SOS sent!");
    });
  }

  if (document.getElementById("submitReport")) {
    document.getElementById("submitReport").addEventListener("click", () => {
      const text = document.getElementById("reportInput").value.trim();
      if (!text) return alert("Enter incident description.");
      addToLocalStorageArray("incidentReports", text);
      document.getElementById("reportInput").value = "";
      alert("✅ Report submitted!");
    });
  }

  if (document.getElementById("submitFeedback")) {
    document.getElementById("submitFeedback").addEventListener("click", () => {
      const text = document.getElementById("feedbackInput").value.trim();
      if (!text) return alert("Enter feedback.");
      addToLocalStorageArray("userFeedbacks", text);
      document.getElementById("feedbackInput").value = "";
      alert("🌟 Feedback submitted!");
    });
  }

  /*** =================== DRIVER =================== ***/
  if (document.getElementById("showDriverLogin")) {
    document.getElementById("showDriverLogin").addEventListener("click", () => {
      document.getElementById("driverRegistration").classList.add("hidden");
      document.getElementById("driverLogin").classList.remove("hidden");
    });
  }

  if (document.getElementById("showDriverRegister")) {
    document.getElementById("showDriverRegister").addEventListener("click", () => {
      document.getElementById("driverLogin").classList.add("hidden");
      document.getElementById("driverRegistration").classList.remove("hidden");
    });
  }

  if (document.getElementById("registerDriver")) {
    document.getElementById("registerDriver").addEventListener("click", () => {
      const name = document.getElementById("driverName").value.trim();
      const email = document.getElementById("driverEmail").value.trim();
      const phone = document.getElementById("driverPhone").value.trim();
      const permit = document.getElementById("driverPermit").value.trim();
      if (!name || !email || !phone || !permit) return alert("Fill all fields.");
      const code = generateCode();
      drivers.push({ name, email, phone, permit, code, online: false });
      localStorage.setItem("drivers", JSON.stringify(drivers));
      alert(`Registered! Your code: ${code}`);
      document.getElementById("driverRegistration").classList.add("hidden");
      document.getElementById("driverLogin").classList.remove("hidden");
    });
  }

  if (document.getElementById("loginDriver")) {
    document.getElementById("loginDriver").addEventListener("click", () => {
      const phone = document.getElementById("driverLoginPhone").value.trim();
      const code = document.getElementById("driverLoginCode").value.trim();
      const driver = drivers.find(d => d.phone === phone && d.code == code);
      if (!driver) return alert("Invalid phone or code.");
      showDriverDashboard(driver);
    });
  }

  if (document.getElementById("toggleStatus")) {
    document.getElementById("toggleStatus").addEventListener("click", () => {
      const driverName = document.getElementById("toggleStatus").dataset.driver;
      drivers = JSON.parse(localStorage.getItem("drivers") || "[]");
      const driver = drivers.find(d => d.name === driverName);
      if (!driver) return;
      driver.online = !driver.online;
      showDriverDashboard(driver);
      localStorage.setItem("drivers", JSON.stringify(drivers));
    });
  }

  if (document.getElementById("startRideBtn")) {
    document.getElementById("startRideBtn").addEventListener("click", () => {
      const ride = JSON.parse(localStorage.getItem("currentRide") || "null");
      if (!ride) return alert("No ride assigned.");
      document.getElementById("driverTripStatus").classList.remove("hidden");
      document.getElementById("driverLocation").textContent = `Trip started with ${ride.vehicle} for ${ride.rider}`;
      ride.status = "in progress";
      localStorage.setItem("currentRide", JSON.stringify(ride));
    });
  }

  if (document.getElementById("endRideBtn")) {
    document.getElementById("endRideBtn").addEventListener("click", () => {
      const ride = JSON.parse(localStorage.getItem("currentRide") || "null");
      if (!ride) return alert("No ride in progress.");
      ride.status = "completed";
      localStorage.setItem("currentRide", JSON.stringify(ride));
      document.getElementById("driverTripStatus").classList.add("hidden");
      alert("✅ Ride completed!");
    });
  }

  if (document.getElementById("driverSOS")) {
    document.getElementById("driverSOS").addEventListener("click", () => {
      const sos = `🚨 Driver SOS at ${new Date().toLocaleTimeString()}`;
      addToLocalStorageArray("sosAlerts", sos);
      alert("✅ SOS sent!");
    });
  }

  /*** =================== ADMIN =================== ***/
  if (document.getElementById("loginAdmin")) {
    document.getElementById("loginAdmin").addEventListener("click", () => {
      const username = document.getElementById("adminUsername").value.trim();
      const password = document.getElementById("adminPassword").value.trim();
      if (username === "admin" && password === "admin123") {
        document.getElementById("adminLogin").classList.add("hidden");
        document.getElementById("adminDashboard").classList.remove("hidden");
        loadAdminData();
      } else alert("Invalid credentials.");
    });
  }

  if (document.getElementById("clearData")) {
    document.getElementById("clearData").addEventListener("click", () => {
      localStorage.clear();
      alert("All data cleared!");
      location.reload();
    });
  }

});





// === DRIVER ONLINE/OFFLINE TOGGLE ===
const toggleStatusBtn = document.getElementById("toggleStatus");
const driverStatus = document.getElementById("driverStatus");

if (toggleStatusBtn) {
  toggleStatusBtn.addEventListener("click", () => {
    const loggedInDriver = JSON.parse(localStorage.getItem("loggedInDriver"));

    if (!loggedInDriver) {
      alert("Please log in first before going online.");
      return;
    }

    // Toggle driver status
    loggedInDriver.online = !loggedInDriver.online;
    driverStatus.textContent = loggedInDriver.online ? "🟢 Online" : "🔴 Offline";
    toggleStatusBtn.textContent = loggedInDriver.online ? "Go Offline" : "Go Online";

    // Update driver record in localStorage
    let drivers = JSON.parse(localStorage.getItem("drivers")) || [];
    const index = drivers.findIndex(d => d.email === loggedInDriver.email);

    if (index !== -1) {
      drivers[index].online = loggedInDriver.online;
      localStorage.setItem("drivers", JSON.stringify(drivers));
    }

    localStorage.setItem("loggedInDriver", JSON.stringify(loggedInDriver));

    alert(loggedInDriver.online
      ? "✅ You are now ONLINE and visible to riders."
      : "🚗 You are now OFFLINE.");
  });
}


const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});



/*** === RIDE ASSIGNMENT AND STATUS === ***/

// When a rider requests a ride
if (document.getElementById("requestRideBtn")) {
  document.getElementById("requestRideBtn").addEventListener("click", () => {
    const pickup = document.getElementById("pickupLocation").value.trim();
    const dropoff = document.getElementById("dropoffLocation").value.trim();
    const vehicleType = document.getElementById("vehicleType").value;

    if (!pickup || !dropoff) {
      alert("Please enter both pickup and drop-off locations.");
      return;
    }

    // Get available drivers
    const drivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    const availableDriver = drivers.find(d => d.vehicle === vehicleType && d.online);

    if (!availableDriver) {
      alert(`No ${vehicleType} drivers available at the moment.`);
      return;
    }

const rideRequest = {
  id: Date.now(),
  riderName: rider.name,
  pickup,
  dropoff,
  fare: fare,
  driverId: assignedDriver.id,
  driverName: assignedDriver.name,
  status: "assigned" // new
};

localStorage.setItem("assignedRide", JSON.stringify(rideRequest));

    const ride = {
      rider: localStorage.getItem("loggedInRider"),
      driver: availableDriver.name,
      pickup,
      dropoff,
      vehicle: vehicleType,
      status: "assigned"
    };

    localStorage.setItem("activeRide", JSON.stringify(ride));
    alert(`✅ Ride assigned to ${availableDriver.name}!`);

    // Notify both dashboards
    localStorage.setItem("rideUpdate", Date.now());
  });
}

// Show ride details on Rider Dashboard
if (document.getElementById("rideDetails")) {
  function loadRiderRide() {
    const ride = JSON.parse(localStorage.getItem("activeRide") || "null");
    if (!ride || ride.status === "ended") return;

    document.getElementById("ridePickup").textContent = ride.pickup;
    document.getElementById("rideDropoff").textContent = ride.dropoff;
    document.getElementById("assignedDriver").textContent = ride.driver;
    document.getElementById("rideDetails").classList.remove("hidden");
  }
  loadRiderRide();

  window.addEventListener("storage", e => {
    if (e.key === "rideUpdate") loadRiderRide();
  });
}

// Show assigned ride on Driver Dashboard
if (document.getElementById("rideAssignments")) {
  function loadDriverRide() {
    const ride = JSON.parse(localStorage.getItem("activeRide") || "null");
    if (!ride || ride.status === "ended") return;

    const driverName = localStorage.getItem("loggedInDriver");
    if (ride.driver !== driverName) return;

    document.getElementById("driverPickup").textContent = ride.pickup;
    document.getElementById("driverDropoff").textContent = ride.dropoff;
    document.getElementById("ridePassenger").textContent = ride.rider;
    document.getElementById("rideAssignments").classList.remove("hidden");
  }
  loadDriverRide();

  window.addEventListener("storage", e => {
    if (e.key === "rideUpdate") loadDriverRide();
  });
}

// Driver starts and ends ride
const startBtn = document.getElementById("driverStartRideBtn");
const endBtn = document.getElementById("driverEndRideBtn");

if (startBtn) {
  startBtn.addEventListener("click", () => {
    const ride = JSON.parse(localStorage.getItem("activeRide"));
    if (!ride) return;
    ride.status = "in-progress";
    localStorage.setItem("assignedRide", JSON.stringify(ride));
    startFareTracker();
startMapSimulation();
    localStorage.setItem("rideUpdate", Date.now());
    alert("🚘 Ride started!");
    startBtn.classList.add("hidden");
    endBtn.classList.remove("hidden");
  });
}

if (endBtn) {
  endBtn.addEventListener("click", () => {
    const ride = JSON.parse(localStorage.getItem("activeRide"));
    if (!ride) return;
    ride.status = "ended";
    localStorage.setItem("assignedRide", JSON.stringify(ride));
    stopFareTracker();
    localStorage.setItem("rideUpdate", Date.now());
    alert("✅ Ride ended successfully!");
    endBtn.classList.add("hidden");
  });
}

const rideAssignments = document.getElementById("rideAssignments");
const driverPickup = document.getElementById("driverPickup");
const driverDropoff = document.getElementById("driverDropoff");
const ridePassenger = document.getElementById("ridePassenger");
const driverStartRideBtn = document.getElementById("driverStartRideBtn");
const driverEndRideBtn = document.getElementById("driverEndRideBtn");
const driverTripStatus = document.getElementById("driverTripStatus");
const driverLocation = document.getElementById("driverLocation");
const mapSimulation = document.getElementById("mapSimulation");

function loadAssignedRide() {
  const ride = JSON.parse(localStorage.getItem("currentRide") || "null");
  if (!ride) {
    rideAssignments.classList.add("hidden");
    return;
  }
  rideAssignments.classList.remove("hidden");
  driverPickup.textContent = ride.pickup || "Unknown";
  driverDropoff.textContent = ride.dropoff || "Unknown";
  ridePassenger.textContent = ride.rider || "Unknown";

  if (ride.status === "in progress") {
    driverStartRideBtn.classList.add("hidden");
    driverEndRideBtn.classList.remove("hidden");
    driverTripStatus.classList.remove("hidden");
    driverLocation.textContent = `Trip started with ${ride.vehicle} for ${ride.rider}`;
  } else {
    driverStartRideBtn.classList.remove("hidden");
    driverEndRideBtn.classList.add("hidden");
    driverTripStatus.classList.add("hidden");
  }
}

if (driverStartRideBtn) {
  driverStartRideBtn.addEventListener("click", () => {
    const ride = JSON.parse(localStorage.getItem("currentRide") || "null");
    if (!ride) return alert("No ride assigned.");
    ride.status = "in progress";
    localStorage.setItem("currentRide", JSON.stringify(ride));

    driverStartRideBtn.classList.add("hidden");
    driverEndRideBtn.classList.remove("hidden");
    driverTripStatus.classList.remove("hidden");
    driverLocation.textContent = `Trip started with ${ride.vehicle} for ${ride.rider}`;
    simulateMapRoute();
  });
}

if (driverEndRideBtn) {
  driverEndRideBtn.addEventListener("click", () => {
    const ride = JSON.parse(localStorage.getItem("currentRide") || "null");
    if (!ride) return alert("No ride in progress.");
    ride.status = "completed";
    localStorage.setItem("currentRide", JSON.stringify(ride));

    driverStartRideBtn.classList.remove("hidden");
    driverEndRideBtn.classList.add("hidden");
    driverTripStatus.classList.add("hidden");
    alert("✅ Ride completed!");
  });
}

// Simple Map Simulation
function simulateMapRoute() {
  let progress = 0;
  mapSimulation.textContent = "Driving...";
  const interval = setInterval(() => {
    progress += 10;
    mapSimulation.textContent = `Trip progress: ${progress}%`;
    if (progress >= 100) {
      clearInterval(interval);
      mapSimulation.textContent = "Arrived at drop-off! 🏁";
    }
  }, 1000);
}

// Load assigned ride on page load
loadAssignedRide();



/*** === LIVE RIDE STATUS SYNC === ***/
function syncRideStatus() {
  const ride = JSON.parse(localStorage.getItem("activeRide") || "null");
  if (!ride) return;

  // Rider side update
  const rideStatusText = document.getElementById("rideStatusText");
  if (rideStatusText) {
    if (ride.status === "assigned") rideStatusText.textContent = "Driver on the way 🚗";
    else if (ride.status === "in-progress") rideStatusText.textContent = "Ride in progress ⏱️";
    else if (ride.status === "ended") rideStatusText.textContent = "Ride completed ✅";
  }

  // Driver side update
  const startBtn = document.getElementById("driverStartRideBtn");
  const endBtn = document.getElementById("driverEndRideBtn");
  if (startBtn && endBtn) {
    if (ride.status === "assigned") {
      startBtn.classList.remove("hidden");
      endBtn.classList.add("hidden");
    } else if (ride.status === "in-progress") {
      startBtn.classList.add("hidden");
      endBtn.classList.remove("hidden");
    } else if (ride.status === "ended") {
      startBtn.classList.add("hidden");
      endBtn.classList.add("hidden");
    }
  }
}

// Live listen to localStorage changes
window.addEventListener("storage", e => {
  if (e.key === "rideUpdate" || e.key === "activeRide") {
    syncRideStatus();
  }
});

// Run once on page load
document.addEventListener("DOMContentLoaded", syncRideStatus);




// ==================== RIDE SYNC SYSTEM ====================

function syncRideStatus() {
  const ride = JSON.parse(localStorage.getItem("assignedRide"));
  const currentPage = window.location.pathname;

  if (!ride) return;

  // === Rider Side ===
  if (currentPage.includes("rider.html")) {
    const status = document.getElementById("rideStatusText");
    if (!status) return;

    if (ride.status === "assigned") status.textContent = "🚗 Driver is coming...";
    if (ride.status === "in-progress") status.textContent = "🚘 Ride in progress...";
    if (ride.status === "completed") status.textContent = "✅ Ride completed. Thank you!";
  }

  // === Driver Side ===
  if (currentPage.includes("driver.html")) {
    const status = document.getElementById("status");
    if (!status) return;

    if (ride.status === "assigned") status.textContent = "✅ New Ride Assigned!";
    if (ride.status === "in-progress") status.textContent = "🚘 Ride in Progress...";
    if (ride.status === "completed") {
      status.textContent = "🏁 Ride Completed!";
      localStorage.removeItem("assignedRide");
      setTimeout(() => {
        status.textContent = "🚗 Waiting for ride requests...";
      }, 3000);
    }
  }
}

// Keep both sides synced every 2 seconds
setInterval(syncRideStatus, 2000);


// ================== MAP SIMULATION ==================
function startMapSimulation() {
  const map = document.getElementById("rideMap");
  const dot = document.getElementById("vehicleDot");
  const label = document.getElementById("mapLabel");
  if (!map || !dot) return;

  map.classList.remove("hidden");
  label.textContent = "🚗 Ride in progress...";

  // Animate the dot moving
  dot.style.animation = "moveDot 12s linear forwards";

  // After a few seconds, finish ride
  setTimeout(() => {
    label.textContent = "✅ Ride completed!";
    dot.style.background = "green";
  }, 12000);
}

// Trigger animation when ride starts
setInterval(() => {
  const ride = JSON.parse(localStorage.getItem("assignedRide"));
  if (!ride) return;

  if (ride.status === "in-progress") startMapSimulation();
}, 2000);




// ================== LIVE FARE TRACKER ==================
let fareInterval;
let currentFare = 0;

function startFareTracker() {
  const fareDisplay = document.getElementById("fareAmount");
  if (!fareDisplay) return;

  currentFare = 1000; // starting fare
  fareDisplay.textContent = currentFare.toLocaleString();

  fareInterval = setInterval(() => {
    currentFare += Math.floor(Math.random() * 200) + 100; // add UGX 100–300 every few seconds
    fareDisplay.textContent = currentFare.toLocaleString();
  }, 2000);
}

function stopFareTracker() {
  clearInterval(fareInterval);
  const fareDisplay = document.getElementById("fareAmount");
  if (fareDisplay) {
    fareDisplay.textContent = currentFare.toLocaleString() + " (Final)";
  }
}