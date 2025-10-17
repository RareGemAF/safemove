// Enhanced NovaMove Passenger Dashboard Functionality
let socket = null;
let currentLanguage = 'en';
let selectedTransportMode = null;
let selectedPaymentMethod = null;
let selectedDriver = null;
let mediaRecorder = null;
let audioChunks = [];
let videoChunks = [];
let isRecording = false;
let recordingTimer = null;
let recordingStartTime = null;
let currentRide = null;
let availableDrivers = [];
let currentLocation = null;
let map = null;
let routePolyline = null;

// Social Media Links
const socialLinks = {
    facebook: 'https://www.facebook.com/groups/4303641976577780',
    instagram: 'https://www.instagram.com/novamove2025?utm_source=qr&igsh=MXYyZmZlY2E3Y3gwNg==',
    twitter: 'https://x.com/NovaMove2025',
    linkedin: 'https://www.linkedin.com/company/nova-move/'
};

// Language translations
const translations = {
    en: {
        // Navigation
        dashboard: "Dashboard",
        available_drivers: "Available Drivers",
        ride_history: "Ride History",
        safety_center: "Safety Center",
        trusted_contacts: "Trusted Contacts",
        verification: "Verification",
        settings: "Settings",
        
        // Dashboard
        passenger_dashboard: "Passenger Dashboard",
        welcome_message: "Welcome back! Your safety is our priority.",
        welcome_user: "Welcome, User",
        logout: "Logout",
        request_ride: "Request a Ride",
        get_safe_ride: "Get a safe ride to your destination",
        pickup_location: "Pickup Location",
        enter_pickup: "Enter your pickup address",
        destination: "Destination",
        enter_destination: "Enter your destination",
        transport_mode: "Transport Mode",
        moto: "Moto",
        car: "Car",
        taxi: "Taxi",
        bus: "Bus",
        calculate_fare: "Calculate Fare",
        request_ride: "Request Ride",
        available_drivers: "Available Drivers",
        loading_drivers: "Loading available drivers...",
        view_all_drivers: "View All Drivers",
        safety_features: "Safety Features",
        emergency_sos: "Emergency SOS",
        in_app_calling: "In-App Calling",
        safety_checkins: "Safety Check-ins",
        incident_reporting: "Incident Reporting",
        current_ride: "Current Ride",
        pickup: "Pickup",
        fare: "Fare",
        driver: "Driver",
        vehicle: "Vehicle",
        plate: "Plate",
        scan_plate: "Scan Plate",
        cancel_ride: "Cancel Ride",
        call_driver: "Call Driver",
        
        // Driver Details
        driver_details: "Driver Details",
        rating: "Rating",
        vehicle_type: "Vehicle Type",
        license_plate: "License Plate",
        contact: "Contact",
        email: "Email",
        select_driver: "Select Driver",
        book_ride: "Book Ride",
        
        // Safety Center
        sos_description: "In case of emergency, press the SOS button to alert authorities and your trusted contacts",
        trigger_emergency: "Trigger Emergency Alert",
        sos_immediate: "Immediate notification to authorities",
        voice_sos: "Voice SOS",
        record_voice_alert: "Record and send voice alert",
        test_sos: "Test SOS Feature",
        test_safely: "Test safely without real alert",
        report_safety_concerns: "Report any safety concerns or incidents during your ride",
        text_report: "Text Report",
        voice_report: "Voice Report",
        video_report: "Video Report",
        safety_checkins_desc: "Regular check-ins during your ride to ensure your safety",
        automatic_checkins: "Automatic Check-ins",
        notify_contacts: "Notify Trusted Contacts",
        
        // Safety Tips
        safety_tips: "Safety Tips",
        verify_driver_details: "Always verify driver and vehicle details before entering",
        share_ride_details: "Share your ride details with trusted contacts",
        sit_back_seat: "Sit in the back seat for maximum safety",
        use_in_app_comms: "Use in-app communication instead of personal numbers",
        trust_instincts: "Trust your instincts - if something feels wrong, cancel the ride",
        
        // Trusted Contacts
        trusted_contacts_desc: "Add people who will be notified in case of emergency",
        add_contact: "Add Contact",
        loading_contacts: "Loading contacts...",
        notification_settings: "Notification Settings",
        notify_start_ride: "Notify contacts when I start a ride",
        notify_emergency: "Notify contacts in case of emergency",
        notify_safety_checkin: "Notify contacts for safety check-in failures",
        save_settings: "Save Settings",
        
        // Verification
        face_verification: "Face Verification",
        verification_pending: "Verification Pending",
        face_verification_desc: "Verify your identity for enhanced security",
        start_verification: "Start Verification",
        retake_photo: "Retake Photo",
        account_security: "Account Security",
        two_factor_auth: "Two-Factor Authentication",
        encrypted_data: "Encrypted Data",
        secure_payments: "Secure Payments",
        enhance_security: "Enhance Security",
        verification_guide: "Verification Guide",
        step_one: "Position Your Face",
        step_one_desc: "Ensure your face is clearly visible in good lighting",
        step_two: "Remove Accessories",
        step_two_desc: "Remove hats, sunglasses, or anything covering your face",
        step_three: "Follow Instructions",
        step_three_desc: "Follow the on-screen instructions for verification",
        
        // Settings
        account_settings: "Account Settings",
        full_name: "Full Name",
        enter_full_name: "Your full name",
        enter_email: "Your email",
        phone_number: "Phone Number",
        enter_phone: "Your phone number",
        update_profile: "Update Profile",
        privacy_security: "Privacy & Security",
        share_live_location: "Share live location with trusted contacts",
        enable_safety_checkins: "Enable safety check-ins",
        share_ride_history: "Share ride history for safety improvements",
        save_preferences: "Save Preferences",
        payment_methods: "Payment Methods",
        mobile_money: "Mobile Money",
        mobile_money_desc: "Pay with MTN, Airtel Money",
        paypal_desc: "Secure PayPal payments",
        credit_card: "Credit Card",
        card_desc: "Visa, MasterCard, Amex",
        pesapal_desc: "Local payment solution",
        scan_card: "Scan Card",
        
        // SOS and Incident
        sos: "SOS",
        emergency_options: "Emergency Options",
        immediate_help: "Immediate help from authorities",
        record_voice_message: "Record and send voice message",
        medical_emergency: "Medical Emergency",
        medical_assistance: "Request medical assistance",
        record_voice_sos: "Record Voice SOS",
        recording: "Recording...",
        stop_recording: "Stop Recording",
        cancel: "Cancel",
        send_sos: "Send SOS",
        re_record: "Re-record",
        download: "Download",
        report_incident: "Report Incident",
        incident_category: "Incident Category",
        select_category: "Select Category",
        describe_incident: "Please describe the incident in detail...",
        add_evidence: "Add Evidence (Optional)",
        record_voice: "Record Voice",
        record_video: "Record Video",
        upload_file: "Upload File",
        
        // General
        refresh: "Refresh",
        back_to_dashboard: "Back to Dashboard",
        loading_history: "Loading ride history...",
        scan_plate: "Scan Vehicle Plate",
        start_scanning: "Start Scanning",
        stop_scanning: "Stop Scanning",
        capture_face: "Capture Face",
        close: "Close",
        details: "Details",
        language_changed: "Language changed to",
        no_drivers_available: "No drivers available in your area"
    },
    lg: {
        dashboard: "Dashiboodi",
        available_drivers: "Babaddayiva abaliwo",
        passenger_dashboard: "Dashiboodi ya Passenja",
        welcome_message: "Tukwaniriza! Obulamu bwo obukuumibwa",
        request_ride: "Saba Ride",
        pickup_location: "Ekitundu okusibira",
        destination: "Ekitundu ogenda",
        moto: "Boda boda",
        car: "Emotoka",
        emergency_sos: "SOS ey'okubuuza"
    },
    sw: {
        dashboard: "Dashibodi",
        available_drivers: "Madereva Walipo",
        passenger_dashboard: "Dashibodi ya Abiria",
        welcome_message: "Karibu tena! Usalama wako ni kipaumbele chetu",
        request_ride: "Omba Safari",
        pickup_location: "Mahali pa kuchukuliwa",
        destination: "Lengo",
        moto: "Pikipiki",
        car: "Gari",
        emergency_sos: "SOS ya Dharura"
    },
    tt: {
        dashboard: "Dashiboodi",
        available_drivers: "Abasaija b'emmotoka abaliho",
        passenger_dashboard: "Dashiboodi ya Mugenzi",
        welcome_message: "Tukushemererwa! Obulamu bwo oburindirwe",
        request_ride: "Kuba ride",
        moto: "Boda",
        car: "Emotoka"
    },
    ny: {
        dashboard: "Dashiboodi", 
        available_drivers: "Abasaija b'emmotoka abariho",
        passenger_dashboard: "Dashiboodi ya Mugenzi",
        welcome_message: "Tukuhimbiire! Obulamu bwo oburindirwe",
        request_ride: "Kuba ride",
        moto: "Boda",
        car: "Emotoka"
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializePassengerApp();
    setupEventListeners();
    loadLanguagePreference();
    connectToSocket();
    loadInitialData();
    getCurrentLocation();
    initializeSocialMediaSidebar();
});

function initializeSocialMediaSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'social-media-sidebar';
    sidebar.innerHTML = `
        <a href="${socialLinks.facebook}" target="_blank" class="social-icon facebook" title="Facebook">
            <i class="fab fa-facebook-f"></i>
        </a>
        <a href="${socialLinks.instagram}" target="_blank" class="social-icon instagram" title="Instagram">
            <i class="fab fa-instagram"></i>
        </a>
        <a href="${socialLinks.twitter}" target="_blank" class="social-icon twitter" title="Twitter">
            <i class="fab fa-twitter"></i>
        </a>
        <a href="${socialLinks.linkedin}" target="_blank" class="social-icon linkedin" title="LinkedIn">
            <i class="fab fa-linkedin-in"></i>
        </a>
    `;
    document.body.appendChild(sidebar);
}

function initializePassengerApp() {
    setupNavigation();
    updatePageLanguage();
}

function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        loadSectionData(sectionId);
    }
}

function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'availableDrivers':
            loadAvailableDrivers();
            break;
        case 'rideHistory':
            loadRideHistory();
            break;
        case 'trustedContacts':
            loadTrustedContacts();
            break;
        case 'verification':
            checkVerificationStatus();
            break;
    }
}

function setupEventListeners() {
    // Transport mode selection
    document.querySelectorAll('.mode-option').forEach(option => {
        option.addEventListener('click', function() {
            selectTransportMode(this.getAttribute('data-mode'));
        });
    });

    // Payment method selection
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            selectPaymentMethod(this.getAttribute('data-method'));
        });
    });

    // Form submissions
    const incidentForm = document.getElementById('incidentForm');
    if (incidentForm) {
        incidentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await submitIncidentReport();
        });
    }

    const addContactForm = document.getElementById('addContactForm');
    if (addContactForm) {
        addContactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await addTrustedContact();
        });
    }

    // Auto-detect location for pickup
    const pickupInput = document.getElementById('pickupLocation');
    if (pickupInput) {
        pickupInput.addEventListener('focus', function() {
            if (!this.value && currentLocation) {
                this.value = `Near ${currentLocation.address || 'your current location'}`;
            }
        });
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
}

function getTranslation(key) {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
}

function getLanguageName(code) {
    const languages = {
        'en': 'English',
        'lg': 'Luganda',
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
    }
}

// Socket.io connection
function connectToSocket() {
    socket = io();
    
    socket.on('connect', () => {
        console.log('Connected to server');
        showMessage('Connected to real-time updates', 'success');
    });

    // Real-time ride updates
    socket.on('ride-status-update', (data) => {
        showMessage(`Ride update: ${data.ride.status}`, 'info');
        updateRideStatus(data.ride);
    });

    // SOS responses
    socket.on('sos-response', (data) => {
        showMessage(`Emergency services notified. Help is on the way!`, 'success');
    });

    // New messages
    socket.on('new-message', (data) => {
        showMessage(`New message: ${data.message}`, 'info');
    });

    // Driver location updates
    socket.on('driver-location-update', (data) => {
        updateDriverLocation(data);
    });
}

// Load initial data
async function loadInitialData() {
    await loadAvailableDrivers();
    await loadActiveRide();
    await loadTrustedContacts();
    checkVerificationStatus();
}

// Location services
async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    try {
                        // Reverse geocoding to get address
                        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
                        const data = await response.json();
                        
                        currentLocation = {
                            lat: lat,
                            lng: lng,
                            address: data.locality || data.city || 'Current Location'
                        };
                        
                        // Auto-fill pickup location
                        const pickupInput = document.getElementById('pickupLocation');
                        if (pickupInput && !pickupInput.value) {
                            pickupInput.value = `Near ${currentLocation.address}`;
                        }
                        
                        resolve(currentLocation);
                    } catch (error) {
                        currentLocation = { lat, lng, address: 'Current Location' };
                        resolve(currentLocation);
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    showMessage('Unable to get your location. Please enter manually.', 'warning');
                    reject(error);
                }
            );
        } else {
            showMessage('Geolocation is not supported by this browser.', 'error');
            reject(new Error('Geolocation not supported'));
        }
    });
}

// Available Drivers functionality
async function loadAvailableDrivers() {
    try {
        showLoading('driversPreview', getTranslation('loading_drivers'));
        
        // Simulate API call - replace with actual endpoint
        setTimeout(() => {
            const mockDrivers = [
                {
                    _id: '1',
                    name: 'John Kamya',
                    photoUrl: 'https://ui-avatars.com/api/?name=John+Kamya&background=3B82F6&color=fff',
                    rating: 4.8,
                    vehicleType: 'Car',
                    plate: 'UAB 123A',
                    phone: '+256 712 345 678',
                    email: 'john.kamya@example.com',
                    fareEstimates: { moto: '5,000', car: '10,000', taxi: '15,000', bus: '2,000' }
                },
                {
                    _id: '2',
                    name: 'Sarah Nakato',
                    photoUrl: 'https://ui-avatars.com/api/?name=Sarah+Nakato&background=10B981&color=fff',
                    rating: 4.9,
                    vehicleType: 'Moto',
                    plate: 'UCD 456B',
                    phone: '+256 773 987 654',
                    email: 'sarah.nakato@example.com',
                    fareEstimates: { moto: '4,500', car: '9,500', taxi: '14,000', bus: '1,800' }
                }
            ];
            
            availableDrivers = mockDrivers;
            updateDriversUI(availableDrivers);
        }, 1000);
        
    } catch (error) {
        console.error('Error loading drivers:', error);
        showMessage(getTranslation('no_drivers_available'), 'error');
        document.getElementById('driversPreview').innerHTML = `
            <div class="no-data">
                <i class="fas fa-car"></i>
                <p>${getTranslation('no_drivers_available')}</p>
            </div>
        `;
    }
}

function updateDriversUI(drivers) {
    const driversGrid = document.getElementById('driversGrid');
    const driversPreview = document.getElementById('driversPreview');
    
    if (!drivers || drivers.length === 0) {
        const noDriversHTML = `
            <div class="no-data">
                <i class="fas fa-car"></i>
                <p>${getTranslation('no_drivers_available')}</p>
            </div>
        `;
        if (driversGrid) driversGrid.innerHTML = noDriversHTML;
        if (driversPreview) driversPreview.innerHTML = noDriversHTML;
        return;
    }

    const driverCardHTML = drivers.map(driver => `
        <div class="driver-card">
            <div class="driver-header">
                <img src="${driver.photoUrl}" 
                     alt="${driver.name}" class="driver-avatar">
                <div class="driver-info">
                    <div class="driver-name">${driver.name}</div>
                    <div class="driver-rating">
                        <i class="fas fa-star"></i>
                        <span>${driver.rating || '4.5'}</span>
                    </div>
                </div>
            </div>
            <div class="driver-details">
                <div class="driver-detail">
                    <span class="detail-label">${getTranslation('vehicle_type')}</span>
                    <span class="detail-value">${driver.vehicleType || 'Car'}</span>
                </div>
                <div class="driver-detail">
                    <span class="detail-label">${getTranslation('license_plate')}</span>
                    <div class="vehicle-plate">${driver.plate || 'NOT SET'}</div>
                </div>
            </div>
            <div class="fare-estimates" style="margin: 12px 0; padding: 12px; background: var(--gray-100); border-radius: 8px;">
                <div class="fare-item" style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span>Moto:</span>
                    <span style="font-weight: 600; color: var(--success);">${driver.fareEstimates?.moto || '5,000'} UGX</span>
                </div>
                <div class="fare-item" style="display: flex; justify-content: space-between;">
                    <span>Car:</span>
                    <span style="font-weight: 600; color: var(--success);">${driver.fareEstimates?.car || '10,000'} UGX</span>
                </div>
            </div>
            <div class="driver-actions">
                <button class="btn btn-primary btn-sm" onclick="selectDriver('${driver._id}')">
                    <i class="fas fa-check"></i>
                    ${getTranslation('select_driver')}
                </button>
                <button class="btn btn-secondary btn-sm" onclick="showDriverDetails('${driver._id}')">
                    <i class="fas fa-info"></i>
                    ${getTranslation('details')}
                </button>
            </div>
        </div>
    `).join('');

    if (driversGrid) driversGrid.innerHTML = driverCardHTML;
    if (driversPreview) driversPreview.innerHTML = driverCardHTML;
}

function showDriverDetails(driverId) {
    const driver = availableDrivers.find(d => d._id === driverId);
    if (!driver) return;

    const modalContent = `
        <div class="driver-detail-modal">
            <div class="driver-header" style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                <img src="${driver.photoUrl}" 
                     alt="${driver.name}" class="driver-avatar" style="width: 80px; height: 80px; border-radius: 50%;">
                <div class="driver-info">
                    <h3 style="margin: 0 0 8px 0;">${driver.name}</h3>
                    <div class="driver-rating" style="display: flex; align-items: center; gap: 4px; color: var(--warning);">
                        <i class="fas fa-star"></i>
                        <span>${driver.rating || '4.5'} (${driver.totalRides || '50'} rides)</span>
                    </div>
                </div>
            </div>
            <div class="driver-details-grid" style="display: grid; gap: 12px;">
                <div class="detail-item" style="display: flex; justify-content: space-between;">
                    <strong>${getTranslation('vehicle_type')}:</strong>
                    <span>${driver.vehicleType || 'Car'}</span>
                </div>
                <div class="detail-item" style="display: flex; justify-content: space-between;">
                    <strong>${getTranslation('license_plate')}:</strong>
                    <span class="vehicle-plate">${driver.plate || 'NOT SET'}</span>
                </div>
                <div class="detail-item" style="display: flex; justify-content: space-between;">
                    <strong>${getTranslation('contact')}:</strong>
                    <span>${driver.phone || 'Not available'}</span>
                </div>
                <div class="detail-item" style="display: flex; justify-content: space-between;">
                    <strong>${getTranslation('email')}:</strong>
                    <span>${driver.email || 'Not available'}</span>
                </div>
            </div>
            <div class="modal-actions" style="display: flex; gap: 12px; margin-top: 24px;">
                <button class="btn btn-primary" onclick="selectDriver('${driver._id}'); closeModal('driverDetailModal');">
                    <i class="fas fa-car"></i>
                    ${getTranslation('book_ride')}
                </button>
                <button class="btn btn-secondary" onclick="closeModal('driverDetailModal')">
                    <i class="fas fa-times"></i>
                    ${getTranslation('close')}
                </button>
            </div>
        </div>
    `;

    document.getElementById('driverDetailContent').innerHTML = modalContent;
    document.getElementById('driverDetailModal').style.display = 'block';
}

function selectDriver(driverId) {
    const driver = availableDrivers.find(d => d._id === driverId);
    if (!driver) return;

    selectedDriver = driver;
    showMessage(`Selected driver: ${driver.name}`, 'success');
    
    // Enable ride request button
    const requestBtn = document.getElementById('requestRideBtn');
    if (requestBtn) {
        requestBtn.style.display = 'flex';
    }
}

// Transport mode selection
function selectTransportMode(mode) {
    selectedTransportMode = mode;
    
    // Update UI
    document.querySelectorAll('.mode-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`.mode-option[data-mode="${mode}"]`).classList.add('selected');
    
    calculateFare();
}

// Fare calculation
async function calculateFare() {
    const pickup = document.getElementById('pickupLocation').value;
    const destination = document.getElementById('destination').value;
    
    if (!pickup || !destination || !selectedTransportMode) {
        showMessage('Please enter pickup, destination and select transport mode', 'error');
        return;
    }

    try {
        // Simulate fare calculation
        const baseFares = {
            moto: 4000,
            car: 8000,
            taxi: 12000,
            bus: 1500
        };
        
        const distance = Math.random() * 20 + 2; // Random distance 2-22 km
        const baseFare = baseFares[selectedTransportMode] || 5000;
        const fare = Math.round(baseFare + (distance * 300));
        
        showMessage(`Estimated fare: ${fare.toLocaleString()} UGX`, 'success');
        
    } catch (error) {
        console.error('Error calculating fare:', error);
        showMessage('Error calculating fare', 'error');
    }
}

// Enhanced Incident Reporting System
function showIncidentForm(type) {
    document.getElementById('incidentType').value = type;
    
    if (type === 'voice') {
        startVoiceIncidentRecording();
    } else if (type === 'video') {
        startVideoIncidentRecording();
    } else {
        document.getElementById('incidentModal').style.display = 'block';
    }
}

async function startVoiceIncidentRecording() {
    document.getElementById('voiceIncidentModal').style.display = 'block';
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        // Create waveform visualization
        const waveform = document.getElementById('voiceWaveform');
        waveform.innerHTML = Array.from({length: 50}, () => '<div class="wave-bar"></div>').join('');

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Add to incident form
            const evidencePreview = document.getElementById('evidencePreview');
            evidencePreview.innerHTML = `
                <div class="evidence-item">
                    <div>
                        <strong>Voice Recording</strong>
                        <audio controls src="${audioUrl}" style="width: 100%; margin-top: 8px;"></audio>
                    </div>
                    <div class="evidence-actions">
                        <button class="btn-sm danger" onclick="this.parentElement.parentElement.remove()">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            window.currentIncidentRecording = audioBlob;
            stream.getTracks().forEach(track => track.stop());
            stopRecordingTimer();
            closeModal('voiceIncidentModal');
            
            // Show incident form with the recording
            document.getElementById('incidentModal').style.display = 'block';
        };

        mediaRecorder.start();
        startRecordingTimer('incidentVoiceTimer');
        showMessage('Voice recording started. Describe the incident.', 'info');
        
    } catch (error) {
        console.error('Error starting voice recording:', error);
        showMessage('Error accessing microphone. Please check permissions.', 'error');
        closeModal('voiceIncidentModal');
    }
}

async function startVideoIncidentRecording() {
    document.getElementById('videoIncidentModal').style.display = 'block';
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const liveVideo = document.getElementById('liveIncidentVideo');
        liveVideo.srcObject = stream;
        
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
        videoChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                videoChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(videoBlob);
            
            // Add to incident form
            const evidencePreview = document.getElementById('evidencePreview');
            evidencePreview.innerHTML = `
                <div class="evidence-item">
                    <div>
                        <strong>Video Recording</strong>
                        <video controls src="${videoUrl}" style="width: 100%; max-height: 200px; margin-top: 8px;"></video>
                    </div>
                    <div class="evidence-actions">
                        <button class="btn-sm danger" onclick="this.parentElement.parentElement.remove()">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            window.currentIncidentVideo = videoBlob;
            stream.getTracks().forEach(track => track.stop());
            stopRecordingTimer();
            closeModal('videoIncidentModal');
            
            // Show incident form with the recording
            document.getElementById('incidentModal').style.display = 'block';
        };

        mediaRecorder.start();
        startRecordingTimer('incidentVideoTimer');
        showMessage('Video recording started. Record the incident clearly.', 'info');
        
    } catch (error) {
        console.error('Error starting video recording:', error);
        showMessage('Error accessing camera. Please check permissions.', 'error');
        closeModal('videoIncidentModal');
    }
}

function stopIncidentRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        showMessage('Recording completed', 'success');
    }
}

function stopVideoIncidentRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        showMessage('Video recording completed', 'success');
    }
}

function closeVoiceIncidentRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
    closeModal('voiceIncidentModal');
    stopRecordingTimer();
}

function closeVideoIncidentRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
    closeModal('videoIncidentModal');
    stopRecordingTimer();
}

function uploadIncidentFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*,.pdf,.doc,.docx';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            const evidencePreview = document.getElementById('evidencePreview');
            
            let previewHTML = '';
            if (file.type.startsWith('image/')) {
                previewHTML = `<img src="${fileUrl}" style="max-width: 100%; height: auto; border-radius: 4px;">`;
            } else if (file.type.startsWith('video/')) {
                previewHTML = `<video src="${fileUrl}" controls style="max-width: 100%; height: auto;"></video>`;
            } else {
                previewHTML = `<div><i class="fas fa-file"></i> ${file.name}</div>`;
            }
            
            evidencePreview.innerHTML += `
                <div class="evidence-item">
                    <div>
                        <strong>Uploaded File</strong>
                        <div style="margin-top: 8px;">
                            ${previewHTML}
                        </div>
                    </div>
                    <div class="evidence-actions">
                        <button class="btn-sm danger" onclick="this.parentElement.parentElement.remove()">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }
    };
    input.click();
}

async function submitIncidentReport() {
    const form = document.getElementById('incidentForm');
    const formData = new FormData(form);
    
    try {
        showMessage('Submitting incident report...', 'info');
        
        // Simulate API call
        setTimeout(() => {
            showMessage('Incident reported successfully! Our team will review it.', 'success');
            closeModal('incidentModal');
            form.reset();
            document.getElementById('evidencePreview').innerHTML = '';
            
            // Emit real-time incident report
            if (socket) {
                socket.emit('incident-reported', {
                    passengerId: 'current-user',
                    type: formData.get('category'),
                    description: formData.get('description'),
                    timestamp: new Date().toISOString()
                });
            }
        }, 2000);
        
    } catch (error) {
        console.error('Error reporting incident:', error);
        showMessage('Error reporting incident', 'error');
    }
}

// Enhanced Booking System
function requestRide() {
    if (!selectedDriver) {
        showMessage('Please select a driver first', 'error');
        showSection('availableDrivers');
        return;
    }
    
    showBookingConfirmation();
}

function showBookingConfirmation() {
    if (!selectedDriver || !selectedTransportMode) {
        showMessage('Please select both driver and transport mode', 'error');
        return;
    }

    const pickup = document.getElementById('pickupLocation').value;
    const destination = document.getElementById('destination').value;
    
    if (!pickup || !destination) {
        showMessage('Please enter pickup and destination locations', 'error');
        return;
    }

    const modalContent = `
        <div class="booking-confirmation">
            <div class="confirmation-header" style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: var(--success); margin-bottom: 8px;">Ready to Book!</h3>
                <p>Confirm your ride details</p>
            </div>
            
            <div class="confirmation-details" style="background: var(--gray-100); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <strong>Driver:</strong>
                    <span>${selectedDriver.name}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <strong>Vehicle:</strong>
                    <span>${selectedDriver.vehicleType} - ${selectedDriver.plate}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <strong>Mode:</strong>
                    <span>${selectedTransportMode.toUpperCase()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <strong>Pickup:</strong>
                    <span>${pickup}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <strong>Destination:</strong>
                    <span>${destination}</span>
                </div>
            </div>
            
            <div class="payment-section">
                <h4 style="margin-bottom: 12px;">Select Payment Method</h4>
                <div class="payment-methods">
                    <div class="payment-option ${selectedPaymentMethod === 'mobile_money' ? 'selected' : ''}" onclick="selectPaymentMethod('mobile_money')">
                        <div class="payment-icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <div class="payment-info">
                            <span class="payment-name">Mobile Money</span>
                            <span class="payment-desc">Pay with MTN, Airtel Money</span>
                        </div>
                    </div>
                    
                    <div class="payment-option ${selectedPaymentMethod === 'card' ? 'selected' : ''}" onclick="selectPaymentMethod('card')">
                        <div class="payment-icon">
                            <i class="fas fa-credit-card"></i>
                        </div>
                        <div class="payment-info">
                            <span class="payment-name">Credit Card</span>
                            <span class="payment-desc">Visa, MasterCard, Amex</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="confirmation-actions" style="display: flex; gap: 12px; margin-top: 20px;">
                <button class="btn btn-primary btn-wide" onclick="confirmBooking()">
                    <i class="fas fa-check-circle"></i>
                    Confirm & Pay
                </button>
                <button class="btn btn-secondary" onclick="closeModal('bookingConfirmationModal')">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
            </div>
        </div>
    `;

    document.getElementById('bookingConfirmationContent').innerHTML = modalContent;
    document.getElementById('bookingConfirmationModal').style.display = 'block';
}

function confirmBooking() {
    if (!selectedPaymentMethod) {
        showMessage('Please select a payment method', 'error');
        return;
    }

    // Process payment first
    processPayment()
        .then(() => {
            // Then create the ride
            return createRide();
        })
        .then(() => {
            closeModal('bookingConfirmationModal');
            showRideMap();
        })
        .catch(error => {
            showMessage('Payment failed: ' + error.message, 'error');
        });
}

function processPayment() {
    return new Promise((resolve, reject) => {
        showMessage('Processing payment...', 'info');
        
        // Simulate payment processing
        setTimeout(() => {
            if (Math.random() > 0.1) { // 90% success rate for demo
                showMessage('Payment processed successfully!', 'success');
                resolve();
            } else {
                reject(new Error('Payment declined. Please try another method.'));
            }
        }, 2000);
    });
}

function createRide() {
    return new Promise((resolve) => {
        const pickup = document.getElementById('pickupLocation').value;
        const destination = document.getElementById('destination').value;
        
        // Create ride object
        currentRide = {
            _id: 'ride_' + Date.now(),
            pickup: pickup,
            destination: destination,
            mode: selectedTransportMode,
            driver: selectedDriver,
            fare: selectedTransportMode === 'moto' ? '5,000' : 
                  selectedTransportMode === 'car' ? '10,000' :
                  selectedTransportMode === 'taxi' ? '15,000' : '2,000',
            status: 'accepted'
        };
        
        showMessage('Ride booked successfully!', 'success');
        updateActiveRideUI();
        resolve();
        
        // Simulate driver arrival
        setTimeout(() => {
            if (currentRide) {
                currentRide.status = 'in_progress';
                updateActiveRideUI();
                showMessage('Your driver has arrived!', 'success');
            }
        }, 5000);
    });
}

function showRideMap() {
    const modalContent = `
        <div class="ride-map-container">
            <div class="map-header" style="text-align: center; margin-bottom: 16px;">
                <h3 style="color: var(--primary-blue); margin-bottom: 8px;">Ride Confirmed!</h3>
                <p>Your driver is on the way. Share your live location with trusted contacts.</p>
            </div>
            
            <div class="map-container" id="rideMap">
                <!-- Map will be initialized here -->
            </div>
            
            <div class="ride-info" style="background: var(--gray-100); padding: 16px; border-radius: 8px; margin: 16px 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div>
                        <strong>Driver:</strong>
                        <div>${selectedDriver.name}</div>
                    </div>
                    <div>
                        <strong>ETA:</strong>
                        <div>~8 minutes</div>
                    </div>
                    <div>
                        <strong>Vehicle:</strong>
                        <div>${selectedDriver.vehicleType}</div>
                    </div>
                    <div>
                        <strong>Plate:</strong>
                        <div>${selectedDriver.plate}</div>
                    </div>
                </div>
            </div>
            
            <div class="share-actions" style="display: flex; gap: 12px;">
                <button class="btn btn-primary" onclick="shareLiveLocation()">
                    <i class="fas fa-share-alt"></i>
                    Share Live Location
                </button>
                <button class="btn btn-secondary" onclick="closeModal('rideMapModal')">
                    <i class="fas fa-times"></i>
                    Close
                </button>
            </div>
        </div>
    `;

    document.getElementById('rideMapContent').innerHTML = modalContent;
    document.getElementById('rideMapModal').style.display = 'block';
    initializeRideMap();
}

function initializeRideMap() {
    const mapContainer = document.getElementById('rideMap');
    if (!mapContainer || !currentLocation) return;
    
    // Initialize map
    map = L.map('rideMap').setView([currentLocation.lat, currentLocation.lng], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add current location marker
    L.marker([currentLocation.lat, currentLocation.lng])
        .addTo(map)
        .bindPopup('Your Location')
        .openPopup();
    
    // Add driver location (simulated)
    const driverLat = currentLocation.lat + (Math.random() * 0.01 - 0.005);
    const driverLng = currentLocation.lng + (Math.random() * 0.01 - 0.005);
    
    L.marker([driverLat, driverLng])
        .addTo(map)
        .bindPopup('Driver Location')
        .openPopup();
    
    // Draw route
    routePolyline = L.polyline([
        [currentLocation.lat, currentLocation.lng],
        [driverLat, driverLng]
    ], { color: 'blue' }).addTo(map);
    
    map.fitBounds(routePolyline.getBounds());
}

function shareLiveLocation() {
    if (navigator.share) {
        navigator.share({
            title: 'My NovaMove Ride',
            text: `I'm sharing my live location during my NovaMove ride. Driver: ${selectedDriver.name}, Vehicle: ${selectedDriver.vehicleType} ${selectedDriver.plate}`,
            url: window.location.href
        })
        .then(() => showMessage('Location shared successfully!', 'success'))
        .catch(() => showMessage('Sharing cancelled', 'info'));
    } else {
        // Fallback: copy to clipboard
        const shareText = `My NovaMove Ride Live Location: ${window.location.href}\nDriver: ${selectedDriver.name}\nVehicle: ${selectedDriver.vehicleType} ${selectedDriver.plate}`;
        navigator.clipboard.writeText(shareText)
            .then(() => showMessage('Location link copied to clipboard!', 'success'))
            .catch(() => showMessage('Failed to copy link', 'error'));
    }
}

function updateActiveRideUI() {
    const activeRideSection = document.getElementById('activeRideSection');
    if (!currentRide) {
        activeRideSection.style.display = 'none';
        return;
    }
    
    activeRideSection.style.display = 'block';
    document.getElementById('rideStatus').textContent = currentRide.status.replace('_', ' ').toUpperCase();
    document.getElementById('rideStatus').className = `status-badge status-${currentRide.status}`;
    document.getElementById('activePickup').textContent = currentRide.pickup;
    document.getElementById('activeDestination').textContent = currentRide.destination;
    document.getElementById('activeFare').textContent = currentRide.fare + ' UGX';
    document.getElementById('activeDriver').textContent = currentRide.driver.name;
    document.getElementById('activeVehicle').textContent = currentRide.driver.vehicleType;
    document.getElementById('activePlate').textContent = currentRide.driver.plate;
}

// SOS functionality
function showSOSOptions() {
    document.getElementById('sosOptionsModal').style.display = 'block';
}

function triggerEmergencySOS() {
    closeModal('sosOptionsModal');
    sendSOS('emergency', null);
}

function startVoiceSOSRecording() {
    closeModal('sosOptionsModal');
    document.getElementById('voiceSOSModal').style.display = 'block';
    startVoiceRecording();
}

function triggerMedicalSOS() {
    closeModal('sosOptionsModal');
    sendSOS('medical', null);
}

async function sendSOS(type, mediaUrl) {
    try {
        showMessage('Sending emergency alert...', 'info');
        
        // Simulate API call
        setTimeout(() => {
            showMessage('SOS sent successfully! Help is on the way.', 'success');
            
            // Emit real-time SOS via socket
            if (socket) {
                socket.emit('sos-alert', {
                    passengerId: 'current-user',
                    type: type,
                    location: currentLocation,
                    mediaUrl: mediaUrl,
                    timestamp: new Date().toISOString()
                });
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error sending SOS:', error);
        showMessage('Failed to send SOS. Please call emergency services!', 'error');
    }
}

// Voice recording for SOS
async function startVoiceRecording() {
    if (isRecording) return;

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
            
            // Show recording actions
            document.getElementById('voiceRecordingActions').style.display = 'flex';
            
            // Store for sending
            window.currentSOSRecording = {
                blob: audioBlob,
                url: audioUrl
            };
            
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        isRecording = true;
        
        startRecordingTimer('voiceRecordingTimer');
        showMessage('Recording started', 'info');
        
    } catch (error) {
        console.error('Error starting recording:', error);
        showMessage('Error accessing microphone', 'error');
    }
}

function stopVoiceSOSRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        stopRecordingTimer();
        showMessage('Recording stopped', 'success');
    }
}

function cancelVoiceSOSRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        stopRecordingTimer();
    }
    closeVoiceSOSRecording();
}

function closeVoiceSOSRecording() {
    document.getElementById('voiceSOSModal').style.display = 'none';
    document.getElementById('voiceRecordingActions').style.display = 'none';
    if (window.currentSOSRecording) {
        URL.revokeObjectURL(window.currentSOSRecording.url);
        delete window.currentSOSRecording;
    }
}

function sendVoiceSOS() {
    if (window.currentSOSRecording) {
        // Upload recording and send SOS
        uploadMedia(window.currentSOSRecording.blob, 'audio')
            .then(mediaUrl => {
                sendSOS('voice', mediaUrl);
                closeVoiceSOSRecording();
            })
            .catch(error => {
                console.error('Error uploading recording:', error);
                showMessage('Error sending voice SOS', 'error');
            });
    }
}

function reRecordVoiceSOS() {
    document.getElementById('voiceRecordingActions').style.display = 'none';
    if (window.currentSOSRecording) {
        URL.revokeObjectURL(window.currentSOSRecording.url);
        delete window.currentSOSRecording;
    }
    startVoiceRecording();
}

function downloadVoiceSOS() {
    if (window.currentSOSRecording) {
        const a = document.createElement('a');
        a.href = window.currentSOSRecording.url;
        a.download = 'sos-recording.wav';
        a.click();
    }
}

// Enhanced Scanner Functionality
function showPlateScanner() {
    document.getElementById('plateScannerModal').style.display = 'block';
    setTimeout(() => {
        startPlateScanner();
    }, 100);
}

async function startPlateScanner() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        
        const video = document.getElementById('plateScannerVideo');
        video.srcObject = stream;
        
        // Add scanner overlay
        const scannerContainer = document.querySelector('.scanner-container');
        if (!scannerContainer.querySelector('.scanner-overlay')) {
            scannerContainer.innerHTML += `
                <div class="scanner-overlay">
                    <div class="scanner-frame"></div>
                </div>
            `;
        }
        
        // Simulate plate detection
        setTimeout(() => {
            simulatePlateRecognition();
        }, 3000);
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        showMessage('Error accessing camera. Please check permissions.', 'error');
    }
}

function simulatePlateRecognition() {
    const plates = ['UAB 123A', 'UBA 456B', 'UCD 789C', 'UEF 012D'];
    const randomPlate = plates[Math.floor(Math.random() * plates.length)];
    
    document.getElementById('plateScanResult').innerHTML = `
        <div class="scan-result success">
            <i class="fas fa-check-circle"></i>
            <div style="margin-top: 8px;">
                <strong>Plate Detected:</strong> ${randomPlate}
            </div>
            <div style="margin-top: 4px; font-size: 14px;">
                ${currentRide && currentRide.driver && currentRide.driver.plate === randomPlate ? 
                  '✅ Matches your ride' : '❌ Does not match your ride'}
            </div>
        </div>
    `;
    
    if (currentRide && currentRide.driver && currentRide.driver.plate === randomPlate) {
        showMessage('Vehicle verification successful!', 'success');
    } else {
        showMessage('Vehicle plate does not match. Please verify manually.', 'warning');
    }
}

function stopPlateScanner() {
    const video = document.getElementById('plateScannerVideo');
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
}

function closePlateScanner() {
    stopPlateScanner();
    document.getElementById('plateScannerModal').style.display = 'none';
}

// Enhanced Profile Verification
function showFullProfileVerification() {
    const modalContent = `
        <div class="full-profile-verification">
            <div class="verification-header" style="text-align: center; margin-bottom: 24px;">
                <h3 style="color: var(--primary-blue); margin-bottom: 8px;">Complete Profile Verification</h3>
                <p>Verify your identity for enhanced security and features</p>
            </div>
            
            <div class="verification-steps">
                <div class="verification-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4>Personal Information</h4>
                        <p>Verify your name, date of birth, and contact details</p>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="verifyPersonalInfo()">
                        <i class="fas fa-user-check"></i>
                        Verify
                    </button>
                </div>
                
                <div class="verification-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4>Identity Document</h4>
                        <p>Upload a government-issued ID for verification</p>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="verifyIdentityDocument()">
                        <i class="fas fa-id-card"></i>
                        Upload
                    </button>
                </div>
                
                <div class="verification-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4>Face Verification</h4>
                        <p>Complete biometric verification for your safety</p>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="startFaceVerification()">
                        <i class="fas fa-camera"></i>
                        Verify Face
                    </button>
                </div>
                
                <div class="verification-step">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h4>Payment Method</h4>
                        <p>Add and verify your preferred payment method</p>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="verifyPaymentMethod()">
                        <i class="fas fa-credit-card"></i>
                        Verify
                    </button>
                </div>
            </div>
            
            <div class="verification-progress" style="margin-top: 24px; padding: 16px; background: var(--gray-100); border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Verification Progress</span>
                    <span><strong>25%</strong> Complete</span>
                </div>
                <div style="height: 8px; background: var(--gray-300); border-radius: 4px; overflow: hidden;">
                    <div style="width: 25%; height: 100%; background: var(--primary-blue);"></div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('fullProfileVerificationContent').innerHTML = modalContent;
    document.getElementById('fullProfileVerificationModal').style.display = 'block';
}

function verifyPersonalInfo() {
    showMessage('Personal information verification started', 'info');
    // Implement personal info verification logic
}

function verifyIdentityDocument() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            showMessage('Identity document uploaded for verification', 'success');
            // Implement document verification logic
        }
    };
    input.click();
}

function verifyPaymentMethod() {
    showMessage('Payment method verification started', 'info');
    // Implement payment method verification logic
}

// Face verification
function startFaceVerification() {
    document.getElementById('faceVerificationModal').style.display = 'block';
}

async function captureFace() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('faceCamera');
        const canvas = document.getElementById('faceCanvas');
        video.srcObject = stream;
        
        // Capture frame after 2 seconds
        setTimeout(() => {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);
            
            // Stop camera
            stream.getTracks().forEach(track => track.stop());
            
            // Simulate face verification
            const isVerified = Math.random() > 0.3; // 70% success rate for demo
            
            if (isVerified) {
                document.getElementById('faceVerificationResult').innerHTML = `
                    <div class="verification-result success">
                        <i class="fas fa-check-circle"></i>
                        Face verified successfully! Identity confirmed.
                    </div>
                `;
                document.getElementById('faceVerificationStatus').innerHTML = `
                    <div class="status-verified">
                        <i class="fas fa-check-circle"></i>
                        <span>Identity Verified</span>
                    </div>
                `;
                showMessage('Face verification completed successfully!', 'success');
            } else {
                document.getElementById('faceVerificationResult').innerHTML = `
                    <div class="verification-result error">
                        <i class="fas fa-times-circle"></i>
                        Face verification failed. Please try again.
                    </div>
                `;
                showMessage('Face verification failed. Please ensure good lighting and try again.', 'error');
            }
            
        }, 2000);
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        showMessage('Error accessing camera', 'error');
    }
}

function retakeFace() {
    document.getElementById('faceVerificationResult').innerHTML = '';
    startFaceVerification();
}

function closeFaceVerification() {
    document.getElementById('faceVerificationModal').style.display = 'none';
}

function checkVerificationStatus() {
    // Simulate verification status check
    document.getElementById('faceVerificationStatus').innerHTML = `
        <div class="status-pending">
            <i class="fas fa-clock"></i>
            <span>${getTranslation('verification_pending')}</span>
        </div>
    `;
}

// Trusted contacts
async function loadTrustedContacts() {
    try {
        // Simulate API call
        setTimeout(() => {
            const mockContacts = [
                { _id: '1', name: 'Maria Nakato', phone: '+256 712 345 678', relationship: 'Family' },
                { _id: '2', name: 'David Omondi', phone: '+256 773 987 654', relationship: 'Friend' }
            ];
            
            updateContactsUI(mockContacts);
        }, 1000);
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

function updateContactsUI(contacts) {
    const contactsList = document.getElementById('contactsList');
    
    if (!contacts || contacts.length === 0) {
        contactsList.innerHTML = `
            <div class="no-data">
                <i class="fas fa-users"></i>
                <p>No trusted contacts added yet</p>
            </div>
        `;
        return;
    }
    
    contactsList.innerHTML = contacts.map(contact => `
        <div class="contact-item">
            <div class="contact-info">
                <strong>${contact.name}</strong>
                <span>${contact.phone}</span>
                <div class="contact-type">${contact.relationship}</div>
            </div>
            <div class="contact-actions">
                <button class="btn-sm primary" onclick="editContact('${contact._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-sm danger" onclick="deleteContact('${contact._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

async function addTrustedContact() {
    const form = document.getElementById('addContactForm');
    const formData = new FormData(form);
    
    try {
        showMessage('Adding contact...', 'info');
        
        // Simulate API call
        setTimeout(() => {
            showMessage('Contact added successfully!', 'success');
            closeModal('addContactModal');
            form.reset();
            loadTrustedContacts(); // Reload contacts
        }, 1000);
        
    } catch (error) {
        console.error('Error adding contact:', error);
        showMessage('Error adding contact', 'error');
    }
}

// Utility functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
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
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function showLoading(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>${message}</span>
            </div>
        `;
    }
}

function startRecordingTimer(timerElementId = 'voiceRecordingTimer') {
    recordingStartTime = Date.now();
    recordingTimer = setInterval(() => updateRecordingTimer(timerElementId), 1000);
}

function stopRecordingTimer() {
    if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
}

function updateRecordingTimer(timerElementId) {
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timerElement = document.getElementById(timerElementId);
    if (timerElement) {
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

async function uploadMedia(blob, type) {
    // Simulate upload
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`https://example.com/media/${Date.now()}.${type === 'audio' ? 'wav' : 'mp4'}`);
        }, 2000);
    });
}

// Additional functionality
function refreshDrivers() {
    loadAvailableDrivers();
    showMessage('Refreshing available drivers...', 'info');
}

function loadRideHistory() {
    showLoading('rideHistoryContent', getTranslation('loading_history'));
    
    // Simulate loading ride history
    setTimeout(() => {
        const mockHistory = [
            { _id: '1', pickup: 'Kampala Road', destination: 'Makerere University', fare: '8,000', status: 'completed', createdAt: '2024-01-15' },
            { _id: '2', pickup: 'Nakawa', destination: 'City Center', fare: '6,500', status: 'completed', createdAt: '2024-01-14' }
        ];
        
        const historyHTML = `
            <table class="ride-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Pickup</th>
                        <th>Destination</th>
                        <th>Fare</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockHistory.map(ride => `
                        <tr>
                            <td>${new Date(ride.createdAt).toLocaleDateString()}</td>
                            <td>${ride.pickup}</td>
                            <td>${ride.destination}</td>
                            <td>${ride.fare} UGX</td>
                            <td><span class="status-badge status-${ride.status}">${ride.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        document.getElementById('rideHistoryContent').innerHTML = historyHTML;
    }, 1500);
}

function loadActiveRide() {
    // Check if there's an active ride (simulated)
    if (currentRide) {
        updateActiveRideUI();
    }
}

function cancelRide() {
    if (currentRide) {
        if (confirm('Are you sure you want to cancel this ride?')) {
            currentRide.status = 'cancelled';
            updateActiveRideUI();
            showMessage('Ride cancelled successfully', 'success');
            
            // Hide active ride section after delay
            setTimeout(() => {
                document.getElementById('activeRideSection').style.display = 'none';
                currentRide = null;
            }, 3000);
        }
    }
}

function contactDriver() {
    if (currentRide && currentRide.driver) {
        showMessage(`Calling ${currentRide.driver.name}...`, 'info');
        // In a real app, this would initiate a call
    }
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // Update UI
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`.payment-option[data-method="${method}"]`).classList.add('selected');
    
    // Show card scanning for credit card
    const cardScanning = document.getElementById('cardScanning');
    if (cardScanning) {
        cardScanning.style.display = method === 'card' ? 'block' : 'none';
    }
}

function scanCard() {
    showMessage('Card scanning feature would open here', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/logout';
    }
}

// Export functions for global access
window.showSection = showSection;
window.showDriverDetails = showDriverDetails;
window.selectDriver = selectDriver;
window.selectTransportMode = selectTransportMode;
window.calculateFare = calculateFare;
window.requestRide = requestRide;
window.showSOSOptions = showSOSOptions;
window.triggerEmergencySOS = triggerEmergencySOS;
window.startVoiceSOSRecording = startVoiceSOSRecording;
window.triggerMedicalSOS = triggerMedicalSOS;
window.stopVoiceSOSRecording = stopVoiceSOSRecording;
window.cancelVoiceSOSRecording = cancelVoiceSOSRecording;
window.sendVoiceSOS = sendVoiceSOS;
window.reRecordVoiceSOS = reRecordVoiceSOS;
window.downloadVoiceSOS = downloadVoiceSOS;
window.showIncidentForm = showIncidentForm;
window.startVoiceIncidentRecording = startVoiceIncidentRecording;
window.startVideoIncidentRecording = startVideoIncidentRecording;
window.stopIncidentRecording = stopIncidentRecording;
window.stopVideoIncidentRecording = stopVideoIncidentRecording;
window.closeVoiceIncidentRecording = closeVoiceIncidentRecording;
window.closeVideoIncidentRecording = closeVideoIncidentRecording;
window.uploadIncidentFile = uploadIncidentFile;
window.submitIncidentReport = submitIncidentReport;
window.showPlateScanner = showPlateScanner;
window.startPlateScanner = startPlateScanner;
window.stopPlateScanner = stopPlateScanner;
window.closePlateScanner = closePlateScanner;
window.startFaceVerification = startFaceVerification;
window.captureFace = captureFace;
window.retakeFace = retakeFace;
window.closeFaceVerification = closeFaceVerification;
window.showFullProfileVerification = showFullProfileVerification;
window.verifyPersonalInfo = verifyPersonalInfo;
window.verifyIdentityDocument = verifyIdentityDocument;
window.verifyPaymentMethod = verifyPaymentMethod;
window.showAddContactModal = () => showModal('addContactModal');
window.closeModal = closeModal;
window.changeLanguage = changeLanguage;
window.refreshDrivers = refreshDrivers;
window.loadRideHistory = loadRideHistory;
window.cancelRide = cancelRide;
window.contactDriver = contactDriver;
window.selectPaymentMethod = selectPaymentMethod;
window.scanCard = scanCard;
window.logout = logout;
window.shareLiveLocation = shareLiveLocation;
window.processPayment = processPayment;
window.confirmBooking = confirmBooking;