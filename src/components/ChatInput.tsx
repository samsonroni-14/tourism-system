import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled: boolean;
}

export const ChatInput = ({ onSubmit, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me about weather or places to visit..."
        disabled={disabled}
        className="flex-1 px-6 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-900 placeholder-slate-400"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="px-6 py-4 bg-slate-700 text-white rounded-2xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
      >
        <Send className="w-5 h-5" />
        Send
      </button>
    </form>
  );
};