# Berbin Rejo J — Portfolio

A responsive personal portfolio built with HTML, CSS and JavaScript.

## Features

- Responsive modern portfolio design
- Professional profile photo
- About, skills, projects, certifications and contact sections
- GitHub and LinkedIn links
- Interactive "Berbin AI" portfolio assistant
- Chatbot knowledge stored in JSON files
- No backend required for the current version
- Ready for GitHub and Vercel static deployment

## Project structure

```text
berbin-portfolio/
├── assets/
│   └── profile.png
├── data/
│   ├── intents.json
│   └── portfolio.json
├── index.html
├── script.js
├── style.css
├── .gitignore
└── README.md
```

## Run locally

Use VS Code + Live Server, or any static web server.

Do not open `index.html` directly with `file://` because the chatbot loads JSON with `fetch()`.

## Deploy to Vercel

1. Create a GitHub repository.
2. Upload all files while preserving the folder structure.
3. Import the repository into Vercel.
4. Framework preset: **Other** / static site.
5. Build command: leave empty.
6. Output directory: leave empty / root.
7. Deploy.

## Update your information

Edit:

`data/portfolio.json`

Edit chatbot questions/patterns:

`data/intents.json`

Replace `assets/profile.png` if you want to use another profile photo.

## Important

The chatbot is currently a lightweight JavaScript intent/keyword assistant. It is not an LLM yet. It is intentionally structured so that NLP, embeddings and RAG can be added later.
