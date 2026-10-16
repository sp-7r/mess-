import React, { useState } from 'react';
import { FilterState } from '../types';
import { Search, SlidersHorizontal, Map, List, X, RotateCcw, Check, Sparkles } from 'lucide-react';

interface SearchAndFilterBarProps {
  filters: FilterState;
  onUpdateFilters: (partial: Partial<FilterState>) => void;
  onResetFilters: () => void;
  viewMode: 'list' | 'map';
  onToggleViewMode: (mode: 'list' | 'map') => void;
  totalResultsCount: number;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  viewMode,
  onToggleViewMode,
  totalResultsCount
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const activeFilterCount = [
    filters.foodPreference !== 'all',
    filters.cuisines.length > 0,
    filters.highProteinOnly,
    filters.minProteinGrams > 0,
    filters.maxDistanceKm < 15,
    filters.maxMonthlyPrice < 4500,
    filters.homeDeliveryOnly,
    filters.pickupOnly,
    filters.trialMealAvailableOnly,
    filters.breakfastAvailable,
    filters.lunchAvailable,
    filters.dinnerAvailable,
    filters.highestRatedOnly
  ].filter(Boolean).length;

  const toggleCuisine = (cuisine: string) => {
    const exists = filters.cuisines.includes(cuisine);
    const updated = exists 
      ? filters.cuisines.filter(c => c !== cuisine)
      : [...filters.cuisines, cuisine];
    onUpdateFilters({ cuisines: updated });
  };

  return (
    <div className="space-y-3">
      {/* Main Search & Control Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Prominent Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
            placeholder="Search by mess name, meal, paneer, dal tadka, south indian, protein..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-xs"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onUpdateFilters({ searchQuery: '' })}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Switcher & Filter Modal Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          {/* List vs Map View Segmented Control */}
          <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl">
            <button
              onClick={() => onToggleViewMode('list')}
              className={`flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => onToggleViewMode('map')}
              className={`flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>

          {/* Sort Selector */}
          <select
            value={filters.sortBy}
            onChange={(e) => onUpdateFilters({ sortBy: e.target.value as FilterState['sortBy'] })}
            className="py-2 px-3 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-amber-500 shadow-xs"
          >
            <option value="nearest">Nearest First</option>
            <option value="price_low">Lowest Price First</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>

          {/* Advanced Filter Drawer Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`flex items-center gap-1.5 py-2 px-3.5 text-xs font-semibold rounded-xl border transition-all ${
              activeFilterCount > 0
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Interactive Filter Buttons (Single-Line Segmented Strip) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          onClick={() => onUpdateFilters({ foodPreference: filters.foodPreference === 'veg_only' ? 'all' : 'veg_only' })}
          className={`py-1.5 px-3 rounded-xl border whitespace-nowrap shrink-0 font-medium transition-all ${
            filters.foodPreference === 'veg_only'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          🥬 Pure Veg
        </button>

        <button
          onClick={() => onUpdateFilters({ highProteinOnly: !filters.highProteinOnly })}
          className={`py-1.5 px-3 rounded-xl border whitespace-nowrap shrink-0 font-medium transition-all ${
            filters.highProteinOnly
              ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          💪 High Protein (30g+)
        </button>

        <button
          onClick={() => toggleCuisine('South Indian')}
          className={`py-1.5 px-3 rounded-xl border whitespace-nowrap shrink-0 font-medium transition-all ${
            filters.cuisines.includes('South Indian')
              ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          🍛 South Indian
        </button>

        <button
          onClick={() => toggleCuisine('North Indian')}
          className={`py-1.5 px-3 rounded-xl border whitespace-nowrap shrink-0 font-medium transition-all ${
            filters.cuisines.includes('North Indian')
              ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          🫓 North Indian (Homely)
        </button>

        <button
          onClick={() => onUpdateFilters({ trialMealAvailableOnly: !filters.trialMealAvailableOnly })}
          className={`py-1.5 px-3 rounded-xl border whitespace-nowrap shrink-0 font-medium transition-all ${
            filters.trialMealAvailableOnly
              ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          🎟️ Trial Meal Available
        </button>

        <button
          onClick={() => onUpdateFilters({ homeDeliveryOnly: !filters.homeDeliveryOnly })}
          className={`py-1.5 px-3 rounded-xl border whitespace-nowrap shrink-0 font-medium transition-all ${
            filters.homeDeliveryOnly
              ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          🛵 Hostel Delivery
        </button>

        <button
          onClick={() => onUpdateFilters({ foodPreference: filters.foodPreference === 'jain' ? 'all' : 'jain' })}
          className={`py-1.5 px-3 rounded-xl border whitespace-nowrap shrink-0 font-medium transition-all ${
            filters.foodPreference === 'jain'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          🌱 Jain Food
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="py-1.5 px-3 text-rose-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filter Drawer / Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div 
            className="relative w-full max-w-lg my-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Advanced Filter & Preferences</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Controls Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Distance Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span>Maximum Distance from Campus</span>
                  <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Within {filters.maxDistanceKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={filters.maxDistanceKm}
                  onChange={(e) => onUpdateFilters({ maxDistanceKm: parseFloat(e.target.value) })}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>1 km (Walkable)</span>
                  <span>5 km</span>
                  <span>15 km (Whole City)</span>
                </div>
              </div>

              {/* Monthly Subscription Price Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span>Monthly Budget Limit</span>
                  <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Up to ₹{filters.maxMonthlyPrice.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="5000"
                  step="100"
                  value={filters.maxMonthlyPrice}
                  onChange={(e) => onUpdateFilters({ maxMonthlyPrice: parseInt(e.target.value) })}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>₹2,000 (Budget)</span>
                  <span>₹3,500</span>
                  <span>₹5,000 (Premium/Diet)</span>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Dietary Category
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: 'All Options' },
                    { id: 'veg_only', label: 'Pure Veg Only' },
                    { id: 'non_veg', label: 'Non-Veg Available' },
                    { id: 'jain', label: 'Jain Friendly' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onUpdateFilters({ foodPreference: opt.id as FilterState['foodPreference'] })}
                      className={`py-2 px-3 text-xs font-medium rounded-xl border text-left flex items-center justify-between transition-all ${
                        filters.foodPreference === opt.id
                          ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {filters.foodPreference === opt.id && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nutrition & High Protein Requirements */}
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nutrition & Fitness Tracking
                </span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.highProteinOnly}
                      onChange={(e) => onUpdateFilters({ highProteinOnly: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 accent-amber-600"
                    />
                    <span className="font-medium">Filter High-Protein Messes Only (Sprouts, Paneer, Soya, Chicken)</span>
                  </label>

                  {filters.highProteinOnly && (
                    <div className="pl-6 pt-1 flex items-center gap-2">
                      <span className="text-xs text-slate-500">Min. protein per meal:</span>
                      {[25, 35, 45].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => onUpdateFilters({ minProteinGrams: g })}
                          className={`px-2.5 py-1 text-xs rounded-lg font-mono font-medium border ${
                            filters.minProteinGrams === g
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {g}g+
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Service & Delivery Methods */}
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Delivery & Dining Options
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={filters.homeDeliveryOnly}
                      onChange={(e) => onUpdateFilters({ homeDeliveryOnly: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 accent-amber-600"
                    />
                    <span>Hostel Delivery</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={filters.pickupOnly}
                      onChange={(e) => onUpdateFilters({ pickupOnly: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 accent-amber-600"
                    />
                    <span>Dine-In / Pickup</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={filters.trialMealAvailableOnly}
                      onChange={(e) => onUpdateFilters({ trialMealAvailableOnly: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 accent-amber-600"
                    />
                    <span>Trial Meals Allowed</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={filters.highestRatedOnly}
                      onChange={(e) => onUpdateFilters({ highestRatedOnly: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 accent-amber-600"
                    />
                    <span>Top Rated (4.7★ +)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <button
                type="button"
                onClick={onResetFilters}
                className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Clear All Filters
              </button>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
              >
                Show {totalResultsCount} Messes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
