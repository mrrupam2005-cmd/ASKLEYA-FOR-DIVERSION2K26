/**
 * Medical Ethics and Privacy Framework
 * Ensures compliance with medical standards and data privacy.
 */

export interface EthicsCompliance {
    isSafe: boolean;
    requiresExpert: boolean;
    privacyWarning?: string;
    disclaimer: string;
}

export class EthicsPrivacyManager {
    private static standardDisclaimer = "Important: I am an AI, not a doctor. This information is for educational purposes and should be verified by a medical professional.";

    static checkQuery(query: string): EthicsCompliance {
        const lowerQuery = query.toLowerCase();

        // Expert detection
        const expertKeywords = ['surgery', 'dose', 'biopsy', 'staging', 'critical', 'suicide', 'self-harm'];
        const needsExpert = expertKeywords.some(k => lowerQuery.includes(k));

        // Privacy detection (PII)
        const privacyKeywords = ['my name is', 'ssn', 'insurance id', 'address is', 'my phone'];
        const privacyRisk = privacyKeywords.some(k => lowerQuery.includes(k));

        return {
            isSafe: !lowerQuery.includes('suicide') && !lowerQuery.includes('kill'),
            requiresExpert: needsExpert,
            privacyWarning: privacyRisk ? "Please do not share personally identifiable information (PII) with this chatbot for your safety." : undefined,
            disclaimer: this.standardDisclaimer
        };
    }

    static getExpertRequirementMessage(lang: 'en' | 'hi' | 'hg'): string {
        if (lang === 'hi') {
            return "यह मामला जटिल है और इसके लिए मानव विशेषज्ञ या नैदानिक परीक्षण की आवश्यकता है। कृपया तुरंत एक पेशेवर डॉक्टर से परामर्श लें।";
        } else if (lang === 'hg') {
            return "Yeh case thoda complicated hai aur iske liye human expert ki zarurat hai. Please turant ek professional doctor se milein.";
        }
        return "This case is complex and requires a human expert or clinical trial verification. Please consult a professional doctor immediately.";
    }
}
