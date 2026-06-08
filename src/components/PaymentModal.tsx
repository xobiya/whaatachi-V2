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
  profile, isOpen, onClose, onSubmitPayment, userGender
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
        setError('Please enter your full name as on bank receipt.');
        return;
      }
      if (!senderPhone.trim()) {
        setError('Please enter your contact phone number.');
        return;
      }
      if (!transactionId.trim() || transactionId.length < 6) {
        setError('Please enter a valid Transaction ID (at least 6 characters).');
        return;
      }

      setSubmitting(true);
      setTimeout(() => {
        onSubmitPayment(profile.id, profile.name, profile.image, senderName, senderPhone, transactionId, method, activeFee);
        setSubmitting(false);
        onClose();
      }, 1200);
    } else {
      if (!senderPhone.trim()) {
        setError('Please enter your phone number.');
        return;
      }
      setSubmitting(true);
      setTimeout(() => {
        onSubmitPayment(
          profile.id, profile.name, profile.image,
          'Free Female Member', senderPhone,
          'FREE_' + Math.random().toString(36).substring(2, 7).toUpperCase(),
          'Telebirr', 0
        );
        setSubmitting(false);
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-55 overflow-y-auto">
      <div className="fixed inset-0 bg-[#1A1118]/80 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-[#FFFCF8] dark:bg-[#120A0E] text-left shadow-2xl transition-all w-full max-w-md sm:max-w-lg border border-[#C9A84C]/20 flex flex-col my-8">

          <div className="bg-[#8B0020] px-6 py-4 flex items-center justify-between text-white shrink-0">
            <div>
              <h3 className="text-base sm:text-lg font-bold">Unlock {profile.name}'s Contact</h3>
              <p className="text-[10px] sm:text-[11px] text-[#F0D4D4] font-medium">Get phone, Telegram & Instagram instantly</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[80vh] scrollbar-thin">
            {error && (
              <div className="bg-[#8B0020]/5 dark:bg-[#8B0020]/10 border border-[#8B0020]/20 dark:border-[#8B0020]/30 text-[#8B0020] dark:text-[#F0D4D4] rounded-xl p-3 text-xs flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 text-[#8B0020] dark:text-[#F0D4D4] shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {userGender === 'Female' ? (
              <div className="space-y-4">
                <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl p-4 text-[#1A1118] dark:text-[#FFFCF8] flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#C9A84C] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Free for Women</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-1">
                      Whaatachi is completely free for women. Submit your phone below for instant access.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">Your Phone Number</label>
                  <input type="text" required placeholder="+251 900 000 000" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} className="w-full rounded-xl border border-[#EDE6D9] dark:border-[#C9A84C]/15 p-3 text-sm text-gray-900 dark:text-[#FFFCF8] focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C] focus:ring-1 focus:ring-[#8B0020]/20 dark:focus:ring-[#C9A84C]/20 bg-white dark:bg-[#1A1118]" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#F8F4ED] dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#8B0020]/10 dark:bg-[#8B0020]/20 p-2 rounded-lg text-[#8B0020] dark:text-[#C9A84C]">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">One-Time Unlock</p>
                      <p className="text-sm font-bold text-[#1A1118] dark:text-[#FFFCF8]">Pay & Connect Instantly</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-[#8B0020] dark:text-[#C9A84C]">{activeFee}</span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">ETB</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Pay <strong className="text-lg text-[#8B0020] dark:text-[#C9A84C]">{activeFee} ETB</strong> to get <strong className="text-[#1A1118] dark:text-[#FFFCF8]">{profile.name}</strong>'s direct phone, Telegram & Instagram.
                </p>

                <div className="bg-[#F8F4ED] dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-[#1A1118] dark:text-[#FFFCF8] uppercase tracking-wider">1. Send {activeFee} ETB to:</h4>

                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-md bg-blue-600 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">TELE</span>
                      <div className="text-xs">
                        <p className="font-bold text-gray-800 dark:text-[#FFFCF8]">Merchant: <span className="text-blue-600">0900123456</span></p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Whaatachi PLC</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleCopy('0900123456', 'tele')} className="text-[10px] font-semibold text-[#8B0020] dark:text-[#C9A84C] hover:text-[#B31B3A] dark:hover:text-[#E0C878] hover:bg-[#8B0020]/5 dark:hover:bg-[#C9A84C]/10 p-1.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors">
                      {copiedText === 'tele' ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedText === 'tele' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-md bg-purple-700 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">CBE</span>
                      <div className="text-xs">
                        <p className="font-bold text-gray-800 dark:text-[#FFFCF8]">Account: <span className="text-purple-700">1000123456789</span></p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Samuel S. (Whaatachi)</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleCopy('1000123456789', 'cbe')} className="text-[10px] font-semibold text-[#8B0020] dark:text-[#C9A84C] hover:text-[#B31B3A] dark:hover:text-[#E0C878] hover:bg-[#8B0020]/5 dark:hover:bg-[#C9A84C]/10 p-1.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors">
                      {copiedText === 'cbe' ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedText === 'cbe' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  <h4 className="text-xs font-bold text-[#1A1118] dark:text-[#FFFCF8] uppercase tracking-wider">2. Submit Payment Proof:</h4>

                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setMethod('Telebirr')} className={`p-2.5 border rounded-lg font-semibold cursor-pointer transition-colors ${method === 'Telebirr' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' : 'border-[#EDE6D9] dark:border-[#C9A84C]/15 hover:border-gray-300 text-gray-600 dark:text-gray-400 dark:hover:text-[#FFFCF8]'}`}>
                      Telebirr
                    </button>
                    <button type="button" onClick={() => setMethod('CBE Birr')} className={`p-2.5 border rounded-lg font-semibold cursor-pointer transition-colors ${method === 'CBE Birr' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300' : 'border-[#EDE6D9] dark:border-[#C9A84C]/15 hover:border-gray-300 text-gray-600 dark:text-gray-400 dark:hover:text-[#FFFCF8]'}`}>
                      CBE Birr
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase">Full Name</label>
                      <input type="text" required placeholder="e.g. Samuel Girma" value={senderName} onChange={(e) => setSenderName(e.target.value)} className="w-full bg-white dark:bg-[#1A1118] text-gray-900 dark:text-[#FFFCF8] border border-[#EDE6D9] dark:border-[#C9A84C]/15 p-2.5 rounded-lg text-xs focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C]" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase">Your Phone</label>
                      <input type="text" required placeholder="0911234567" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} className="w-full bg-white dark:bg-[#1A1118] text-gray-900 dark:text-[#FFFCF8] border border-[#EDE6D9] dark:border-[#C9A84C]/15 p-2.5 rounded-lg text-xs focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase">Transaction ID</label>
                    <input type="text" required placeholder="e.g. FT2315354922" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="w-full bg-white dark:bg-[#1A1118] text-gray-900 dark:text-[#FFFCF8] border border-[#EDE6D9] dark:border-[#C9A84C]/15 p-2.5 rounded-lg font-mono text-xs uppercase focus:outline-hidden focus:border-[#8B0020] dark:focus:border-[#C9A84C]" />
                  </div>

                  <div className="border border-dashed border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-3 bg-[#F8F4ED] dark:bg-[#1A1118] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-bold text-gray-700 dark:text-gray-300">Upload Slip</p>
                        <p className="text-[10px] text-gray-400">Optional screenshot</p>
                      </div>
                    </div>
                    <span className="bg-white dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-md px-2 py-1 font-semibold text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1A1118] text-[10px]">
                      Choose
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={submitting} className="w-full py-3.5 bg-[#8B0020] hover:bg-[#B31B3A] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#8B0020]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0">
              {submitting ? (
                <span>Verifying transaction...</span>
              ) : (
                <>
                  <span>{userGender === 'Female' ? 'Verify & Get Free Contact' : `Pay ${activeFee} ETB & Unlock Contact`}</span>
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
