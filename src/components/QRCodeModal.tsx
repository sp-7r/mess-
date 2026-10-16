import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, CheckCircle, Clock, ShieldCheck, Download } from 'lucide-react';
import { Coupon } from '../types';

interface QRCodeModalProps {
  coupon: Coupon;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ coupon, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        coupon.qrPayload,
        {
          width: 220,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [coupon]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `MessBhojan-Coupon-${coupon.code}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const isRedeemed = coupon.status === 'redeemed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <span className="text-xs font-semibold tracking-wider text-amber-700 uppercase">Digital Meal Token</span>
            <h3 id="qr-modal-title" className="text-lg font-bold text-slate-900 leading-snug">{coupon.messName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Coupon Content */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* Status banner */}
          <div className="w-full mb-4">
            {isRedeemed ? (
              <div className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-medium border border-slate-200">
                <CheckCircle className="w-4 h-4 text-slate-500" />
                <span>Already Redeemed at {new Date(coupon.redeemedAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium border border-emerald-200">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Valid for Today · Show at Mess Counter</span>
              </div>
            )}
          </div>

          {/* Canvas QR Container */}
          <div className={`p-4 bg-white rounded-2xl border-2 ${isRedeemed ? 'border-dashed border-slate-300 opacity-60' : 'border-amber-400 shadow-sm'} flex items-center justify-center`}>
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>

          {/* Coupon Code Typography */}
          <div className="mt-4">
            <span className="text-xs text-slate-500 font-medium">Coupon Code</span>
            <div className="text-2xl font-mono font-bold tracking-widest text-slate-900 mt-0.5">
              {coupon.code}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              <span>{coupon.mealType}</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>Student: {coupon.studentName}</span>
            </div>
          </div>

          {/* Security guarantee */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cryptographically verified one-time redemption</span>
          </div>

          {/* Actions */}
          <div className="w-full mt-6 flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Save to Phone
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
