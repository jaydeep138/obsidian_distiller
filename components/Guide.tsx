import React from 'react';

export const Guide: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-8 overflow-y-auto h-full text-gray-300">
      <h1 className="text-3xl font-bold text-white mb-6">How to use Obsidian Knowledge Distiller</h1>
      
      <div className="space-y-8">
        <section className="bg-obsidian-800 p-6 rounded-xl border border-obsidian-700">
          <h2 className="text-xl font-semibold text-purple-400 mb-4">1. Prerequisites & Setup</h2>
          <ul className="list-disc pl-5 space-y-3">
            <li>
              <strong>Obsidian:</strong> You must have <a href="https://obsidian.md/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Obsidian</a> installed.
            </li>
            <li>
              <strong>Vault Name:</strong> Configure your Vault Name in the <strong>Settings</strong> tab (default is "My Vault").
            </li>
            <li>
              <strong>API Key (Important):</strong> To use the AI features, you need a Google Gemini API Key.
              <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-gray-400">
                <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-400 hover:underline">Google AI Studio</a>.</li>
                <li>Click "Create API Key" (It's free for standard use).</li>
                <li>Copy the key and paste it into the <strong>Settings</strong> tab of this app.</li>
                <li>Your key is stored locally in your browser and is never shared.</li>
              </ol>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">2. The Workflow</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-obsidian-800 p-4 rounded-lg">
              <div className="text-4xl mb-2">📥</div>
              <h3 className="font-bold text-white">Input</h3>
              <p className="text-sm text-gray-400 mt-2">Paste articles, messy thoughts, or learning material into the left panel.</p>
            </div>
            <div className="bg-obsidian-800 p-4 rounded-lg">
              <div className="text-4xl mb-2">✨</div>
              <h3 className="font-bold text-white">Distill</h3>
              <p className="text-sm text-gray-400 mt-2">AI extracts key logic, mental models, and formats it with metadata.</p>
            </div>
            <div className="bg-obsidian-800 p-4 rounded-lg">
              <div className="text-4xl mb-2">💾</div>
              <h3 className="font-bold text-white">Save</h3>
              <p className="text-sm text-gray-400 mt-2">Approve the note to instantly open and save it in your local Obsidian vault.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">3. Detailed Steps</h2>
          
          <div className="border-l-2 border-purple-500 pl-4">
            <h3 className="text-lg text-white font-medium">Step 1: Paste Content</h3>
            <p>Copy text from a blog, a transcript, or just write your own rough notes into the "Raw Input" text area. Click <strong>Distill Insights</strong>.</p>
          </div>

          <div className="border-l-2 border-purple-500 pl-4">
            <h3 className="text-lg text-white font-medium">Step 2: Review & Edit</h3>
            <p>The generated note appears on the right.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Use <strong>Preview Mode</strong> to see how it looks rendered.</li>
              <li>Use <strong>Editor Mode</strong> to manually fix typos or change text yourself.</li>
              <li>Use the <strong>Refine</strong> box to ask AI to rewrite sections (e.g., "Make the summary shorter").</li>
            </ul>
          </div>

          <div className="border-l-2 border-purple-500 pl-4">
            <h3 className="text-lg text-white font-medium">Step 3: Save to Obsidian</h3>
            <p>Once satisfied, click <strong>Save to Obsidian</strong>.</p>
            <p className="mt-2 text-yellow-500 text-sm bg-yellow-900/20 p-2 rounded">
              <strong>Note:</strong> Your browser will ask permission to open the Obsidian app. Click "Open Obsidian". The note will be created automatically in your vault.
            </p>
          </div>
        </section>

        <section className="bg-obsidian-800 p-6 rounded-xl border border-obsidian-700">
            <h2 className="text-xl font-semibold text-purple-400 mb-4">Troubleshooting</h2>
            <p className="mb-2"><strong>Nothing happens when I click Save?</strong></p>
            <p className="text-sm mb-4">Ensure your <strong>Vault Name</strong> in Settings matches exactly what is shown in your Obsidian vault list. It is case-sensitive.</p>
            
            <p className="mb-2"><strong>Error: API Key is missing?</strong></p>
            <p className="text-sm">Go to Settings and ensure you have pasted a valid Gemini API Key.</p>
        </section>
      </div>
    </div>
  );
};