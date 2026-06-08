import React, { useState } from 'react';
import { X, Copy, Check, ShieldAlert, CheckCircle, Upload, ArrowRight, DollarSign } from 'lucide-react';
import { Profile } from '../types';

interface PaymentModalProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
  onSubmitPayment: (
    profileId: string, 
    profileName: string, 
    profileImage: string,
    senderName: string, 
    senderPhone: string, 
    transactionId: string, 
    method: 'Telebirr' | 'CBE Birr',
    amount: number
  ) => void;
  userGender: 'Male' | 'Female';
}

export default function PaymentModal({
  profile,
  isOpen,
  onClose,
  onSubmitPayment,
  userGender
}: PaymentModalProps) {
  const [copiedText, setCopiedText] = useState<'tele' | 'cbe' | null>(null);
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [method, setMethod] = useState<'Telebirr' | 'CBE Birr'>('Telebirr');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const activeFee = (() => {
    const saved = localStorage.getItem('whaatachi_match_fee_v1');
    return saved ? parseInt(saved, 10) : 200;
  })();

  if (!isOpen) return null;

  const handleCopy = (text: string, type: 'tele' | 'cbe') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (userGender === 'Male') {
      if (!senderName.trim()) {
        setError('Please enter your full name as printed on bank receipt.');
        return;
      }
      if (!senderPhone.trim()) {
        setError('Please enter your contact phone number.');
        return;
      }
      if (!transactionId.trim() || transactionId.length < 6) {
        setError('Please enter a valid Transaction ID (at least 6-10 characters long).');
        return;
      }

      setSubmitting(true);
      
      // Simulate network request
      setTimeout(() => {
        onSubmitPayment(
          profile.id,
          profile.name,
          profile.image,
          senderName,
          senderPhone,
          transactionId,
          method,
          activeFee
        );
        setSubmitting(false);
        onClose();
      }, 1200);
    } else {
      // Free verification for women
      if (!senderPhone.trim()) {
        setError('Please supply your contact digits to link.');
        return;
      }
      setSubmitting(true);
      setTimeout(() => {
        onSubmitPayment(
          profile.id,
          profile.name,
          profile.image,
          'Free Female Member',
          senderPhone,
          'FREE_REVEAL_' + Math.random().toString(36).substring(2, 7).toUpperCase(),
          'Telebirr',
          0
        );
        setSubmitting(false);
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-55 overflow-y-auto" id="payment-modal">
      
      {/* Dark overlay backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/60 dark:bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal element positioning */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all w-full max-w-md sm:max-w-lg border border-gray-100 dark:border-slate-800 flex flex-col my-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-4 flex items-center justify-between text-white shrink-0">
            <div>
              <h3 className="text-base sm:text-lg font-bold">Secure Verification Guard</h3>
              <p className="text-[10px] sm:text-[11px] text-pink-100 font-medium">Unlocking {profile.name}'s Connection Portal</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[80vh] scrollbar-thin">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300 rounded-xl p-3 text-xs flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 text-red-500 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {userGender === 'Female' ? (
              // Women Free Path description
              <div className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 dark:border-emerald-900/30 rounded-xl p-4 text-emerald-900 dark:text-emerald-305 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-605 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Free Verification for Women</h4>
                    <p className="text-xs text-emerald-700 dark:text-slate-350 leading-relaxed mt-1">
                      Whaatachi provides completely free access for our premium female members. Submit your phone number below and get instant secure access to connect.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                    Your Contact Phone Number (Required)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., +251 900 000 000"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-slate-700 p-3 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-pink-500 focus:ring-1 focus:ring-pink-500 bg-gray-50/50 dark:bg-slate-850"
                  />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500">
                    We securely save your profile context to prevent spam bots. Your number is never shown to malicious players.
                  </p>
                </div>
              </div>
            ) : (
              // Men Payment standard flow (Telebirr & CBE)
              <div className="space-y-4">
                
                {/* Visual Fee Banner */}
                <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl p-4 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-pink-100 dark:bg-pink-950/60 p-2 rounded-lg text-pink-600 dark:text-pink-400">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lock Fee required</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-slate-200">One-Time Activation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-pink-600 dark:text-pink-400">{activeFee}</span>
                    <span className="text-xs font-bold text-gray-500 ml-1">Birr</span>
                  </div>
                </div>

                {/* Info Text */}
                <p className="text-xs text-gray-500 dark:text-slate-350 leading-relaxed">
                  Before we disclose <strong className="text-gray-800 dark:text-white">{profile.name}</strong>'s direct Telegram handler and phone numbers, please complete a single <strong>{activeFee} ETB</strong> payment via CBE Birr or Telebirr and submit receipt below.
                </p>

                {/* Copyable Accounts section */}
                <div className="bg-gray-50/50 dark:bg-slate-850/50 border border-gray-150 dark:border-slate-800 rounded-xl p-4 space-y-3.5 transition-colors">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider">1. Transfer {activeFee}Birr to:</h4>
                  
                  {/* Account Telebirr */}
                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-750 rounded-lg shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-md bg-blue-600 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">TELE</span>
                      <div className="text-xs">
                        <p className="font-bold text-gray-800 dark:text-slate-200">Merchant: <span className="text-blue-600 dark:text-blue-400">0900123456</span></p>
                        <p className="text-[10px] text-gray-505 dark:text-slate-400">Name: Whaatachi PLC</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('0900123456', 'tele')}
                      className="text-[10px] font-semibold text-pink-600 hover:text-pink-700 hover:bg-pink-50 dark:hover:bg-pink-950/20 p-1.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedText === 'tele' ? <Check className="h-3 w-3 text-emerald-550" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedText === 'tele' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Account CBE */}
                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-750 rounded-lg shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-md bg-purple-700 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">CBE</span>
                      <div className="text-xs">
                        <p className="font-bold text-gray-800 dark:text-slate-200">Account: <span className="text-purple-700 dark:text-purple-400">1000123456789</span></p>
                        <p className="text-[10px] text-gray-550 dark:text-slate-400">Name: Samuel Shiferaw (Whaatachi)</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('1000123456789', 'cbe')}
                      className="text-[10px] font-semibold text-pink-600 hover:text-pink-700 hover:bg-pink-50 dark:hover:bg-pink-950/20 p-1.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedText === 'cbe' ? <Check className="h-3 w-3 text-emerald-550" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedText === 'cbe' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                </div>

                {/* Form fields */}
                <div className="space-y-4 pt-1">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider">2. Submit Verification Details:</h4>

                  {/* Channel selectors */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setMethod('Telebirr')}
                      className={`p-2.5 border rounded-lg font-semibold cursor-pointer transition-colors ${
                        method === 'Telebirr'
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300'
                          : 'border-gray-200 dark:border-slate-750 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-605 dark:text-slate-405'
                      }`}
                    >
                      Telebirr Receipt
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod('CBE Birr')}
                      className={`p-2.5 border rounded-lg font-semibold cursor-pointer transition-colors ${
                        method === 'CBE Birr'
                          ? 'border-purple-650 bg-purple-50/50 dark:bg-purple-950/20 text-purple-800 dark:text-purple-300'
                          : 'border-gray-200 dark:border-slate-755 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-605 dark:text-slate-405'
                      }`}
                    >
                      CBE Transfer Receipt
                    </button>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-650 dark:text-slate-350 uppercase">Sender Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Samuel Girma"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-850 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 p-2.5 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-650 dark:text-slate-350 uppercase">Your Contact Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 0911234567"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        className="w-full bg-white dark:bg-slate-850 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-700 p-2.5 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-650 dark:text-slate-350 uppercase">Transaction ID / Reference Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FT2315354922 or A7B5C3D..."
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-white dark:bg-slate-855 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 p-2.5 rounded-lg font-mono text-sm uppercase outline-hidden focus:border-pink-500"
                    />
                  </div>

                  {/* Mock Upload container */}
                  <div className="border border-dashed border-gray-200 dark:border-slate-700 rounded-xl p-3 bg-gray-50 dark:bg-slate-850 flex items-center justify-between text-xs transition-colors">
                    <div className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-gray-400 " />
                      <div>
                        <p className="font-bold text-gray-700 dark:text-slate-200">Upload Transfer Slip</p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">PDF, JPG or screenshot evidence (Optional)</p>
                      </div>
                    </div>
                    <span className="bg-white dark:bg-slate-900 border dark:border-slate-750 rounded-md px-2 py-1 font-semibold text-gray-500 dark:text-slate-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 text-[10px] transition-colors">
                      Choose
                    </span>
                  </div>

                </div>

              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
            >
              {submitting ? (
                <span>Locking details & verifying transaction...</span>
              ) : (
                <>
                  <span>
                    {userGender === 'Female' ? 'Verify & Get Free Contact' : 'Submit for Verification'}
                  </span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}
