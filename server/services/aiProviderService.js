/**
 * AI Provider Service Abstraction
 * Supports Google Gemini, OpenAI, or compatible endpoints via environment variables.
 * If AI_API_KEY is not configured or an error occurs, returns null so the system falls back
 * seamlessly to the deterministic local NLP engine.
 */
export async function callAICompletion({ systemPrompt = '', userPrompt = '', temperature = 0.2, jsonMode = true }) {
  const apiKey = process.env.AI_API_KEY;
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  const model = process.env.AI_MODEL || (provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini');

  if (!apiKey || apiKey.trim() === '') {
    // Demo / Offline Mode active
    return null;
  }

  try {
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\n${userPrompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature,
          responseMimeType: jsonMode ? 'application/json' : 'text/plain'
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[AI Service] Gemini API returned ${response.status}: ${errText}`);
        return null;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return null;

      if (jsonMode) {
        return JSON.parse(rawText);
      }
      return rawText;
    }

    if (provider === 'openai') {
      const url = 'https://api.openai.com/v1/chat/completions';
      const payload = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature,
        response_format: jsonMode ? { type: 'json_object' } : undefined
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[AI Service] OpenAI API returned ${response.status}: ${errText}`);
        return null;
      }

      const data = await response.json();
      const rawText = data?.choices?.[0]?.message?.content;
      if (!rawText) return null;

      if (jsonMode) {
        return JSON.parse(rawText);
      }
      return rawText;
    }

    return null;
  } catch (err) {
    console.warn(`[AI Service] Error calling ${provider}:`, err.message);
    return null;
  }
}
