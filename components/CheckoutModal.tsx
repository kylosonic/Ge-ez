import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, CheckCircle, AlertCircle, Loader2, Smartphone, FileImage, Clock, ChevronRight, ChevronLeft, Mail } from 'lucide-react';
import { analyzeReceipt } from '../services/geminiService';
import { sendConfirmationEmail } from '../services/emailService';
import { PaymentStatus, CartItem, Order, User } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  onPaymentSuccess: () => void;
  user: User | null;
  onOpenLogin: () => void;
}

const SHIPPING_OPTIONS = [
  { id: 'standard', name: 'Standard Shipping', price: 5.99, minDays: 5, maxDays: 7 },
  { id: 'expedited', name: 'Expedited Shipping', price: 14.99, minDays: 2, maxDays: 3 },
];

const STEPS = [{ id: 1, name: 'Shipping' }, { id: 2, name: 'Payment' }, { id: 3, name: 'Review' }];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
    isOpen, onClose, cartItems, totalAmount, onPaymentSuccess, user, onOpenLogin
}) => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedShippingId, setSelectedShippingId] = useState(SHIPPING_OPTIONS[0].id);
  const [progress, setProgress] = useState(0);
  const [currentOrderId, setCurrentOrderId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentOrderId(Date.now().toString());
      setStep(1);
      setStatus(PaymentStatus.IDLE);
      setErrorMessage('');
      setSummary('');
      setProgress(0);
      setReceiptFile(null);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === PaymentStatus.ANALYZING) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + (prev < 40 ? 5 : 1) + Math.random() * 2, 90));
      }, 200);
    } else if (status === PaymentStatus.SUCCESS) {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [status]);

  if (!isOpen) return null;

  const selectedShipping = SHIPPING_OPTIONS.find(opt => opt.id === selectedShippingId) || SHIPPING_OPTIONS[0];
  const finalTotal = totalAmount + selectedShipping.price;

  const getEstimatedDelivery = (min: number, max: number) => {
    const d = new Date();
    d.setDate(d.getDate() + min);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
    });
  };

  const handleSubmit = async () => {
    const emailToUse = user?.email || guestEmail;
    if (!phoneNumber || !receiptFile || !emailToUse) {
      setErrorMessage("Please provide all required fields.");
      return;
    }

    setStatus(PaymentStatus.ANALYZING);
    
    try {
      const base64Img = await convertFileToBase64(receiptFile);
      const analysis = await analyzeReceipt(base64Img);

      if (analysis.isValid) {
        setSummary(analysis.summary);
        const newOrder: Order = {
          id: currentOrderId,
          date: new Date().toISOString(),
          userEmail: emailToUse,
          items: cartItems,
          total: finalTotal,
          status: 'Verified',
          receiptSummary: analysis.summary,
          shippingMethod: selectedShipping.name,
          shippingCost: selectedShipping.price
        };

        await sendConfirmationEmail(newOrder);
        const existingOrders = JSON.parse(localStorage.getItem('stylehive_orders') || '[]');
        localStorage.setItem('stylehive_orders', JSON.stringify([newOrder, ...existingOrders]));

        setStatus(PaymentStatus.SUCCESS);
        onPaymentSuccess();
      } else {
        setErrorMessage("Invalid receipt.");
        setStatus(PaymentStatus.ERROR);
      }
    } catch (error) {
      setErrorMessage("Upload failed. Please try again.");
      setStatus(PaymentStatus.ERROR);
    }
  };

  const renderShippingStep = () => (
    <div className="space-y-6">
      {!user && (
          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 mb-4 flex justify-between items-center">
             <span>Sign in to save this order.</span>
             <button onClick={onOpenLogin} className="font-semibold underline">Sign In</button>
          </div>
      )}
      <div className="space-y-3">
        {SHIPPING_OPTIONS.map((option) => (
          <div key={option.id} onClick={() => setSelectedShippingId(option.id)}
            className={`flex items-center cursor-pointer rounded-lg border p-4 transition-all ${selectedShippingId === option.id ? 'border-stone-900 ring-1 ring-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-300'}`}>
             <div className="flex-1">
                 <div className="flex justify-between font-medium text-stone-900">
                    <span>{option.name}</span>
                    <span>+${option.price.toFixed(2)}</span>
                 </div>
                 <p className="text-xs text-stone-500 mt-1">Est. Delivery: {getEstimatedDelivery(option.minDays, option.maxDays)}</p>
             </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-base font-medium text-stone-900 border-t pt-4">
        <span>Total</span>
        <span>${finalTotal.toFixed(2)}</span>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
       <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
          <p className="text-sm text-stone-600 mb-2">Transfer <span className="font-bold">${finalTotal.toFixed(2)}</span> to:</p>
          <div className="bg-white p-3 rounded border border-stone-200 text-sm">
              <div className="flex justify-between mb-1"><span>Bank:</span><span className="font-medium">Ge'ez Global Bank</span></div>
              <div className="flex justify-between mb-1"><span>Account:</span><span className="font-mono">1234-5678-9012</span></div>
              <div className="flex justify-between"><span>Ref:</span><span className="font-bold bg-yellow-50 px-1">ORD-{currentOrderId.slice(-6)}</span></div>
          </div>
      </div>
      <div className="space-y-4">
          {!user && (
            <input type="email" placeholder="Email Address" className="block w-full rounded-md border-stone-300 py-2 pl-3 border text-sm" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
          )}
          <input type="tel" placeholder="Phone Number" className="block w-full rounded-md border-stone-300 py-2 pl-3 border text-sm" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <div className="border border-dashed border-stone-300 rounded-lg p-6 text-center cursor-pointer hover:bg-stone-50" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mx-auto h-8 w-8 text-stone-400" />
              <p className="mt-2 text-sm text-stone-600">{receiptFile ? receiptFile.name : 'Upload Payment Receipt'}</p>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && setReceiptFile(e.target.files[0])} />
          </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden">
          {status === PaymentStatus.ANALYZING && (
            <div className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center p-4">
                <Loader2 className="h-10 w-10 text-stone-900 animate-spin mb-4" />
                <h3 className="text-lg font-bold text-stone-900">Processing Upload</h3>
                <p className="text-sm text-stone-500 mt-2 mb-6">Securing your transaction details...</p>
                <div className="w-full max-w-xs bg-stone-200 rounded-full h-2">
                    <div className="bg-stone-900 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif font-bold">Checkout</h3>
                <button onClick={onClose}><X className="text-stone-400" size={24}/></button>
            </div>

            {status === PaymentStatus.SUCCESS ? (
               <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h4 className="text-lg font-bold">Order Confirmed!</h4>
                  <p className="text-stone-500 text-sm mt-2">Confirmation sent to {user?.email || guestEmail}.</p>
                  <p className="text-xs text-stone-400 italic mt-4">Note: {summary}</p>
                  <button onClick={onClose} className="mt-6 w-full bg-stone-900 text-white py-3 rounded-md font-medium">Close</button>
               </div>
            ) : (
                <>
                  <div className="flex justify-center mb-6 gap-8">
                      {STEPS.map(s => (
                          <div key={s.id} className={`text-sm font-medium ${step === s.id ? 'text-stone-900 underline' : 'text-stone-400'}`}>{s.name}</div>
                      ))}
                  </div>
                  <div className="min-h-[300px]">
                      {step === 1 && renderShippingStep()}
                      {step === 2 && renderPaymentStep()}
                      {step === 3 && (
                          <div className="space-y-4">
                              <h4 className="font-medium">Review Order</h4>
                              <div className="bg-stone-50 p-3 rounded text-sm space-y-2">
                                  <div className="flex justify-between"><span>Contact:</span><span>{user?.email || guestEmail}</span></div>
                                  <div className="flex justify-between"><span>Receipt:</span><span>{receiptFile?.name}</span></div>
                                  <div className="flex justify-between font-bold pt-2 border-t border-stone-200"><span>Total Due:</span><span>${finalTotal.toFixed(2)}</span></div>
                              </div>
                          </div>
                      )}
                  </div>
                  {errorMessage && <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded flex items-center gap-2"><AlertCircle size={16}/>{errorMessage}</div>}
                  <div className="mt-6 flex gap-3">
                      {step > 1 && <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 border rounded-md font-medium">Back</button>}
                      <button onClick={step === 3 ? handleSubmit : () => setStep(s => s + 1)} className="flex-1 py-3 bg-stone-900 text-white rounded-md font-medium">
                        {step === 3 ? 'Confirm Order' : 'Next'}
                      </button>
                  </div>
                </>
            )}
          </div>
      </div>
    </div>
  );
};