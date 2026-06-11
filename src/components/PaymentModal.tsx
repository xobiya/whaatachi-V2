import React, { useState, useRef, useEffect } from 'react';
import { X, Copy, Check, ShieldAlert, CheckCircle, Upload, ArrowRight, DollarSign, File, Lock } from 'lucide-react';
import { Profile } from '../types';
import { useUIContext } from '../context/UIContext';

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
    amount: number,
    receiptImage?: string
  ) => void;
  onPaymentSuccess: () => void;
  userGender: 'Male' | 'Female';
  currentUser: Profile | null;
}

export default function PaymentModal({
  profile, isOpen, onClose, onSubmitPayment, onPaymentSuccess, userGender, currentUser
}: PaymentModalProps) {
  const { t } = useUIContext();
  const [copiedText, setCopiedText] = useState<'tele' | 'cbe' | null>(null);
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [method, setMethod] = useState<'Telebirr' | 'CBE Birr'>('Telebirr');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileData, setUploadedFileData] = useState<string | null>(null);
  const [uploadTouched, setUploadTouched] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setUploadedFileName(null);
      setUploadedFileData(null);
      setUploadTouched(false);
      setError('');
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadTouched(true);
    if (file) {
      setUploadedFileName(file.name);
      setError('');
      const reader = new FileReader();
      reader.onload = ev => setUploadedFileData(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text: string, type: 'tele' | 'cbe') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (userGender === 'Male') {
      if (!uploadedFileName) {
        setUploadTouched(true);
        setError('Please upload a payment receipt/screenshot before submitting.');
        return;
      }
      setSubmitting(true);
      const autoTxId = 'TXN_' + Math.random().toString(36).substring(2, 9).toUpperCase();
      setTimeout(() => {
        onSubmitPayment(profile.id, profile.name, profile.image, currentUser?.name || 'Male Member', currentUser?.contactInfo?.phone || 'Auto', autoTxId, method, 0, uploadedFileData || undefined);
        setSubmitting(false);
        onPaymentSuccess();
      }, 800);
    } else {
      if (!senderPhone.trim()) {
        setError(t('payment.error-phone-female'));
        return;
      }
      setSubmitting(true);
      setTimeout(() => {
        onSubmitPayment(
          profile.id, profile.name, profile.image,
          currentUser?.name || 'Free Female Member', senderPhone || currentUser?.contactInfo?.phone || '',
          'FREE_' + Math.random().toString(36).substring(2, 7).toUpperCase(),
          'Telebirr', 0
        );
        setSubmitting(false);
        onPaymentSuccess();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-55 overflow-y-auto">
      <div className="fixed inset-0 bg-[#1A1118]/80 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-[#FFFCF8] dark:bg-[#120A0E] text-left shadow-2xl transition-all w-full max-w-md sm:max-w-lg border border-[#C9A84C]/20 flex flex-col my-8">

          <div className="bg-[#EB317A] px-6 py-4 flex items-center justify-between text-white shrink-0">
            <div>
              <h3 className="text-base sm:text-lg font-bold">{t('payment.title').replace('{name}', profile.name)}</h3>
              <p className="text-[10px] sm:text-[11px] text-[#FAD0E8] font-medium">{t('payment.subtitle')}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[80vh] scrollbar-thin">
            {error && (
              <div className="bg-[#EB317A]/5 dark:bg-[#EB317A]/10 border border-[#EB317A]/20 dark:border-[#EB317A]/30 text-[#EB317A] dark:text-[#FAD0E8] rounded-xl p-3 text-xs flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 text-[#EB317A] dark:text-[#FAD0E8] shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {userGender === 'Female' ? (
              <div className="space-y-4">
                <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl p-4 text-[#1A1118] dark:text-[#FFFCF8] flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#C9A84C] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">{t('payment.free-title')}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-1">
                      {t('payment.free-desc')}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#1A1118]/70 dark:text-[#FFFCF8]/60 uppercase tracking-wider">{t('payment.your-phone')}</label>
                  <input type="text" required placeholder="+251 900 000 000" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} className="w-full rounded-xl border border-[#EDE6D9] dark:border-[#C9A84C]/15 p-3 text-sm text-gray-900 dark:text-[#FFFCF8] focus:outline-hidden focus:border-[#EB317A] dark:focus:border-[#C9A84C] focus:ring-1 focus:ring-[#EB317A]/20 dark:focus:ring-[#C9A84C]/20 bg-white dark:bg-[#1A1118]" />
                </div>
              </div>
            ) : !showPaymentForm ? (
              <div className="space-y-4">
                <div className="bg-[#EB317A]/5 border border-[#EB317A]/20 rounded-xl p-6 text-center space-y-3">
                  <Lock className="h-10 w-10 text-[#EB317A] mx-auto" />
                  <div>
                    <h4 className="font-bold text-lg text-[#1A1118] dark:text-[#FFFCF8]">Pay 200 ETB to See Contact Details</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      One-time payment to unlock {profile.name}'s phone, Telegram & Instagram
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full py-3 bg-[#EB317A] hover:bg-[#F04B8E] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#EB317A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <DollarSign className="h-4 w-4" />
                    Pay 200 ETB & Unlock
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#EB317A]/5 border border-[#EB317A]/20 rounded-xl p-4 text-[#1A1118] dark:text-[#FFFCF8] flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-[#EB317A] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">{t('payment.male-title')}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-1">
                      {t('payment.male-desc')}
                    </p>
                  </div>
                </div>

                <div className="bg-[#F8F4ED] dark:bg-[#1A1118] border border-[#EDE6D9] dark:border-[#C9A84C]/15 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-[#1A1118] dark:text-[#FFFCF8] uppercase tracking-wider">{t('payment.submit-proof')}</h4>

                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-md bg-blue-600 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">TELE</span>
                      <div className="text-xs">
                        <p className="font-bold text-gray-800 dark:text-[#FFFCF8]">{t('payment.merchant').split('{number}')[0]}<span className="text-blue-600">0900123456</span>{t('payment.merchant').split('{number}')[1]}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Whaatachi PLC</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleCopy('0900123456', 'tele')} className="text-[10px] font-semibold text-[#EB317A] dark:text-[#C9A84C] hover:text-[#F04B8E] dark:hover:text-[#E0C878] hover:bg-[#EB317A]/5 dark:hover:bg-[#C9A84C]/10 p-1.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors">
                      {copiedText === 'tele' ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedText === 'tele' ? t('payment.copied') : t('payment.copy')}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-md bg-purple-700 text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">CBE</span>
                      <div className="text-xs">
                        <p className="font-bold text-gray-800 dark:text-[#FFFCF8]">{t('payment.account').split('{number}')[0]}<span className="text-purple-700">1000123456789</span>{t('payment.account').split('{number}')[1]}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Samuel S. (Whaatachi)</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleCopy('1000123456789', 'cbe')} className="text-[10px] font-semibold text-[#EB317A] dark:text-[#C9A84C] hover:text-[#F04B8E] dark:hover:text-[#E0C878] hover:bg-[#EB317A]/5 dark:hover:bg-[#C9A84C]/10 p-1.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors">
                      {copiedText === 'cbe' ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedText === 'cbe' ? t('payment.copied') : t('payment.copy')}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setMethod('Telebirr')} className={`p-2.5 border rounded-lg font-semibold cursor-pointer transition-colors ${method === 'Telebirr' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' : 'border-[#EDE6D9] dark:border-[#C9A84C]/15 hover:border-gray-300 text-gray-600 dark:text-gray-400 dark:hover:text-[#FFFCF8]'}`}>
                      {t('payment.teleBirr')}
                    </button>
                    <button type="button" onClick={() => setMethod('CBE Birr')} className={`p-2.5 border rounded-lg font-semibold cursor-pointer transition-colors ${method === 'CBE Birr' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300' : 'border-[#EDE6D9] dark:border-[#C9A84C]/15 hover:border-gray-300 text-gray-600 dark:text-gray-400 dark:hover:text-[#FFFCF8]'}`}>
                      {t('payment.cbeBirr')}
                    </button>
                  </div>

                  <div className={`border border-dashed rounded-xl p-3 bg-[#F8F4ED] dark:bg-[#1A1118] flex items-center justify-between text-xs ${uploadTouched && !uploadedFileName ? 'border-[#EB317A]' : 'border-[#EDE6D9] dark:border-[#C9A84C]/15'}`}>
                    <div className="flex items-center gap-2">
                      {uploadedFileName ? <File className="h-5 w-5 text-[#EB317A]" /> : <Upload className="h-5 w-5 text-gray-400" />}
                      <div>
                        <p className="font-bold text-gray-700 dark:text-gray-300">{uploadedFileName || t('payment.upload-slip')}</p>
                        <p className="text-[10px] text-gray-400">{uploadedFileName ? 'File selected' : 'Upload receipt (required)'}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white dark:bg-[#120A0E] border border-[#EDE6D9] dark:border-[#C9A84C]/10 rounded-md px-2 py-1 font-semibold text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1A1118] text-[10px]">
                      {t('payment.choose')}
                    </button>
                    <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                </div>
              </div>
            )}

            {(showPaymentForm || userGender === 'Female') && (
            <button type="submit" disabled={submitting} className="w-full py-3.5 bg-[#EB317A] hover:bg-[#F04B8E] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#EB317A]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0">
              {submitting ? (
                <span>{t('payment.verifying')}</span>
              ) : userGender === 'Female' ? (
                <>
                  <span>{t('payment.verify-free')}</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              ) : (
                <>
                  <span>Submit Payment for Review</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
