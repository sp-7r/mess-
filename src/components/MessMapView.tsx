import React, { useState } from 'react';
import { MessListing } from '../types';
import { MapPin, Navigation, Star, ArrowRight, X, Utensils, Bike } from 'lucide-react';

interface MessMapViewProps {
  messes: MessListing[];
  userLocationName: string;
  onSelectMess: (mess: MessListing) => void;
  onBookTrial: (mess: MessListing) => void;
}

export const MessMapView: React.FC<MessMapViewProps> = ({
  messes,
  userLocationName,
  onSelectMess,
  onBookTrial
}) => {
  const [activeMess, setActiveMess] = useState<MessListing | null>(messes[0] || null);

  // Normalized visual coordinates for the map simulation
  const markerPositions = [
    { top: '35%', left: '42%' },
    { top: '55%', left: '32%' },
    { top: '28%', left: '68%' },
    { top: '65%', left: '60%' },
    { top: '45%', left: '78%' }
  ];

  return (
    <div className="relative w-full h-[580px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 shadow-md">
      {/* Map Graphic Canvas / Background */}
      <div className="absolute inset-0 bg-[#e5e3df] overflow-hidden">
        {/* SVG Street grid simulation */}
        <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Main roads */}
          <path d="M 0 180 Q 300 240 600 200 T 1200 220" fill="none" stroke="#fcd34d" strokeWidth="12" />
          <path d="M 380 0 Q 400 300 450 600" fill="none" stroke="#fef08a" strokeWidth="10" />
          <path d="M 100 500 Q 500 450 900 550" fill="none" stroke="#ffffff" strokeWidth="8" />
          <path d="M 700 0 Q 720 350 780 600" fill="none" stroke="#ffffff" strokeWidth="8" />
          {/* Green parks */}
          <rect x="180" y="80" width="140" height="90" rx="16" fill="#bbf7d0" opacity="0.7" />
          <rect x="520" y="320" width="180" height="120" rx="20" fill="#bbf7d0" opacity="0.7" />
          <rect x="80" y="380" width="120" height="80" rx="12" fill="#bbf7d0" opacity="0.6" />
        </svg>

        {/* Center Student Campus Beacon */}
        <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping" />
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <Navigation className="w-4 h-4 fill-white" />
            </div>
          </div>
          <span className="mt-1 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold rounded-md shadow-xs whitespace-nowrap">
            You ({userLocationName})
          </span>
        </div>

        {/* Mess Markers */}
        {messes.map((mess, idx) => {
          const pos = markerPositions[idx % markerPositions.length];
          const isSelected = activeMess?.id === mess.id;

          return (
            <div
              key={mess.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <button
                onClick={() => setActiveMess(mess)}
                className={`group flex items-center gap-1.5 py-1.5 px-2.5 rounded-2xl shadow-lg border-2 transition-all transform hover:scale-110 ${
                  isSelected
                    ? 'bg-amber-600 text-white border-white ring-4 ring-amber-600/30 scale-105'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-amber-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${mess.isVegOnly ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className="text-xs font-bold font-mono">₹{mess.singleMealPrice}</span>
                <span className="text-[11px] font-medium max-w-[90px] truncate hidden sm:inline">
                  {mess.name.split(' ')[0]}
                </span>
              </button>
            </div>
          );
        })}

        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs py-2 px-3.5 rounded-2xl shadow-md border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span>Showing <strong>{messes.length}</strong> student messes within reach</span>
        </div>
      </div>

      {/* Selected Mess Slide-Up Bottom Drawer */}
      {activeMess && (
        <div className="absolute bottom-4 left-4 right-4 max-w-lg mx-auto z-30 animate-slide-up">
          <div className="bg-white/98 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <img
                  src={activeMess.coverImage}
                  alt={activeMess.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-slate-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{activeMess.name}</h4>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 font-mono">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {activeMess.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{activeMess.address}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium mt-1">
                    <span className="font-mono text-slate-900 font-bold">₹{activeMess.monthlyBasePrice}/mo</span>
                    <span>·</span>
                    <span>Trial ₹{activeMess.trialMealPrice}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveMess(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Bike className="w-3.5 h-3.5 text-amber-600" />
                Delivery to Hostel: ~25 mins
              </span>
              <div className="flex gap-2">
                {activeMess.trialMealAvailable && (
                  <button
                    onClick={() => onBookTrial(activeMess)}
                    className="py-1.5 px-3 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors"
                  >
                    Book Trial
                  </button>
                )}
                <button
                  onClick={() => onSelectMess(activeMess)}
                  className="py-1.5 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
