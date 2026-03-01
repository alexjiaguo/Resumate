export interface LLMProvider {
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export class LLMService {
  static async tailorResume(
    provider: LLMProvider,
    sourceResume: string,
    workHistory: string,
    jobDescription: string
  ): Promise<string> {
    const prompt = `You are a professional resume writer. Tailor the following resume and work history to match the provided job description.
Respond with ONLY raw JSON — no markdown, no code fences, no explanation.
The JSON must match this exact structure:
{"personalInfo":{"fullName":"","title":"","email":"","phone":"","linkedin":"","location":""},"summary":"","experience":[{"id":"1","company":"","location":"","title":"","dates":"","achievements":[""]}],"education":[{"id":"1","school":"","degree":"","dates":"","location":""}],"skills":[{"id":"1","name":"","isHighlighted":false}],"languages":[""],"certifications":[""]}

SOURCE RESUME:
${sourceResume}

WORK HISTORY:
${workHistory}

JOB DESCRIPTION:
${jobDescription}`;

    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: 'system', content: 'You output only valid raw JSON. Never use markdown code fences.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        ...(provider.name === 'openai' ? { response_format: { type: 'json_object' } } : {})
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'LLM Call Failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    // Strip markdown code fences if the LLM wrapped the JSON
    return content.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
  }
}
