import React, { useState } from 'react';
import { MessListing, User, Order } from '../types';
import { storage } from '../services/storageService';
import { X, Star, AlertCircle, CheckCircle } from 'lucide-react';

interface ReviewModalProps {
  mess: MessListing;
  currentUser: User;
  eligibleOrders: Order[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  mess,
  currentUser,
  eligibleOrders,
  onClose,
  onSuccess
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    eligibleOrders.length > 0 ? eligibleOrders[0].id : ''
  );
  const [rating, setRating] = useState(5);
  const [foodQuality, setFoodQuality] = useState(5);
  const [hygiene, setHygiene] = useState(5);
  const [taste, setTaste] = useState(5);
  const [valueForMoney, setValueForMoney] = useState(5);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMessage('Please share a brief comment about your dining experience.');
      return;
    }
    try {
      storage.addReview({
        messId: mess.id,
        studentId: currentUser.id,
        studentName: `${currentUser.name} (${currentUser.college || 'Student'})`,
        rating,
        foodQuality,
        hygiene,
        taste,
        valueForMoney,
        comment,
        orderId: selectedOrderId,
        verifiedOrder: true
      });
      setIsSubmitted(true);
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to submit review');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-md my-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Verified Student Feedback</span>
            <h3 className="text-base font-bold text-slate-900">{mess.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Review Published!</h4>
            <p className="text-xs text-slate-500">
              Thank you for helping fellow college students find the best mess food.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {eligibleOrders.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                Only students with verified completed meal orders can post a review. You can review once your current meal is completed.
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Completed Order</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                  {eligibleOrders.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      #{ord.orderNumber} - {ord.planName || 'Meal'} (₹{ord.grandTotal})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Overall Star Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Overall Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-100 text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-bold font-mono text-slate-700 ml-2">{rating}.0 / 5</span>
              </div>
            </div>

            {/* Criteria Sliders */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Food Quality & Freshness:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFoodQuality(val)}
                      className={`w-6 h-6 rounded-md font-mono text-xs font-semibold ${
                        foodQuality === val ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Dining Hygiene:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setHygiene(val)}
                      className={`w-6 h-6 rounded-md font-mono text-xs font-semibold ${
                        hygiene === val ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Taste & Seasoning:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTaste(val)}
                      className={`w-6 h-6 rounded-md font-mono text-xs font-semibold ${
                        taste === val ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Value for Money:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setValueForMoney(val)}
                      className={`w-6 h-6 rounded-md font-mono text-xs font-semibold ${
                        valueForMoney === val ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Written Comments */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Written Feedback & Student Advice
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="How were the chapatis, dal, seating space, or delivery timings?"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                required
              />
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Submit Verified Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
