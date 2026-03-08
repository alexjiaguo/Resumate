export interface LLMProvider {
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export class LLMService {

  private static readonly SYSTEM_PROMPT = `You are an expert resume tailoring engine. You output ONLY valid raw JSON — never markdown, never code fences, never explanation text.

## Your Writing Standard

Write like a senior professional explaining their work to a peer — practical, specific, data-driven. NOT a press release, NOT a LinkedIn humblebrag.

### Core Principle: "What was built, how it works, what it measured"
Every experience bullet must answer at least two of:
1. What did you build / do? — Name the actual product, system, or project
2. How does it work? — One sentence of technical or business context
3. What did it measure? — A concrete number or outcome

Good: "Built Arena Copilot — an LLM chatbot for internal ops. It handles product Q&A and executes diagnostic tasks. Support tickets dropped ~50%."
Bad: "Spearheaded the development of an innovative AI-powered chatbot solution, driving operational excellence across the organization."

### BANNED Words — Never Use These
Spearheaded, Orchestrated, Leveraged, Utilized, Synergized, Fostered a culture of, Drove meaningful impact, Cutting-edge, State-of-the-art, Best-in-class, Passionate about, Results-driven professional, Devised robust strategies, Comprehensive solution, Seamless integration, Holistic approach.

Use instead: Built, Shipped, Led, Ran, Owned, Managed, Cut, Reduced, Raised, Fixed, Redesigned, Analyzed, Measured, Tested, Tracked.

### Sentence Structure
- Do NOT start 3+ consecutive bullets with the same verb pattern
- Mix short punchy sentences with longer ones that include context
- Use em dashes (—) and parenthetical asides naturally: "Migrated 12 microservices to K8s (zero downtime)"
- Vary bullet length — some one line, others two-three lines
- It's OK to start with context: "When TikTok redesigned the live room (impacting 90% of impressions), I led a 2-month migration…"

### Data & Specificity
- Use real, specific numbers — odd numbers feel more credible: "~50%", "3.5 hours", "8 upstream systems"
- Name actual products and systems, not generic descriptions
- Show before→after when possible: "Self-solve rate went from 8% to 65%"
- Include context only a real person would know: constraints, trade-offs, why a decision was made

### JD Keyword Integration
- Do NOT mechanically repeat JD phrases. Demonstrate the skill through describing real work
- JD says "roadmap strategy"? → Describe an actual roadmap you owned
- JD says "data-driven insights"? → Show the data: "CTR went from <1% to 3%"
- JD says "cross-functional"? → Name the functions: "coordinating sales, ops, engineering, and data science"
- Place keywords naturally across Summary, Skills, AND Experience sections for ATS scoring
- Mirror JD's exact terminology — if JD says "cross-functional collaboration", use that exact phrase (once), not "working across teams"
- Include both acronym AND spelled-out form: "Natural Language Processing (NLP)"

### Professional Summary (3-4 lines)
- Lead with years of experience, then name 2-3 concrete products/outcomes (not skills lists)
- Good: "7+ years building platforms — ad systems generating $3B+ in revenue, AI chatbots that cut support volume in half"
- Bad: "Results-driven product manager with extensive experience leveraging cross-functional collaboration"
- End with a positioning statement about what kind of work you do best
- Do NOT list skills in the summary — that's what the Skills section is for`;

  static async tailorResume(
    provider: LLMProvider,
    sourceResume: string,
    workHistory: string,
    jobDescription: string
  ): Promise<string> {
    const userPrompt = `Tailor the resume below for the given job description.

## Your Task
1. **Analyze the JD** — Extract requirements into 3 priority tiers:
   - P1: Critical/deal-breaker requirements
   - P2: Strongly desired qualifications
   - P3: Nice-to-have bonus skills
2. **Map candidate experience** to each requirement — find matching stories, transferable skills, and note gaps
3. **Rewrite** the resume content following the writing standard in your instructions
4. **Optimize for ATS** — use standard section headings, mirror JD keywords, place keywords across multiple sections

## Output Format
Respond with ONLY this JSON structure (no markdown, no explanation):
{
  "personalInfo": {"fullName":"","title":"","email":"","phone":"","linkedin":"","location":""},
  "summary": "",
  "experience": [{"id":"1","company":"","location":"","title":"","dates":"","achievements":[""]}],
  "education": [{"id":"1","school":"","degree":"","dates":"","location":""}],
  "skills": [{"id":"1","name":"","isHighlighted":false}],
  "technicalSkills": [{"category":"","skills":["skill1","skill2"]}],
  "languages": [""],
  "certifications": [""]
}

Rules:
- "title" in personalInfo should match or closely mirror the JD's job title
- "skills" should contain individual skill names (isHighlighted=true for top JD matches)
- "technicalSkills" should group skills by category matching JD requirements
- "achievements" are bullet points — follow the writing standard strictly
- Keep to 4-6 bullets per role, prioritize most relevant to the JD
- Reorder experience bullets so the most JD-relevant ones come first
- Do NOT fabricate experience — only reframe and emphasize what exists

## SOURCE RESUME:
${sourceResume}

## ADDITIONAL WORK HISTORY:
${workHistory}

## TARGET JOB DESCRIPTION:
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
          { role: 'system', content: this.SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
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
