// farmer.js

// Translations for Farmer Module
const farmerTranslations = {
    en: {
        "farmer-title": "Farmer Portal",
        "farmer-login-title": "Farmer Login",
        "farmer-username": "Username",
        "farmer-password": "Password",
        "farmer-login-btn": "Login",
        "farmer-register-btn": "Register",
        "farmer-dashboard-title": "Welcome, Farmer!",
        "farmer-add-crop": "Add Crop",
        "farmer-crop-name": "Crop Name",
        "farmer-crop-quantity": "Quantity (kg)",
        "farmer-crop-price": "Price per kg",
        "farmer-submit-crop": "Submit Crop",
        "farmer-insurance-title": "Apply for Crop Insurance"
    },
    ta: {
        "farmer-title": "விவசாயி தளம்",
        "farmer-login-title": "விவசாயி உள்நுழைவு",
        "farmer-username": "பயனர் பெயர்",
        "farmer-password": "கடவுச்சொல்",
        "farmer-login-btn": "உள்நுழைவு",
        "farmer-register-btn": "பதிவு செய்யவும்",
        "farmer-dashboard-title": "வரவேற்கிறோம், விவசாயி!",
        "farmer-add-crop": "பயிர் சேர்க்கவும்",
        "farmer-crop-name": "பயிர் பெயர்",
        "farmer-crop-quantity": "அளவு (கிலோ)",
        "farmer-crop-price": "ஒரு கிலோவிற்கான விலை",
        "farmer-submit-crop": "பயிர் சமர்ப்பிக்கவும்",
        "farmer-insurance-title": "பயிர் காப்பீட்டிற்கு விண்ணப்பிக்கவும்"
    }
};

// Function to switch language
function setFarmerLanguage(lang){
    const selected = farmerTranslations[lang];
    if(!selected) return;
    for(let id in selected){
        const el = document.getElementById(id);
        if(el) el.innerHTML = selected[id];
    }
}

// Optional: Basic form validation
function validateLoginForm() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if(username === "" || password === "") {
        alert("Please enter both username and password.");
        return false;
    }
    return true;
}

// Optional: Crop form submission handler
function submitCropForm() {
    const name = document.getElementById("crop-name").value.trim();
    const quantity = document.getElementById("crop-quantity").value.trim();
    const price = document.getElementById("crop-price").value.trim();

    if(name === "" || quantity === "" || price === "") {
        alert("Please fill all crop details.");
        return false;
    }

    alert("Crop submitted successfully!");
    // Here you can add code to save data or interact with backend
    return true;
}
