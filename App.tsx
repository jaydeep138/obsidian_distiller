import React, { useState, useEffect } from 'react';
import { View, Settings, NoteState } from './types';
import { extractInsights, refineInsights } from './services/geminiService';
import { Button } from './components/Button';
import { Guide } from './components/Guide';
import { marked } from 'marked';
import { 
  BookOpen, 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw, 
  ArrowRight, 
  Sparkles, 
  Edit3,
  CheckCircle,
  FileText,
  Eye,
  Code,
  Key
} from 'lucide-react';

const DEFAULT_VAULT_NAME = "My Vault";

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.GUIDE);
  const [settings, setSettings] = useState<Settings>({
    vaultName: DEFAULT_VAULT_NAME,
    defaultTags: 'learning, inbox',
    apiKey: ''
  });
  
  const [noteState, setNoteState] = useState<NoteState>({
    status: 'idle',
    rawInput: '',
    generatedContent: '',
    error: null
  });

  const [refinePrompt, setRefinePrompt] = useState('');
  const [previewMode, setPreviewMode] = useState(true); // Toggle between Edit (false) and Preview (true)

  // Load settings from local storage on mount
  useEffect(() => {
    const savedVault = localStorage.getItem('obsidian_vault_name');
    const savedKey = localStorage.getItem('obsidian_api_key');
    
    setSettings(prev => ({ 
      ...prev, 
      vaultName: savedVault || DEFAULT_VAULT_NAME,
      apiKey: savedKey || ''
    }));
  }, []);

  const handleGenerate = async () => {
    if (!noteState.rawInput.trim()) return;

    setNoteState(prev => ({ ...prev, status: 'generating', error: null }));
    try {
      const result = await extractInsights(noteState.rawInput);
      setNoteState(prev => ({ 
        ...prev, 
        generatedContent: result, 
        status: 'reviewing' 
      }));
      setView(View.EDITOR);
      setPreviewMode(true);
    } catch (err: any) {
      setNoteState(prev => ({ 
        ...prev, 
        status: 'idle', 
        error: err.message || "Failed to generate note. Check your API Key in Settings." 
      }));
    }
  };

  const handleRefine = async () => {
    if (!refinePrompt.trim()) return;
    
    setNoteState(prev => ({ ...prev, status: 'refining', error: null }));
    try {
      const result = await refineInsights(noteState.generatedContent, refinePrompt);
      setNoteState(prev => ({ 
        ...prev, 
        generatedContent: result, 
        status: 'reviewing' 
      }));
      setRefinePrompt('');
      setPreviewMode(true);
    } catch (err: any) {
      setNoteState(prev => ({ 
        ...prev, 
        status: 'reviewing', 
        error: err.message || "Failed to refine note." 
      }));
    }
  };

  const extractTitleFromMarkdown = (md: string): string => {
    // Try to find title in YAML
    const yamlMatch = md.match(/title:\s*["']?([^"'\n]+)["']?/);
    if (yamlMatch && yamlMatch[1]) return yamlMatch[1].trim();

    // Try to find first H1
    const h1Match = md.match(/^#\s+(.+)$/m);
    if (h1Match && h1Match[1]) return h1Match[1].trim();

    return `Note ${new Date().toISOString().slice(0,10)}`;
  };

  const sanitizeFileName = (name: string): string => {
    // Remove chars invalid in Windows/Unix filenames: \ / : * ? " < > |
    // Replace them with a space or empty string
    return name.replace(/[\\/:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const handleSaveToObsidian = () => {
    const { vaultName } = settings;
    const { generatedContent } = noteState;
    
    if (!generatedContent) return;

    let fileName = extractTitleFromMarkdown(generatedContent);
    fileName = sanitizeFileName(fileName);
    
    if (!fileName) {
      fileName = `Untitled Note ${Date.now()}`;
    }

    const encodedVault = encodeURIComponent(vaultName);
    const encodedFile = encodeURIComponent(fileName);
    const encodedContent = encodeURIComponent(generatedContent);
    
    const uri = `obsidian://new?vault=${encodedVault}&file=${encodedFile}&content=${encodedContent}`;
    
    window.location.href = uri;
    
    setNoteState(prev => ({...prev, status: 'ready'}));
  };

  const saveVaultName = (newVaultName: string) => {
    setSettings(prev => ({ ...prev, vaultName: newVaultName }));
    localStorage.setItem('obsidian_vault_name', newVaultName);
  };

  const saveApiKey = (newKey: string) => {
    setSettings(prev => ({ ...prev, apiKey: newKey }));
    localStorage.setItem('obsidian_api_key', newKey);
  };

  // --- Render Helpers ---

  const renderHeader = () => (
    <header className="h-16 border-b border-obsidian-700 bg-obsidian-900/50 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="bg-purple-600 p-2 rounded-lg">
          <BookOpen className="text-white h-5 w-5" />
        </div>
        <h1 className="font-bold text-xl tracking-tight text-white hidden sm:block">
          Obsidian <span className="text-purple-400 font-light">Distiller</span>
        </h1>
      </div>

      <nav className="flex items-center gap-2">
        <Button 
          variant={view === View.EDITOR ? 'primary' : 'ghost'} 
          onClick={() => setView(View.EDITOR)}
          className="text-sm"
          icon={<Edit3 size={16} />}
        >
          Editor
        </Button>
        <Button 
          variant={view === View.GUIDE ? 'primary' : 'ghost'} 
          onClick={() => setView(View.GUIDE)}
          className="text-sm"
          icon={<BookOpen size={16} />}
        >
          Guide
        </Button>
        <Button 
          variant={view === View.SETTINGS ? 'primary' : 'ghost'} 
          onClick={() => setView(View.SETTINGS)}
          className="text-sm"
          icon={<SettingsIcon size={16} />}
        >
          Settings
        </Button>
      </nav>
    </header>
  );

  const renderEditor = () => (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-obsidian-900 overflow-hidden">
      
      {/* LEFT: Input Area */}
      <div className="w-full md:w-1/2 flex flex-col border-r border-obsidian-700 p-4 md:p-6 gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <FileText size={18} className="text-purple-400"/> Raw Source
          </h2>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Paste Text Here</span>
        </div>
        
        <textarea
          className="flex-1 bg-obsidian-800 border border-obsidian-700 rounded-xl p-4 text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none font-mono text-sm leading-relaxed"
          placeholder="Paste article text, video transcript, or your rough notes here..."
          value={noteState.rawInput}
          onChange={(e) => setNoteState(prev => ({ ...prev, rawInput: e.target.value }))}
        />
        
        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleGenerate} 
            isLoading={noteState.status === 'generating'}
            disabled={!noteState.rawInput}
            icon={<Sparkles size={18} />}
            className="w-full md:w-auto shadow-lg shadow-purple-900/20"
          >
            Distill Insights
          </Button>
        </div>
      </div>

      {/* RIGHT: Output & Review Area */}
      <div className="w-full md:w-1/2 flex flex-col p-4 md:p-6 gap-4 bg-obsidian-800/30">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-400"/> Review & Save
          </h2>
          
          {/* Toggle View Buttons */}
          <div className="flex bg-obsidian-900 rounded-lg p-1 border border-obsidian-700">
            <button 
              onClick={() => setPreviewMode(false)}
              className={`p-1.5 rounded-md transition-all ${!previewMode ? 'bg-obsidian-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
              title="Edit Markdown"
            >
              <Code size={16} />
            </button>
            <button 
              onClick={() => setPreviewMode(true)}
              className={`p-1.5 rounded-md transition-all ${previewMode ? 'bg-obsidian-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
              title="Preview Reading Mode"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-obsidian-800 border border-obsidian-700 rounded-xl overflow-hidden relative group flex flex-col">
          {noteState.generatedContent ? (
             previewMode ? (
               // READING MODE
              <div className="flex-1 p-6 overflow-auto prose prose-invert prose-sm max-w-none custom-scrollbar">
                <div dangerouslySetInnerHTML={{ __html: marked.parse(noteState.generatedContent) }} />
              </div>
             ) : (
               // EDITING MODE
               <textarea 
                 className="flex-1 w-full h-full p-4 bg-transparent text-gray-300 font-mono text-sm resize-none focus:outline-none custom-scrollbar"
                 value={noteState.generatedContent}
                 onChange={(e) => setNoteState(prev => ({...prev, generatedContent: e.target.value}))}
               />
             )
          ) : (
            // EMPTY STATE
            <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4 p-4">
              <div className="w-16 h-16 rounded-full bg-obsidian-700 flex items-center justify-center">
                <ArrowRight size={24} className="opacity-50" />
              </div>
              <p>Generated structured notes will appear here.</p>
            </div>
          )}
          
          {/* Loading Overlay */}
          {(noteState.status === 'generating' || noteState.status === 'refining') && (
             <div className="absolute inset-0 bg-obsidian-900/80 backdrop-blur-sm flex items-center justify-center z-10">
               <div className="flex flex-col items-center gap-3">
                 <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                 <span className="text-purple-200 font-medium animate-pulse">
                   {noteState.status === 'generating' ? 'Analyzing & Structuring...' : 'Applying Revisions...'}
                 </span>
               </div>
             </div>
          )}
        </div>

        {/* Action Area: Refine or Save */}
        {noteState.generatedContent && (
          <div className="flex flex-col gap-3 bg-obsidian-800 border border-obsidian-700 p-4 rounded-xl">
            {noteState.error && (
              <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded mb-2">
                Error: {noteState.error}
              </div>
            )}
            
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 bg-obsidian-900 border border-obsidian-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                placeholder="Ask AI to change something..."
                value={refinePrompt}
                onChange={(e) => setRefinePrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
              />
              <Button 
                variant="secondary" 
                onClick={handleRefine}
                disabled={!refinePrompt}
                isLoading={noteState.status === 'refining'}
                icon={<RefreshCw size={16} />}
              >
                Refine
              </Button>
            </div>
            
            <div className="h-px bg-obsidian-700 my-1"></div>
            
            <Button 
              variant="primary" 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-none text-white shadow-lg shadow-purple-900/50"
              onClick={handleSaveToObsidian}
              icon={<Save size={18} />}
            >
              Approve & Save to Obsidian
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-obsidian-800 rounded-xl border border-obsidian-700 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <SettingsIcon className="text-purple-400" /> Settings
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
             Gemini API Key
          </label>
          <div className="relative">
            <input 
              type="password"
              className="w-full bg-obsidian-900 border border-obsidian-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all font-mono text-sm"
              value={settings.apiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              placeholder="AIzaSy..."
            />
            <Key className="absolute left-3 top-3.5 text-gray-500 h-4 w-4" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Required for the AI to work. Your key is stored securely in your browser's LocalStorage and never sent to any 3rd party server other than Google.
          </p>
        </div>

        <div className="h-px bg-obsidian-700"></div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Obsidian Vault Name
          </label>
          <input 
            type="text"
            className="w-full bg-obsidian-900 border border-obsidian-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
            value={settings.vaultName}
            onChange={(e) => saveVaultName(e.target.value)}
            placeholder="e.g. My Second Brain"
          />
          <p className="text-xs text-gray-500 mt-2">
            This must match your local folder name exactly (case-sensitive).
          </p>
        </div>

        <div className="pt-4 border-t border-obsidian-700">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Connection Check</h3>
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => {
              window.location.href = `obsidian://new?vault=${encodeURIComponent(settings.vaultName)}&name=ConnectionTest&content=It%20Works!`;
            }}
          >
            Test Connection with Obsidian
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-obsidian-900 text-gray-200 font-sans selection:bg-purple-500/30 selection:text-white">
      {renderHeader()}
      <main className="h-[calc(100vh-4rem)] overflow-hidden">
        {view === View.EDITOR && renderEditor()}
        {view === View.GUIDE && <Guide />}
        {view === View.SETTINGS && renderSettings()}
      </main>
    </div>
  );
};

export default App;