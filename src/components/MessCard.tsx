import React from 'react';
import { MessListing } from '../types';
import { Star, MapPin, Bike, Store, Heart, UtensilsCrossed, Dumbbell, ShieldCheck } from 'lucide-react';

interface MessCardProps {
  mess: MessListing;
  distanceKm: number;
  isSaved: boolean;
  onToggleSave: (messId: string) => void;
  onSelectMess: (mess: MessListing) => void;
  onBookTrial: (mess: MessListing) => void;
}

export const MessCard: React.FC<MessCardProps> = ({
  mess,
  distanceKm,
  isSaved,
  onToggleSave,
  onSelectMess,
  onBookTrial
}) => {
  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={mess.coverImage}
          alt={mess.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />

        {/* Veg / Non-Veg Indicator & High Protein Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {mess.isVegOnly ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-lg text-emerald-800 text-[11px] font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Pure Veg
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-lg text-rose-800 text-[11px] font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              Veg & Non-Veg
            </span>
          )}

          {mess.hasHighProtein && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white rounded-lg text-[11px] font-bold shadow-xs">
              <Dumbbell className="w-3 h-3" />
              High Protein
            </span>
          )}
        </div>

        {/* Bookmark Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(mess.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
            isSaved
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/90 text-slate-500 hover:text-rose-600'
          }`}
          aria-label={isSaved ? 'Remove from saved messes' : 'Save mess'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Distance Gradient Chip */}
        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/65 backdrop-blur-xs rounded-md text-white text-[11px] font-mono flex items-center gap-1">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>{distanceKm.toFixed(1)} km away</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 
                onClick={() => onSelectMess(mess)}
                className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors cursor-pointer line-clamp-1"
              >
                {mess.name}
              </h3>
              {/* Unboxed Metadata with · separator */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>{mess.locality}</span>
                <span aria-hidden="true">·</span>
                <span>{mess.city}</span>
                {mess.hasSouthIndian && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>South Indian</span>
                  </>
                )}
                {mess.hasNorthIndian && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>North Indian</span>
                  </>
                )}
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200/80 rounded-lg shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold font-mono text-amber-900">{mess.rating}</span>
              <span className="text-[10px] text-slate-400 font-normal">({mess.reviewCount})</span>
            </div>
          </div>

          {/* Today's Menu Snippet */}
          <div className="mt-3 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 mb-1">
              <UtensilsCrossed className="w-3 h-3 text-amber-600" />
              <span>Today&apos;s Special Menu</span>
            </div>
            <p className="line-clamp-1 text-slate-600 font-medium">
              {mess.todayMenuSnippet}
            </p>
          </div>

          {/* Service Availability Row */}
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
            {mess.homeDeliveryAvailable && (
              <span className="flex items-center gap-1 text-slate-600">
                <Bike className="w-3.5 h-3.5 text-amber-600" />
                Delivery (₹{mess.deliveryFee})
              </span>
            )}
            {mess.pickupAvailable && (
              <span className="flex items-center gap-1 text-slate-600">
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                Mess Dine-In
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-400 ml-auto text-[11px]">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              FSSAI Verified
            </span>
          </div>
        </div>

        {/* Pricing & Action Row */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Monthly Plan</div>
            <div className="text-base font-bold font-mono text-slate-900">
              ₹{mess.monthlyBasePrice.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-500 font-sans"> / mo</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mess.trialMealAvailable && (
              <button
                type="button"
                onClick={() => onBookTrial(mess)}
                className="py-2 px-3 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors whitespace-nowrap"
              >
                Trial ₹{mess.trialMealPrice}
              </button>
            )}

            <button
              type="button"
              onClick={() => onSelectMess(mess)}
              className="py-2 px-3.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shadow-xs"
            >
              View Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
