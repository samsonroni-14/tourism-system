import { useState, useRef, useEffect } from 'react';
import { Plane } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LoadingIndicator } from './components/LoadingIndicator';
import { processTourismQuery, TourismResult } from './agents/tourismAgent';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  result?: TourismResult;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (userInput: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userInput
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await processTourismQuery(userInput);

      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        type: 'agent',
        content: result.message,
        result
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error processing query:', error);
      const errorMessage: Message = {
        id: `agent-${Date.now()}`,
        type: 'agent',
        content: 'Sorry, I encountered an error processing your request. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col h-screen">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Plane className="w-8 h-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">Tourism AI Assistant</h1>
          </div>
          <p className="text-slate-600">Ask me about weather and places to visit anywhere in the world</p>
        </header>

        <div className="flex-1 bg-white rounded-3xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <Plane className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-slate-700 mb-2">Start Your Journey</h2>
                  <p className="text-slate-500 mb-6">
                    Ask me about any destination and I'll help you with weather information and top places to visit.
                  </p>
                  <div className="space-y-2 text-sm text-slate-400">
                    <p>Try: "I'm going to Paris, what's the weather like?"</p>
                    <p>Or: "Show me places to visit in Tokyo"</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {messages.map(message => (
                  <ChatMessage
                    key={message.id}
                    type={message.type}
                    content={message.content}
                    result={message.result}
                  />
                ))}
                {isLoading && <LoadingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-6 bg-slate-50">
            <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
          </div>
        </div>

        <footer className="mt-6 text-center text-sm text-slate-500">
          Powered by Open-Meteo, OpenStreetMap, and Nominatim APIs
        </footer>
      </div>
    </div>
  );
}

export default App;
