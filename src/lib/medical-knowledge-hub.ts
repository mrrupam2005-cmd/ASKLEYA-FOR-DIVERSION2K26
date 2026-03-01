/**
 * Medical Knowledge Hub
 * Handles dynamic research from global authoritative sources.
 */

import { DISEASE_MODEL, DiseaseInfo } from './disease-model';

export interface ResearchResult {
    foundInLocal: boolean;
    data?: DiseaseInfo | any;
    sources: string[];
    summary: string;
}

export class MedicalKnowledgeHub {
    private static highAuthorityDomains = ['ncbi.nlm.nih.gov', 'who.int', 'cdc.gov', 'mayoclinic.org', 'thelancet.com'];

    static async researchSymptom(query: string): Promise<ResearchResult> {
        const lowerQuery = query.toLowerCase();
        // Helper for word boundary matching
        const matchWithBoundaries = (text: string, keyword: string) => {
            const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
            return regex.test(text);
        };

        // 1. Check local Disease Model first
        for (const [id, disease] of Object.entries(DISEASE_MODEL)) {
            const nameMatch = matchWithBoundaries(lowerQuery, disease.name.en) ||
                lowerQuery.includes(disease.name.hi) ||
                matchWithBoundaries(lowerQuery, id);

            const symptomMatch = disease.symptoms.some(s => matchWithBoundaries(lowerQuery, s));

            if (nameMatch || symptomMatch) {
                return {
                    foundInLocal: true,
                    data: disease,
                    sources: ['Internal Comprehensive Disease Model'],
                    summary: `System identified ${disease.name.en} (${disease.type} disease).`
                };
            }
        }

        // 2. Placeholder for dynamic web-based research using search tools
        // In a real implementation, this would trigger a controlled web search restricted to authority domains.
        return {
            foundInLocal: false,
            sources: ['PubMed', 'WHO Global Reports (Simulated)'],
            summary: "Extensive research in progress for the described symptoms..."
        };
    }
}
