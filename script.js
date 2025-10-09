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