// Complete driver dashboard functionality with real data and features
let earningsChart = null;
let performanceChart = null;
let earningsBreakdownChart = null;
let driverMap = null;
let currentLanguage = 'en';
let recognition = null;
let isMobileMenuOpen = false;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let videoChunks = [];
let recordingTimer = null;
let recordingStartTime = null;

// Complete language translations
const translations = {
    en: {
        // Navigation
        safemove_driver: "SafeMove Driver",
        dashboard: "Dashboard",
        ride_requests: "Ride Requests",
        trip_history: "Trip History",
        incident_report: "Incident Report",
        safety_center: "Safety Center",
        financial_hub: "Financial Hub",
        professional_growth: "Professional Growth",
        community: "Community",
        live_map: "Live Map",
        logout: "Logout",
        
        // Status
        online: "Online",
        offline: "Offline",
        available_for_rides: "Available for rides",
        not_available: "Not available",
        gold_driver: "Gold Driver",
        silver_driver: "Silver Driver",
        bronze_driver: "Bronze Driver",
        
        // Dashboard
        driver_dashboard: "Driver Dashboard",
        dashboard_subtitle: "Manage your rides, earnings, and safety features",
        welcome: "Welcome",
        today_earnings: "Today's Earnings",
        today_rides: "Today's Rides",
        pending_requests: "Pending Requests",
        performance_rating: "Performance Rating",
        trust_score: "Trust Score",
        safety_tip: "Safety Tip of the Day",
        safety_tip_content: "Always verify passenger details before starting a trip. Use in-app navigation for accurate routes and share trip status with trusted contacts.",
        click_to_record_sos: "Click to Record SOS Message",
        recording_voice: "Recording Voice Message",
        speak_now: "Speak now...",
        stop_recording: "Stop Recording",
        recording_note: "This recording will be sent to emergency contacts if SOS is activated",
        earnings_overview: "Earnings Overview (Last 7 Days)",
        performance_metrics: "Performance Metrics",
        acceptance_rate: "Acceptance Rate",
        completion_rate: "Completion Rate",
        customer_rating: "Customer Rating",
        safety_score: "Safety Score",
        quick_actions: "Quick Actions",
        view_ride_requests: "View Ride Requests",
        refresh_dashboard: "Refresh Dashboard",
        report_incident: "Report Incident",
        toggle_safety_mode: "Toggle Safety Mode",
        view_live_map: "View Live Map",
        recent_activity: "Recent Activity",
        welcome_activity: "Welcome to SafeMove! Start accepting rides to see your activity here.",
        ride_completed: "Ride completed",
        payment_received: "Payment received",
        
        // Map
        map_subtitle: "View your current location, nearby passengers, and popular pickup spots",
        center_map: "Center on My Location",
        find_hotspots: "Find Hotspots",
        safety_zones: "Safety Zones",
        nearby_passengers: "Nearby Passengers",
        hotspot_areas: "Hotspot Areas",
        safe_zones: "Safe Zones",
        
        // Ride Requests
        ride_requests_subtitle: "Accept or decline ride requests from passengers",
        verified_passenger: "Verified Passenger",
        check_verification: "Check passenger verification status before accepting",
        refresh_requests: "Refresh Requests",
        go_online: "Go Online",
        go_offline: "Go Offline",
        passenger: "Passenger",
        verification: "Verification",
        pickup: "Pickup",
        destination: "Destination",
        distance: "Distance",
        fare: "Fare",
        requested: "Requested",
        actions: "Actions",
        loading_requests: "Loading ride requests...",
        no_requests: "No ride requests available",
        accept: "Accept",
        decline: "Decline",
        
        // Trip History
        trip_history_subtitle: "View your completed rides and earnings",
        refresh_history: "Refresh History",
        last_7_days: "Last 7 Days",
        last_30_days: "Last 30 Days",
        last_90_days: "Last 90 Days",
        route: "Route",
        date_time: "Date & Time",
        rating: "Rating",
        loading_history: "Loading trip history...",
        no_trips: "No trips completed yet",
        total_earnings: "Total Earnings",
        total_trips: "Total Trips",
        average_rating: "Average Rating",
        
        // Incident Report
        incident_subtitle: "Report any incidents or safety concerns during your trips",
        submit_incident: "Submit Incident Report",
        incident_type: "Incident Type",
        select_incident_type: "Select incident type...",
        traffic_accident: "Traffic Accident",
        theft: "Theft",
        passenger_harassment: "Passenger Harassment",
        safety_concern: "Safety Concern",
        vehicle_issue: "Vehicle Issue",
        technical_issue: "App/Technical Issue",
        other: "Other",
        description: "Description",
        description_placeholder: "Please describe what happened in detail...",
        location: "Location",
        location_placeholder: "Enter location where incident occurred",
        related_ride: "Related Ride",
        select_related_ride: "Select related ride...",
        emergency_video: "Emergency Video Recording",
        record_video: "Record Emergency Video",
        video_note: "This will record a video clip to attach to your report",
        recording_video: "Recording Video",
        video_recording_note: "This video will be attached to your incident report",
        voice_note: "Voice Note",
        record_voice_note: "Record Voice Note",
        submit_report: "Submit Incident Report",
        cancel: "Cancel",
        emergency_contact: "Emergency? Call support:",
        use_voice_sos: "use Voice SOS",
        
        // Safety Center
        safety_center_subtitle: "Your safety is our priority. Access emergency features and safety tools.",
        safety_score: "Safety Score",
        safety_tips: "Follow safety guidelines to improve your score",
        emergency_contacts: "Emergency Contacts",
        police: "Police",
        ambulance: "Ambulance",
        safemove_support: "SafeMove Support",
        smart_safety_mode: "Smart Safety Mode",
        safety_mode_desc: "Automatically activates in risky zones or at night",
        safety_mode_active: "Safety Mode: Active",
        safety_mode_inactive: "Safety Mode: Inactive",
        active: "Active",
        inactive: "Inactive",
        voice_sos: "Voice-Activated SOS",
        voice_sos_desc: "Say 'SafeMove Help' to trigger emergency",
        test_voice: "Test Voice Command",
        emergency_video_snap: "Emergency Video Snap",
        video_snap_desc: "Records 10-second clip during emergencies",
        test_video: "Test Video Recording",
        driver_health: "Driver Health Monitor",
        health_monitor_desc: "Track fatigue and wellness",
        select_fatigue: "Select fatigue level",
        feeling_fresh: "Feeling Fresh",
        slightly_tired: "Slightly Tired",
        moderately_fatigued: "Moderately Fatigued",
        very_tired: "Very Tired",
        extremely_fatigued: "Extremely Fatigued",
        log_status: "Log Status",
        safety_guidelines: "Safety Guidelines",
        verify_passenger: "Verify Passenger",
        verify_passenger_tip: "Always check passenger details and rating before starting trip",
        share_location: "Share Location",
        share_location_tip: "Share your live location with trusted contacts during trips",
        emergency_protocol: "Emergency Protocol",
        emergency_protocol_tip: "Know how to use SOS features and emergency contacts",
        vehicle_safety: "Vehicle Safety",
        vehicle_safety_tip: "Regular vehicle maintenance and safety checks are essential",
        
        // Financial Hub
        financial_subtitle: "Track your earnings, set goals, and redeem rewards",
        financial_summary: "Financial Summary",
        weekly_earnings: "Weekly Earnings",
        monthly_earnings: "Monthly Earnings",
        total_earnings: "Total Earnings",
        smart_wallet: "Smart Wallet Analytics",
        spending_trend: "Spending Trend",
        performance_score: "Performance Score",
        view_analytics: "View Detailed Analytics",
        savings_goals: "Savings & Goals",
        new_helmet: "New Helmet",
        vehicle_maintenance: "Vehicle Maintenance",
        add_goal: "Add New Goal",
        safemove_rewards: "SafeMove Rewards",
        your_points: "Your Points",
        redeem_fuel: "Redeem Fuel Discount",
        view_rewards: "View All Rewards",
        earnings_breakdown: "Earnings Breakdown",
        
        // Professional Growth
        professional_subtitle: "Enhance your skills and build your professional profile",
        driver_profile: "Driver Profile",
        total_trips: "Total Trips",
        experience: "Experience",
        beginner: "Beginner",
        intermediate: "Intermediate",
        experienced: "Experienced",
        expert: "Expert",
        completion_rate: "Completion Rate",
        digital_profile: "Digital Driver Profile",
        trusted_driver: "Trusted Driver",
        safety_expert: "Safety Expert",
        view_profile: "View Full Profile",
        share_profile: "Share Profile",
        training_center: "Safety Training Center",
        traffic_laws: "Traffic Laws Update",
        customer_care: "Customer Care",
        emergency_response: "Emergency Response",
        defensive_driving: "Defensive Driving",
        completed: "Completed",
        in_progress: "In Progress",
        available: "Available",
        start_training: "Start Training",
        transparency_log: "Incident Transparency Log",
        passenger_report: "Passenger Report",
        route_issue: "Route Issue",
        resolved: "Resolved",
        under_review: "Under Review",
        no_incidents: "No incidents reported",
        view_full_log: "View Full Log",
        performance_tracking: "Performance Tracking",
        
        // Community
        community_subtitle: "Connect with other drivers, share experiences, and get support",
        active_drivers: "Active Drivers",
        community_rating: "Community Rating",
        safety_incidents: "Safety Incidents",
        community_forum: "Community Forum",
        welcome_forum: "Welcome to SafeMove Community",
        forum_welcome_message: "Connect with fellow drivers and share your experiences...",
        dangerous_route: "Dangerous Route Reported",
        route_warning: "Avoid Main Street after dark due to...",
        rating_tips: "Tips for Better Ratings",
        rating_advice: "Always greet passengers with a smile...",
        maintenance_tips: "Vehicle Maintenance Tips",
        maintenance_advice: "Regular oil changes can improve...",
        enter_forum: "Enter Forum",
        create_post: "Create Post",
        driver_month: "Driver of the Month",
        no_driver_selected: "Not selected yet",
        check_back_later: "Check back later this month",
        excellent_service: "Excellent service and safety record",
        view_spotlight: "View Spotlight",
        nominate_driver: "Nominate Driver",
        mental_wellness: "Mental Wellness Support",
        wellness_desc: "Stress management and counseling available for all drivers",
        stress_management: "Stress Management",
        counseling: "Professional Counseling",
        support_groups: "Support Groups",
        contact_counselor: "Contact Counselor",
        wellness_tips: "Wellness Tips",
        
        // Support
        support: "Support",
        safemove_support: "SafeMove Support",
        support_welcome: "Hello! How can we help you today?",
        type_message: "Type your message...",
        send: "Send",
        
        // Messages
        language_changed: "Language changed to",
        going_online: "Going online...",
        going_offline: "Going offline...",
        safety_mode_activated: "Safety mode activated",
        safety_mode_deactivated: "Safety mode deactivated",
        fatigue_logged: "Fatigue level logged",
        incident_submitted: "Incident report submitted successfully",
        ride_accepted: "Ride accepted",
        ride_declined: "Ride declined",
        recording_started: "Recording started",
        recording_stopped: "Recording stopped",
        recording_saved: "Recording saved",
        video_recording_started: "Video recording started",
        video_recording_stopped: "Video recording stopped",
        video_saved: "Video saved",
        voice_sos_activated: "Voice SOS activated! Emergency contacts notified",
        location_centered: "Map centered on your location",
        hotspots_updated: "Hotspots updated on map",
        data_loaded: "Data loaded successfully",
        error_loading_data: "Error loading data",
        error_recording: "Error accessing microphone/camera",
        no_browser_support: "Feature not supported in your browser"
    },
    lg: {
        safemove_driver: "SafeMove Ddayiva",
        dashboard: "Dashiboodi",
        ride_requests: "Okusaba Okugenda",
        welcome: "Tukwaniriza",
        today_earnings: "Ensasa y'eno",
        today_rides: "Enkya z'eno",
        pending_requests: "Okusaba okulindirira",
        // Add more Luganda translations as needed...
    },
    sw: {
        safemove_driver: "Dereva wa SafeMove", 
        dashboard: "Dashibodi",
        ride_requests: "Maombi ya Safari",
        welcome: "Karibu",
        today_earnings: "Mapato ya Leo",
        today_rides: "Safari za Leo",
        pending_requests: "Maombi Yanayosubiri",
        // Add more Kiswahili translations as needed...
    },
    tt: {
        safemove_driver: "SafeMove Ddayiva",
        dashboard: "Dashiboodi", 
        ride_requests: "Okusaba Okugenda",
        welcome: "Tukushemererwa",
        today_earnings: "Ebiryo by'eno",
        today_rides: "Okuyenda kw'eno",
        // Add more Rutooro translations as needed...
    },
    ny: {
        safemove_driver: "SafeMove Ddayiva",
        dashboard: "Dashiboodi",
        ride_requests: "Okusaba Okugyenda", 
        welcome: "Tukuhimbiire",
        today_earnings: "Eby'eno",
        today_rides: "Okuyenda kw'eno",
        // Add more Runyakore translations as needed...
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDriverApp();
    setupNavigation();
    loadLanguagePreference();
    checkMediaPermissions();
});

function initializeDriverApp() {
    initializeVoiceRecognition();
    setupEventListeners();
    loadRealData();
    
    // Refresh data every 30 seconds
    setInterval(loadRealData, 30000);
}

function setupNavigation() {
    // Handle initial hash in URL
    const hash = window.location.hash.slice(1) || 'dashboard';
    showSection(hash);
    
    // Update active link based on current section
    updateActiveNavigation();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(event) {
        const hash = window.location.hash.slice(1) || 'dashboard';
        showSection(hash);
    });
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

    // Window resize handler for responsive behavior
    window.addEventListener('resize', handleResize);
    
    // Online/offline status detection
    window.addEventListener('online', function() {
        showMessage(getTranslation('going_online'), 'success');
        updateDriverStatus(true);
    });
    
    window.addEventListener('offline', function() {
        showMessage(getTranslation('going_offline'), 'warning');
        updateDriverStatus(false);
    });
}

function handleResize() {
    if (window.innerWidth > 1024 && isMobileMenuOpen) {
        closeMobileMenu();
    }
}

// Mobile menu functionality
function toggleMobileMenu() {
    if (isMobileMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.mobile-menu-toggle');
    const overlay = document.createElement('div');
    
    overlay.className = 'mobile-overlay';
    overlay.onclick = closeMobileMenu;
    document.body.appendChild(overlay);
    
    sidebar.classList.add('mobile-open');
    toggle.classList.add('open');
    isMobileMenuOpen = true;
}

function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.mobile-menu-toggle');
    const overlay = document.querySelector('.mobile-overlay');
    
    if (overlay) {
        overlay.remove();
    }
    
    sidebar.classList.remove('mobile-open');
    toggle.classList.remove('open');
    isMobileMenuOpen = false;
}

// Section navigation
window.showSection = function(sectionId) {
    // Close mobile menu when navigating
    if (window.innerWidth <= 1024) {
        closeMobileMenu();
    }
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update URL hash without scrolling
        history.pushState(null, '', `#${sectionId}`);
        
        // Update page title
        updatePageTitle(sectionId);
        
        // Update active navigation
        updateActiveNavigation();
        
        // Initialize section-specific features
        initializeSectionFeatures(sectionId);
    } else {
        console.warn(`Section ${sectionId} not found`);
        showSection('dashboard');
    }
};

function updateActiveNavigation() {
    // Remove active class from all links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Get current section from URL hash
    const currentSection = window.location.hash.slice(1) || 'dashboard';
    
    // Add active class to current link
    const activeLink = document.querySelector(`[href="#${currentSection}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function updatePageTitle(sectionId) {
    const sectionTitles = {
        'dashboard': getTranslation('driver_dashboard'),
        'ride-requests': getTranslation('ride_requests'),
        'trip-history': getTranslation('trip_history'),
        'incident-report': getTranslation('incident_report'),
        'safety-center': getTranslation('safety_center'),
        'financial-hub': getTranslation('financial_hub'),
        'professional-growth': getTranslation('professional_growth'),
        'community': getTranslation('community'),
        'live-map': getTranslation('live_map')
    };
    
    document.title = `${sectionTitles[sectionId]} - SafeMove Driver`;
}

function initializeSectionFeatures(sectionId) {
    switch(sectionId) {
        case 'live-map':
            initializeMap();
            break;
        case 'financial-hub':
            initializeFinancialCharts();
            break;
        case 'professional-growth':
            initializePerformanceChart();
            break;
        case 'dashboard':
            initializeDashboardCharts();
            break;
    }
}

// Language functionality
function changeLanguage(lang) {
    currentLanguage = lang;
    updatePageLanguage();
    saveLanguagePreference(lang);
    showMessage(`${getTranslation('language_changed')} ${getLanguageName(lang)}`, 'success');
}

function updatePageLanguage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else if (element.tagName === 'SELECT') {
                // Handle select options
                const options = element.querySelectorAll('option');
                options.forEach(option => {
                    const optionKey = option.getAttribute('data-i18n');
                    if (optionKey) {
                        const optionTranslation = getTranslation(optionKey);
                        if (optionTranslation) {
                            option.textContent = optionTranslation;
                        }
                    }
                });
            } else {
                element.textContent = translation;
            }
        }
    });
    
    // Update page title
    const currentSection = window.location.hash.slice(1) || 'dashboard';
    updatePageTitle(currentSection);
}

function getTranslation(key) {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
}

function getLanguageName(code) {
    const languages = {
        'en': 'English',
        'lg': 'Luganda',
        'sw': 'Kiswahili',
        'sw': 'Kiswahili',
        'tt': 'Rutooro',
        'ny': 'Runyakore'
    };
    return languages[code] || code;
}

function saveLanguagePreference(lang) {
    localStorage.setItem('preferredLanguage', lang);
}

function loadLanguagePreference() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
        const select = document.getElementById('languageSelect');
        if (select) {
            select.value = savedLang;
        }
        updatePageLanguage();
    }
}

// Voice Recording Functionality
function initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLanguage === 'en' ? 'en-US' : currentLanguage;
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.toLowerCase();
            if (transcript.includes('safemove') && (transcript.includes('help') || transcript.includes('sos'))) {
                triggerEmergencySOS();
            }
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
        };
    }
}

async function startVoiceRecording() {
    if (isRecording) {
        stopVoiceRecording();
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Show preview in incident report
            const audioPreview = document.getElementById('audioPreview');
            if (audioPreview) {
                audioPreview.src = audioUrl;
                audioPreview.style.display = 'block';
            }
            
            // Save recording for SOS
            localStorage.setItem('sosVoiceRecording', audioUrl);
            
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        isRecording = true;
        
        // Update UI
        const voiceBtn = document.getElementById('voiceSOSBtn');
        const voiceLabel = document.getElementById('voiceSOSLabel');
        if (voiceBtn) voiceBtn.classList.add('recording');
        if (voiceLabel) voiceLabel.textContent = getTranslation('stop_recording');
        
        // Show recording modal
        showVoiceRecordingModal();
        
        startRecordingTimer();
        
        showMessage(getTranslation('recording_started'), 'info');
        
    } catch (error) {
        console.error('Error starting voice recording:', error);
        showMessage(getTranslation('error_recording'), 'error');
    }
}

function stopVoiceRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        stopRecordingTimer();
        
        // Update UI
        const voiceBtn = document.getElementById('voiceSOSBtn');
        const voiceLabel = document.getElementById('voiceSOSLabel');
        if (voiceBtn) voiceBtn.classList.remove('recording');
        if (voiceLabel) voiceLabel.textContent = getTranslation('click_to_record_sos');
        
        // Hide recording modal
        hideVoiceRecordingModal();
        
        showMessage(getTranslation('recording_stopped'), 'success');
    }
}

function startVoiceNoteRecording() {
    startVoiceRecording();
}

// Video Recording Functionality
async function startVideoRecording() {
    if (isRecording) {
        stopVideoRecording();
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 },
            audio: true 
        });
        
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        videoChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                videoChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(videoBlob);
            
            // Show preview in incident report
            const videoPreview = document.getElementById('videoPreview');
            if (videoPreview) {
                videoPreview.src = videoUrl;
                videoPreview.style.display = 'block';
            }
            
            stream.getTracks().forEach(track => track.stop());
        };

        // Show live preview
        const videoLivePreview = document.getElementById('videoLivePreview');
        if (videoLivePreview) {
            videoLivePreview.srcObject = stream;
        }

        mediaRecorder.start();
        isRecording = true;
        
        showVideoRecordingModal();
        startRecordingTimer();
        
        showMessage(getTranslation('video_recording_started'), 'info');
        
    } catch (error) {
        console.error('Error starting video recording:', error);
        showMessage(getTranslation('error_recording'), 'error');
    }
}

function stopVideoRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        stopRecordingTimer();
        
        hideVideoRecordingModal();
        
        showMessage(getTranslation('video_recording_stopped'), 'success');
    }
}

function testVideoRecording() {
    startVideoRecording();
}

// Recording timer functions
function startRecordingTimer() {
    recordingStartTime = Date.now();
    recordingTimer = setInterval(updateRecordingTimer, 1000);
}

function stopRecordingTimer() {
    if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
}

function updateRecordingTimer() {
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const timerElement = document.getElementById('recordingTimer') || document.getElementById('videoRecordingTimer');
    if (timerElement) {
        timerElement.textContent = `${elapsed}s`;
    }
}

// Modal functions
function showVoiceRecordingModal() {
    const modal = document.getElementById('voiceModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function hideVoiceRecordingModal() {
    const modal = document.getElementById('voiceModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function showVideoRecordingModal() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function hideVideoRecordingModal() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Safety Features
function toggleSmartSafetyMode(enabled) {
    const statusElement = document.getElementById('safetyModeStatus');
    const statusTextElement = document.getElementById('safetyModeStatusText');
    
    if (enabled) {
        if (statusElement) statusElement.textContent = getTranslation('safety_mode_active');
        if (statusTextElement) statusTextElement.textContent = getTranslation('active');
        showMessage(getTranslation('safety_mode_activated'), 'success');
    } else {
        if (statusElement) statusElement.textContent = getTranslation('safety_mode_inactive');
        if (statusTextElement) statusTextElement.textContent = getTranslation('inactive');
        showMessage(getTranslation('safety_mode_deactivated'), 'info');
    }
}

function toggleSafetyMode() {
    const safetyModeToggle = document.getElementById('smartSafetyMode');
    if (safetyModeToggle) {
        safetyModeToggle.checked = !safetyModeToggle.checked;
        toggleSmartSafetyMode(safetyModeToggle.checked);
    }
}

function logFatigue() {
    const fatigueLevel = document.getElementById('fatigueLevel').value;
    if (fatigueLevel) {
        // Save to localStorage or send to backend
        localStorage.setItem('driverFatigueLevel', fatigueLevel);
        localStorage.setItem('driverFatigueTimestamp', new Date().toISOString());
        
        showMessage(getTranslation('fatigue_logged'), 'success');
    } else {
        showMessage('Please select fatigue level', 'error');
    }
}

function triggerEmergencySOS() {
    showMessage(getTranslation('voice_sos_activated'), 'error');
    
    // Send emergency notification
    sendEmergencyNotification();
    
    // Record emergency video automatically
    setTimeout(() => {
        startVideoRecording();
        setTimeout(stopVideoRecording, 10000); // Stop after 10 seconds
    }, 2000);
}

function sendEmergencyNotification() {
    // In a real app, this would send to your backend
    const emergencyData = {
        type: 'sos',
        timestamp: new Date().toISOString(),
        location: getCurrentLocation(),
        driverId: 'current-driver-id'
    };
    
    console.log('Emergency SOS triggered:', emergencyData);
    // fetch('/api/emergency/sos', { method: 'POST', body: JSON.stringify(emergencyData) });
}

// Map functionality
function initializeMap() {
    const mapElement = document.getElementById('driverMap');
    if (!mapElement) return;

    // Clear existing map
    if (driverMap) {
        driverMap.remove();
    }

    driverMap = L.map('driverMap').setView([0.3476, 32.5825], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(driverMap);

    // Add user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLatLng = [position.coords.latitude, position.coords.longitude];
            driverMap.setView(userLatLng, 15);
            
            L.marker(userLatLng)
                .addTo(driverMap)
                .bindPopup(getTranslation('your_location'))
                .openPopup();

            // Add safety zones
            addSafetyZones(userLatLng);
            
            // Update map stats
            updateMapStats(12, 3, 8); // Sample data

        }, function(error) {
            console.warn('Geolocation failed:', error);
            addSampleMapData();
        });
    } else {
        addSampleMapData();
    }
}

function addSafetyZones(userLatLng) {
    const safetyZones = [
        { lat: userLatLng[0] + 0.01, lng: userLatLng[1] + 0.01, name: 'Safe Zone 1' },
        { lat: userLatLng[0] - 0.01, lng: userLatLng[1] - 0.01, name: 'Safe Zone 2' },
        { lat: userLatLng[0] + 0.02, lng: userLatLng[1] - 0.01, name: 'Safe Zone 3' }
    ];

    safetyZones.forEach(zone => {
        L.circle([zone.lat, zone.lng], {
            color: 'green',
            fillColor: '#30c230',
            fillOpacity: 0.2,
            radius: 500
        }).addTo(driverMap).bindPopup(zone.name);
    });
}

function addSampleMapData() {
    const hotspots = [
        { lat: 0.3476, lng: 32.5825, name: 'City Center', demand: 'High' },
        { lat: 0.3376, lng: 32.5725, name: 'Shopping Mall', demand: 'Medium' },
        { lat: 0.3576, lng: 32.5925, name: 'University', demand: 'High' }
    ];

    hotspots.forEach(hotspot => {
        L.circleMarker([hotspot.lat, hotspot.lng], {
            color: 'orange',
            fillColor: '#ffa500',
            fillOpacity: 0.6,
            radius: 8
        }).addTo(driverMap).bindPopup(`${hotspot.name}<br>Demand: ${hotspot.demand}`);
    });
    
    updateMapStats(8, 3, 5); // Sample data
}

function centerMapOnUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            driverMap.setView([position.coords.latitude, position.coords.longitude], 15);
            showMessage(getTranslation('location_centered'), 'success');
        });
    } else {
        showMessage(getTranslation('no_browser_support'), 'error');
    }
}

function findHotspots() {
    showMessage(getTranslation('find_hotspots'), 'info');
    
    // Simulate API call
    setTimeout(() => {
        showMessage(getTranslation('hotspots_updated'), 'success');
    }, 2000);
}

function toggleSafetyZones() {
    showMessage(getTranslation('safety_zones'), 'info');
}

function updateMapStats(passengers, hotspots, safeZones) {
    document.getElementById('nearbyPassengers').textContent = passengers;
    document.getElementById('hotspotAreas').textContent = hotspots;
    document.getElementById('safeZones').textContent = safeZones;
}

// Real Data Loading
async function loadRealData() {
    try {
        // Load driver stats
        await loadDriverStats();
        
        // Load ride requests
        await loadRideRequests();
        
        // Load trip history
        await loadTripHistory();
        
        // Update all charts
        initializeDashboardCharts();
        
    } catch (error) {
        console.error('Error loading real data:', error);
        showMessage(getTranslation('error_loading_data'), 'error');
    }
}

async function loadDriverStats() {
    try {
        // Simulate API call - replace with actual API endpoint
        const response = await fetch('/api/driver/stats');
        const data = await response.json();
        
        // Update dashboard with real data
        updateDashboardStats(data);
        
    } catch (error) {
        // Fallback to sample data for demo
        const sampleData = {
            todayEarnings: 45000,
            todayRides: 8,
            pendingRequests: 3,
            performanceRating: 4.8,
            trustScore: 92,
            weeklyEarnings: 245000,
            monthlyEarnings: 980000,
            totalEarnings: 2450000,
            acceptanceRate: 85,
            completionRate: 92,
            customerRating: 4.8,
            safetyScore: 98
        };
        
        updateDashboardStats(sampleData);
    }
}

function updateDashboardStats(data) {
    // Update stats cards
    document.getElementById('todayEarnings').textContent = `UGX ${data.todayEarnings?.toLocaleString() || '0'}`;
    document.getElementById('todayRides').textContent = data.todayRides || '0';
    document.getElementById('pendingRequests').textContent = data.pendingRequests || '0';
    document.getElementById('performanceRating').textContent = data.performanceRating ? `${data.performanceRating}⭐` : '0.0';
    document.getElementById('trustScore').textContent = data.trustScore ? `${data.trustScore}%` : '0%';
    
    // Update notification badge
    const badge = document.getElementById('pendingRequestsBadge');
    if (badge) {
        badge.textContent = data.pendingRequests || '0';
    }
    
    // Update performance metrics
    document.getElementById('acceptanceRate').textContent = data.acceptanceRate ? `${data.acceptanceRate}%` : '0%';
    document.getElementById('completionRate').textContent = data.completionRate ? `${data.completionRate}%` : '0%';
    document.getElementById('customerRating').textContent = data.customerRating ? `${data.customerRating}⭐` : '0.0';
    document.getElementById('safetyScore').textContent = data.safetyScore ? `${data.safetyScore}%` : '0%';
    
    // Update progress bars
    updateProgressBar('acceptanceRate', data.acceptanceRate || 0);
    updateProgressBar('completionRate', data.completionRate || 0);
    updateProgressBar('customerRating', (data.customerRating || 0) * 20); // Convert 5-star to percentage
    updateProgressBar('safetyScore', data.safetyScore || 0);
    
    // Update safety score circle
    updateSafetyScore(data.safetyScore || 0);
    
    // Update financial data
    document.getElementById('weeklyEarnings').textContent = `UGX ${data.weeklyEarnings?.toLocaleString() || '0'}`;
    document.getElementById('monthlyEarnings').textContent = `UGX ${data.monthlyEarnings?.toLocaleString() || '0'}`;
    document.getElementById('totalEarningsAmount').textContent = `UGX ${data.totalEarnings?.toLocaleString() || '0'}`;
}

function updateProgressBar(metricId, percentage) {
    const progressElement = document.querySelector(`#${metricId}`).closest('.metric').querySelector('.progress');
    if (progressElement) {
        progressElement.style.width = `${percentage}%`;
    }
}

function updateSafetyScore(score) {
    const scoreCircle = document.querySelector('.score-circle');
    const scoreValue = document.getElementById('safetyScoreValue');
    
    if (scoreCircle) {
        scoreCircle.style.background = `conic-gradient(#10b981 0% ${score}%, #e2e8f0 ${score}% 100%)`;
    }
    
    if (scoreValue) {
        scoreValue.textContent = `${score}%`;
    }
}

async function loadRideRequests() {
    try {
        // Simulate API call - replace with actual API endpoint
        const response = await fetch('/api/ride-requests');
        const data = await response.json();
        
        updateRideRequestsUI(data);
        
    } catch (error) {
        // Fallback to sample data for demo
        const sampleData = [
            {
                id: '1',
                passenger: { name: 'John D.', verified: true },
                pickup: 'City Center',
                destination: 'Airport',
                distance: '12 km',
                fare: 25000,
                requestedAt: new Date(Date.now() - 2 * 60000).toISOString()
            },
            {
                id: '2', 
                passenger: { name: 'Sarah M.', verified: true },
                pickup: 'Shopping Mall',
                destination: 'University',
                distance: '8 km',
                fare: 18000,
                requestedAt: new Date(Date.now() - 5 * 60000).toISOString()
            }
        ];
        
        updateRideRequestsUI(sampleData);
    }
}

function updateRideRequestsUI(requests) {
    const tbody = document.getElementById('rideRequestsBody');
    if (!tbody) return;
    
    if (requests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center;">${getTranslation('no_requests')}</td></tr>`;
        return;
    }
    
    tbody.innerHTML = requests.map(ride => `
        <tr>
            <td>${ride.passenger.name}</td>
            <td><span class="verification-badge">${ride.passenger.verified ? getTranslation('verified') : 'Unverified'}</span></td>
            <td>${ride.pickup}</td>
            <td>${ride.destination}</td>
            <td>${ride.distance}</td>
            <td>UGX ${ride.fare?.toLocaleString()}</td>
            <td>${formatTimeAgo(new Date(ride.requestedAt))}</td>
            <td>
                <button class="btn btn-accept" onclick="acceptRide('${ride.id}')">${getTranslation('accept')}</button>
                <button class="btn btn-decline" onclick="declineRide('${ride.id}')">${getTranslation('decline')}</button>
            </td>
        </tr>
    `).join('');
}

async function loadTripHistory() {
    try {
        // Simulate API call - replace with actual API endpoint
        const response = await fetch('/api/trip-history');
        const data = await response.json();
        
        updateTripHistoryUI(data);
        
    } catch (error) {
        // Fallback to sample data for demo
        const sampleData = [
            {
                route: 'City Center → Airport',
                datetime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                passenger: 'John D.',
                distance: '12 km',
                fare: 25000,
                rating: 5.0
            },
            {
                route: 'Shopping Mall → University', 
                datetime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                passenger: 'Sarah M.',
                distance: '8 km',
                fare: 18000,
                rating: 4.5
            }
        ];
        
        updateTripHistoryUI(sampleData);
    }
}

function updateTripHistoryUI(trips) {
    const tbody = document.getElementById('tripHistoryBody');
    if (!tbody) return;
    
    if (trips.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">${getTranslation('no_trips')}</td></tr>`;
        return;
    }
    
    tbody.innerHTML = trips.map(trip => `
        <tr>
            <td>${trip.route}</td>
            <td>${formatDateTime(new Date(trip.datetime))}</td>
            <td>${trip.passenger}</td>
            <td>${trip.distance}</td>
            <td>UGX ${trip.fare?.toLocaleString()}</td>
            <td>${trip.rating}⭐</td>
        </tr>
    `).join('');
    
    // Update summary
    const totalEarnings = trips.reduce((sum, trip) => sum + (trip.fare || 0), 0);
    const averageRating = trips.length > 0 ? trips.reduce((sum, trip) => sum + (trip.rating || 0), 0) / trips.length : 0;
    
    document.getElementById('totalEarnings').textContent = `UGX ${totalEarnings.toLocaleString()}`;
    document.getElementById('totalTrips').textContent = trips.length;
    document.getElementById('averageRating').textContent = averageRating.toFixed(1);
}

// Chart initialization
function initializeDashboardCharts() {
    initializeEarningsChart();
    initializePerformanceChart();
}

function initializeEarningsChart() {
    const ctx = document.getElementById('earningsChart')?.getContext('2d');
    if (!ctx) return;
    
    if (earningsChart) {
        earningsChart.destroy();
    }
    
    // Sample data - replace with real data from API
    const earningsData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: getTranslation('daily_earnings'),
            data: [35000, 42000, 38000, 45000, 52000, 48000, 55000],
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 2,
            borderRadius: 6
        }]
    };
    
    earningsChart = new Chart(ctx, {
        type: 'bar',
        data: earningsData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${getTranslation('earnings')}: UGX ${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return `UGX ${value.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    });
}

function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart')?.getContext('2d');
    if (!ctx) return;
    
    if (performanceChart) {
        performanceChart.destroy();
    }
    
    // Sample data - replace with real data from API
    const performanceData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: getTranslation('performance_score'),
            data: [75, 82, 78, 85, 88, 92],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };
    
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: performanceData,
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
                    max: 100
                }
            }
        }
    });
}

function initializeFinancialCharts() {
    const ctx = document.getElementById('earningsBreakdownChart')?.getContext('2d');
    if (!ctx) return;
    
    if (earningsBreakdownChart) {
        earningsBreakdownChart.destroy();
    }
    
    // Sample data - replace with real data from API
    const breakdownData = {
        labels: [
            getTranslation('ride_fares'),
            getTranslation('tips'),
            getTranslation('bonuses'),
            getTranslation('other')
        ],
        datasets: [{
            data: [65, 15, 15, 5],
            backgroundColor: [
                '#3b82f6',
                '#10b981', 
                '#f59e0b',
                '#6b7280'
            ]
        }]
    };
    
    earningsBreakdownChart = new Chart(ctx, {
        type: 'doughnut',
        data: breakdownData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Utility functions
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return getTranslation('just_now');
    if (diffMins < 60) return `${diffMins} ${getTranslation('minutes_ago')}`;
    if (diffHours < 24) return `${diffHours} ${getTranslation('hours_ago')}`;
    return `${diffDays} ${getTranslation('days_ago')}`;
}

function formatDateTime(date) {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }),
                error => reject(error)
            );
        } else {
            reject(new Error('Geolocation not supported'));
        }
    });
}

function checkMediaPermissions() {
    // Check if browser supports media devices
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showMessage(getTranslation('no_browser_support'), 'warning');
        return false;
    }
    return true;
}

// Online/Offline functionality
function goOnline() {
    updateDriverStatus(true);
    showMessage(getTranslation('going_online'), 'success');
    loadRideRequests(); // Refresh requests when going online
}

function goOffline() {
    updateDriverStatus(false);
    showMessage(getTranslation('going_offline'), 'info');
}

function updateDriverStatus(online) {
    const statusElement = document.getElementById('driverStatus');
    const statusTextElement = document.getElementById('statusText');
    
    if (statusElement) {
        statusElement.textContent = online ? getTranslation('online') : getTranslation('offline');
        statusElement.className = online ? 'status-online' : 'status-offline';
    }
    
    if (statusTextElement) {
        statusTextElement.textContent = online ? getTranslation('available_for_rides') : getTranslation('not_available');
    }
}

// Ride management
async function acceptRide(rideId) {
    try {
        // Simulate API call
        await fetch(`/api/rides/${rideId}/accept`, { method: 'POST' });
        showMessage(getTranslation('ride_accepted'), 'success');
        
        // Refresh ride requests
        setTimeout(() => loadRideRequests(), 1000);
        
    } catch (error) {
        console.error('Error accepting ride:', error);
        showMessage('Error accepting ride', 'error');
    }
}

async function declineRide(rideId) {
    try {
        // Simulate API call
        await fetch(`/api/rides/${rideId}/decline`, { method: 'POST' });
        showMessage(getTranslation('ride_declined'), 'info');
        
        // Refresh ride requests
        setTimeout(() => loadRideRequests(), 1000);
        
    } catch (error) {
        console.error('Error declining ride:', error);
        showMessage('Error declining ride', 'error');
    }
}

// Incident reporting
async function submitIncident() {
    const form = document.getElementById('incidentForm');
    const formData = new FormData(form);
    
    try {
        // Include media files if available
        const audioPreview = document.getElementById('audioPreview');
        const videoPreview = document.getElementById('videoPreview');
        
        if (audioPreview && audioPreview.src) {
            // Convert audio URL to blob and add to form data
            const audioBlob = await fetch(audioPreview.src).then(r => r.blob());
            formData.append('audio', audioBlob, 'voice-note.webm');
        }
        
        if (videoPreview && videoPreview.src) {
            // Convert video URL to blob and add to form data
            const videoBlob = await fetch(videoPreview.src).then(r => r.blob());
            formData.append('video', videoBlob, 'emergency-video.webm');
        }
        
        // Simulate API call
        await fetch('/api/incidents', {
            method: 'POST',
            body: formData
        });
        
        showMessage(getTranslation('incident_submitted'), 'success');
        form.reset();
        
        // Clear media previews
        if (audioPreview) {
            audioPreview.src = '';
            audioPreview.style.display = 'none';
        }
        if (videoPreview) {
            videoPreview.src = '';
            videoPreview.style.display = 'none';
        }
        
        // Return to dashboard
        setTimeout(() => showSection('dashboard'), 2000);
        
    } catch (error) {
        console.error('Error submitting incident:', error);
        showMessage('Error submitting incident report', 'error');
    }
}

// Support chat
function toggleSupportChat() {
    const chatContainer = document.getElementById('supportChatContainer');
    if (chatContainer) {
        chatContainer.classList.toggle('active');
    }
}

function sendSupportMessage() {
    const input = document.getElementById('supportMessageInput');
    const message = input.value.trim();
    
    if (message) {
        const messagesContainer = document.getElementById('supportChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.innerHTML = `<p>${message}</p>`;
        messagesContainer.appendChild(messageDiv);
        
        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simulate support response
        setTimeout(() => {
            const responseDiv = document.createElement('div');
            responseDiv.className = 'message support';
            responseDiv.innerHTML = `<p>${getTranslation('support_welcome')}</p>`;
            messagesContainer.appendChild(responseDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }
}

// Message system
function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <span class="message-text">${message}</span>
        <button class="message-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    messageContainer.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
}

// Refresh functionality
function refreshDashboard() {
    loadRealData();
    showMessage(getTranslation('data_loaded'), 'success');
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any ongoing recordings
        if (isRecording) {
            stopVoiceRecording();
            stopVideoRecording();
        }
        
        // Redirect to logout
        window.location.href = '/logout';
    }
}

// Export functions for global access
window.showSection = showSection;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.changeLanguage = changeLanguage;
window.refreshDashboard = refreshDashboard;
window.acceptRide = acceptRide;
window.declineRide = declineRide;
window.submitIncident = submitIncident;
window.startVoiceRecording = startVoiceRecording;
window.stopVoiceRecording = stopVoiceRecording;
window.startVideoRecording = startVideoRecording;
window.stopVideoRecording = stopVideoRecording;
window.startVoiceNoteRecording = startVoiceNoteRecording;
window.testVideoRecording = testVideoRecording;
window.toggleSafetyMode = toggleSafetyMode;
window.logFatigue = logFatigue;
window.testVoiceCommand = function() {
    if (recognition) {
        recognition.start();
        showMessage('Say "SafeMove Help" to test', 'info');
    } else {
        showMessage('Voice recognition not available', 'error');
    }
};
window.goOnline = goOnline;
window.goOffline = goOffline;
window.centerMapOnUser = centerMapOnUser;
window.findHotspots = findHotspots;
window.toggleSafetyZones = toggleSafetyZones;
window.toggleSupportChat = toggleSupportChat;
window.sendSupportMessage = sendSupportMessage;
window.logout = logout;

// Placeholder functions for features to be implemented
window.showWalletAnalytics = function() { showMessage('Wallet analytics feature coming soon', 'info'); };
window.showGoalsManager = function() { showMessage('Goals manager feature coming soon', 'info'); };
window.redeemRewards = function() { showMessage('Rewards redemption feature coming soon', 'info'); };
window.showAllRewards = function() { showMessage('Rewards catalog feature coming soon', 'info'); };
window.viewFullProfile = function() { showMessage('Full profile view feature coming soon', 'info'); };
window.shareProfile = function() { showMessage('Profile sharing feature coming soon', 'info'); };
window.startTraining = function() { showMessage('Training center feature coming soon', 'info'); };
window.viewFullLog = function() { showMessage('Full incident log feature coming soon', 'info'); };
window.enterForum = function() { showMessage('Community forum feature coming soon', 'info'); };
window.createPost = function() { showMessage('Post creation feature coming soon', 'info'); };
window.viewSpotlight = function() { showMessage('Driver spotlight feature coming soon', 'info'); };
window.nominateDriver = function() { showMessage('Driver nomination feature coming soon', 'info'); };
window.contactCounselor = function() { showMessage('Counselor contact feature coming soon', 'info'); };
window.showWellnessTips = function() { showMessage('Wellness tips feature coming soon', 'info'); };
window.filterTripHistory = function() { loadTripHistory(); };

// Initialize the app
initializeDriverApp();