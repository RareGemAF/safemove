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