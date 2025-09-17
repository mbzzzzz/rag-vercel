export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
    const USE_MOCK = process.env.USE_MOCK === '1';
    const { question = '', context = '' } = req.body || {};

    if (USE_MOCK) {
      return res.status(200).json({
        answer: `Mock answer.\n\nContext (${Math.min(context.length, 160)} chars): ${context.slice(0,160)}...`
      });
    }

    if (!GEMINI_KEY) return res.status(400).json({ error: 'Missing GEMINI_API_KEY' });

    const prompt = [
      'Answer using ONLY the context below.',
      'If the context is insufficient, say you do not have enough information.',
      '',
      'Context:',
      context,
      '',
      `Question: ${question}`
    ].join('\n');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
    const body = { contents: [{ parts: [{ text: prompt }]}] };

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: 'Gemini chat error', detail: data });

    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer.';
    return res.status(200).json({ answer });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}
