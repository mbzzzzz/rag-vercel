# RAG (Minimal) on Vercel

A minimal Retrieval-Augmented Generation UI + API (Gemini) deployed on Vercel.

## Features
- Drag & drop **PDF/TXT/MD** → client-side text extraction (pdf.js for PDFs)
- Local **chunking** with adjustable size/overlap
- **/api/embed** → batches chunks to Gemini `text-embedding-004`
- **/api/chat** → RAG completion using `gemini-1.5-flash`
- Same-origin by default (UI and API on one domain)

## Project structure
