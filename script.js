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