export const translations = {
    en: {
        navbar: {
            features: "Features",
            about: "About",
            support: "Support"
        },
        landing: {
            title: "Your Complete Healthcare Ecosystem",
            subtitle: "Healthcare",
            description: "Select your portal to access specialized tools and services designed for your role.",
            cards: {
                user: { title: "Login as User", desc: "Access your personal health records, book appointments, and chat with AI Doctor." },
                doctor: { title: "Login as Doctor", desc: "Manage patient consultations, view medical history, and provide expert advice." },
                driver: { title: "Login as Driver", desc: "Track emergency requests, navigate routes, and coordinate medical transport." },
                supplier: { title: "Login as Supplier", desc: "Manage inventory, track equipment orders, and handle medical supply logistics." }
            },
            button: "Continue",
            footer: "© 2026 Askleya. Professional medical solutions powered by intelligence."
        },
        dashboard: {
            header: { welcome: "Welcome back,", logout: "Logout" },
            cards: {
                aiDoctor: { title: "AI Doctor", desc: "Chat with AI for symptom analysis & health guidance", btn: "Start Consultation" },
                doctor: { title: "Doctor", desc: "Book appointment with certified doctors", btn: "Find Doctor" },
                pharmacy: { title: "Pharmacy", desc: "Order medicines & browse nearby pharmacies", btn: "Order Now" },
                prescription: { title: "Prescriptions", desc: "View your full prescription & medical history", btn: "View History" },
                ambulance: { title: "Ambulance", desc: "Quick hospital selection and ambulance booking", btn: "Book Now" }
            },
            nav: { home: "Home", appointments: "Appointments", records: "Records", profile: "Profile" }
        },
        pharmacyServices: {
            title: "Pharmacy & Blood Bank",
            subtitle: "Find medicines and life-saving blood instantly",
            pharmacyTitle: "Pharmacies",
            pharmacyDesc: "Browse nearby pharmacies, check medicine availability, and order online for home delivery.",
            pharmacyBtn: "View Pharmacies",
            bloodBankTitle: "Blood Banks",
            bloodBankDesc: "Search for blood availability by type and location in case of emergencies or planned procedures.",
            bloodBankBtn: "View Blood Banks"
        },
        pharmacy: {
            title: "Pharmacies",
            searchPlaceholder: "Search by name or location...",
            filterAll: "All Pharmacies",
            filterOpen: "Open Now",
            filter247: "24/7 Services",
            filterRating: "Top Rated",
            viewBtn: "View & Order",
            noResults: "No pharmacies found matching your criteria."
        },
        pharmacyDetails: {
            searchPlaceholder: "Search medicines...",
            cartTitle: "Your Cart",
            emptyCart: "Your cart is empty",
            totalLabel: "Total",
            checkoutBtn: "Checkout",
            successTitle: "Order Success!",
            successDesc: "Your order has been placed successfully. You can track it in your profile.",
            inStock: "In Stock",
            outOfStock: "Out of Stock",
            addBtn: "Add"
        },
        bloodBank: {
            title: "Blood Banks",
            searchPlaceholder: "Search by location or bank name...",
            filterType: "Available Blood Types:",
            requestBtn: "View & Request",
            noResults: "No blood banks found matching your requirements.",
            types: {
                all: "All",
                aPlus: "A+",
                aMinus: "A-",
                bPlus: "B+",
                bMinus: "B-",
                abPlus: "AB+",
                abMinus: "AB-",
                oPlus: "O+",
                oMinus: "O-"
            }
        },
        bloodBankDetails: {
            title: "Request Blood",
            detailsTitle: "Request Details",
            typeLabel: "Blood Type",
            unitsLabel: "Units Required",
            nameLabel: "Patient Name",
            namePlaceholder: "Full Name",
            emergencyLabel: "Mark as Emergency",
            emergencyDesc: "High priority request for urgent medical situations",
            submitBtn: "Request {qty} Unit(s) of {type}",
            successTitle: "Request Submitted!",
            successDesc: "Your request ID is {id}. The blood bank will contact you shortly.",
            backBtn: "Back to List",
            processingTime: "Processing Time",
            availability: "Availability",
            requirement: "Requirement",
            immediate: "Immediate",
            standardTime: "15-30 mins"
        },
        doctorProfile: {
            experience: "Experience",
            rating: "Rating",
            about: "About",
            hospital: "Hospital",
            fees: "Consultation Fees",
            bookBtn: "Book Appointment",
            uploadBtn: "Upload Report",
            notFound: "Doctor not found",
            backBtn: "Back to list",
            booked: "Booked!",
            uploading: "Uploading...",
            uploadSuccess: "Report uploaded successfully!"
        },
        specialistList: {
            title: "Find a Specialist",
            searchPlaceholder: "Search by specialty or doctor name...",
            noResults: "No doctors found matching your search."
        },
        specialties: {
            cardiologist: "Cardiologist",
            dermatologist: "Dermatologist",
            pediatrician: "Pediatrician",
            neurologist: "Neurologist",
            gynecologist: "Gynecologist",
            orthopedic: "Orthopedic"
        },
        prescriptions: {
            title: "My Prescriptions",
            subtitle: "Select a doctor to view your prescriptions",
            searchPlaceholder: "Search by doctor or specialty...",
            filterRecent: "Most Recent",
            filterOldest: "Oldest First",
            lastConsult: "Last Consultation",
            available: "Prescriptions available",
            viewBtn: "View Prescriptions",
            noDocs: "No doctors found matching your search."
        },
        prescriptionDetails: {
            title: "Medications",
            searchPlaceholder: "Search by medicine or diagnosis...",
            filterAll: "All Dates",
            filter6Months: "Last 6 Months",
            downloadBtn: "Download PDF",
            detailsBtn: "View Details",
            noPresc: "No prescriptions found."
        },
        ambulances: {
            title: "Select Hospital",
            subtitle: "Choose a hospital for ambulance service",
            searchPlaceholder: "Search by hospital or location...",
            filterAll: "All Hospitals",
            filterEmergency: "Emergency (24/7)",
            filterRating: "Top Rated",
            selectBtn: "Select Hospital",
            noResults: "No hospitals found."
        },
        ambulanceBooking: {
            title: "Select Ambulance",
            normal: "Normal Ambulance",
            normalDesc: "Basic life support (BLS). For non-critical patients.",
            icu: "ICU Ambulance",
            icuDesc: "Advanced life support (ALS). For critical patients.",
            estPrice: "Est. Price",
            bookBtn: "Book Now",
            confirmTitle: "Booking Confirmation",
            pickupLabel: "Pickup Address",
            pickupPlaceholder: "Enter pickup location",
            conditionLabel: "Patient Condition",
            phoneLabel: "Contact Number",
            priorityLabel: "High Priority Emergency",
            priorityDesc: "Flag this as a critical emergency",
            confirmBtn: "Confirm Booking",
            successTitle: "Booking Confirmed!",
            successDesc: "Your ambulance is on its way.",
            etaLabel: "Estimated Arrival",
            backBtn: "Back to Dashboard"
        },
        profileSetup: {
            title: "Complete Your Profile",
            subtitle: "Help us keep your account secure and personalized",
            steps: { basic: "Basic Information", security: "Security Information", personal: "Personal Details" },
            labels: {
                fullName: "Full Name",
                username: "Username",
                email: "Email Address",
                mobile: "Mobile Number",
                otp: "Verification Code",
                specialization: "Medical Specialization",
                registrationNumber: "Registration Number",
                licenseNumber: "License Number",
                securityQuestion: "Security Question",
                securityAnswer: "Security Answer",
                twoFA: "Two-Factor Authentication",
                twoFADesc: "Add an extra layer of security to your account.",
                dob: "Date of Birth",
                gender: "Gender",
                address: "Full Address",
                city: "City",
                state: "State",
                pinCode: "PIN Code"
            },
            placeholders: {
                fullName: "John Doe",
                username: "johndoe123",
                email: "john@example.com",
                mobile: "9876543210",
                otp: "Enter 6-digit code",
                registrationNumber: "e.g. REG123456",
                licenseNumber: "e.g. LIC987654",
                securityAnswer: "Your Answer",
                address: "Flat/House No, Building, Street, Area",
                city: "City Name",
                state: "State Name",
                pinCode: "123456"
            },
            btns: {
                sendOtp: "Send OTP",
                resend: "Resend",
                verify: "Verify",
                verified: "Verified",
                next: "Next Step",
                back: "Back",
                save: "Save & Continue"
            },
            questions: [
                "Select a question",
                "What was the name of your first pet?",
                "In what city were you born?",
                "What was your favorite subject in school?",
                "What is your mother's maiden name?"
            ],
            genders: { male: "Male", female: "Female", other: "Other", none: "Prefer not to say" },
            errors: {
                fullName: "Full Name is required",
                username: "Username is required",
                email: "Email is required",
                mobile: "Mobile Number is required",
                otp: "Please verify your mobile number",
                invalidOtp: "Invalid OTP",
                specialization: "Specialization is required",
                registrationNumber: "Registration Number is required",
                licenseNumber: "License Number is required",
                securityQuestion: "Please select a security question",
                securityAnswer: "Security Answer is required",
                dob: "Date of Birth is required",
                gender: "Please select your gender",
                address: "Address is required",
                city: "City is required",
                state: "State is required",
                pinCode: "PIN Code is required",
                mobileFirst: "Enter mobile number first"
            }
        },
        doctorDashboard: {
            sidebar: {
                dashboard: "Dashboard",
                appointments: "Appointments",
                patients: "Patients",
                prescriptions: "Prescriptions",
                reports: "Reports",
                settings: "Settings",
                logout: "Logout"
            },
            header: {
                welcome: "Welcome Dr.",
                subtitle: "Here's what's happening with your patients today."
            },
            stats: {
                today: "Today's Appointments",
                total: "Total Patients",
                pending: "Pending Prescriptions",
                labs: "Lab Reports"
            },
            features: {
                appointments: { title: "My Appointments", desc: "View upcoming & past appointments" },
                records: { title: "Patient Records", desc: "Access patient medical history" },
                write: { title: "Write Prescription", desc: "Create and send digital prescriptions" },
                consultation: { title: "Consultation", desc: "Start online consultation" },
                reports: { title: "Reports", desc: "View uploaded test results" },
                messages: { title: "Messages", desc: "Chat with patients and colleagues" }
            },
            btns: {
                explore: "Explore"
            },
            bottomNav: {
                home: "Home",
                appts: "Appts",
                patients: "Patients",
                presc: "Presc",
                profile: "Profile"
            },
            appointmentsPage: {
                title: "My Appointments",
                subtitle: "Manage and respond to patient appointment requests",
                pending: "Pending",
                searchPlaceholder: "Search by patient name or ID...",
                allStatus: "All Status",
                allModes: "All Modes",
                noAppts: "No appointments found",
                adjustFilters: "Try adjusting your filters or search terms",
                approve: "Approve",
                reject: "Reject",
                toastReceived: "New appointment request received!",
                toastApproved: "Appointment Approved",
                toastRejected: "Appointment Rejected",
                toastSuccess: "The request has been updated successfully.",
                date: "Date",
                time: "Time",
                mode: "Mode",
                id: "ID",
                symptoms: "Symptoms"
            }
        },
        supplierDashboard: {
            sidebar: {
                overview: "Dashboard Overview",
                medicines: "Manage Medicines",
                equipment: "Manage Medical Equipment",
                blood: "Manage Blood Stock",
                orders: "Orders Received",
                pending: "Pending Deliveries",
                inventory: "Inventory Status",
                addProduct: "Add New Product",
                payments: "Payment & Transactions",
                notifications: "Notifications",
                settings: "Profile Settings",
                logout: "Logout"
            },
            header: {
                welcome: "Welcome back,",
                subtitle: "Here's what's happening with your inventory today."
            },
            stats: {
                totalProducts: "Total Products",
                activeOrders: "Active Orders",
                pendingDeliveries: "Pending Deliveries",
                outOfStock: "Out of Stock Items",
                revenue: "Total Revenue",
                lowStockAlerts: "Low Stock Alerts"
            },
            btns: {
                addMedicine: "Add Medicine",
                bulkUpload: "Bulk Upload",
                updateStock: "Update Stock",
                accept: "Accept",
                reject: "Reject",
                updateStatus: "Update Status",
                downloadInvoice: "Download Invoice",
                explore: "Explore Now"
            }
        },
        driverDashboard: {
            sidebar: {
                overview: "Dashboard Overview",
                emergencyRequests: "New Emergency Requests",
                bloodRequests: "Urgent Blood Requests",
                deliveryOrders: "New Delivery Orders",
                activeRide: "Active Ride",
                activeDeliveries: "Active Deliveries",
                activeTransport: "Active Transport",
                rideHistory: "Ride History",
                deliveryHistory: "Delivery History",
                transportHistory: "Transport History",
                earnings: "Earnings",
                vehicleStatus: "Vehicle Status",
                contacts: "Emergency Contacts",
                notifications: "Notifications",
                settings: "Profile & Settings",
                logout: "Logout"
            },
            header: {
                welcome: "Welcome Back,",
                onDuty: "ON DUTY",
                pendingAmbulance: "emergency dispatches",
                pendingMedicine: "medicine orders",
                pendingBlood: "urgent blood units",
                queue: "pending in your queue."
            },
            stats: {
                rides: "Rides Today",
                emergency: "Active Emergency",
                pending: "Pending Requests",
                earnings: "Earnings Today",
                rating: "Rating",
                deliveries: "Deliveries Today",
                activeDeliveries: "Active Deliveries",
                pendingOrders: "Pending Orders",
                onTime: "On-Time Delivery Rate",
                urgent: "Urgent Requests",
                activeTransports: "Active Transports",
                completed: "Completed Today",
                alerts: "Emergency Alerts",
                temp: "Temp Warnings"
            }
        },
        patientRecords: {
            title: "Patient Records",
            subtitle: "View and manage patient medical information",
            totalPatients: "Total {count} Patients",
            searchPlaceholder: "Search by Name, ID, or Phone...",
            backToDashboard: "Back to Dashboard",
            filters: {
                gender: {
                    all: "All Genders",
                    male: "Male",
                    female: "Female"
                },
                age: {
                    all: "All Ages",
                    range1: "0-18 Yrs",
                    range2: "19-40 Yrs",
                    range3: "41-60 Yrs",
                    range4: "60+ Yrs"
                },
                sort: {
                    recent: "Sort: Recent Visit",
                    alphabetical: "Sort: Alphabetical"
                }
            },
            card: {
                id: "ID",
                bg: "B.G",
                ageGenderLabel: "Age & Gender",
                lastVisitLabel: "Last Visit",
                years: "Yrs",
                viewHistoryBtn: "View Medical History"
            },
            noResults: {
                title: "No patients found",
                desc: "Try adjusting your search criteria or filters."
            }
        },
        patientMedicalHistory: {
            backDirectly: "Back directly",
            confidentialBadge: "Confidential Patient Data",
            notFound: "Patient Not Found",
            backToRecordsBtn: "Back to Patient Records",
            profile: {
                id: "ID",
                years: "Yrs",
                contactLabel: "Contact Number",
                emergencyLabel: "Emergency Contact",
                heightLabel: "Height",
                weightLabel: "Weight",
                bmiLabel: "BMI"
            },
            overview: {
                sectionTitle: "Conditions & Allergies",
                chronicTitle: "Chronic Conditions",
                noChronic: "No chronic conditions reported.",
                allergiesTitle: "Allergies",
                noAllergies: "No known allergies."
            },
            medications: {
                sectionTitle: "Ongoing Medications",
                noMeds: "No ongoing medications."
            },
            appointments: {
                sectionTitle: "Past Appointments",
                colDate: "Date",
                colDoctor: "Doctor",
                colDiagnosis: "Diagnosis",
                colNotes: "Notes",
                colAction: "Action",
                viewDetailsBtn: "View Details"
            },
            prescriptions: {
                sectionTitle: "Prescription History",
                dateLabel: "Date",
                idLabel: "ID",
                followUpLabel: "Follow up",
                freqLabel: "Freq",
                durLabel: "Dur"
            }
        },
        gratitudePopup: {
            title: "Thank You for Choosing Askleya! ✨",
            subtitle: "Your health and well-being are our top priorities.",
            message: "We are honored to have you as part of our medical ecosystem. Together, we are building a smarter, healthier future.",
            continueBtn: "Continue to Dashboard"
        },
        feedbackPopup: {
            title: "Help Us Improve 💬",
            subtitle: "Your feedback helps us provide better care.",
            ratingLabel: "How would you rate your experience?",
            commentLabel: "Any suggestions for us?",
            placeholder: "Share your thoughts here...",
            submitBtn: "Submit Feedback",
            cancelBtn: "Maybe Later",
            success: "Thank you for your feedback!"
        },
        consultationSelection: {
            title: "Choose Consultation Type",
            subtitle: "Select your preferred way to connect with the specialist",
            audio: {
                title: "Audio Consultation",
                desc: "High-quality voice call for immediate medical guidance.",
                fee: "₹1,000",
                btn: "Select Audio"
            },
            video: {
                title: "Video Consultation",
                desc: "Face-to-face video session for a more thorough examination.",
                fee: "₹1,500",
                btn: "Select Video"
            },
            back: "Back to Profile"
        }
    },
    hi: {
        navbar: {
            features: "विशेषताएं",
            about: "हमारे बारे में",
            support: "सहायता"
        },
        landing: {
            title: "आपका संपूर्ण स्वास्थ्य पारिस्थितिकी तंत्र",
            subtitle: "स्वास्थ्य देखभाल",
            description: "अपनी भूमिका के लिए डिज़ाइन किए गए विशेष टूल और सेवाओं तक पहुँचने के लिए अपना पोर्टल चुनें।",
            cards: {
                user: { title: "उपयोगकर्ता के रूप में लॉगिन करें", desc: "अपने व्यक्तिगत स्वास्थ्य रिकॉर्ड एक्सेस करें, अपॉइंटमेंट बुक करें और एआई डॉक्टर से चैट करें।" },
                doctor: { title: "डॉक्टर के रूप में लॉगिन करें", desc: "रोगी परामर्श प्रबंधित करें, चिकित्सा इतिहास देखें और विशेषज्ञ सलाह दें।" },
                driver: { title: "ड्राइवर के रूप में लॉगिन करें", desc: "आपातकालीन अनुरोधों को ट्रैक करें, मार्ग नेविगेट करें और चिकित्सा परिवहन का समन्वय करें।" },
                supplier: { title: "आपूर्तिकर्ता के रूप में लॉगिन करें", desc: "इन्वेंट्री प्रबंधित करें, उपकरण के आदेशों को ट्रैक करें और चिकित्सा आपूर्ति रसद संभालें।" }
            },
            button: "जारी रखें",
            footer: "© 2026 Askleya. बुद्धिमत्ता द्वारा संचालित पेशेवर चिकित्सा समाधान।"
        },
        dashboard: {
            header: { welcome: "आपका स्वागत है,", logout: "लॉगआउट" },
            cards: {
                aiDoctor: { title: "एआई डॉक्टर", desc: "लक्षण विश्लेषण और स्वास्थ्य मार्गदर्शन के लिए एआई के साथ चैट करें", btn: "परामर्श शुरू करें" },
                doctor: { title: "डॉक्टर", desc: "प्रमाणित डॉक्टरों के साथ अपॉइंटमेंट बुक करें", btn: "डॉक्टर खोजें" },
                pharmacy: { title: "फार्मेसी", desc: "दवाएं ऑर्डर करें और आस-पास की फार्मेसी खोजें", btn: "अभी ऑर्डर करें" },
                prescription: { title: "प्रिस्क्रिप्शन", desc: "अपना पूरा प्रिस्क्रिप्शन और चिकित्सा इतिहास देखें", btn: "इतिहास देखें" },
                ambulance: { title: "एम्बुलेंस", desc: "त्वरित अस्पताल चयन और एम्बुलेंस बुकिंग", btn: "अभी बुक करें" }
            },
            nav: { home: "होम", appointments: "अपॉइंटमेंट", records: "रिकॉर्ड", profile: "प्रोफ़ाइल" }
        },
        pharmacyServices: {
            title: "फार्मेसी और ब्लड बैंक",
            subtitle: "दवाएं और जीवन रक्षक रक्त तुरंत पाएं",
            pharmacyTitle: "फार्मेसी",
            pharmacyDesc: "आस-पास की फार्मेसी ब्राउज़ करें, दवाओं की उपलब्धता जांचें और होम डिलीवरी के लिए ऑनलाइन ऑर्डर करें।",
            pharmacyBtn: "फार्मेसी देखें",
            bloodBankTitle: "ब्लड बैंक",
            bloodBankDesc: "आपात स्थिति या नियोजित प्रक्रियाओं के मामले में प्रकार और स्थान के अनुसार रक्त की उपलब्धता खोजें।",
            bloodBankBtn: "ब्लड बैंक देखें"
        },
        pharmacy: {
            title: "फार्मेसी",
            searchPlaceholder: "नाम या स्थान से खोजें...",
            filterAll: "सभी फार्मेसी",
            filterOpen: "अभी खुला है",
            filter247: "24/7 सेवाएं",
            filterRating: "टॉप रेटेड",
            viewBtn: "देखें और ऑर्डर करें",
            noResults: "आपकी खोज से मेल खाने वाली कोई फार्मेसी नहीं मिली।"
        },
        pharmacyDetails: {
            searchPlaceholder: "दवाएं खोजें...",
            cartTitle: "आपका कार्ट",
            emptyCart: "आपका कार्ट खाली है",
            totalLabel: "कुल",
            checkoutBtn: "चेकआउट",
            successTitle: "ऑर्डर सफल!",
            successDesc: "आपका ऑर्डर सफलतापूर्वक दे दिया गया है। आप इसे अपनी प्रोफ़ाइल में ट्रैक कर सकते हैं।",
            inStock: "स्टॉक में",
            outOfStock: "स्टॉक से बाहर",
            addBtn: "जोड़ें"
        },
        bloodBank: {
            title: "ब्लड बैंक",
            searchPlaceholder: "स्थान या बैंक के नाम से खोजें...",
            filterType: "उपलब्ध रक्त के प्रकार:",
            requestBtn: "देखें और अनुरोध करें",
            noResults: "आपकी आवश्यकताओं से मेल खाने वाला कोई ब्लड बैंक नहीं मिला।",
            types: {
                all: "सभी",
                aPlus: "A+",
                aMinus: "A-",
                bPlus: "B+",
                bMinus: "B-",
                abPlus: "AB+",
                abMinus: "AB-",
                oPlus: "O+",
                oMinus: "O-"
            }
        },
        bloodBankDetails: {
            title: "रक्त का अनुरोध करें",
            detailsTitle: "अनुरोध विवरण",
            typeLabel: "रक्त का प्रकार",
            unitsLabel: "इकाइयों की आवश्यकता",
            nameLabel: "रोगी का नाम",
            namePlaceholder: "पूरा नाम",
            emergencyLabel: "आपातकालीन के रूप में चिह्नित करें",
            emergencyDesc: "तत्काल चिकित्सा स्थितियों के लिए उच्च प्राथमिकता अनुरोध",
            submitBtn: "{type} की {qty} यूनिट का अनुरोध करें",
            successTitle: "अनुरोध जमा हो गया!",
            successDesc: "आपकी अनुरोध आईडी {id} है। ब्लड बैंक जल्द ही आपसे संपर्क करेगा।",
            backBtn: "सूची पर वापस जाएं",
            processingTime: "प्रसंस्करण समय",
            availability: "उपलब्धता",
            requirement: "आवश्यकता",
            immediate: "तत्काल",
            standardTime: "15-30 मिनट"
        },
        doctorProfile: {
            experience: "अनुभव",
            rating: "रेटिंग",
            about: "के बारे में",
            hospital: "अस्पताल",
            fees: "परामर्श शुल्क",
            bookBtn: "अपॉइंटमेंट बुक करें",
            uploadBtn: "रिपोर्ट अपलोड करें",
            notFound: "डॉक्टर नहीं मिला",
            backBtn: "सूची पर वापस जाएं",
            booked: "बुक हो गया!",
            uploading: "अपलोड हो रहा है...",
            uploadSuccess: "रिपोर्ट सफलतापूर्वक अपलोड की गई!"
        },
        specialistList: {
            title: "विशेषज्ञ खोजें",
            searchPlaceholder: "विशेषज्ञता या डॉक्टर के नाम से खोजें...",
            noResults: "आपकी खोज से मेल खाने वाला कोई डॉक्टर नहीं मिला।"
        },
        specialties: {
            cardiologist: "हृदय रोग विशेषज्ञ",
            dermatologist: "त्वचा रोग विशेषज्ञ",
            pediatrician: "बाल रोग विशेषज्ञ",
            neurologist: "न्यूरोलॉजिस्ट",
            gynecologist: "स्त्री रोग विशेषज्ञ",
            orthopedic: "हड्डी रोग विशेषज्ञ"
        },
        prescriptions: {
            title: "मेरे प्रिस्क्रिप्शन",
            subtitle: "अपने प्रिस्क्रिप्शन देखने के लिए डॉक्टर चुनें",
            searchPlaceholder: "डॉक्टर या विशेषता से खोजें...",
            filterRecent: "सबसे हालिया",
            filterOldest: "सबसे पुराना",
            lastConsult: "पिछला परामर्श",
            available: "प्रिस्क्रिप्शन उपलब्ध",
            viewBtn: "प्रिस्क्रिप्शन देखें",
            noDocs: "आपकी खोज से मेल खाने वाला कोई डॉक्टर नहीं मिला।"
        },
        prescriptionDetails: {
            title: "दवाएं",
            searchPlaceholder: "दवा या निदान से खोजें...",
            filterAll: "सभी तिथियां",
            filter6Months: "पिछले 6 महीने",
            downloadBtn: "पीडीएफ डाउनलोड करें",
            detailsBtn: "विवरण देखें",
            noPresc: "कोई प्रिस्क्रिप्शन नहीं मिला।"
        },
        ambulances: {
            title: "अस्पताल चुनें",
            subtitle: "एम्बुलेंस सेवा के लिए अस्पताल चुनें",
            searchPlaceholder: "अस्पताल या स्थान से खोजें...",
            filterAll: "सभी अस्पताल",
            filterEmergency: "आपातकालीन (24/7)",
            filterRating: "टॉप रेटेड",
            selectBtn: "अस्पताल चुनें",
            noResults: "कोई अस्पताल नहीं मिला।"
        },
        ambulanceBooking: {
            title: "एम्बुलेंस चुनें",
            normal: "सामान्य एम्बुलेंस",
            normalDesc: "बुनियादी जीवन सहायता (BLS)। गैर-गंभीर रोगियों के लिए।",
            icu: "आईसीयू एम्बुलेंस",
            icuDesc: "उन्नत जीवन सहायता (ALS)। गंभीर रोगियों के लिए।",
            estPrice: "अनुमानित मूल्य",
            bookBtn: "अभी बुक करें",
            confirmTitle: "बुकिंग की पुष्टि",
            pickupLabel: "पिकअप का पता",
            pickupPlaceholder: "पिकअप स्थान दर्ज करें",
            conditionLabel: "रोगी की स्थिति",
            phoneLabel: "संपर्क नंबर",
            priorityLabel: "उच्च प्राथमिकता आपातकाल",
            priorityDesc: "इसे एक गंभीर आपातकाल के रूप में चिह्नित करें",
            confirmBtn: "बुकिंग की पुष्टि करें",
            successTitle: "बुकिंग की पुष्टि हो गई!",
            successDesc: "आपकी एम्बुलेंस रास्ते में है।",
            etaLabel: "पहुंचने का अनुमानित समय",
            backBtn: "डैशबोर्ड पर वापस जाएं"
        },
        profileSetup: {
            title: "अपनी प्रोफ़ाइल पूरी करें",
            subtitle: "अपने खाते को सुरक्षित और व्यक्तिगत रखने में हमारी सहायता करें",
            steps: { basic: "बुनियादी जानकारी", security: "सुरक्षा जानकारी", personal: "व्यक्तिगत विवरण" },
            labels: {
                fullName: "पूरा नाम",
                username: "उपयोगकर्ता नाम",
                email: "ईमेल पता",
                mobile: "मोबाइल नंबर",
                otp: "सत्यापन कोड",
                specialization: "चिकित्सा विशेषज्ञता",
                registrationNumber: "पंजीकरण संख्या",
                licenseNumber: "लाइसेंस संख्या",
                securityQuestion: "सुरक्षा प्रश्न",
                securityAnswer: "सुरक्षा उत्तर",
                twoFA: "दो-कारक प्रमाणीकरण",
                twoFADesc: "अपने खाते में सुरक्षा की एक अतिरिक्त परत जोड़ें।",
                dob: "जन्म तिथि",
                gender: "लिंग",
                address: "पूरा पता",
                city: "शहर",
                state: "राज्य",
                pinCode: "पिन कोड"
            },
            placeholders: {
                fullName: "जॉन डो",
                username: "johndoe123",
                email: "john@example.com",
                mobile: "9876543210",
                otp: "6-अंकों का कोड दर्ज करें",
                registrationNumber: "उदा. REG123456",
                licenseNumber: "उदा. LIC987654",
                securityAnswer: "आपका उत्तर",
                address: "फ्लैट/घर नंबर, भवन, सड़क, क्षेत्र",
                city: "शहर का नाम",
                state: "राज्य का नाम",
                pinCode: "123456"
            },
            btns: {
                sendOtp: "ओटीपी भेजें",
                resend: "पुनः भेजें",
                verify: "सत्यापित करें",
                verified: "सत्यापित",
                next: "अगला चरण",
                back: "पीछे",
                save: "सहेजें और जारी रखें"
            },
            questions: [
                "एक प्रश्न चुनें",
                "आपके पहले पालतू जानवर का नाम क्या था?",
                "आपका जन्म किस शहर में हुआ था?",
                "स्कूल में आपका पसंदीदा विषय क्या था?",
                "आपकी माता का पहला नाम क्या है?"
            ],
            genders: { male: "पुरुष", female: "महिला", other: "अन्य", none: "बताना नहीं चाहते" },
            errors: {
                fullName: "पूरा नाम आवश्यक है",
                username: "उपयोगकर्ता नाम आवश्यक है",
                email: "ईमेल आवश्यक है",
                mobile: "मोबाइल नंबर आवश्यक है",
                otp: "कृपया अपना मोबाइल नंबर सत्यापित करें",
                invalidOtp: "अमान्य ओटीपी",
                specialization: "विशेषज्ञता आवश्यक है",
                registrationNumber: "पंजीकरण संख्या आवश्यक है",
                licenseNumber: "लाइसेंस संख्या आवश्यक है",
                securityQuestion: "कृपया एक सुरक्षा प्रश्न चुनें",
                securityAnswer: "सुरक्षा उत्तर आवश्यक है",
                dob: "जन्म तिथि आवश्यक है",
                gender: "कृपया अपना लिंग चुनें",
                address: "पता आवश्यक है",
                city: "शहर आवश्यक है",
                state: "राज्य आवश्यक है",
                pinCode: "पिन कोड आवश्यक है",
                mobileFirst: "पहले मोबाइल नंबर दर्ज करें"
            }
        },
        doctorDashboard: {
            sidebar: {
                dashboard: "डैशबोर्ड",
                appointments: "अपॉइंटमेंट",
                patients: "मरीज",
                prescriptions: "प्रिस्क्रिप्शन",
                reports: "रिपोर्ट",
                settings: "सेटिंग्स",
                logout: "लॉगआउट"
            },
            header: {
                welcome: "स्वागत है डॉ.",
                subtitle: "आज आपके मरीजों के साथ क्या हो रहा है, यहाँ देखें।"
            },
            stats: {
                today: "आज के अपॉइंटमेंट",
                total: "कुल मरीज",
                pending: "लंबित प्रिस्क्रिप्शन",
                labs: "लैब रिपोर्ट"
            },
            features: {
                appointments: { title: "मेरे अपॉइंटमेंट", desc: "आगामी और पिछले अपॉइंटमेंट देखें" },
                records: { title: "मरीज के रिकॉर्ड", desc: "मरीज के चिकित्सा इतिहास तक पहुंचें" },
                write: { title: "प्रिस्क्रिप्शन लिखें", desc: "डिजिटल प्रिस्क्रिप्शन बनाएं और भेजें" },
                consultation: { title: "परामर्श", desc: "ऑनलाइन परामर्श शुरू करें" },
                reports: { title: "रिपोर्ट", desc: "अपलोड किए गए परीक्षण परिणाम देखें" },
                messages: { title: "संदेश", desc: "मरीजों और सहकर्मियों के साथ चैट करें" }
            },
            btns: {
                explore: "देखें"
            },
            bottomNav: {
                home: "होम",
                appts: "अपॉइंटमेंट",
                patients: "मरीज",
                presc: "प्रिस्क्रिप्शन",
                profile: "प्रोफ़ाइल"
            },
            appointmentsPage: {
                title: "मेरे अपॉइंटमेंट",
                subtitle: "रोगी के अपॉइंटमेंट अनुरोधों को प्रबंधित करें और उनका उत्तर दें",
                pending: "लंबित",
                searchPlaceholder: "मरीज के नाम या आईडी से खोजें...",
                allStatus: "सभी स्थिति",
                allModes: "सभी मोड",
                noAppts: "कोई अपॉइंटमेंट नहीं मिला",
                adjustFilters: "अपने फ़िल्टर या खोज शब्दों को समायोजित करने का प्रयास करें",
                approve: "स्वीकार करें",
                reject: "अस्वीकार करें",
                toastReceived: "नया अपॉइंटमेंट अनुरोध प्राप्त हुआ!",
                toastApproved: "अपॉइंटमेंट स्वीकृत",
                toastRejected: "अपॉइंटमेंट अस्वीकृत",
                toastSuccess: "अनुरोध सफलतापूर्वक अपडेट कर दिया गया है।",
                date: "तिथि",
                time: "समय",
                mode: "मोड",
                id: "आईडी",
                symptoms: "लक्षण"
            }
        },
        supplierDashboard: {
            sidebar: {
                overview: "डैशबोर्ड ओवरव्यू",
                medicines: "दवाएं प्रबंधित करें",
                equipment: "चिकित्सा उपकरण प्रबंधित करें",
                blood: "ब्लड स्टॉक प्रबंधित करें",
                orders: "प्राप्त आदेश",
                pending: "लंबित वितरण",
                inventory: "इन्वेंट्री की स्थिति",
                addProduct: "नया उत्पाद जोड़ें",
                payments: "भुगतान और लेनदेन",
                notifications: "सूचनाएं",
                settings: "प्रोफ़ाइल सेटिंग्स",
                logout: "लॉगआउट"
            },
            header: {
                welcome: "वापसी पर स्वागत है,",
                subtitle: "आज आपकी इन्वेंट्री के साथ क्या हो रहा है, यहाँ देखें।"
            },
            stats: {
                totalProducts: "कुल उत्पाद",
                activeOrders: "सक्रिय आदेश",
                pendingDeliveries: "लंबित वितरण",
                outOfStock: "स्टॉक से बाहर आइटम",
                revenue: "कुल राजस्व",
                lowStockAlerts: "कम स्टॉक अलर्ट"
            },
            btns: {
                addMedicine: "दवा जोड़ें",
                bulkUpload: "थोक अपलोड",
                updateStock: "स्टॉक अपडेट करें",
                accept: "स्वीकार करें",
                reject: "अस्वीकार करें",
                updateStatus: "स्थिति अपडेट करें",
                downloadInvoice: "चालान डाउनलोड करें",
                explore: "अभी देखें"
            }
        },
        driverDashboard: {
            sidebar: {
                overview: "डैशबोर्ड ओवरव्यू",
                emergencyRequests: "नए आपातकालीन अनुरोध",
                bloodRequests: "तत्काल रक्त अनुरोध",
                deliveryOrders: "नए वितरण आदेश",
                activeRide: "सक्रिय सवारी",
                activeDeliveries: "सक्रिय वितरण",
                activeTransport: "सक्रिय परिवहन",
                rideHistory: "सवारी इतिहास",
                deliveryHistory: "वितरण इतिहास",
                transportHistory: "परिवहन इतिहास",
                earnings: "कमाई",
                vehicleStatus: "वाहन की स्थिति",
                contacts: "आपातकालीन संपर्क",
                notifications: "सूचनाएं",
                settings: "प्रोफ़ाइल और सेटिंग्स",
                logout: "लॉगआउट"
            },
            header: {
                welcome: "वापसी पर स्वागत है,",
                onDuty: "ड्यूटी पर",
                pendingAmbulance: "आपातकालीन प्रेषण",
                pendingMedicine: "दवा आदेश",
                pendingBlood: "तत्काल रक्त इकाइयां",
                queue: "आपकी कतार में लंबित हैं।"
            },
            stats: {
                rides: "आज की सवारी",
                emergency: "सक्रिय आपातकाल",
                pending: "लंबित अनुरोध",
                earnings: "आज की कमाई",
                rating: "रेटिंग",
                deliveries: "आज की डिलीवरी",
                activeDeliveries: "सक्रिय डिलीवरी",
                pendingOrders: "लंबित आदेश",
                onTime: "समय पर डिलीवरी दर",
                urgent: "तत्काल अनुरोध",
                activeTransports: "सक्रिय परिवहन",
                completed: "आज पूरे हुए",
                alerts: "आपातकालीन अलर्ट",
                temp: "तापमान की चेतावनी"
            }
        },
        patientRecords: {
            title: "मरीज के रिकॉर्ड",
            subtitle: "रोगी की चिकित्सा जानकारी देखें और प्रबंधित करें",
            totalPatients: "कुल {count} मरीज",
            searchPlaceholder: "नाम, आईडी या फोन से खोजें...",
            backToDashboard: "डैशबोर्ड पर वापस जाएं",
            filters: {
                gender: {
                    all: "सभी लिंग",
                    male: "पुरुष",
                    female: "महिला"
                },
                age: {
                    all: "सभी आयु वर्ग",
                    range1: "0-18 वर्ष",
                    range2: "19-40 वर्ष",
                    range3: "41-60 वर्ष",
                    range4: "60+ वर्ष"
                },
                sort: {
                    recent: "छाँटें: हाल की यात्रा",
                    alphabetical: "छाँटें: वर्णमाला"
                }
            },
            card: {
                id: "आईडी",
                bg: "रक्त समूह",
                ageGenderLabel: "आयु और लिंग",
                lastVisitLabel: "अंतिम यात्रा",
                years: "वर्ष",
                viewHistoryBtn: "चिकित्सा इतिहास देखें"
            },
            noResults: {
                title: "कोई मरीज नहीं मिला",
                desc: "अपने खोज मानदंड या फ़िल्टर समायोजित करने का प्रयास करें।"
            }
        },
        patientMedicalHistory: {
            backDirectly: "सीधे वापस",
            confidentialBadge: "गोपनीय रोगी डेटा",
            notFound: "मरीज नहीं मिला",
            backToRecordsBtn: "मरीज के रिकॉर्ड पर वापस जाएं",
            profile: {
                id: "आईडी",
                years: "वर्ष",
                contactLabel: "संपर्क नंबर",
                emergencyLabel: "आपातकालीन संपर्क",
                heightLabel: "ऊंचाई",
                weightLabel: "वजन",
                bmiLabel: "बीएमआई (BMI)"
            },
            overview: {
                sectionTitle: "स्थितियां और एलर्जी",
                chronicTitle: "पुरानी बीमारियाँ",
                noChronic: "कोई पुरानी बीमारी नहीं बताई गई।",
                allergiesTitle: "एलर्जी",
                noAllergies: "कोई ज्ञात एलर्जी नहीं।"
            },
            medications: {
                sectionTitle: "चल रही दवाएं",
                noMeds: "कोई चल रही दवा नहीं।"
            },
            appointments: {
                sectionTitle: "पिछले अपॉइंटमेंट",
                colDate: "तिथि",
                colDoctor: "डॉक्टर",
                colDiagnosis: "निदान",
                colNotes: "नोट्स",
                colAction: "कार्रवाई",
                viewDetailsBtn: "विवरण देखें"
            },
            prescriptions: {
                sectionTitle: "प्रिस्क्रिप्शन इतिहास",
                dateLabel: "तिथि",
                idLabel: "आईडी",
                followUpLabel: "फॉलो अप",
                freqLabel: "आवृत्ति",
                durLabel: "अवधि"
            }
        },
        gratitudePopup: {
            title: "Askleya को चुनने के लिए धन्यवाद! ✨",
            subtitle: "आपका स्वास्थ्य और कल्याण हमारी सर्वोच्च प्राथमिकता है।",
            message: "चिकित्सा पारिस्थितिकी तंत्र का हिस्सा बनने के लिए हम सम्मानित महसूस कर रहे हैं। साथ मिलकर, हम एक स्मार्ट और स्वस्थ भविष्य बना रहे हैं।",
            continueBtn: "डैशबोर्ड पर जारी रखें"
        },
        feedbackPopup: {
            title: "हमें सुधारने में मदद करें 💬",
            subtitle: "आपकी प्रतिक्रिया हमें बेहतर देखभाल प्रदान करने में मदद करती है।",
            ratingLabel: "आप अपने अनुभव को कैसे रेट करेंगे?",
            commentLabel: "हमारे लिए कोई सुझाव?",
            placeholder: "अपने विचार यहाँ साझा करें...",
            submitBtn: "प्रतिक्रिया भेजें",
            cancelBtn: "बाद में",
            success: "आपकी प्रतिक्रिया के लिए धन्यवाद!"
        },
        consultationSelection: {
            title: "परामर्श प्रकार चुनें",
            subtitle: "विशेषज्ञ के साथ जुड़ने का अपना पसंदीदा तरीका चुनें",
            audio: {
                title: "ऑडियो परामर्श",
                desc: "तत्काल चिकित्सा मार्गदर्शन के लिए उच्च गुणवत्ता वाली वॉयस कॉल।",
                fee: "₹1,000",
                btn: "ऑडियो चुनें"
            },
            video: {
                title: "वीडियो परामर्श",
                desc: "अधिक गहन जांच के लिए आमने-सामने वीडियो सत्र।",
                fee: "₹1,500",
                btn: "वीडियो चुनें"
            },
            back: "प्रोफ़ाइल पर वापस जाएं"
        }
    }
};
