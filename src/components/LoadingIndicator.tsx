export const LoadingIndicator = () => {
  return (
    <div className="flex justify-start mb-6">
      <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-slate-600 text-sm ml-2">Analyzing your request...</span>
        </div>
      </div>
    </div>
  );
};