# RAG (Minimal) on Vercel

A minimal Retrieval-Augmented Generation UI + API (Gemini) deployed on Vercel.

## Features
- Drag & drop **PDF/TXT/MD** → client-side text extraction (pdf.js for PDFs)
- Local **chunking** with adjustable size/overlap
- **/api/embed** → batches chunks to Gemini `text-embedding-004`
- **/api/chat** → RAG completion using `gemini-1.5-flash`
- Same-origin by default (UI and API on one domain)

## Project structure
public/index.html # UI
api/embed.js # POST /api/embed
api/chat.js # POST /api/chat
vercel.json
package.json

markdown
Copy code

## Env vars (Vercel)
Set in **Vercel → Project → Settings → Environment Variables**:
- `GEMINI_API_KEY = <your key>`
- (optional) `USE_MOCK = 1` to mock vectors/answers

Redeploy after changing env vars.

## Local dev
- Install Vercel CLI: `npm i -g vercel`
- Run: `vercel dev`
- Open: `http://localhost:3000`
- UI defaults Backend to same origin. If you run the API elsewhere, fill the Backend field in the UI.

## Usage
1. Open the app.
2. Drop PDF/TXT/MD files.
3. Ask a question. The app selects Top-K chunks and calls `/api/chat`.

## Notes
- Keep API keys on the server; avoid using the browser key field in production.
- You can tune `chunkSize`, `overlap`, and `Top-K` in the UI.
