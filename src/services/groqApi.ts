
interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface PageContent {
  title: string;
  url: string;
  headings: Array<{ level: string; text: string; id?: string }>;
  paragraphs: string[];
  links: Array<{ text: string; href: string; title?: string }>;
  timestamp: string;
}

interface AIResponse {
  answer: string;
  confidence: number;
  sources: string[];
  action?: 'highlight' | 'navigate';
  target?: string;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const queryGroqAI = async (userQuery: string, pageContent: PageContent, apiKey: string): Promise<AIResponse> => {
  try {
    // Safely prepare content for the AI with proper escaping
    const contentSummary = [
      `Page Title: ${pageContent.title}`,
      `URL: ${pageContent.url}`,
      '',
      'Headings:',
      ...pageContent.headings.map(h => `${h.level}: ${h.text}`),
      '',
      'Content:',
      ...pageContent.paragraphs.slice(0, 5),
      '',
      'Links:',
      ...pageContent.links.slice(0, 10).map(l => `- ${l.text}: ${l.href}`)
    ].join('\n');

    const systemPrompt = `You are Suzzy, a smart web assistant. Your job is to help users navigate and understand web pages.

Given the page content below, analyze the user's query and respond with a JSON object containing:
- "answer": A helpful response to the user's question
- "confidence": A number between 0 and 1 indicating your confidence
- "sources": Array of relevant text snippets from the page that support your answer
- "action": Either "highlight", "navigate", or null
- "target": If action is "highlight", provide text to highlight. If "navigate", provide the link href or element to navigate to.

For navigation requests (like "take me to", "go to", "find"), try to identify relevant links or sections.
For questions, provide informative answers based on the page content.

Respond ONLY with valid JSON, no other text.`;

    const userMessage = `Page Content:\n${contentSummary}\n\nUser Query: ${userQuery}`;

    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userMessage
      }
    ];

    console.log('Sending request to Groq API with messages:', messages);

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    console.log('Groq API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error response:', errorText);
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data: GroqResponse = await response.json();
    console.log('Groq API response data:', data);
    
    const aiContent = data.choices[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No response from AI');
    }

    console.log('AI raw response:', aiContent);

    // Parse the JSON response
    let parsedResponse: AIResponse;
    try {
      parsedResponse = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', aiContent);
      // Fallback response if JSON parsing fails
      return {
        answer: "I received a response but couldn't parse it properly. Please try rephrasing your question.",
        confidence: 0.3,
        sources: [],
      };
    }
    
    // Validate and sanitize the response structure
    return {
      answer: parsedResponse.answer || "I couldn't process your request properly.",
      confidence: Math.min(Math.max(parsedResponse.confidence || 0.5, 0), 1),
      sources: Array.isArray(parsedResponse.sources) ? parsedResponse.sources : [],
      action: parsedResponse.action || undefined,
      target: parsedResponse.target || undefined,
    };

  } catch (error) {
    console.error('Error querying Groq AI:', error);
    
    // Fallback response
    return {
      answer: "I'm having trouble processing your request right now. Please check your API key and try again.",
      confidence: 0.1,
      sources: [],
    };
  }
};
