export interface NoteState {
  status: 'idle' | 'generating' | 'reviewing' | 'refining' | 'ready';
  rawInput: string;
  generatedContent: string;
  error: string | null;
}

export interface Settings {
  vaultName: string;
  defaultTags: string;
  apiKey: string;
}

export enum View {
  EDITOR = 'EDITOR',
  GUIDE = 'GUIDE',
  SETTINGS = 'SETTINGS'
}