const translations = {
    en: {
        "nav-home":"Home",
        "nav-about":"About",
        "nav-farmer":"Farmer",
        "nav-buyer":"Buyer",
        "nav-admin":"Admin",
        "nav-transporter":"Transporter",
        "nav-insurance":"Insurance",

        "hero-title":"Welcome to AgriChain",
        "hero-text":"Empowering farmers, ensuring transparency, and connecting directly with buyers using blockchain technology.",
        "hero-button":"Get Started",
        "feature-title1":"Direct Marketplace",
        "feature-text1":"Farmers can sell crops directly to buyers without middlemen.",
        "feature-title2":"Crop Traceability",
        "feature-text2":"Track every stage of your crops using blockchain and QR codes.",
        "feature-title3":"Smart Insurance",
        "feature-text3":"Automatic crop insurance claims based on verified weather and crop data.",

        "about-title":"About AgriChain",
        "about-text1":"AgriChain is a blockchain-based platform designed to empower farmers, ensure transparency, and streamline the agricultural supply chain.",
        "about-text2":"Our platform integrates a direct marketplace for farmers, blockchain-based crop traceability, and automated smart insurance to protect farmers against risks.",
        "about-text3":"By removing middlemen, providing authentic traceability, and automating insurance claims, AgriChain ensures that farmers earn more, consumers trust their food, and the agricultural ecosystem becomes more efficient.",

        "footer-brand-title":"AgriChain",
        "footer-text":"Empowering farmers, ensuring transparency, and connecting directly with buyers through blockchain technology.",
        "footer-home":"Home",
        "footer-about":"About",
        "footer-contact":"Contact",
        "footer-farmer":"Farmer Login",
        "footer-bottom-text":"© 2025 AgriChain. All Rights Reserved."
    },
    ta: {
        "nav-home":"முகப்பு",
        "nav-about":"பற்றி",
        "nav-farmer":"விவசாயி",
        "nav-buyer":"வாங்குபவர்",
        "nav-admin":"நிர்வாகி",
        "nav-transporter":"போக்குவரத்து",
        "nav-insurance":"காப்பீடு",

        "hero-title":"அக்ரிச்செயினுக்கு வரவேற்கிறோம்",
        "hero-text":"விவசாயிகளை சக்திவாய்ந்தவர் ஆக்கும், தெளிவுத்தன்மையை உறுதி செய்கிறது, மற்றும் நேரடியாக வாடிக்கையாளர்களுடன் இணைக்கிறது.",
        "hero-button":"தொடக்கம் செய்க",
        "feature-title1":"நேரடி சந்தை",
        "feature-text1":"விவசாயிகள் இடைநிலையாளர் இல்லாமல் நேரடியாக வாடிக்கையாளர்களுக்கு பயிர்களை விற்கலாம்.",
        "feature-title2":"பயிர் பின்வட்டத்தன்மை",
        "feature-text2":"உங்கள் பயிர்களின் ஒவ்வொரு கட்டத்தையும் பிளாக்செயின் மற்றும் QR குறியீடுகள் மூலம் கண்காணிக்கவும்.",
        "feature-title3":"ஸ்மார்ட் காப்பீடு",
        "feature-text3":"சரிபார்க்கப்பட்ட வானிலை மற்றும் பயிர் தரவுகளின் அடிப்படையில் தானாக பயிர் காப்பீட்டு வாதங்கள்.",

        "about-title":"அக்ரிச்செயின் பற்றி",
        "about-text1":"அக்ரிச்செயின் என்பது விவசாயிகளை சக்திவாய்ந்தவர் ஆக்கும், தெளிவுத்தன்மையை உறுதி செய்கிறது மற்றும் விவசாய வழங்கல் சங்கிலியை சீரமைக்க வடிவமைக்கப்பட்ட பிளாக்செயின் அடிப்படையிலான ஒரு தளம் ஆகும்.",
        "about-text2":"எங்கள் தளம் விவசாயிகளுக்கான நேரடி சந்தை, பிளாக்செயின் அடிப்படையிலான பயிர் பின்வட்டத்தன்மை மற்றும் விவசாயிகளை ஆபத்துகளிலிருந்து பாதுகாக்க தானாக செயற்கை காப்பீட்டையும் ஒருங்கிணைக்கிறது.",
        "about-text3":"இடைநிலையாளர்களை நீக்குவதன் மூலம், அசல் பின்வட்டத்தன்மையை வழங்குவதன் மூலம், மற்றும் காப்பீட்டு வாதங்களை தானாகச் செயல்படுத்துவதன் மூலம், அக்ரிச்செயின் விவசாயிகள் அதிகமாக சம்பாதிக்கிறார்கள், வாடிக்கையாளர்கள் உணவை நம்புகிறார்கள் மற்றும் விவசாய சூழல் மிகவும் திறம்படமாகிறது.",

        "footer-brand-title":"அக்ரிச்செயின்",
        "footer-text":"அக்ரிச்செயின் – விவசாயிகளை சக்திவாய்ந்தவர் ஆக்கும், தெளிவுத்தன்மையை உறுதி செய்கிறது, நேரடியாக வாடிக்கையாளர்களுடன் இணைக்கிறது.",
        "footer-home":"முகப்பு",
        "footer-about":"பற்றி",
        "footer-contact":"தொடர்பு",
        "footer-farmer":"விவசாயி உள்நுழை",
        "footer-bottom-text":"© 2025 அக்ரிச்செயின். எல்லா உரிமைகளும் பாதுகாக்கப்பட்டவை."
    }
};

function setLanguage(lang){
    const selected = translations[lang];
    if(!selected) return;
    for(let id in selected){
        const el = document.getElementById(id);
        if(el) el.innerHTML = selected[id];
    }
}
