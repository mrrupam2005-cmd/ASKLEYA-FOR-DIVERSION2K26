import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface TavilyResult {
    title: string;
    url: string;
    content?: string;
}

interface TavilyResponse {
    results?: TavilyResult[];
    answer?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const query = typeof body?.query === 'string' ? body.query.trim() : '';

        if (!query) {
            return NextResponse.json(
                { error: 'Missing or invalid query' },
                { status: 400 }
            );
        }

        const tavilyKey = process.env.TAVILY_KEY;
        const geminiKey = process.env.GEMINI_KEY;

        if (!geminiKey) {
            return NextResponse.json(
                { error: 'GEMINI_KEY is not configured' },
                { status: 500 }
            );
        }

        let sources: { title: string; url: string }[] = [];
        let tavilyUnavailable = false;
        let tavilyContext = '';

        // 1. Call Tavily API (with fallback)
        if (tavilyKey) {
            try {
                const tavilyRes = await fetch('https://api.tavily.com/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tavilyKey}`,
                    },
                    body: JSON.stringify({
                        query: query,
                        search_depth: 'basic',
                        max_results: 8,
                        topic: 'general',
                    }),
                });

                if (tavilyRes.ok) {
                    const data: TavilyResponse = await tavilyRes.json();
                    if (data.results && data.results.length > 0) {
                        sources = data.results.map((r) => ({
                            title: r.title || r.url,
                            url: r.url,
                        }));
                        tavilyContext = data.results
                            .map(
                                (r) =>
                                    `[${r.title}](${r.url}): ${r.content || ''}`
                            )
                            .join('\n\n');
                    }
                } else {
                    tavilyUnavailable = true;
                }
            } catch {
                tavilyUnavailable = true;
            }
        } else {
            tavilyUnavailable = true;
        }

        // 2. Call Gemini API
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-pro',
            systemInstruction:
                'You are a helpful AI medical assistant. Provide clear, evidence-based guidance in plain text only. Do not use any Markdown formatting (no bold, no italics, no headings, no bullet points, no special symbols like *, #, _, -). Always remind users to consult a licensed healthcare professional for diagnoses or treatment. Never replace professional medical advice.',
        });

        const promptParts: string[] = [];

        if (tavilyContext) {
            promptParts.push(
                `Search context (use for evidence-based guidance):\n${tavilyContext}\n\n\n\n`
            );
        }

        promptParts.push(
            `User query:\n${query}\n\n\n\nRespond in a helpful, professional tone using plain text only. Do not use any Markdown formatting (no bold, no italics, no headings, no bullet points, no special symbols like *, #, _, -). If search context was provided, incorporate relevant findings and cite sources where appropriate. Keep the response concise but informative. Include a brief disclaimer that you are an AI and cannot replace a real doctor.`
        );

        const result = await model.generateContent(promptParts.join(''));
        const answer =
            result.response.text() ||
            "I couldn't generate a response. Please try again.";

        return NextResponse.json({
            answer,
            sources,
            tavilyUnavailable,
        });
    } catch (err) {
        console.error('Doctor API error:', err);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: err instanceof Error ? err.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
