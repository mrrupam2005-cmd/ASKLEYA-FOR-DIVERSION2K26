import { EthicsPrivacyManager } from './ethics-privacy';
import { MedicalKnowledgeHub } from './medical-knowledge-hub';

export interface AIResponse {
    text: string;
    suggestDoctor?: boolean;
    suggestSearch?: boolean;
    searchQuery?: string;
    isExpertRequired?: boolean;
}

// Helper to detect if text contains Hindi characters
const containsHindi = (text: string) => /[\u0900-\u097F]/.test(text);

// Helper to detect Hinglish (Hindi words in Roman script)
const isHinglish = (text: string) => {
    const lower = text.toLowerCase();
    const hinglishKeywords = [
        'hai', 'dard', 'ho', 'raha', 'mujh', 'mere', 'kya', 'karu', 'kese', 'kaise', 'batao', 'ilaaj', 'upay',
        'bukhar', 'khansi', 'sardi', 'pet', 'sar', 'pair', 'hath', 'badan', 'kamjori', 'thakan', 'jalan',
        'raat', 'din', 'khana', 'peena', 'pani', 'daane', 'khujli', 'sujan'
    ];
    // Check if at least 2 common Hinglish words are present
    const matches = hinglishKeywords.filter(w => new RegExp(`\\b${w}\\b`).test(lower));
    return matches.length >= 1;
};

const TRANSLATIONS = {
    en: {
        greeting: "Hello! I'm your AI Doctor. How can I help you today? Please describe your symptoms.",
        imageScan: "I have scanned the image you provided. While I can see the area of concern, I cannot make a definitive diagnosis from a photo alone. Important: Since I am an AI, I highly recommend consulting a professional doctor for an accurate diagnosis.",
        unrecognizedSymptom: "I've analyzed your symptoms against our medical knowledge base. While I cannot provide a definitive diagnosis, here is what I found:",
        nonMedical: "I am your AI Medical Assistant. I can only answer health and medical related questions.",
        genericPain: "You're experiencing pain. Please rest and avoid straining. If the pain is severe, see a professional doctor immediately.",
        nonMedicalImage: "This image does not appear to be medical in nature. I am specialized only in health-related assistance.",
        unclearImage: "I've analyzed the image, but I cannot clearly identify the symptom. Please consult a professional doctor for a physical examination.",
        analyzing: "Analyzing symptoms using global medical databases...",
        remedyHeader: "Initial Precautions and Home remedies:",
    },
    hi: {
        greeting: "नमस्ते! मैं आपका AI डॉक्टर हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ? कृपया अपने लक्षणों के बारे में बताएं।",
        imageScan: "मैंने आपके द्वारा प्रदान की गई छवि को स्कैन किया है। चूंकि मैं एक AI हूं, मैं अकेले फोटो से निश्चित निदान नहीं कर सकता। सटीक निदान के लिए पेशेवर डॉक्टर से परामर्श करने की अत्यधिक अनुशंसा की जाती है।",
        unrecognizedSymptom: "मैंने हमारे चिकित्सा ज्ञान आधार के खिलाफ आपके लक्षणों का विश्लेषण किया है। हालांकि मैं निश्चित निदान नहीं दे सकता, यहां मुझे जो मिला है वह है:",
        nonMedical: "मैं आपका AI मेडिकल सहायक हूं। मैं केवल स्वास्थ्य और चिकित्सा संबंधी प्रश्नों के उत्तर दे सकता हूं।",
        genericPain: "आप दर्द का अनुभव कर रहे हैं। फिर भी कृपया आराम करें। यदि दर्द तेज है, तो कृपया तुरंत पेशेवर डॉक्टर को दिखाएं।",
        nonMedicalImage: "यह छवि प्रकृति में चिकित्सा संबंधी नहीं लगती है। मैं केवल स्वास्थ्य संबंधी सहायता में विशेषज्ञता रखता हूँ।",
        unclearImage: "मैंने छवि का विश्लेषण किया है, लेकिन मैं स्पष्ट रूप से लक्षण की पहचान नहीं कर पा रहा हूं। शारीरिक परीक्षण के लिए पेशेवर डॉक्टर से परामर्श करें।",
        analyzing: "वैश्विक चिकित्सा डेटाबेस का उपयोग करके लक्षणों का विश्लेषण किया जा रहा है...",
        remedyHeader: "प्रारंभिक सावधानियां और घरेलू उपचार:",
    },
    hg: {
        greeting: "Hello! Main aapka AI Doctor hoon. Main aaj aapki kaise help kar sakta hoon? Apne symptoms batayein.",
        imageScan: "Maine aapki image scan kar li hai. Photo se pakka diagnosis nahi ho sakta, isliye Important: Aap ek real doctor se milein.",
        unrecognizedSymptom: "Main aapke symptoms ko analyze kiya hai. Pakka toh nahi bol sakte, par yeh ho sakta hai:",
        nonMedical: "Main sirf medical sawaalon ka jawab de sakta hoon. Please health se related sawal pucchein.",
        genericPain: "Aapko dard ho raha hai. Please aaram karein aur stress na lein. Agar dard jyada hai toh doctor ko dikhayein.",
        nonMedicalImage: "Yeh image medical nahi lag rahi hai. Main sirf health issues mein help karta hoon.",
        unclearImage: "Image clear nahi hai, main identify nahi kar pa raha hoon. Doctor se physical checkup karwayein.",
        analyzing: "Medical database check kiya ja raha hai...",
        remedyHeader: "Home Remedies aur Sawdhaniyan:",
    }
};

const HOME_REMEDIES: Record<string, { en: string; hi: string; hg: string }> = {
    'headache': {
        en: "Rest in a quiet, dark room, stay hydrated, and try a cold compress on your forehead.",
        hi: "शांत, अंधेरे कमरे में आराम करें, हाइड्रेटेड रहें, और अपने माथे पर ठंडी सिकाई करें।",
        hg: "Andhere aur shant kamre mein aaram karein, pani khoob piyein, aur sar par thandi patti rakhein."
    },
    'fever': {
        en: "Get plenty of rest, drink fluids (water, juice, broth), and keep the room temperature comfortable.",
        hi: "खूब आराम करें, तरल पदार्थ (पानी, जूस, सूप) पिएं और कमरे के तापमान को आरामदायक रखें।",
        hg: "Aaram karein, fluids (pani, juice, soup) piyein aur sharir ka temperature normal rakhne ki koshish karein."
    },
    'cough': {
        en: "Honey with warm water or ginger tea can help soothe the throat. Use a humidifier if the air is dry.",
        hi: "गर्म पानी के साथ शहद या अदरक की चाय गले को शांत करने में मदद कर सकती है। यदि हवा शुष्क है तो ह्यूमिडिफायर का उपयोग करें।",
        hg: "Garam pani mein sahad milakar piyein ya adrak wali chai lein. Isse gale mein aaram milega."
    },
    'stomach': {
        en: "Try the BRAT diet (Bananas, Rice, Applesauce, Toast). Avoid spicy or oily foods. Peppermint tea might help.",
        hi: "BRAT डाइट (केला, चावल, सेब की चटनी, टोस्ट) आजमाएं। मसालेदार या तैलीय भोजन से बचें। पुदीने की चाय मदद कर सकती है।",
        hg: "Halka khana khayein jise khichdi ya kela. Masale wali aur oily cheezon se bachein."
    },
    'sinus': {
        en: "Try steam inhalation, use a saline nasal rinse, and apply a warm compress to your face. Stay hydrated.",
        hi: "भाप लें, खारे पानी से नाक साफ करें, और अपने चेहरे पर गर्म सिकाई करें। पर्याप्त पानी पिएं।",
        hg: "Vaap (steam) lein, garam pani ki sikai karein aur hydrated rahein."
    },
    'sneezing': {
        en: "Identify and avoid allergen triggers. Use a saline nasal spray and keep your living area dust-free.",
        hi: "एलर्जी पैदा करने वाली चीजों को पहचानें और उनसे बचें। सलाइन नेज़ल स्प्रे का उपयोग करें और अपने आसपास धूल न होने दें।",
        hg: "Allergies se bachein, saaf-safai ka dhyan rakhein aur nasal spray use karein."
    },
    'pain': {
        en: "Apply a warm or cold compress to the affected area. Avoid heavy physical activity and rest.",
        hi: "प्रभावित क्षेत्र पर गर्म या ठंडी सिकाई करें। भारी शारीरिक गतिविधि से बचें और आराम करें।",
        hg: "Dard wali jagah par garam ya thandi sikai karein. Jyada bhari kaam na karein aur rest karein."
    },
    'default': {
        en: "Maintain adequate hydration, ensure proper rest, and monitor your symptoms closely.",
        hi: "पर्याप्त हाइड्रेटेड रहें, उचित आराम सुनिश्चित करें, और अपने लक्षणों की बारीकी से निगरानी करें।",
        hg: "Khoob pani piyein, aaram karein aur symptoms par nazar rakhein."
    }
};

const EMERGENCY_SIGNS = [
    'chest pain', 'difficulty breathing', 'shortness of breath', 'uncontrolled bleeding', 'loss of consciousness',
    'suspected fracture', 'head injury', 'abdominal pain',
    'snake bite', 'snake bit', 'bitten by snake', 'snake', 'cobra', 'krait', 'viper', 'scorpion sting', 'spider bite', 'black widow', 'brown recluse',
    'face drooping', 'arm weakness', 'speech difficulty', 'paralysis', 'seizure', 'twitch',
    'fainting during pregnancy', 'heavy vaginal bleeding', 'severe pelvic pain', 'soaking pads hourly',
    'छाती में दर्द', 'सांस लेने में कठिनाई', 'सांस फूलना', 'बेकाबू रक्तस्राव', 'होश खोना',
    'गर्भावस्था में बेहोशी', 'भारी योनि रक्तस्राव', 'पेल्विक दर्द',
    'सांप का काटना', 'सांप ने काट लिया', 'बिच्छू का डंक', 'मकड़ी का काटना', 'लकवा', 'दौरे'
];

const SYMPTOMS_DATA = [
    {
        keywords: {
            en: ['headache', 'migraine', 'head ache'],
            hi: ['सिरदर्द', 'माइग्रेन', 'सिर में दर्द', 'सर दर्द']
        },
        advice: {
            en: "It sounds like you have a headache. Rest in a quiet, dark room and stay hydrated. If it's severe or accompanied by a stiff neck, see a doctor.",
            hi: "ऐसा लगता है कि आपको सिरदर्द है। शांत, अंधेरे कमरे में आराम करें और हाइड्रेटेड रहें। यदि यह गंभीर है या गर्दन में अकड़न है, तो डॉक्टर को दिखाएं।",
            hg: "Aapko sar dard (headache) lag raha hai. Shant andhere kamre mein rest karein aur pani piyein. Agar dard bahut jyada hai toh doctor ko dikhayein."
        },
        isSevere: (msg: string) => msg.includes('severe') || msg.includes('गंभीर') || msg.includes('jyada')
    },
    {
        keywords: {
            en: ['fever', 'chills', 'temperature'],
            hi: ['बुखार', 'ठंड', 'तापमान', 'तप रहा']
        },
        advice: {
            en: "You seem to have a fever. Drink plenty of fluids and rest. If your fever exceeds 102°F (39°C), or lasts more than 3 days, consult a doctor.",
            hi: "आपको बुखार लग रहा है। खूब तरल पदार्थ पिएं और आराम करें। यदि आपका बुखार 102°F (39°C) से अधिक हो जाता है, या 3 दिनों से अधिक समय तक रहता है, तो डॉक्टर से परामर्श लें।",
            hg: "Aapko bukhar (fever) lag raha hai. Fluids aur aaram ki jarurat hai. Agar bukhar 102°F se upar jaye toh doctor se milein."
        },
        isSevere: (msg: string) => msg.includes('high') || msg.includes('severe') || msg.includes('तेज') || msg.includes('गंभीर') || msg.includes('jyada')
    },
    {
        keywords: {
            en: ['earpain', 'ear pain', 'earache', 'ear'],
            hi: ['कान का दर्द', 'कान में दर्द', 'कान'],
            hg: ['kaanya dard', 'kan me dard', 'ear pain']
        },
        advice: {
            en: "Ear pain can be caused by infections or pressure changes. Avoid putting anything in your ear. If you have hearing loss or discharge, see an ENT specialist.",
            hi: "कान का दर्द संक्रमण या दबाव परिवर्तन के कारण हो सकता है। अपने कान में कुछ भी डालने से बचें। यदि आपको सुनने में कमी या डिस्चार्ज महसूस हो, तो ईएनटी विशेषज्ञ को दिखाएं।",
            hg: "Kaanda dard infection ya pressure ki wajah se ho sakta hai. Kaan mein kuch bhi na dalein. Agar sunne mein dikat ho ya liquid nikle toh doctor (ENT) ko dikhayein."
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['stomach', 'abdominal', 'belly', 'stomach ache'],
            hi: ['पेट दर्द', 'पेट में दर्द', 'पेट'],
            hg: ['pet me dard', 'stomach ache', 'abdomen pain']
        },
        advice: {
            en: "Stomach pain can have many causes. Avoid spicy food and try light meals. If the pain is sharp, persistent, or accompanied by vomiting, see a doctor.",
            hi: "पेट दर्द के कई कारण हो सकते हैं। मसालेदार भोजन से बचें और हल्का भोजन लें। यदि दर्द तेज है, लगातार बना हुआ है, या उल्टी के साथ है, तो डॉक्टर को दिखाएं।",
            hg: "Pet mein dard ke kayi karan ho sakte hain. Masaledar khana na khayein aur halka khana lein. Agar dard tej hai ya ulti aa rahi hai toh doctor ko dikhayein."
        },
        isSevere: (msg: string) => msg.includes('severe') || msg.includes('sharp') || msg.includes('गंभीर') || msg.includes('तेज') || msg.includes('tej') || msg.includes('jyada')
    },
    {
        keywords: {
            en: ['throat', 'cough', 'cold', 'flu', 'sneeze'],
            hi: ['गला', 'खांसी', 'जुकाम', 'सर्दी', 'छींक'],
            hg: ['khansi', 'sardi', 'gala kharab', 'cough', 'cold']
        },
        advice: {
            en: "It sounds like a respiratory issue or cold. Gargle with warm salt water for throat pain and stay hydrated. If you have trouble breathing, seek immediate care.",
            hi: "यह श्वसन संबंधी समस्या या सर्दी की तरह लगता है। गले के दर्द के लिए गर्म नमक के पानी से गरारे करें और हाइड्रेटेड रहें। यदि आपको सांस लेने में परेशानी हो रही है, तो तुरंत देखभाल की तलाश करें।",
            hg: "Yeh sardi ya respiratory issue lag raha hai. Garam namak ke pani se garare (gargle) karein aur pani piyein. Agar saas lene mein dikat ho toh turant doctor ke paas jayein."
        },
        isSevere: (msg: string) => msg.includes('breathing') || msg.includes('सांस') || msg.includes('saas')
    },
    {
        keywords: {
            en: ['eye', 'vision', 'redness', 'itchy eyes'],
            hi: ['आंख', 'दृष्टि', 'लालिमा', 'आंखों में खुजली']
        },
        advice: {
            en: "Eye issues should be handled carefully. Avoid rubbing your eyes. If you experience sudden vision changes or severe pain, see an ophthalmologist.",
            hi: "आंखों की समस्याओं को सावधानी से संभाला जाना चाहिए। अपनी आंखों को रगड़ने से बचें। यदि आप अचानक दृष्टि परिवर्तन या गंभीर दर्द का अनुभव करते हैं, तो नेत्र रोग विशेषज्ञ को दिखाएं।"
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['neck', 'stiff neck', 'neck pain', 'neck ache'],
            hi: ['गर्दन', 'गर्दन में दर्द', 'गर्दन में अकड़न']
        },
        advice: {
            en: "Neck pain is common. Try gentle stretches and apply heat or cold packs. If the pain radiates to your arms or causes numbness, consult a doctor.",
            hi: "गर्दन में दर्द होना आम बात है। हल्का स्ट्रेच करने की कोशिश करें और गर्म या ठंडी सिकाई करें। यदि दर्द आपकी बाहों तक फैलता है या सुन्नपन पैदा करता है, तो डॉक्टर से परामर्श लें।"
        },
        isSevere: (msg: string) => msg.includes('numb') || msg.includes('radiat') || msg.includes('सुन्न')
    },
    {
        keywords: {
            en: ['back', 'back pain', 'lower back', 'spine', 'back ache'],
            hi: ['पीठ दर्द', 'कमर दर्द', 'रीढ़']
        },
        advice: {
            en: "Back pain often improves with light activity and avoid heavy lifting. If you have fever, leg weakness, or loss of bladder control, seek immediate medical attention.",
            hi: "पीठ दर्द अक्सर हल्की गतिविधि से ठीक हो जाता है और भारी वजन उठाने से बचें। यदि आपको बुखार, पैरों में कमजोरी, या मूत्राशय नियंत्रण खोने का अनुभव हो, तो तुरंत चिकित्सा सहायता लें।"
        },
        isSevere: (msg: string) => msg.includes('weakness') || msg.includes('fever') || msg.includes('कमजोरी') || msg.includes('बुखार')
    },
    {
        keywords: {
            en: ['rash', 'itch', 'skin', 'spots', 'skin irritation'],
            hi: ['चकत्ते', 'खुजली', 'त्वचा', 'दाने'],
            hg: ['khujli', 'skin rash', 'daane', 'itching']
        },
        advice: {
            en: "For skin rashes, keep the area clean and avoid scratching. You can use aloe vera or calamine lotion. If the rash spreads rapidly or causes breathing issues, see a doctor.",
            hi: "त्वचा पर चकत्तों के लिए, क्षेत्र को साफ रखें और खुजली करने से बचें। आप एलोवेरा या कैलामाइन लोशन का उपयोग कर सकते हैं। यदि दाने तेजी से फैलते हैं या सांस लेने में समस्या पैदा करते हैं, तो डॉक्टर को दिखाएं।",
            hg: "Skin rashes ke liye us jagah ko saaf rakhein aur khujayein nahi. Aloe vera ya calamine lotion lagayein. Agar rash jaldi faile toh doctor ko dikhayein."
        },
        isSevere: (msg: string) => msg.includes('breath') || msg.includes('spread') || msg.includes('सांस') || msg.includes('saas')
    },
    {
        keywords: {
            en: ['twitching', 'twitch', 'tremor', 'muscle spasm', 'fasciculation', 'nerve'],
            hi: ['फड़कना', 'फड़क', 'कंपन', 'मांसपेशियों में ऐंठन', 'तंत्रिका']
        },
        advice: {
            en: "Muscle twitching or tremors can be caused by stress, caffeine, or neurological issues. If it's persistent, affects physical function, or occurs with weakness, please consult a neurologist.",
            hi: "मांसपेशियों का फड़कना या कंपन तनाव, कैफीन या तंत्रिका संबंधी समस्याओं के कारण हो सकता है। यदि यह लगातार बना रहता है, शारीरिक कार्य को प्रभावित करता है, या कमजोरी के साथ होता है, तो कृपया न्यूरोलॉजिस्ट से परामर्श लें।"
        },
        isSevere: (msg: string) => msg.includes('weakness') || msg.includes('numb') || msg.includes('कमजोरी') || msg.includes('सुन्न')
    },
    {
        keywords: {
            en: ['chest', 'chest pain', 'heart', 'tightness in chest', 'chest hurt'],
            hi: ['छाती में दर्द', 'दिल', 'सीने में जकड़न'],
            hg: ['chest pain', 'dil me dard', 'seene me dard']
        },
        advice: {
            en: "Chest pain can be serious. Please seek emergency medical care immediately. Do not wait as it could be a sign of a heart attack.",
            hi: "सीने में दर्द गंभीर हो सकता है। कृपया तुरंत आपातकालीन चिकित्सा सहायता लें। प्रतीक्षा न करें क्योंकि यह दिल के दौरे का संकेत हो सकता है।",
            hg: "Chest pain serious ho sakta hai. Please turant emergency medical help lein. Der na karein, yeh heart attack ka sanket ho sakta hai."
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['breath', 'shortness of breath', 'gasping', 'trouble breathing'],
            hi: ['सांस', 'सांस फूलना', 'हांफ'],
            hg: ['saas phulna', 'shortness of breath', 'saas lene me takleef']
        },
        advice: {
            en: "Difficulty breathing is a medical emergency. Please seek immediate help (call emergency services). Especially if it occurs with chest pain.",
            hi: "सांस लेने में कठिनाई एक चिकित्सा आपातकाल है। कृपया तुरंत सहायता लें (आपातकालीन सेवाओं को कॉल करें)। खासकर अगर यह सीने में दर्द के साथ होता है।",
            hg: "Saas lene mein takleef ek medical emergency hai. Please turant help lein (emergency services ko call karein). Khaas kar agar chest pain ke sath ho."
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['dizzy', 'faint', 'spinning', 'unsteady', 'dizziness'],
            hi: ['चक्कर', 'बेहोश', 'अस्थिर']
        },
        advice: {
            en: "If you feel dizzy, sit or lie down immediately to prevent falls. Stay hydrated. If you experience confusion, chest pain, or sudden weakness, see a doctor urgently.",
            hi: "यदि आपको चक्कर महसूस हो, तो गिरने से रोकने के लिए तुरंत बैठ जाएं या लेट जाएं। हाइड्रेटेड रहें। यदि आप भ्रम, सीने में दर्द, या अचानक कमजोरी का अनुभव करते हैं, तो तुरंत डॉक्टर को दिखाएं।",
            hg: "Agar chakkar (dizziness) aa rahe hain toh turant baith jayein ya let jayein. Pani piyein aur rest karein. Agar confusion ya chest pain ho toh doctor ko dikhayein."
        },
        isSevere: (msg: string) => msg.includes('confus') || msg.includes('chest') || msg.includes('weakness') || msg.includes('भ्रम') || msg.includes('कमजोरी') || msg.includes('jyada') || msg.includes('chakkar')
    },
    {
        keywords: {
            en: ['irregular', 'irregular period', 'period cycle', 'missed period'],
            hi: ['अनियमित', 'अनियमित पीरियड', 'पीरियड साइकिल', 'छुटा हुआ पीरियड']
        },
        advice: {
            en: "Irregular periods can be caused by various factors like stress, lifestyle changes, or underlying conditions like PCOS. It's important to track your cycles carefully. Since regular cycles are a key indicator of reproductive health, I highly recommend consulting a gynaecologist for a proper evaluation.",
            hi: "पीरियड का अनियमित होना तनाव, जीवनशैली में बदलाव या PCOS जैसी अंतर्निहित स्थितियों के कारण हो सकता है। अपने साइकिल को ध्यान से ट्रैक करना महत्वपूर्ण है। चूंकि नियमित साइकिल प्रजनन स्वास्थ्य का एक महत्वपूर्ण संकेतक हैं, इसलिए मैं उचित मूल्यांकन के लिए स्त्री रोग विशेषज्ञ (gynaecologist) से परामर्श करने की अत्यधिक अनुशंसा करता हूं।",
            hg: "Periods ka irregular hona stress ya lifestyle ki wajah se ho sakta hai. Apne cycle ko track karein. Health ke liye behter hai ki aap ek gynaecologist se consult karein."
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['period', 'cramp', 'menstrual', 'menstruation'],
            hi: ['पीरियड', 'मासिक धर्म', 'ऐंठन']
        },
        advice: {
            en: "Period pain is common. Try a heating pad or a warm bottle on your abdomen. For persistent or severe pain that disrupts your life, please consult a gynaecologist.",
            hi: "पीरियड में दर्द होना आम बात है। अपने पेट पर हीटिंग पैड या गर्म बोतल का इस्तेमाल करें। लगातार या गंभीर दर्द के लिए जो आपके जीवन को प्रभावित करता है, कृपया स्त्री रोग विशेषज्ञ (gynaecologist) से परामर्श लें।"
        },
        isSevere: (msg: string) => msg.includes('severe') || msg.includes('heavy') || msg.includes('गंभीर')
    },
    {
        keywords: {
            en: ['pregnancy', 'morning sickness', 'nausea', 'pregnant'],
            hi: ['गर्भावस्था', 'मॉर्निंग सिकनेस', 'गर्भवती', 'मतली']
        },
        advice: {
            en: "Morning sickness during pregnancy is normal. Try eating small meals and stay hydrated. Ginger can also help. Consult your obstetrician for any severe vomiting or concerns.",
            hi: "गर्भावस्था के दौरान मॉर्निंग सिकनेस होना सामान्य है। थोड़ा-थोड़ा खाना खाने की कोशिश करें और हाइड्रेटेड रहें। अदरक भी मदद कर सकता है। किसी भी गंभीर उल्टी या चिंता के लिए अपने प्रसूति रोग विशेषज्ञ से परामर्श लें।",
            hg: "Pregnancy mein morning sickness normal hai. Thoda-thoda khana khaiye aur pani piyein. Adrak (ginger) se aaram mil sakta hai. Agar ulti bahut jyada ho toh doctor se milein."
        },
        isSevere: (msg: string) => msg.includes('vomit') || msg.includes('severe') || msg.includes('उल्टी') || msg.includes('jyada') || msg.includes('bahut')
    },
    {
        keywords: {
            en: ['discharge', 'vaginal', 'safed pani', 'white discharge'],
            hi: ['डिस्चार्ज', 'योनि स्राव', 'सफेद पानी']
        },
        advice: {
            en: "Vaginal discharge is normal, but if it changes color (green/yellow), has a strong odor, or causes itching, it may be an infection. Please see a doctor for an accurate diagnosis.",
            hi: "योनि स्राव सामान्य है, लेकिन यदि इसका रंग बदलता है (हरा/पीला), तेज गंध आती है, या खुजली होती है, तो यह संक्रमण हो सकता है। सटीक निदान के लिए कृपया डॉक्टर को दिखाएं।",
            hg: "Vaginal discharge normal hai, par agar iska color change ho ya smell aaye, toh infection ho sakta hai. Confirm karne ke liye doctor ko dikhayein."
        },
        isSevere: (msg: string) => msg.includes('odor') || msg.includes('smell') || msg.includes('itch') || msg.includes('गंध') || msg.includes('खुजली') || msg.includes('badboo')
    },
    {
        keywords: {
            en: ['asthma', 'wheezing', 'short of breath', 'breathless'],
            hi: ['अस्थमा', 'दमा', 'घबराहट', 'सांस फूलना']
        },
        advice: {
            en: "Asthma causes your airways to narrow and swell. Use your rescue inhaler if you have one. If you experience severe difficulty breathing or blue lips/fingernails, seek emergency help immediately.",
            hi: "अस्थमा के कारण आपके वायुमार्ग संकुचित हो जाते हैं और उनमें सूजन आ जाती है। यदि आपके पास रेस्क्यू इनहेलर है तो उसका उपयोग करें। यदि आपको सांस लेने में गंभीर कठिनाई हो या होंठ/नाखून नीले पड़ जाएं, तो तुरंत आपातकालीन सहायता लें।"
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['emphysema', 'copd', 'lung disease', 'chronic cough'],
            hi: ['वातस्फीति', 'सीओपीडी', 'फेफड़ों की बीमारी', 'पुरानी खांसी']
        },
        advice: {
            en: "Emphysema is a lung condition that causes shortness of breath. It's often part of COPD. Avoid pollutants and smoke. Please consult a pulmonologist for specialized care and oxygen therapy evaluation if needed.",
            hi: "वातस्फीति फेफड़ों की एक स्थिति है जो सांस फूलने का कारण बनती है। यह अक्सर सीओपीडी का हिस्सा होता है। प्रदूषकों और धुएं से बचें। कृपया जरूरत पड़ने पर विशेष देखभाल और ऑक्सीजन थेरेपी मूल्यांकन के लिए पल्मोनोलॉजिस्ट से परामर्श लें।"
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['hiv', 'aids', 'immunosuppression'],
            hi: ['एचआईवी', 'एड्स', 'प्रतिरक्षा की कमी']
        },
        advice: {
            en: "HIV/AIDS is a serious condition affecting the immune system. Early diagnosis and antiretroviral therapy (ART) are crucial for a long, healthy life. Consult an infectious disease specialist for confidential testing and treatment planning.",
            hi: "एचआईवी/एड्स प्रतिरक्षा प्रणाली को प्रभावित करने वाली एक गंभीर स्थिति है। लंबे, स्वस्थ जीवन के लिए प्रारंभिक निदान और एंटीरेट्रोवाइरल थेरेपी (ART) महत्वपूर्ण हैं। संक्रामक रोग विशेषज्ञ से परामर्श लें।"
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['bronchitis', 'chest cold', 'productive cough', 'mucus'],
            hi: ['ब्रोंकाइटिस', 'छाती में सर्दी', 'बलगम वाली खांसी', 'बलगम']
        },
        advice: {
            en: "Bronchitis is an inflammation of the lining of your bronchial tubes. Stay hydrated and use a humidifier. If symptoms persist for more than 3 weeks or you have a high fever, please see a doctor.",
            hi: "ब्रोंकाइटिस आपके ब्रोन्कियल नलियों के अस्तर की सूजन है। हाइड्रेटेड रहें और ह्यूमिडिफायर का उपयोग करें। यदि लक्षण 3 सप्ताह से अधिक समय तक बने रहते हैं या आपको तेज़ बुखार है, तो कृपया डॉक्टर को दिखाएं।"
        },
        isSevere: (msg: string) => msg.includes('fever') || msg.includes('blood') || msg.includes('बुखार')
    },
    {
        keywords: {
            en: ['arthritis', 'joint pain', 'stiffness', 'inflammation', 'joint'],
            hi: ['गठिया', 'जोड़ों का दर्द', 'जकड़न', 'सूजन', 'जोड़']
        },
        advice: {
            en: "Arthritis involves inflammation of one or more joints. Gentle exercise and weight management can help. Consult a rheumatologist to determine the type of arthritis and develop a management plan.",
            hi: "गठिया में एक या अधिक जोड़ों की सूजन शामिल होती है। हल्का व्यायाम और वजन प्रबंधन मदद कर सकता है। गठिया के प्रकार को निर्धारित करने और प्रबंधन योजना विकसित करने के लिए संधिविज्ञानी (rheumatologist) से परामर्श लें।"
        },
        isSevere: (msg: string) => msg.includes('severe') || msg.includes('swollen') || msg.includes('गंभीर')
    },
    {
        keywords: {
            en: ['heart disease', 'cardiac', 'palpitation', 'cholesterol', 'blood pressure'],
            hi: ['हृदय रोग', 'दिल की बीमारी', 'धड़कन', 'कोलेस्ट्रॉल', 'रक्तचाप']
        },
        advice: {
            en: "Heart disease covers many conditions. Monitor your blood pressure and follow a heart-healthy diet. For any chest pain, shortness of breath, or palpitations, consult a cardiologist immediately.",
            hi: "हृदय रोग में कई स्थितियां शामिल हैं। अपने रक्तचाप की निगरानी करें और हृदय-स्वस्थ आहार का पालन करें। सीने में दर्द, सांस लेने में तकलीफ या धड़कन महसूस होने पर तुरंत हृदय रोग विशेषज्ञ से परामर्श लें।"
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['diabetes', 'sugar', 'blood sugar', 'insulin', 'polydipsia', 'polyuria'],
            hi: ['मधुमेह', 'शुगर', 'चीनी', 'ब्लड शुगर', 'इंसुलिन', 'ज्यादा प्यास', 'ज्यादा पेशाब']
        },
        advice: {
            en: "Diabetes is a chronic condition that affects how your body turns food into energy. Monitor your blood sugar regularly, maintain a healthy diet, and stay active. Consult an endocrinologist for a personalized management plan and medication if prescribed.",
            hi: "मधुमेह एक पुरानी स्थिति है जो प्रभावित करती है कि आपका शरीर भोजन को ऊर्जा में कैसे बदलता है। नियमित रूप से अपने ब्लड शुगर की निगरानी करें, स्वस्थ आहार लें और सक्रिय रहें। व्यक्तिगत प्रबंधन योजना और निर्धारित दवाओं के लिए एंडोक्राइनोलॉजिस्ट से परामर्श लें।"
        },
        isSevere: (msg: string) => msg.includes('very high') || msg.includes('low') || msg.includes('ब्लर') || msg.includes('धुंधला')
    },
    {
        keywords: {
            en: ['hypertension', 'high bp', 'high blood pressure', 'blood pressure'],
            hi: ['उच्च रक्तचाप', 'हाई बीपी', 'रक्तचाप', 'बीपी']
        },
        advice: {
            en: "Hypertension (high blood pressure) can lead to serious health issues if not managed. Reduce salt intake, exercise regularly, and manage stress. Please consult a doctor to monitor your BP and discuss potential treatment options.",
            hi: "मैनेज न किए जाने पर उच्च रक्तचाप (हाइपरटेंशन) गंभीर स्वास्थ्य समस्याओं का कारण बन सकता है। नमक का सेवन कम करें, नियमित व्यायाम करें और तनाव कम करें। बीपी की निगरानी और उपचार के विकल्पों के लिए कृपया डॉक्टर से परामर्श लें।"
        },
        isSevere: (msg: string) => msg.includes('headache') || msg.includes('vision') || msg.includes('सिरदर्द') || msg.includes('दृष्टि')
    },
    {
        keywords: {
            en: ['malaria', 'dengue', 'mosquito bite', 'high fever with chills'],
            hi: ['मलेरिया', 'डेंगू', 'मच्छर का काटना', 'ठंड के साथ तेज बुखार']
        },
        advice: {
            en: "Malaria and Dengue are serious mosquito-borne illnesses. Common symptoms include high fever, chills, and muscle pain. Please seek medical attention immediately for testing and proper treatment. Use mosquito nets and repellents.",
            hi: "मलेरिया और डेंगू मच्छर से होने वाली गंभीर बीमारियाँ हैं। सामान्य लक्षणों में तेज़ बुखार, ठंड लगना और मांसपेशियों में दर्द शामिल है। जांच और उचित उपचार के लिए कृपया तुरंत चिकित्सा सहायता लें। मच्छरदानी और रिपेलेंट्स का उपयोग करें।"
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['typhoid', 'enteric fever', 'sustained fever'],
            hi: ['टाइफाइड', 'मियादी बुखार', 'लगातार बुखार']
        },
        advice: {
            en: "Typhoid fever is caused by bacteria and is usually spread through contaminated food or water. Maintain high hygiene standards and drink boiled water. Consult a doctor for antibiotic treatment and diagnosis.",
            hi: "टाइफाइड बुखार बैक्टीरिया के कारण होता है और आमतौर पर दूषित भोजन या पानी के माध्यम से फैलता है। उच्च स्वच्छता मानक बनाए रखें और उबला हुआ पानी पिएं। एंटीबायोटिक्स और निदान के लिए डॉक्टर से परामर्श लें।"
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['kidney stone', 'kidney pain', 'stone in kidney', 'renal colic'],
            hi: ['गुर्दे की पथरी', 'पथरी', 'किडनी स्टोन', 'गुर्दे में दर्द']
        },
        advice: {
            en: "Kidney stones are hard deposits of minerals. Symptoms include severe pain in the back or side. Drink plenty of water to help pass the stone. See a urologist if the pain is unbearable or if you have blood in your urine.",
            hi: "गुर्दे की पथरी खनिजों का कठोर जमाव है। लक्षणों में पीठ या बगल में तेज़ दर्द शामिल है। पथरी को निकालने में मदद के लिए खूब पानी पिएं। यदि दर्द असहनीय है या आपके मूत्र में रक्त आता है, तो यूरोलॉजिस्ट को देखें।"
        },
        isSevere: (msg: string) => msg.includes('blood') || msg.includes('vomit') || msg.includes('खून') || msg.includes('उल्टी')
    },
    {
        keywords: {
            en: ['jaundice', 'liver', 'yellow eyes', 'yellow skin', 'hepatitis'],
            hi: ['पीलिया', 'लिवर', 'पीली आंखें', 'पीली त्वचा', 'हेपेटाइटिस']
        },
        advice: {
            en: "Jaundice is often a sign of liver, gallbladder, or pancreas issues. Avoid heavy/oily foods and stay hydrated. You must consult a doctor or hepatologist for a full liver function assessment and diagnosis.",
            hi: "पीलिया अक्सर लिवर, पित्ताशय या अग्न्याशय की समस्याओं का संकेत होता है। भारी/तैलीय भोजन से बचें और हाइड्रेटेड रहें। लिवर फंक्शन टेस्ट और निदान के लिए आपको डॉक्टर या हेपेटोलॉजिस्ट से परामर्श करना चाहिए।"
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['tuberculosis', 'tb', 'chronic cough', 'coughing blood'],
            hi: ['टीबी', 'तपेदिक', 'पुरानी खांसी', 'खांसी में खून', 'क्षय रोग']
        },
        advice: {
            en: "Tuberculosis (TB) is a bacterial infection that primarily affects the lungs. A cough lasting more than 3 weeks is a key symptom. TB requires long-term antibiotic treatment. See a doctor immediately for testing and treatment. It is curable.",
            hi: "तपेदिक (टीबी) एक बैक्टीरिया संक्रमण है जो मुख्य रूप से फेफड़ों को प्रभावित करता है। 3 सप्ताह से अधिक समय तक रहने वाली खांसी एक प्रमुख लक्षण है। टीबी के लिए दीर्घकालिक एंटीबायोटिक उपचार की आवश्यकता होती है। जांच और उपचार के लिए तुरंत डॉक्टर को दिखाएं। यह पूरी तरह से इलाज योग्य है।"
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['goitre', 'goiter', 'neck swelling', 'thyroid swelling', 'swollen neck'],
            hi: ['घेंघा', 'घेघा', 'गर्दन में सूजन', 'थायराइड में सूजन', 'गर्दन की सूजन']
        },
        advice: {
            en: "A swelling in the neck (Goitre) can indicate thyroid issues or iodine deficiency. It can affect your metabolism and energy level. Please consult an endocrinologist for a TSH blood test and an ultrasound of the neck. Avoid self-medicating.",
            hi: "गर्दन में सूजन (घेंघा) थायराइड की समस्याओं या आयोडीन की कमी का संकेत हो सकता है। यह आपके मेटाबॉलिज्म और ऊर्जा स्तर को प्रभावित कर सकता है। TSH ब्लड टेस्ट और गर्दन के अल्ट्रासाउंड के लिए कृपया एंडोक्राइनोलॉजिस्ट से परामर्श लें। खुद से दवा न लें।"
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['abnormality', 'body deformity', 'physical anomaly', 'unusual growth', 'lump', 'cyst'],
            hi: ['असामान्यता', 'विकृति', 'शारीरिक विसंगति', 'असामान्य वृद्धि', 'गांठ', 'सिस्ट']
        },
        advice: {
            en: "Physical abnormalities or unusual growths should be examined by a doctor to rule out serious conditions. Please see a general physician or a specialist (like a surgeon or dermatologist) for a physical examination. Some lumps may require a biopsy or scan.",
            hi: "गंभीर स्थितियों से बचने के लिए डॉक्टर द्वारा शारीरिक असामान्यताओं या असामान्य वृद्धि की जांच की जानी चाहिए। शारीरिक जांच के लिए कृपया एक सामान्य चिकित्सक या विशेषज्ञ (जैसे सर्जन या त्वचा विशेषज्ञ) से मिलें। कुछ गांठों को बायोप्सी या स्कैन की आवश्यकता हो सकती है।"
        },
        isSevere: (msg: string) => msg.includes('painful') || msg.includes('large') || msg.includes('growing') || msg.includes('दर्दनाक') || msg.includes('बड़ा')
    },
    {
        keywords: {
            en: ['thyroid', 'hypothyroidism', 'hyperthyroidism', 'weight gain', 'weight loss'],
            hi: ['थायराइड', 'हाइपोथायरायडिज्म', 'हाइपरथायरायडिज्म', 'वजन बढ़ना', 'वजन कम होना']
        },
        advice: {
            en: "Thyroid disorders affect the metabolism. Common signs include fatigue, weight changes, and temperature sensitivity. Please consult an endocrinologist for a TSH blood test and proper diagnosis.",
            hi: "थायराइड विकार मेटाबॉलिज्म को प्रभावित करते हैं। सामान्य लक्षणों में थकान, वजन में बदलाव और तापमान के प्रति संवेदनशीलता शामिल है। TSH ब्लड टेस्ट और उचित निदान के लिए कृपया एंडोक्राइनोलॉजिस्ट से परामर्श लें।"
        },
        isSevere: () => false
    },
    {
        keywords: {
            en: ['anemia', 'low hemoglobin', 'weakness', 'pale skin', 'fatigue'],
            hi: ['एनीमिया', 'खून की कमी', 'कमजोरी', 'पीली त्वचा', 'थकान', 'हीमोग्लोबिन कम']
        },
        advice: {
            en: "Anemia occurs when your blood lacks enough healthy red blood cells. Eat iron-rich foods like spinach and beats. Consult a doctor for a CBC test to check your hemoglobin levels.",
            hi: "एनीमिया तब होता है जब आपके रक्त में पर्याप्त स्वस्थ लाल रक्त कोशिकाओं की कमी होती है। पालक और चुकंदर जैसे आयरन से भरपूर खाद्य पदार्थ खाएं। अपने हीमोग्लोबिन के स्तर की जांच के लिए डॉक्टर से सीबीसी (CBC) टेस्ट के लिए परामर्श लें।"
        },
        isSevere: (msg: string) => msg.includes('severe') || msg.includes('faint') || msg.includes('गंभीर') || msg.includes('बेहोश')
    },
    {
        keywords: {
            en: ['gout', 'uric acid', 'joint pain toe', 'swelling toe'],
            hi: ['गाउट', 'यूरिक एसिड', 'पैर के अंगूठे में दर्द', 'जोड़ों में सूजन']
        },
        advice: {
            en: "Gout is a type of arthritis caused by high uric acid levels. It often affects the big toe. Avoid high-purine foods like red meat. Consult a rheumatologist for uric acid testing and management.",
            hi: "गाउट एक प्रकार का गठिया है जो यूरिक एसिड के उच्च स्तर के कारण होता है। यह अक्सर पैर के अंगूठे को प्रभावित करता है। रेड मीट जैसे हाई-प्यूरीन खाद्य पदार्थों से बचें। संधिविज्ञानी (rheumatologist) से परामर्श लें।"
        },
        isSevere: () => false
    },
    {
        keywords: {
            en: ['pcos', 'pcod', 'hormonal imbalance', 'facial hair woman'],
            hi: ['पीसीओएस', 'पीसीओडी', 'हार्मोनल असंतुलन', 'चेहरे पर बाल']
        },
        advice: {
            en: "PCOS/PCOD is a hormonal disorder common among women of reproductive age. It can cause irregular periods and weight gain. Consult a gynaecologist for a pelvic ultrasound and hormonal profile.",
            hi: "PCOS/PCOD प्रजनन आयु की महिलाओं में होने वाला एक हार्मोनल विकार है। इसके कारण अनियमित पीरियड और वजन बढ़ सकता है। पेल्विक अल्ट्रासाउंड और हार्मोनल प्रोफाइल के लिए स्त्री रोग विशेषज्ञ से परामर्श लें।"
        },
        isSevere: () => false
    },
    {
        keywords: {
            en: ['pneumonia', 'lung infection', 'shortness of breath', 'chest congestion'],
            hi: ['निमोनिया', 'फेफड़ों में संक्रमण', 'सांस फूलना', 'छाती में जकड़न']
        },
        advice: {
            en: "Pneumonia is a serious lung infection. Common symptoms include cough, fever, and difficulty breathing. It is critical that you consult a doctor immediately for a physical exam and possible chest X-ray. Stay hydrated and rest.",
            hi: "निमोनिया फेफड़ों का एक गंभीर संक्रमण है। सामान्य लक्षणों में खांसी, बुखार और सांस लेने में कठिनाई शामिल है। यह महत्वपूर्ण है कि आप शारीरिक जांच और सीने के एक्स-रे के लिए तुरंत डॉक्टर से परामर्श लें।"
        },
        isSevere: () => true
    },
    {
        keywords: {
            en: ['knee pain', 'joint pain', 'leg pain', 'joint swelling', 'knee ache'],
            hi: ['घुटने का दर्द', 'जोड़ों का दर्द', 'पैरों में दर्द', 'जोड़ों में सूजन', 'घुटने में दर्द']
        },
        advice: {
            en: "Joint and knee pain can be caused by injury, overexertion, or arthritis. Resting, applying ice packs, and using support can help. If you have severe swelling or cannot bear weight, see an orthopaedic specialist.",
            hi: "जोड़ों और घुटने का दर्द चोट, अत्यधिक परिश्रम या गठिया के कारण हो सकता है। आराम करना, बर्फ की सिकाई करना और सपोर्ट का उपयोग करना मददगार हो सकता है। यदि आपको गंभीर सूजन है या वजन सहन नहीं कर पा रहे हैं, तो हड्डी रोग विशेषज्ञ (orthopaedic) को दिखाएं।"
        },
        isSevere: (msg: string) => msg.includes('can\'t walk') || msg.includes('cannot walk') || msg.includes('swelling') || msg.includes('सूजन') || msg.includes('चल नहीं पा')
    },
    {
        keywords: {
            en: ['uti', 'urinary tract infection', 'burning urination', 'pain in urine'],
            hi: ['यूटीआई', 'पेशाब में जलन', 'पेशाब में संक्रमण', 'मूत्र मार्ग में संक्रमण']
        },
        advice: {
            en: "UTI is an infection in any part of your urinary system. Drink plenty of water and avoid caffeine. See a doctor for a urine culture test and possible antibiotics.",
            hi: "यूटीआई आपके मूत्र प्रणाली के किसी भी हिस्से में होने वाला संक्रमण है। खूब पानी पिएं और कैफीन से बचें। यूरिन कल्चर टेस्ट और एंटीबायोटिक्स के लिए डॉक्टर को दिखाएं।"
        },
        isSevere: (msg: string) => msg.includes('fever') || msg.includes('back pain') || msg.includes('बुखार') || msg.includes('पीठ दर्द')
    },
    {
        keywords: {
            en: ['sinus', 'sinusitis', 'sinus pain', 'sinus pressure'],
            hi: ['साइनस', 'साइनुसाइटिस', 'नाक बंद', 'चेहरे में दर्द'],
            hg: ['sinus problem', 'naak band', 'sinus pain']
        },
        advice: {
            en: "It sounds like you have sinusitis. Face pain and a blocked nose are common symptoms. Try steam inhalation and warm compresses. If you have a high fever or symptoms last over 10 days, see a doctor.",
            hi: "ऐसा लगता है कि आपको साइनुसाइटिस है। चेहरे का दर्द और बंद नाक सामान्य लक्षण हैं। भाप लें और गर्म सिकाई करें। यदि तेज़ बुखार हो या लक्षण 10 दिनों से अधिक समय तक रहें, तो डॉक्टर को दिखाएं।",
            hg: "Yeh sinus ki problem lag rahi hai. Steam (vaap) lein aur garam patti se sikai karein. Agar symptoms 10 din se jyada rahein toh doctor ko dikhayein."
        },
        isSevere: (msg: string) => msg.includes('vision') || msg.includes('fever') || msg.includes('दृष्टि') || msg.includes('बुखार') || msg.includes('vision')
    },
    {
        keywords: {
            en: ['sneezing', 'sneeze', 'frequent sneezing', 'hay fever'],
            hi: ['छींक', 'छींकना', 'बार-बार छींक आना'],
            hg: ['chhink aana', 'sneezing problem', 'bar bar chhink']
        },
        advice: {
            en: "Frequent sneezing is often due to allergies (allergic rhinitis). Avoid triggers like dust or pollen. Over-the-counter antihistamines may help. If you have severe breathing issues, seek help.",
            hi: "बार-बार छींक आना अक्सर एलर्जी के कारण होता है। धूल या पराग जैसी उत्तेजक चीजों से बचें। एंटीहिस्टामाइन दवाएं मदद कर सकती हैं। यदि सांस लेने में गंभीर समस्या हो, तो डॉक्टर से मिलें।",
            hg: "Baar-baar chhink aana allergy ki wajah se ho sakta hai. Dhul-mitti se bachein. Agar saans lene mein dikat ho toh doctor ko dikhayein."
        },
        isSevere: (msg: string) => msg.includes('breath') || msg.includes('saas') || msg.includes('सांस')
    }
];

// Keywords that strongly suggest a non-medical topic
const NON_MEDICAL_TOPICS = [
    'weather', 'news', 'sports', 'movie', 'music', 'book', 'game', 'travel', 'cooking', 'recipe',
    'politics', 'technology', 'finance', 'money', 'stock', 'job', 'career', 'education',
    'history', 'science', 'math', 'philosophy', 'joke', 'story', 'coding', 'programming',
    'lyrics', 'capital', 'president', 'prime minister', 'actor', 'actress', 'television',
    'मौसम', 'समाचार', 'खेल', 'फिल्म', 'गाना', 'किताब', 'यात्रा', 'खाना बनाना', 'पकाने की विधि',
    'राजनीति', 'प्रौद्योगिकी', 'वित्त', 'पैसा', 'नौकरी', 'शिक्षा', 'इतिहास', 'विज्ञान', 'गणित', 'दर्शन', 'मजाक', 'कहानी'
];

// Helper to determine if a message is potentially medical
const isMedicalQuery = (msg: string) => {
    const lowerMsg = msg.toLowerCase();

    // Specific diseases requested by user
    const specificDiseases = [
        'asthma', 'emphysema', 'hiv', 'aids', 'bronchitis', 'arthritis', 'heart', 'pneumonia', 'lung',
        'diabetes', 'hypertension', 'malaria', 'dengue', 'typhoid', 'kidney stone', 'jaundice', 'tuberculosis', 'tb',
        'thyroid', 'anemia', 'gout', 'pcos', 'pcod', 'uti', 'headache', 'pain', 'joint', 'knee',
        'goitre', 'goiter', 'abnormality', 'deformity', 'lump', 'cyst', 'sinus', 'sinusitis', 'sneezing',
        'pcos', 'endometriosis', 'fibroids', 'prolapse', 'ovarian cyst', 'ectopic', 'menopause', 'hot flashes',
        'sti', 'hiv', 'aids', 'syphilis', 'gonorrhea', 'chlamydia', 'herpes', 'trichomoniasis', 'blisters', 'warts',
        'snake', 'cobra', 'krait', 'viper', 'scorpion', 'spider', 'bee', 'wasp', 'jellyfish', 'bite', 'sting', 'venom',
        'fracture', 'broken bone', 'stroke', 'seizure', 'paralysis', 'numbness', 'tingling', 'weakness', 'burn',
        'अस्थमा', 'वातस्फीति', 'एचआईवी', 'एड्स', 'ब्रोंकाइटिस', 'गठिया', 'हृदय', 'निमोनिया', 'फेफड़ा',
        'मधुमेह', 'शुगर', 'बीपी', 'मलेरिया', 'डेंगू', 'टाइफाइड', 'पथरी', 'पीलिया', 'टीबी',
        'थायराइड', 'एनीमिया', 'गाउट', 'पीसीओएस', 'पीसीओडी', 'यूटीआई', 'सिरदर्द', 'सरदर्द', 'दर्द', 'जोड़', 'घुटने',
        'घेंघा', 'घेघा', 'असामान्यता', 'विकृति', 'गांठ', 'सिस्ट', 'सांप', 'बिच्छू', 'डंक', 'काटना', 'हड्डी', 'टूटना', 'जलन', 'सुन्न', 'कमजोरी'
    ];

    if (specificDiseases.some(d => lowerMsg.includes(d))) return true;

    // If it contains non-medical keywords, it's likely not medical unless it ALSO contains strong medical keywords
    const hasNonMedical = NON_MEDICAL_TOPICS.some(k => lowerMsg.includes(k));

    const medicalKeywords = [
        'symptom', 'pain', 'ache', 'feeling', 'doctor', 'medicine', 'sick', 'hurt', 'health',
        'injury', 'rash', 'fever', 'infection', 'allergy', 'cough', 'cold', 'flu', 'sneeze',
        'eye', 'vision', 'stomach', 'head', 'throat', 'breathe', 'breathing', 'burn', 'swelling',
        'neck', 'back', 'chest', 'dizzy', 'faint', 'skin', 'spots', 'pulse', 'bp', 'medical', 'pregnant', 'period',
        'joint', 'knee', 'pneumonia',
        'दर्द', 'बीमार', 'दवा', 'लक्षण', 'डॉक्टर', 'स्वास्थ्य', 'परेशानी', 'तकलीफ',
        'चोट', 'दाने', 'बुखार', 'संक्रमण', 'एलर्जी', 'खांसी', 'जुकाम', 'सर्दी', 'छींक',
        'आंख', 'दृष्टि', 'पेट', 'सिर', 'गला', 'सांस', 'जलन', 'सूजन', 'गर्दन', 'पीठ', 'सीने', 'चक्कर', 'गर्भवती', 'खून', 'उल्टी', 'दस्त',
        'जोड़', 'घुटने', 'निमोनिया'
    ];

    const hasMedicalKeyword = medicalKeywords.some(k => lowerMsg.includes(k));

    // Also consider it medical if it matches any symptom keyword from SYMPTOMS_DATA
    const hasSymptomKeyword = SYMPTOMS_DATA.some(s =>
        [...s.keywords.en, ...s.keywords.hi].some(k => lowerMsg.includes(k.toLowerCase()))
    );

    // If it's a mix of non-medical and medical, we prioritize medical but only if it's substantial
    if (hasNonMedical && !hasSymptomKeyword && !lowerMsg.includes('doctor') && !lowerMsg.includes('medicine')) {
        return false;
    }

    return hasSymptomKeyword || hasMedicalKeyword;
};

// Helper to simulate image analysis
const analyzeImageContent = (file: File, message: string): { isMedical: boolean; matchedSymptom?: (typeof SYMPTOMS_DATA)[0] } => {
    const fileName = file.name.toLowerCase();
    const context = (fileName + " " + message).toLowerCase();

    // 1. Check if the image is likely medical
    const medicalKeywords = [
        'rash', 'wound', 'skin', 'burn', 'spot', 'swelling', 'eye', 'throat', 'tongue',
        'injury', 'cut', 'bruise', 'scar', 'infection', 'inflammation',
        'symptom', 'pain', 'medical', 'doctor', 'treatment',
        'chakatte', 'chot', 'jalan', 'sujan', 'aankh', 'gala', 'jeebh', 'nishaan',
        'चकत्ते', 'चोट', 'जलन', 'सूजन', 'आंख', 'गला', 'जीभ', 'निशान'
    ];

    const nonMedicalKeywords = [
        'pizza', 'cat', 'dog', 'car', 'meme', 'nature', 'landscape', 'selfie', 'food',
        'building', 'electronics', 'furniture', 'toy', 'clothes',
        'samosa', 'billi', 'kutta', 'gaadi', 'khana',
        'समोसा', 'बिल्ली', 'कुत्ता', 'गाड़ी', 'खाना'
    ];

    const hasMedical = medicalKeywords.some(k => context.includes(k));
    const hasNonMedical = nonMedicalKeywords.some(k => context.includes(k));

    // Refine: If it has non-medical keywords and no medical keywords in the message, it's non-medical
    if (hasNonMedical && !medicalKeywords.some(k => message.toLowerCase().includes(k))) {
        return { isMedical: false };
    }

    const hasSymptomInContext = SYMPTOMS_DATA.some(s =>
        [...s.keywords.en, ...s.keywords.hi].some(k => context.includes(k.toLowerCase()))
    );

    if (!hasMedical && !hasSymptomInContext) {
        return { isMedical: false };
    }

    // 2. Try to match a specific symptom
    const matchedSymptom = SYMPTOMS_DATA.find(s => {
        const hgKeywords = s.keywords.hg || [];
        return [...s.keywords.en, ...s.keywords.hi, ...hgKeywords].some(k => context.includes(k.toLowerCase()));
    });

    return { isMedical: true, matchedSymptom };
};

export async function getAIResponse(userMessage: string, image?: File): Promise<AIResponse> {
    const lowerMsg = userMessage.toLowerCase();

    // Improved language detection
    let lang: 'en' | 'hi' | 'hg' = 'en';
    if (containsHindi(userMessage)) lang = 'hi';
    else if (isHinglish(userMessage)) lang = 'hg';

    const dict = TRANSLATIONS[lang];

    // 1. Initial Greeting Check
    const isGreeting = (msg: string) => {
        const greetings = ['hello', 'hi', 'hey', 'नमस्ते', 'namaste'];
        const words = msg.split(/\s+/);
        return (words.length <= 2 && greetings.some(g => msg.includes(g))) || greetings.some(g => msg.trim() === g);
    };

    if (lowerMsg.length < 3 || isGreeting(lowerMsg)) {
        return { text: dict.greeting };
    }

    // 2. Emergency Sign Check
    const isEmergency = EMERGENCY_SIGNS.some(sign => lowerMsg.includes(sign.toLowerCase()));
    if (isEmergency) {
        let emergencyText = "";
        if (lang === 'hi') emergencyText = `यह एक चिकित्सा आपातकाल (Medical Emergency) हो सकता है। कृपया तुरंत नजदीकी अस्पताल में जाएं या आपातकालीन सेवाओं को कॉल करें। देरी न करें।`;
        else if (lang === 'hg') emergencyText = `Yeh ek Medical Emergency ho sakti hai. Please turant hospital jayein ya emergency services ko call karein. Der na karein.`;
        else emergencyText = `This could be a Medical Emergency. Please go to the nearest hospital emergency room or call emergency services (like 102 or 108) immediately. Do not delay.`;

        return {
            text: emergencyText,
            suggestDoctor: true,
            isExpertRequired: true
        };
    }

    // 3. Ethics & Privacy Check
    const compliance = EthicsPrivacyManager.checkQuery(userMessage);
    if (!compliance.isSafe) {
        let safetyText = "I'm sorry, I cannot answer this query as it violates safety guidelines.";
        if (lang === 'hi') safetyText = "क्षमा करें, मैं इस प्रश्न का उत्तर नहीं दे सकता क्योंकि यह सुरक्षा दिशानिर्देशों का उल्लंघन करता है।";
        else if (lang === 'hg') safetyText = "Sorry, main iska jawab nahi de sakta kyuki yeh safety guidelines ke against hai.";

        return {
            text: safetyText,
            suggestDoctor: true
        };
    }

    // 3. Image Scanning Logic (Restore Integrated Heuristic)
    if (image) {
        const { isMedical, matchedSymptom } = analyzeImageContent(image, userMessage);
        if (!isMedical) {
            return { text: dict.nonMedicalImage, suggestDoctor: false };
        }
        if (matchedSymptom) {
            return {
                text: `I have analyzed the image and your description based on our medical database. ${matchedSymptom.advice[lang] || matchedSymptom.advice['en']}\n\n${compliance.disclaimer}`,
                suggestDoctor: matchedSymptom.isSevere(lowerMsg)
            };
        }
    }

    // 4. Dynamic Research & Knowledge Hub Integration
    const research = await MedicalKnowledgeHub.researchSymptom(userMessage);

    // Add significant delay for research visibility if not found locally or if it's a complex query
    const isComplex = lowerMsg.length > 50 || compliance.requiresExpert;
    if (!research.foundInLocal || isComplex) {
        await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    let responseText = "";
    let expertFlag = compliance.requiresExpert;

    // Detect primary symptom for home remedy
    let remedyKey = 'default';
    if (lowerMsg.includes('head') || lowerMsg.includes('migraine') || lowerMsg.includes('sar dard') || lowerMsg.includes('sir dard')) remedyKey = 'headache';
    else if (lowerMsg.includes('fever') || lowerMsg.includes('temp') || lowerMsg.includes('bukhar')) remedyKey = 'fever';
    else if (lowerMsg.includes('cough') || lowerMsg.includes('throat') || lowerMsg.includes('khansi') || lowerMsg.includes('gala')) remedyKey = 'cough';
    else if (lowerMsg.includes('stomach') || lowerMsg.includes('belly') || lowerMsg.includes('pet dard')) remedyKey = 'stomach';
    else if (lowerMsg.includes('sinus')) remedyKey = 'sinus';
    else if (lowerMsg.includes('sneeze') || lowerMsg.includes('chhink')) remedyKey = 'sneezing';
    else if (lowerMsg.includes('pain') || lowerMsg.includes('hurt') || lowerMsg.includes('ache') || lowerMsg.includes('dard')) remedyKey = 'pain';

    const remedySection = `${dict.remedyHeader}\n${HOME_REMEDIES[remedyKey][lang]}\n\n\n\n`;

    if (research.foundInLocal && research.data) {
        const d = research.data;
        let diseaseInfo = "";
        if (lang === 'hi') {
            diseaseInfo = `संभावित स्थिति: यह ${d.name.hi} (${d.type}) की तरह लगता है।\n\nलक्षण: ${d.symptoms.join(', ')}\nकारण: ${d.causes.join(', ')}\nप्रबंधन: ${d.treatmentOptions.join(', ')}\n\n${compliance.disclaimer}`;
        } else if (lang === 'hg') {
            diseaseInfo = `Potenial Condition: Yeh ${d.name.en} (${d.type} condition) lag raha hai.\n\nSymptoms: ${d.symptoms.join(', ')}\nCauses: ${d.causes.join(', ')}\nManagement: ${d.treatmentOptions.join(', ')}\n\n${compliance.disclaimer}`;
        } else {
            diseaseInfo = `Potential Condition: This looks consistent with ${d.name.en} (${d.type} condition).\n\nSymptoms: ${d.symptoms.join(', ')}\nCauses: ${d.causes.join(', ')}\nManagement: ${d.treatmentOptions.join(', ')}\n\n${compliance.disclaimer}`;
        }

        responseText = remedySection + diseaseInfo;
        if (d.requiresExpert) expertFlag = true;
    } else {
        // Fallback to traditional symptom matching if hub didn't find a structured disease
        for (const symptom of SYMPTOMS_DATA) {
            const hgKeywords = symptom.keywords.hg || [];
            const matches = [...symptom.keywords.en, ...symptom.keywords.hi, ...hgKeywords].some(k => {
                const regex = new RegExp(`\\b${k.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                return regex.test(lowerMsg);
            });
            if (matches) {
                responseText = remedySection + (symptom.advice[lang] || symptom.advice['en']);
                return {
                    text: responseText,
                    suggestDoctor: symptom.isSevere(lowerMsg)
                };
            }
        }

        // Final Fallback for recognized medical queries but no specific match
        if (isMedicalQuery(lowerMsg)) {
            responseText = remedySection + `${dict.unrecognizedSymptom}\n\n${research.summary}\n\n${compliance.disclaimer}`;
        } else {
            return { text: dict.nonMedical, suggestDoctor: false };
        }
    }

    // Add expert requirement message if needed
    if (expertFlag) {
        responseText += `\n\nNote: ${EthicsPrivacyManager.getExpertRequirementMessage(lang)}`;
    }

    // Add privacy warning if needed
    if (compliance.privacyWarning) {
        responseText = `Privacy Notice: ${compliance.privacyWarning}\n\n${responseText}`;
    }

    return {
        text: responseText,
        suggestDoctor: expertFlag || isMedicalQuery(lowerMsg),
        isExpertRequired: expertFlag
    };
}
