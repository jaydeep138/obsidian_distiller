# Obsidian Knowledge Distiller

An AI-powered web application designed to bridge the gap between your raw learning consumption and your "Second Brain" in Obsidian. 

Paste articles, transcripts, or messy notes, and this app will extract the core mental models, format them into clean Markdown, and save them directly to your local Obsidian vault.

## Features

- **AI Extraction**: Uses Google Gemini to distill key insights and remove fluff.
- **Structured Output**: Generates Zettelkasten-style notes with YAML frontmatter, tags, and summaries.
- **Review & Refine**: 
    - **Reading Mode**: Preview the note as it will look in Obsidian.
    - **Editor Mode**: Manually edit the markdown before saving.
    - **AI Refinement**: Ask the AI to tweak specific parts (e.g., "Make it shorter", "Fix the title").
- **One-Click Save**: Uses the Obsidian URI scheme to create the file in your local vault immediately.
- **Secure & Client-Side**: Runs entirely in the browser. Your API key is stored in LocalStorage.

## Getting Started

### Prerequisites

1.  **Obsidian**: You must have [Obsidian](https://obsidian.md/) installed.
2.  **Gemini API Key**: You need a free API key from Google.

### Installation (Local)

1.  Clone this repository:
    ```bash
    git clone https://github.com/yourusername/obsidian-knowledge-distiller.git
    cd obsidian-knowledge-distiller
    ```

2.  Install dependencies (if running a build process, though this project is currently designed to run via simple ESM serving):
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm start
    ```

### Configuration

1.  Open the app in your browser (usually `http://localhost:3000` or similar).
2.  Go to the **Settings** tab.
3.  **API Key**: Paste your Google Gemini API Key (Get one at [aistudio.google.com](https://aistudio.google.com/app/apikey)).
4.  **Vault Name**: Enter the *exact* name of your Obsidian vault (case-sensitive).

## Usage Guide

1.  **Input**: Paste your text (article, transcript, thoughts) into the left panel.
2.  **Distill**: Click "Distill Insights".
3.  **Review**: 
    - Switch between the **Eye Icon** (Preview) and **Code Icon** (Edit) to check the content.
    - Type instructions in the "Refine" box to ask the AI for changes.
4.  **Save**: Click "Approve & Save". Browser will prompt to open Obsidian.

## Privacy

- **No Backend**: This is a client-side application.
- **API Keys**: Your API key is stored in your browser's `localStorage`. It is sent directly to Google's servers to generate text and nowhere else.

## Contributing

Pull requests are welcome! Please look at existing issues or create a new one for feature requests.
