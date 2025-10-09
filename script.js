document.addEventListener("DOMContentLoaded", () => {
  // --- RIDER ELEMENTS ---
  const submitReport = document.getElementById("submitReport");
  const reportInput = document.getElementById("reportInput");
  const submitFeedback = document.getElementById("submitFeedback");
  const feedbackInput = document.getElementById("feedbackInput");
  const requestRideBtn = document.getElementById("requestRide");
  const sosRiderBtn = document.getElementById("sosRider");

  // --- DRIVER ELEMENTS ---
  const startShiftBtn = document.getElementById("startShift");
  const endShiftBtn = document.getElementById("endShift");
  const acceptRideBtn = document.getElementById("acceptRide");
  const sosDriverBtn = document.getElementById("sosDriver");
  const healthCheckBtn = document.getElementById("healthCheck");
  const trainingBtn = document.getElementById("training");

  // --- ADMIN ELEMENTS ---
  const incidentList = document.getElementById("incidentList");
  const feedbackList = document.getElementById("feedbackList");
  const clearData = document.getElementById("clearData");

  // ------------------- RIDER LOGIC -------------------
  if (submitReport) {
    submitReport.addEventListener("click", () => {
      const text = reportInput.value.trim();
      if (!text) return alert("Please describe the incident before submitting.");
      
      const reports = JSON.parse(localStorage.getItem("incidentReports") || "[]");
      reports.push(text);
      localStorage.setItem("incidentReports", JSON.stringify(reports));

      reportInput.value = "";
      alert("✅ Incident report submitted successfully!");
    });
  }

  if (submitFeedback) {
    submitFeedback.addEventListener("click", () => {
      const text = feedbackInput.value.trim();
      if (!text) return alert("Please enter your feedback first.");
      
      const feedbacks = JSON.parse(localStorage.getItem("userFeedbacks") || "[]");
      feedbacks.push(text);
      localStorage.setItem("userFeedbacks", JSON.stringify(feedbacks));

      feedbackInput.value = "";
      alert("🌟 Thank you for your feedback!");
    });
  }

  if (requestRideBtn) {
    requestRideBtn.addEventListener("click", () => {
      alert("🚗 Ride Requested! Searching for available drivers...");
      setTimeout(() => alert("✅ Driver Assigned! Driver is on the way."), 2000);
      setTimeout(() => alert("📍 Driver has arrived at your location."), 4000);
      setTimeout(() => alert("🏁 Ride Completed. Thank you for using SafeMove!"), 6000);
    });
  }

  if (sosRiderBtn) {
    sosRiderBtn.addEventListener("click", () => {
      alert("🚨 SOS Activated! Alert sent to nearest authorities and driver.");
    });
  }

  // ------------------- DRIVER LOGIC -------------------
  if (startShiftBtn) {
    startShiftBtn.addEventListener("click", () => {
      alert("🟢 Shift started. You are now available for rides.");
    });
  }

  if (endShiftBtn) {
    endShiftBtn.addEventListener("click", () => {
      alert("🔴 Shift ended. You are now offline.");
    });
  }

  if (acceptRideBtn) {
    acceptRideBtn.addEventListener("click", () => {
      const mockRider = "Rider: Favour K., Pickup: 10 Kampala Road";
      alert(`✅ Ride Accepted!\n${mockRider}`);
      setTimeout(() => alert("📍 Rider picked up. Drive safely!"), 2000);
      setTimeout(() => alert("🏁 Ride completed."), 4000);
    });
  }

  if (sosDriverBtn) {
    sosDriverBtn.addEventListener("click", () => {
      alert("🚨 SOS Activated! Alert sent to nearest authorities and admin.");
    });
  }

  if (healthCheckBtn) {
    healthCheckBtn.addEventListener("click", () => {
      alert("💊 Health Check: Please ensure you are fit to drive. ✅ Passed");
    });
  }

  if (trainingBtn) {
    trainingBtn.addEventListener("click", () => {
      alert("📚 Safety Training Completed! Remember: Drive safely & follow traffic rules.");
    });
  }

  // ------------------- ADMIN LOGIC -------------------
  function loadData() {
    if (!incidentList || !feedbackList) return;

    const reports = JSON.parse(localStorage.getItem("incidentReports") || "[]");
    const feedbacks = JSON.parse(localStorage.getItem("userFeedbacks") || "[]");

    // Display Reports
    incidentList.innerHTML = reports.length
      ? reports.map((r) => `<li>${r}</li>`).join("")
      : `<li class="empty">No incident reports submitted yet.</li>`;

    // Display Feedback
    feedbackList.innerHTML = feedbacks.length
      ? feedbacks.map((f) => `<li>${f}</li>`).join("")
      : `<li class="empty">No user feedback yet.</li>`;
  }

  if (clearData) {
    clearData.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all stored data?")) {
        localStorage.removeItem("incidentReports");
        localStorage.removeItem("userFeedbacks");
        loadData();
      }
    });
  }

  // Load data on admin page open
  loadData();
});




document.addEventListener("DOMContentLoaded", () => {

  const registrationBox = document.getElementById("riderRegistration");
  const loginBox = document.getElementById("riderLogin");
  const dashboard = document.getElementById("riderDashboard");

  // Toggle forms
  document.getElementById("showLogin").addEventListener("click", () => {
    registrationBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
  });
  document.getElementById("showRegister").addEventListener("click", () => {
    loginBox.classList.add("hidden");
    registrationBox.classList.remove("hidden");
  });

  /* ---------- Rider Registration ---------- */
  document.getElementById("registerRider").addEventListener("click", () => {
    const name = document.getElementById("riderName").value.trim();
    const email = document.getElementById("riderEmail").value.trim();
    const phone = document.getElementById("riderPhone").value.trim();
    if (!name || !email || !phone) return alert("Please fill in all fields.");

    const code = Math.floor(1000 + Math.random() * 9000);
    alert(`Your verification code: ${code}`);

    let riders = JSON.parse(localStorage.getItem("riders") || "[]");
    riders.push({ name, email, phone, code });
    localStorage.setItem("riders", JSON.stringify(riders));

    alert("✅ Registration successful! You can now log in.");
    registrationBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
  });

  /* ---------- Rider Login ---------- */
  document.getElementById("loginRider").addEventListener("click", () => {
    const phone = document.getElementById("riderLoginPhone").value.trim();
    const code = document.getElementById("riderLoginCode").value.trim();

    let riders = JSON.parse(localStorage.getItem("riders") || "[]");
    const user = riders.find(r => r.phone === phone && r.code == code);

    if (user) {
      alert(`Welcome back, ${user.name}!`);
      loginBox.classList.add("hidden");
      dashboard.classList.remove("hidden");
    } else {
      alert("❌ Invalid phone number or code.");
    }
  });

  /* ---------- Dashboard Logic ---------- */
  // SOS
  const sosBtn = document.getElementById("sosBtn");
  if(sosBtn) sosBtn.addEventListener("click", () => alert("🚨 SOS Activated! Authorities notified."));

  // Report & Feedback
  const submitReport = document.getElementById("submitReport");
  const reportInput = document.getElementById("reportInput");
  const submitFeedback = document.getElementById("submitFeedback");
  const feedbackInput = document.getElementById("feedbackInput");

  if (submitReport) {
    submitReport.addEventListener("click", () => {
      const text = reportInput.value.trim();
      if (!text) return alert("Please describe the incident before submitting.");
      const reports = JSON.parse(localStorage.getItem("incidentReports") || "[]");
      reports.push(text);
      localStorage.setItem("incidentReports", JSON.stringify(reports));
      reportInput.value = "";
      alert("✅ Incident report submitted successfully!");
    });
  }

  if (submitFeedback) {
    submitFeedback.addEventListener("click", () => {
      const text = feedbackInput.value.trim();
      if (!text) return alert("Please enter your feedback first.");
      const feedbacks = JSON.parse(localStorage.getItem("userFeedbacks") || "[]");
      feedbacks.push(text);
      localStorage.setItem("userFeedbacks", JSON.stringify(feedbacks));
      feedbackInput.value = "";
      alert("🌟 Thank you for your feedback!");
    });
  }

  // Trip Simulation
  const startTripBtn = document.getElementById("startTripBtn");
  const endTripBtn = document.getElementById("endTripBtn");
  const riderLocation = document.getElementById("riderLocation");

  if(startTripBtn) startTripBtn.addEventListener("click", () => {
    riderLocation.textContent = "🟢 Trip started. Tracking location...";
    startTripBtn.classList.add("hidden");
    endTripBtn.classList.remove("hidden");
  });

  if(endTripBtn) endTripBtn.addEventListener("click", () => {
    riderLocation.textContent = "Trip ended. Thank you for riding safely!";
    endTripBtn.classList.add("hidden");
    startTripBtn.classList.remove("hidden");
  });

});




document.addEventListener("DOMContentLoaded", () => {

  /* ---------- DRIVER REGISTRATION & LOGIN ---------- */
  const driverRegistration = document.getElementById("driverRegistration");
  const driverLogin = document.getElementById("driverLogin");
  const driverDashboard = document.getElementById("driverDashboard");

  document.getElementById("showDriverLogin").addEventListener("click", () => {
    driverRegistration.classList.add("hidden");
    driverLogin.classList.remove("hidden");
  });

  document.getElementById("showDriverRegister").addEventListener("click", () => {
    driverLogin.classList.add("hidden");
    driverRegistration.classList.remove("hidden");
  });

  document.getElementById("registerDriver").addEventListener("click", () => {
    const name = document.getElementById("driverName").value.trim();
    const email = document.getElementById("driverEmail").value.trim();
    const phone = document.getElementById("driverPhone").value.trim();
    const permit = document.getElementById("driverPermit").value.trim();
    if (!name || !email || !phone || !permit) return alert("Please fill in all fields.");

    const code = Math.floor(1000 + Math.random() * 9000);
    alert(`Your verification code: ${code}`);

    let drivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    drivers.push({ name, email, phone, permit, code });
    localStorage.setItem("drivers", JSON.stringify(drivers));

    alert("✅ Registration successful! You can now log in.");
    driverRegistration.classList.add("hidden");
    driverLogin.classList.remove("hidden");
  });

  document.getElementById("loginDriver").addEventListener("click", () => {
    const phone = document.getElementById("driverLoginPhone").value.trim();
    const code = document.getElementById("driverLoginCode").value.trim();
    let drivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    const user = drivers.find(d => d.phone === phone && d.code == code);

    if(user){
      alert(`Welcome back, ${user.name}!`);
      driverLogin.classList.add("hidden");
      driverDashboard.classList.remove("hidden");
    } else {
      alert("❌ Invalid phone number or code.");
    }
  });

  /* ---------- DRIVER DASHBOARD LOGIC ---------- */
  const toggleStatus = document.getElementById("toggleStatus");
  const driverStatus = document.getElementById("driverStatus");
  const rideAssignments = document.getElementById("rideAssignments");
  const startRideBtn = document.getElementById("startRideBtn");
  const driverTripStatus = document.getElementById("driverTripStatus");
  const endRideBtn = document.getElementById("endRideBtn");
  const driverLocation = document.getElementById("driverLocation");
  const driverSOS = document.getElementById("driverSOS");

  if(toggleStatus) toggleStatus.addEventListener("click", () => {
    if(driverStatus.textContent === "Offline"){
      driverStatus.textContent = "Online";
      toggleStatus.textContent = "Go Offline";
      rideAssignments.classList.remove("hidden");
    } else {
      driverStatus.textContent = "Offline";
      toggleStatus.textContent = "Go Online";
      rideAssignments.classList.add("hidden");
    }
  });

  if(startRideBtn) startRideBtn.addEventListener("click", () => {
    rideAssignments.classList.add("hidden");
    driverTripStatus.classList.remove("hidden");
    driverLocation.textContent = "🟢 Trip started. Tracking location...";
  });

  if(endRideBtn) endRideBtn.addEventListener("click", () => {
    driverTripStatus.classList.add("hidden");
    rideAssignments.classList.remove("hidden");
    driverLocation.textContent = "Trip ended. Thank you for driving safely!";
  });

  if(driverSOS) driverSOS.addEventListener("click", () => alert("🚨 Driver SOS Activated! Authorities notified."));

});





/* ---------- ADMIN LOGIN ---------- */
const adminLogin = document.getElementById("adminLogin");
const adminDashboard = document.getElementById("adminDashboard");

document.getElementById("loginAdmin").addEventListener("click", () => {
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  // For hackathon demo, simple hardcoded admin credentials
  if(username === "admin" && password === "1234"){
    alert("✅ Welcome, Admin!");
    adminLogin.classList.add("hidden");
    adminDashboard.classList.remove("hidden");
    loadAdminData();
  } else {
    alert("❌ Invalid admin credentials.");
  }
});

/* ---------- LOAD ADMIN DATA ---------- */
function loadAdminData() {
  const sosList = document.getElementById("sosList");
  const incidentList = document.getElementById("incidentList");
  const feedbackList = document.getElementById("feedbackList");

  // Load SOS Alerts
  const sosAlerts = JSON.parse(localStorage.getItem("sosAlerts") || "[]");
  sosList.innerHTML = sosAlerts.length
    ? sosAlerts.map(alert => `<li>${alert}</li>`).join("")
    : `<li class="empty">No SOS alerts yet.</li>`;

  // Load Incident Reports
  const reports = JSON.parse(localStorage.getItem("incidentReports") || "[]");
  incidentList.innerHTML = reports.length
    ? reports.map(r => `<li>${r}</li>`).join("")
    : `<li class="empty">No incident reports yet.</li>`;

  // Load Feedback
  const feedbacks = JSON.parse(localStorage.getItem("userFeedbacks") || "[]");
  feedbackList.innerHTML = feedbacks.length
    ? feedbacks.map(f => `<li>${f}</li>`).join("")
    : `<li class="empty">No feedback yet.</li>`;
}

// Clear All Data Button
const clearData = document.getElementById("clearData");
if(clearData){
  clearData.addEventListener("click", () => {
    if(confirm("Are you sure you want to clear all stored data?")){
      localStorage.removeItem("incidentReports");
      localStorage.removeItem("userFeedbacks");
      localStorage.removeItem("sosAlerts");
      loadAdminData();
    }
  });
}




/* ---------- RIDER BOOKING & TRIP LOGIC ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // --- Elements ---
  const riderRegistration = document.getElementById("riderRegistration");
  const riderLogin = document.getElementById("riderLogin");
  const riderDashboard = document.getElementById("riderDashboard");

  const riderName = document.getElementById("riderName");
  const riderEmail = document.getElementById("riderEmail");
  const riderPhone = document.getElementById("riderPhone");
  const registerRider = document.getElementById("registerRider");

  const riderLoginPhone = document.getElementById("riderLoginPhone");
  const riderLoginCode = document.getElementById("riderLoginCode");
  const loginRider = document.getElementById("loginRider");

  const showLogin = document.getElementById("showLogin");
  const showRegister = document.getElementById("showRegister");

  const requestRideBtn = document.getElementById("requestRideBtn");
  const vehicleType = document.getElementById("vehicleType");
  const rideStatus = document.getElementById("rideStatus");

  const submitReport = document.getElementById("submitReport");
  const reportInput = document.getElementById("reportInput");
  const submitFeedback = document.getElementById("submitFeedback");
  const feedbackInput = document.getElementById("feedbackInput");

  // --- Storage ---
  let riders = JSON.parse(localStorage.getItem("riders") || "[]");
  let demoDrivers = [
    { name: "John", vehicle: "car" },
    { name: "Mary", vehicle: "boda" },
    { name: "David", vehicle: "car" },
    { name: "Grace", vehicle: "boda" }
  ];
  localStorage.setItem("drivers", JSON.stringify(demoDrivers));

  // --- Helper Functions ---
  function showDashboard(rider) {
    riderRegistration.classList.add("hidden");
    riderLogin.classList.add("hidden");
    riderDashboard.classList.remove("hidden");
    document.querySelector("#riderDashboard h2").textContent = `Welcome, ${rider.name} 🧍‍♀️`;
  }

  function generateCode() {
    return Math.floor(1000 + Math.random() * 9000); // 4-digit code
  }

  // --- Toggle Forms ---
  if (showLogin) {
    showLogin.addEventListener("click", () => {
      riderRegistration.classList.add("hidden");
      riderLogin.classList.remove("hidden");
    });
  }
  if (showRegister) {
    showRegister.addEventListener("click", () => {
      riderLogin.classList.add("hidden");
      riderRegistration.classList.remove("hidden");
    });
  }

  // --- Rider Registration ---
  if (registerRider) {
    registerRider.addEventListener("click", () => {
      const name = riderName.value.trim();
      const email = riderEmail.value.trim();
      const phone = riderPhone.value.trim();
      if (!name || !email || !phone) return alert("Please fill all fields.");

      // Check if already registered
      if (riders.find(r => r.phone === phone)) return alert("Phone number already registered.");

      const code = generateCode();
      const newRider = { name, email, phone, code };
      riders.push(newRider);
      localStorage.setItem("riders", JSON.stringify(riders));

      alert(`Registered! Your verification code is: ${code}`);
      riderRegistration.classList.add("hidden");
      riderLogin.classList.remove("hidden");
      riderLoginPhone.value = phone;
      riderLoginCode.value = "";
    });
  }

  // --- Rider Login ---
  if (loginRider) {
    loginRider.addEventListener("click", () => {
      const phone = riderLoginPhone.value.trim();
      const code = riderLoginCode.value.trim();
      const rider = riders.find(r => r.phone === phone && r.code == code);
      if (!rider) return alert("Invalid phone or code.");
      showDashboard(rider);
    });
  }

  // --- Ride Request ---
  if (requestRideBtn) {
    requestRideBtn.addEventListener("click", () => {
      const vehicle = vehicleType.value;
      let drivers = JSON.parse(localStorage.getItem("drivers") || "[]");
      const availableDriver = drivers.find(d => d.vehicle === vehicle);
      if (!availableDriver) {
        rideStatus.textContent = `No ${vehicle} drivers available now.`;
        return;
      }
      const currentRide = {
        driver: availableDriver.name,
        vehicle: availableDriver.vehicle,
        status: "assigned"
      };
      localStorage.setItem("currentRide", JSON.stringify(currentRide));
      rideStatus.textContent = `Driver ${availableDriver.name} (${availableDriver.vehicle}) is on the way!`;
    });
  }

  // --- Report & Feedback ---
  if (submitReport) {
    submitReport.addEventListener("click", () => {
      const text = reportInput.value.trim();
      if (!text) return alert("Please describe the incident.");
      const reports = JSON.parse(localStorage.getItem("incidentReports") || "[]");
      reports.push(text);
      localStorage.setItem("incidentReports", JSON.stringify(reports));
      reportInput.value = "";
      alert("Incident report submitted!");
    });
  }
  if (submitFeedback) {
    submitFeedback.addEventListener("click", () => {
      const text = feedbackInput.value.trim();
      if (!text) return alert("Please enter feedback.");
      const feedbacks = JSON.parse(localStorage.getItem("userFeedbacks") || "[]");
      feedbacks.push(text);
      localStorage.setItem("userFeedbacks", JSON.stringify(feedbacks));
      feedbackInput.value = "";
      alert("Feedback submitted!");
    });
  }
});


/* ---------- DRIVER ASSIGNED RIDE LOGIC ---------- */
const rideAssignments = document.getElementById("rideAssignments");
const driverPickup = document.getElementById("driverPickup");
const driverDropoff = document.getElementById("driverDropoff");
const ridePassenger = document.getElementById("ridePassenger");
const driverStartRideBtn = document.getElementById("driverStartRideBtn");
const driverEndRideBtn = document.getElementById("driverEndRideBtn");

// Check for new ride assignments every 1s (simulate real-time)
setInterval(() => {
  const currentRide = JSON.parse(localStorage.getItem("currentRide") || "null");
  if(currentRide){
    rideAssignments.classList.remove("hidden");
    driverPickup.textContent = currentRide.pickup;
    driverDropoff.textContent = currentRide.dropoff;
    ridePassenger.textContent = "Rider"; // Demo, can use rider name
  } else {
    rideAssignments.classList.add("hidden");
  }
}, 1000);

// Start Ride
if(driverStartRideBtn){
  driverStartRideBtn.addEventListener("click", () => {
    alert("🚗 Ride started!");
    driverStartRideBtn.classList.add("hidden");
    driverEndRideBtn.classList.remove("hidden");
  });
}

// End Ride
if(driverEndRideBtn){
  driverEndRideBtn.addEventListener("click", () => {
    alert("✅ Ride completed!");
    driverEndRideBtn.classList.add("hidden");
    driverStartRideBtn.classList.remove("hidden");
    localStorage.removeItem("currentRide");
  });
};



requestRideBtn.addEventListener("click", () => {
  const pickup = document.getElementById("pickupLocation").value.trim();
  const dropoff = document.getElementById("dropoffLocation").value.trim();
  const vehicle = document.getElementById("vehicleType").value; // new
  if(!pickup || !dropoff) return alert("Please enter both pickup and drop-off locations.");

  // Assign driver of the selected type
  let drivers = JSON.parse(localStorage.getItem("drivers") || "[]");
  // Filter drivers by vehicle type
  let availableDrivers = drivers.filter(d => d.vehicle === vehicle);
  if(availableDrivers.length === 0) return alert(`No ${vehicle} drivers online yet. Try again later.`);
  
  const driver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];

  // Save ride details
  const ride = { pickup, dropoff, driver: driver.name, vehicle };
  localStorage.setItem("currentRide", JSON.stringify(ride));

  // Show ride details
  ridePickup.textContent = pickup;
  rideDropoff.textContent = dropoff;
  assignedDriver.textContent = `${driver.name} (${vehicle})`;

  document.querySelector(".ride-booking").classList.add("hidden");
  rideDetails.classList.remove("hidden");

  alert(`✅ Ride assigned to ${driver.name} (${vehicle})`);
});


// Example: Setup drivers
const demoDrivers = [
  { name: "John", vehicle: "car" },
  { name: "Mary", vehicle: "boda" },
  { name: "David", vehicle: "car" },
  { name: "Grace", vehicle: "boda" }
];
localStorage.setItem("drivers", JSON.stringify(demoDrivers));




// --- Ride Request Logic ---
document.addEventListener("DOMContentLoaded", () => {
  const requestRideBtn = document.getElementById("requestRideBtn");
  const vehicleType = document.getElementById("vehicleType");
  const rideStatus = document.getElementById("rideStatus");

  // Load drivers
  let drivers = JSON.parse(localStorage.getItem("drivers") || "[]");

  // Function to assign ride
  function assignRide(vehicle) {
    const availableDriver = drivers.find(d => d.vehicle === vehicle);
    if (!availableDriver) {
      rideStatus.textContent = `No ${vehicle} drivers are available right now.`;
      return null;
    }

    const currentRide = {
      driver: availableDriver.name,
      vehicle: availableDriver.vehicle,
      status: "assigned"
    };
    localStorage.setItem("currentRide", JSON.stringify(currentRide));

    rideStatus.textContent = `Driver ${availableDriver.name} (${availableDriver.vehicle}) is on the way!`;
    return currentRide;
  }

  // Event listener
  if (requestRideBtn) {
    requestRideBtn.addEventListener("click", () => {
      const vehicle = vehicleType.value;
      assignRide(vehicle);
    });
  }
});



document.addEventListener("DOMContentLoaded", () => {
  // --- DRIVER ELEMENTS ---
  const driverStatusText = document.getElementById("driverStatus");
  const toggleStatusBtn = document.getElementById("toggleStatus");
  const rideAssignments = document.getElementById("rideAssignments");
  const startRideBtn = document.getElementById("startRideBtn");
  const endRideBtn = document.getElementById("endRideBtn");
  const driverTripStatus = document.getElementById("driverTripStatus");
  const driverLocation = document.getElementById("driverLocation");

  // --- Initialize driver status ---
  let isOnline = false;
  let currentRide = JSON.parse(localStorage.getItem("currentRide") || "null");

  // --- Toggle Online/Offline ---
  if (toggleStatusBtn) {
    toggleStatusBtn.addEventListener("click", () => {
      isOnline = !isOnline;
      driverStatusText.textContent = isOnline ? "Online" : "Offline";
      toggleStatusBtn.textContent = isOnline ? "Go Offline" : "Go Online";

      // Show ride assignment if a ride exists
      if (isOnline && currentRide) {
        rideAssignments.classList.remove("hidden");
      } else {
        rideAssignments.classList.add("hidden");
      }
    });
  }

  // --- Start Ride ---
  if (startRideBtn) {
    startRideBtn.addEventListener("click", () => {
      if (!currentRide) return alert("No ride assigned yet.");
      rideAssignments.classList.add("hidden");
      driverTripStatus.classList.remove("hidden");
      driverLocation.textContent = `Trip started with ${currentRide.vehicle} for passenger ${currentRide.driver}`;
      currentRide.status = "in progress";
      localStorage.setItem("currentRide", JSON.stringify(currentRide));
    });
  }

  // --- End Ride ---
  if (endRideBtn) {
    endRideBtn.addEventListener("click", () => {
      if (!currentRide) return;
      driverTripStatus.classList.add("hidden");
      alert(`Trip ended successfully with ${currentRide.vehicle}`);
      localStorage.removeItem("currentRide");
      currentRide = null;
      // If online, show rideAssignments ready for next ride
      if (isOnline) rideAssignments.classList.add("hidden");
      driverLocation.textContent = "";
    });
  }
});




document.addEventListener("DOMContentLoaded", () => {
  /*** --- RIDER ELEMENTS --- ***/
  const riderDashboard = document.getElementById("riderDashboard");
  const requestRideBtn = document.getElementById("requestRideBtn");
  const vehicleType = document.getElementById("vehicleType");
  const rideStatus = document.getElementById("rideStatus");

  /*** --- DRIVER ELEMENTS --- ***/
  const driverStatusText = document.getElementById("driverStatus");
  const toggleStatusBtn = document.getElementById("toggleStatus");
  const rideAssignments = document.getElementById("rideAssignments");
  const startRideBtn = document.getElementById("startRideBtn");
  const endRideBtn = document.getElementById("endRideBtn");
  const driverTripStatus = document.getElementById("driverTripStatus");
  const driverLocation = document.getElementById("driverLocation");

  /*** --- INITIAL DATA --- ***/
  let demoDrivers = [
    { name: "John", vehicle: "car", online: false },
    { name: "Mary", vehicle: "boda", online: false },
    { name: "David", vehicle: "car", online: false },
    { name: "Grace", vehicle: "boda", online: false }
  ];
  localStorage.setItem("drivers", JSON.stringify(demoDrivers));

  /*** --- RIDER: Request Ride --- ***/
  if (requestRideBtn) {
    requestRideBtn.addEventListener("click", () => {
      const vehicle = vehicleType.value;
      let drivers = JSON.parse(localStorage.getItem("drivers") || "[]");

      // Find available online driver of selected type
      const availableDriver = drivers.find(d => d.vehicle === vehicle && d.online);
      if (!availableDriver) {
        rideStatus.textContent = `No ${vehicle} drivers online now.`;
        return;
      }

      const currentRide = {
        driver: availableDriver.name,
        vehicle: availableDriver.vehicle,
        status: "assigned",
        rider: "You"
      };
      localStorage.setItem("currentRide", JSON.stringify(currentRide));
      rideStatus.textContent = `Driver ${availableDriver.name} (${availableDriver.vehicle}) is on the way!`;

      // Notify driver dashboard by updating storage (driver will pick this up)
      localStorage.setItem("rideUpdate", Date.now());
    });
  }

  /*** --- DRIVER: Online/Offline Toggle --- ***/
  if (toggleStatusBtn) {
    toggleStatusBtn.addEventListener("click", () => {
      let drivers = JSON.parse(localStorage.getItem("drivers") || "[]");
      const driverName = toggleStatusBtn.dataset.driver; // assign driver's name in HTML as data-driver
      const driver = drivers.find(d => d.name === driverName);
      driver.online = !driver.online;
      driverStatusText.textContent = driver.online ? "Online" : "Offline";
      toggleStatusBtn.textContent = driver.online ? "Go Offline" : "Go Online";
      localStorage.setItem("drivers", JSON.stringify(drivers));
      updateRideAssignment(driverName);
    });
  }

  /*** --- DRIVER: Show Assigned Ride --- ***/
  function updateRideAssignment(driverName) {
    let currentRide = JSON.parse(localStorage.getItem("currentRide") || "null");
    if (!currentRide || currentRide.driver !== driverName) {
      if (rideAssignments) rideAssignments.classList.add("hidden");
      return;
    }
    if (rideAssignments) rideAssignments.classList.remove("hidden");
    if (startRideBtn) startRideBtn.textContent = "Start Ride";
    if (driverTripStatus) driverTripStatus.classList.add("hidden");
  }

  /*** --- DRIVER: Start Ride --- ***/
  if (startRideBtn) {
    startRideBtn.addEventListener("click", () => {
      let currentRide = JSON.parse(localStorage.getItem("currentRide") || "null");
      if (!currentRide) return alert("No ride assigned yet.");
      rideAssignments.classList.add("hidden");
      driverTripStatus.classList.remove("hidden");
      driverLocation.textContent = `Trip started with ${currentRide.vehicle} for ${currentRide.rider}`;
      currentRide.status = "in progress";
      localStorage.setItem("currentRide", JSON.stringify(currentRide));

      // Notify rider
      localStorage.setItem("rideUpdate", Date.now());
    });
  }

  /*** --- DRIVER: End Ride --- ***/
  if (endRideBtn) {
    endRideBtn.addEventListener("click", () => {
      let currentRide = JSON.parse(localStorage.getItem("currentRide") || "null");
      if (!currentRide) return;
      driverTripStatus.classList.add("hidden");
      alert(`Trip ended with ${currentRide.vehicle}`);
      localStorage.removeItem("currentRide");

      // Notify rider
      rideStatus.textContent = "Trip completed!";
      localStorage.setItem("rideUpdate", Date.now());
    });
  }

  /*** --- RIDE UPDATE LISTENER (Rider side) --- ***/
  if (rideStatus) {
    window.addEventListener("storage", (e) => {
      if (e.key === "rideUpdate") {
        let currentRide = JSON.parse(localStorage.getItem("currentRide") || "null");
        if (!currentRide) {
          rideStatus.textContent = "No active ride.";
        } else if (currentRide.status === "assigned") {
          rideStatus.textContent = `Driver ${currentRide.driver} (${currentRide.vehicle}) is on the way!`;
        } else if (currentRide.status === "in progress") {
          rideStatus.textContent = `Trip in progress with ${currentRide.driver} (${currentRide.vehicle})`;
        }
      }
    });
  }
});

  /*** --- COMMON ELEMENTS --- ***/
  const sosBtn = document.getElementById("sosBtn");
  const driverSOSBtn = document.getElementById("driverSOS");
  const reportInput = document.getElementById("reportInput");
  const submitReport = document.getElementById("submitReport");
  const feedbackInput = document.getElementById("feedbackInput");
  const submitFeedback = document.getElementById("submitFeedback");

  /*** --- ADMIN ELEMENTS --- ***/
  const sosList = document.getElementById("sosList");
  const reportList = document.getElementById("reportList");
  const feedbackList = document.getElementById("feedbackList");

  /*** --- HELPER FUNCTION: ADD TO LOCALSTORAGE ARRAY --- ***/
  function addToLocalStorageArray(key, value) {
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.push(value);
    localStorage.setItem(key, JSON.stringify(arr));
  }

  /*** --- RIDER SOS --- ***/
  if (sosBtn) {
    sosBtn.addEventListener("click", () => {
      const sos = `🚨 Rider SOS triggered at ${new Date().toLocaleTimeString()}`;
      addToLocalStorageArray("sosAlerts", sos);
      alert("✅ SOS sent! Help is on the way.");
      localStorage.setItem("sosUpdate", Date.now());
    });
  }

  /*** --- DRIVER SOS --- ***/
  if (driverSOSBtn) {
    driverSOSBtn.addEventListener("click", () => {
      const sos = `🚨 Driver SOS triggered at ${new Date().toLocaleTimeString()}`;
      addToLocalStorageArray("sosAlerts", sos);
      alert("✅ SOS sent! Help is on the way.");
      localStorage.setItem("sosUpdate", Date.now());
    });
  }

  /*** --- INCIDENT REPORT --- ***/
  if (submitReport) {
    submitReport.addEventListener("click", () => {
      const text = reportInput.value.trim();
      if (!text) return alert("Please describe the incident before submitting.");
      addToLocalStorageArray("incidentReports", text);
      reportInput.value = "";
      alert("✅ Incident report submitted successfully!");
      localStorage.setItem("reportUpdate", Date.now());
    });
  }

  /*** --- FEEDBACK --- ***/
  if (submitFeedback) {
    submitFeedback.addEventListener("click", () => {
      const text = feedbackInput.value.trim();
      if (!text) return alert("Please enter feedback first.");
      addToLocalStorageArray("userFeedbacks", text);
      feedbackInput.value = "";
      alert("🌟 Thank you for your feedback!");
      localStorage.setItem("feedbackUpdate", Date.now());
    });
  }

  /*** --- ADMIN DASHBOARD: Real-time Updates --- ***/
  function loadAdminData() {
    const sosAlerts = JSON.parse(localStorage.getItem("sosAlerts") || "[]");
    const reports = JSON.parse(localStorage.getItem("incidentReports") || "[]");
    const feedbacks = JSON.parse(localStorage.getItem("userFeedbacks") || "[]");

    if (sosList) {
      sosList.innerHTML = sosAlerts.length
        ? sosAlerts.map(s => `<li>${s}</li>`).join("")
        : "<li class='empty'>No SOS alerts yet.</li>";
    }

    if (reportList) {
      reportList.innerHTML = reports.length
        ? reports.map(r => `<li>${r}</li>`).join("")
        : "<li class='empty'>No incident reports yet.</li>";
    }

    if (feedbackList) {
      feedbackList.innerHTML = feedbacks.length
        ? feedbacks.map(f => `<li>${f}</li>`).join("")
        : "<li class='empty'>No feedback yet.</li>";
    }
  }

  // Initial load
  loadAdminData();

  // Listen for updates from Rider/Driver
  window.addEventListener("storage", (e) => {
    if (["sosUpdate", "reportUpdate", "feedbackUpdate"].includes(e.key)) {
      loadAdminData();
    }
  });
