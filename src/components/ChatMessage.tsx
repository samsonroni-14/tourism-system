import { MapPin, Cloud } from 'lucide-react';
import { TourismResult } from '../agents/tourismAgent';

interface ChatMessageProps {
  type: 'user' | 'agent';
  content: string;
  result?: TourismResult;
}

export const ChatMessage = ({ type, content, result }: ChatMessageProps) => {
  if (type === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-slate-700 text-white px-6 py-3 rounded-2xl max-w-2xl shadow-sm">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-6">
      <div className="bg-white px-6 py-4 rounded-2xl max-w-2xl shadow-sm border border-slate-200">
        {result?.error === 'location_not_found' ? (
          <p className="text-slate-700">{result.message}</p>
        ) : (
          <div className="space-y-4">
            {result?.location && (
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">{result.location}</h3>
                </div>
              </div>
            )}

            {result?.weather && (
              <div className="flex items-start gap-2 pl-7">
                <Cloud className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700">
                  Currently {result.weather.temperature}°C with a {result.weather.precipitation_probability}% chance of rain
                </p>
              </div>
            )}

            {result?.places && result.places.length > 0 && (
              <div className="pl-7">
                <p className="text-slate-700 mb-2">Places to visit:</p>
                <ul className="space-y-1">
                  {result.places.map((place, index) => (
                    <li key={index} className="text-slate-600 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{place.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};