import React, { useState } from 'react';
import { X, MapPin, Navigation, Check } from 'lucide-react';
import { POPULAR_CITIES, CITY_LOCALITIES } from '../data/seedData';

interface LocationSelectorModalProps {
  currentCity: string;
  currentLocality: string;
  onSelectLocation: (city: string, locality: string, lat?: number, lng?: number) => void;
  onClose: () => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  currentCity,
  currentLocality,
  onSelectLocation,
  onClose
}) => {
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const localities = CITY_LOCALITIES[selectedCity] || ['All Areas', 'Campus Area', 'Hostel Zone'];

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser. Please select your city manually.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        // Map detected coordinates: default to nearest Pune campus or retain
        onSelectLocation(selectedCity, 'Near Current Location', position.coords.latitude, position.coords.longitude);
        onClose();
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission denied. Please choose your city and student area from below.');
        } else {
          setLocationError('Unable to detect current GPS location. Please select manually.');
        }
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Campus Discovery</span>
            <h3 className="text-lg font-bold text-slate-900">Select Location</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Geolocation Button */}
          <div>
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="w-full py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-2xl flex items-center justify-center gap-2.5 font-semibold text-sm transition-all shadow-sm disabled:opacity-60"
            >
              <Navigation className={`w-4 h-4 text-amber-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detecting GPS location...' : 'Use Current Device Location'}</span>
            </button>
            {locationError && (
              <p className="mt-2 text-xs text-rose-600 leading-snug">{locationError}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 uppercase font-semibold">or select student hub</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* City Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">City</label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-medium transition-all ${
                    selectedCity === city
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Locality Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Student Locality / University Area in {selectedCity}
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {localities.map((loc) => {
                const isSelected = selectedCity === currentCity && currentLocality === loc;
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      onSelectLocation(selectedCity, loc);
                      onClose();
                    }}
                    className={`py-2 px-3 text-left rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <span className="truncate">{loc}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
