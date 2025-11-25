import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle, AlertCircle, Loader2, Smartphone, FileImage, Truck, Clock, ChevronRight, ChevronLeft, ShoppingBag } from 'lucide-react';
import { analyzeReceipt } from '../services/geminiService';
import { PaymentStatus, CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number; // This is the subtotal
  onPaymentSuccess: () => void;
}

const SHIPPING_OPTIONS = [
  { id: 'standard', name: 'Standard Shipping', price: 5.99, duration: '5-7 business days' },
  { id: 'express', name: 'Express Shipping', price: 14.99, duration: '1-2 business days' },
];

const STEPS = [
  { id: 1, name: 'Shipping' },
  { id: 2, name: 'Payment' },
  { id: 3, name: 'Review' },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, totalAmount, onPaymentSuccess }) => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [selectedShippingId, setSelectedShippingId] = useState<string>(SHIPPING_OPTIONS[0].id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const selectedShipping = SHIPPING_OPTIONS.find(opt => opt.id === selectedShippingId) || SHIPPING_OPTIONS[0];
  const finalTotal = totalAmount + selectedShipping.price;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
      setErrorMessage('');
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!phoneNumber || !receiptFile) {
      setErrorMessage("Please provide both phone number and receipt.");
      return;
    }

    setStatus(PaymentStatus.ANALYZING);
    
    try {
      const base64Img = await convertFileToBase64(receiptFile);
      const analysis = await analyzeReceipt(base64Img);

      if (analysis.isValid) {
        setAiSummary(analysis.summary);
        
        const newOrder: Order = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          items: cartItems,
          total: finalTotal,
          status: 'Verified',
          receiptSummary: analysis.summary,
          shippingMethod: selectedShipping.name,
          shippingCost: selectedShipping.price
        };

        const existingOrders = JSON.parse(localStorage.getItem('stylehive_orders') || '[]');
        localStorage.setItem('stylehive_orders', JSON.stringify([newOrder, ...existingOrders]));

        setStatus(PaymentStatus.SUCCESS);
        onPaymentSuccess();
      } else {
        setAiSummary(analysis.summary);
        setErrorMessage("The uploaded image does not appear to be a valid receipt.");
        setStatus(PaymentStatus.ERROR);
      }
    } catch (error) {
      setErrorMessage("An error occurred during verification. Please try again.");
      setStatus(PaymentStatus.ERROR);
    }
  };

  const handleNext = () => {
    setErrorMessage('');
    if (step === 2) {
      if (!phoneNumber || !receiptFile) {
        setErrorMessage("Please enter your phone number and upload the receipt to continue.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setErrorMessage('');
    setStep(prev => prev - 1);
  };

  const renderShippingStep = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-stone-900">Select Shipping Method</h4>
      <div className="grid grid-cols-1 gap-3">
        {SHIPPING_OPTIONS.map((option) => (
          <div 
            key={option.id}
            onClick={() => setSelectedShippingId(option.id)}
            className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-colors ${
              selectedShippingId === option.id 
                ? 'border-stone-900 ring-1 ring-stone-900 bg-stone-50' 
                : 'border-stone-200 bg-white hover:bg-stone-50'
            }`}
          >
            <span className="flex flex-1">
              <span className="flex flex-col">
                <span className="block text-sm font-medium text-stone-900">{option.name}</span>
                <span className="mt-1 flex items-center text-sm text-stone-500">
                  <Clock size={12} className="mr-1" /> {option.duration}
                </span>
              </span>
            </span>
            <span className="mt-0.5 text-sm font-medium text-stone-900">+${option.price.toFixed(2)}</span>
            <div className={`absolute top-4 right-4 h-4 w-4 rounded-full border flex items-center justify-center ${
                 selectedShippingId === option.id ? 'border-stone-900' : 'border-stone-300'
            }`}>
                {selectedShippingId === option.id && <div className="h-2 w-2 rounded-full bg-stone-900" />}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-stone-50 p-4 rounded-md mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-stone-600">Current Subtotal</span>
            <span className="font-medium">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-stone-600">Estimated Total</span>
            <span className="font-bold text-stone-900">${finalTotal.toFixed(2)}</span>
          </div>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
       <div className="bg-stone-50 p-4 rounded-md border border-stone-200">
          <h4 className="font-medium text-stone-900 mb-2 text-xs uppercase tracking-wider">Bank Transfer Details</h4>
          <p className="text-sm text-stone-600 mb-1">Please transfer <span className="font-bold text-stone-900">${finalTotal.toFixed(2)}</span> to:</p>
          <div className="bg-white p-3 rounded border border-stone-100 mt-2">
              <p className="text-sm text-stone-600">Bank: <span className="font-semibold text-stone-900">StyleHive Global Bank</span></p>
              <p className="text-sm text-stone-600">Account: <span className="font-semibold text-stone-900">1234-5678-9012</span></p>
              <p className="text-sm text-stone-600">Ref: <span className="font-semibold text-stone-900">ORD-{Date.now().toString().slice(-6)}</span></p>
          </div>
      </div>

      <div>
          <label htmlFor="phone" className="block text-sm font-medium leading-6 text-stone-900">
              Phone Number
          </label>
          <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Smartphone className="h-5 w-5 text-stone-400" aria-hidden="true" />
              </div>
              <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="block w-full rounded-md border-0 py-2.5 pl-10 text-stone-900 ring-1 ring-inset ring-stone-300 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
                  placeholder="+1 (555) 987-6543"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
              />
          </div>
      </div>

      <div>
          <label className="block text-sm font-medium leading-6 text-stone-900">
              Upload Payment Receipt
          </label>
          <div 
              className={`mt-2 flex justify-center rounded-lg border border-dashed border-stone-900/25 px-6 py-8 hover:bg-stone-50 transition-colors cursor-pointer ${receiptFile ? 'bg-stone-50 border-stone-400' : ''}`}
              onClick={() => fileInputRef.current?.click()}
          >
              <div className="text-center">
                  {receiptFile ? (
                      <>
                          <FileImage className="mx-auto h-10 w-10 text-stone-600" aria-hidden="true" />
                          <div className="mt-2 flex text-sm leading-6 text-stone-600 justify-center">
                              <span className="font-semibold text-stone-900">{receiptFile.name}</span>
                          </div>
                          <p className="text-xs text-stone-500 mt-1">Click to change file</p>
                      </>
                  ) : (
                      <>
                          <Upload className="mx-auto h-10 w-10 text-stone-300" aria-hidden="true" />
                          <div className="mt-2 flex text-sm leading-6 text-stone-600 justify-center">
                              <span className="relative cursor-pointer rounded-md font-semibold text-stone-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-stone-600 focus-within:ring-offset-2 hover:text-stone-500">
                                  <span>Upload receipt</span>
                              </span>
                          </div>
                          <p className="text-xs leading-5 text-stone-500">PNG, JPG up to 5MB</p>
                      </>
                  )}
                  <input 
                      ref={fileInputRef}
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only" 
                      accept="image/*"
                      onChange={handleFileChange}
                  />
              </div>
          </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
        <h4 className="text-lg font-medium text-stone-900">Review Your Order</h4>
        
        {/* Items Preview */}
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
             <div className="max-h-40 overflow-y-auto divide-y divide-stone-100">
                 {cartItems.map(item => (
                     <div key={item.id} className="flex gap-3 p-3">
                         <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover bg-stone-100" />
                         <div className="flex-1">
                             <p className="text-sm font-medium text-stone-900">{item.name}</p>
                             <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                         </div>
                         <p className="text-sm font-medium text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                     </div>
                 ))}
             </div>
        </div>

        {/* Info Check */}
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-stone-50 p-3 rounded border border-stone-100">
                <p className="text-xs text-stone-500 uppercase tracking-wide">Phone</p>
                <p className="font-medium text-stone-900 mt-1">{phoneNumber}</p>
            </div>
            <div className="bg-stone-50 p-3 rounded border border-stone-100">
                 <p className="text-xs text-stone-500 uppercase tracking-wide">Receipt</p>
                 <div className="flex items-center gap-1 mt-1">
                    <FileImage size={14} className="text-stone-500" />
                    <p className="font-medium text-stone-900 truncate max-w-[120px]">{receiptFile?.name}</p>
                 </div>
            </div>
        </div>

        {/* Cost Breakdown */}
        <div className="border-t border-stone-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-stone-600">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-600">
                <span>Shipping ({selectedShipping.name})</span>
                <span>${selectedShipping.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-stone-900">
                <span className="font-bold">Total Due</span>
                <span className="font-bold text-xl">${finalTotal.toFixed(2)}</span>
            </div>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold leading-6 text-stone-900 font-serif">Checkout</h3>
                <button onClick={onClose} className="text-stone-400 hover:text-stone-500">
                    <X size={24} />
                </button>
            </div>

            {status === PaymentStatus.SUCCESS ? (
               <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-300">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold text-stone-900">Order Confirmed!</h4>
                  <p className="text-stone-500 text-center mt-2 px-4">
                    We have received your receipt and are processing your order.<br/>
                    <span className="italic text-xs text-stone-400 mt-2 block">AI Analysis: "{aiSummary}"</span>
                  </p>
                  <button 
                    onClick={onClose}
                    className="mt-8 w-full rounded-md bg-stone-900 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stone-700 transition-colors"
                  >
                    Return to Home
                  </button>
               </div>
            ) : (
                <>
                  {/* Stepper */}
                  <div className="mb-8">
                      <div className="flex items-center justify-between relative max-w-xs mx-auto">
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-0.5 bg-stone-200 -z-10" />
                          {STEPS.map((s) => {
                              const isActive = s.id === step;
                              const isCompleted = s.id < step;
                              return (
                                  <div key={s.id} className="flex flex-col items-center bg-white px-2 z-10">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-medium transition-colors duration-300 ${
                                          isActive 
                                            ? 'border-stone-900 bg-stone-900 text-white' 
                                            : isCompleted 
                                              ? 'border-stone-900 bg-stone-900 text-white' 
                                              : 'border-stone-200 text-stone-400 bg-white'
                                      }`}>
                                          {isCompleted ? <CheckCircle size={14} /> : s.id}
                                      </div>
                                      <span className={`text-xs mt-1.5 font-medium transition-colors ${
                                          isActive ? 'text-stone-900' : 'text-stone-400'
                                      }`}>
                                          {s.name}
                                      </span>
                                  </div>
                              )
                          })}
                      </div>
                  </div>

                  {/* Body */}
                  <div className="min-h-[300px]">
                      {step === 1 && renderShippingStep()}
                      {step === 2 && renderPaymentStep()}
                      {step === 3 && renderReviewStep()}
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="mt-4 rounded-md bg-red-50 p-3 flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="ml-3 text-sm text-red-700">
                            <p>{errorMessage}</p>
                            {aiSummary && <p className="mt-1 italic text-xs">AI: {aiSummary}</p>}
                        </div>
                    </div>
                  )}

                  {/* Footer Buttons */}
                  <div className="mt-8 flex gap-3">
                      {step > 1 && (
                          <button
                            type="button"
                            onClick={handleBack}
                            disabled={status === PaymentStatus.ANALYZING}
                            className="flex-1 rounded-md border border-stone-300 bg-white px-3 py-3 text-sm font-semibold text-stone-900 shadow-sm hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 disabled:opacity-50"
                          >
                             <span className="flex items-center justify-center gap-2">
                                <ChevronLeft size={16} /> Back
                             </span>
                          </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={step === 3 ? handleSubmit : handleNext}
                        disabled={status === PaymentStatus.ANALYZING}
                        className={`flex-1 rounded-md px-3 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 disabled:opacity-70 disabled:cursor-not-allowed ${
                           step === 1 ? 'w-full' : ''
                        } ${status === PaymentStatus.ANALYZING ? 'bg-stone-700' : 'bg-stone-900 hover:bg-stone-700'}`}
                      >
                         {status === PaymentStatus.ANALYZING ? (
                            <span className="flex items-center justify-center gap-2">
                               <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                            </span>
                         ) : (
                            <span className="flex items-center justify-center gap-2">
                               {step === 3 ? `Pay $${finalTotal.toFixed(2)}` : 'Next'}
                               {step !== 3 && <ChevronRight size={16} />}
                            </span>
                         )}
                      </button>
                  </div>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
