export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
    const USE_MOCK = process.env.USE_MOCK === '1';
    const { chunks = [] } = req.body || {};

    if (!Array.isArray(chunks) || chunks.length === 0) {
      return res.status(400).json({ error: 'No chunks' });
    }

    if (USE_MOCK) {
      const dim = 768;
      const vectors = chunks.map((_, i) => {
        const v = Array(dim).fill(0);
        for (let k = 0; k < dim; k++) v[k] = Math.sin((i + 1) * (k + 7)) * 0.5 + 0.5;
        return v;
      });
      return res.status(200).json({ vectors });
    }

    if (!GEMINI_KEY) return res.status(400).json({ error: 'Missing GEMINI_API_KEY' });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:batchEmbedContents?key=${GEMINI_KEY}`;
    const body = {
      requests: chunks.map(text => ({
        model: 'text-embedding-004',
        content: { parts: [{ text }] }
      }))
    };

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: 'Gemini embedding error', detail: data });

    // { embeddings: [{ values: [...] }, ...] }
    const vectors = (data.embeddings || []).map(e => e.values);
    return res.status(200).json({ vectors });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}
