'use client';

import { useState, useEffect } from 'react';
import { useCart } from './CartProvider';

interface CheckoutProps {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    onClose: () => void;
    onSuccess: () => void;
}

type CheckoutStep = 'info' | 'payment' | 'processing' | 'success';

export default function Checkout({
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    onClose,
    onSuccess
}: CheckoutProps) {
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('info');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errors, setErrors] = useState({
        fullName: '',
        phoneNumber: '',
    });
    const [referenceId, setReferenceId] = useState('');

    // Validate form
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            fullName: '',
            phoneNumber: '',
        };

        if (!fullName.trim()) {
            newErrors.fullName = 'กรุณากรอกชื่อ-นามสกุล';
            isValid = false;
        }

        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = 'กรุณากรอกเบอร์โทรศัพท์';
            isValid = false;
        } else if (!/^[0-9]{9,10}$/.test(phoneNumber.replace(/[-\s]/g, ''))) {
            newErrors.phoneNumber = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = () => {
        if (validateForm()) {
            setCurrentStep('payment');
        }
    };

    // Handle payment confirmation
    const handlePaymentConfirm = () => {
        setCurrentStep('processing');

        // Simulate payment processing
        setTimeout(() => {
            // Generate random reference ID
            const refId = 'REF' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
            setReferenceId(refId);
            setCurrentStep('success');
        }, 2000);
    };

    // Handle order completion
    const handleOrderComplete = () => {
        clearCart();
        onSuccess();
    };

    // Format price with comma separator
    const formatPrice = (price: number) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md relative overflow-y-auto max-h-[90vh] animate-fadeIn">
                {/* Header */}
                <div className="p-6 pb-3 border-b" style={{ borderColor: backgroundColor }}>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold" style={{ color: primaryColor }}>
                            {currentStep === 'info' && 'ข้อมูลการชำระเงิน'}
                            {currentStep === 'payment' && 'ชำระเงินด้วย PromptPay'}
                            {currentStep === 'processing' && 'กำลังดำเนินการ'}
                            {currentStep === 'success' && 'ชำระเงินสำเร็จ'}
                        </h2>
                        {currentStep !== 'processing' && currentStep !== 'success' && (
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full"
                                style={{ backgroundColor }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={primaryColor}>
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Step 1: Customer Information */}
                    {currentStep === 'info' && (
                        <>
                            {/* Order Summary */}
                            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor }}>
                                <h3 className="font-semibold mb-3" style={{ color: primaryColor }}>สรุปรายการสั่งซื้อ</h3>

                                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <div style={{ color: accentColor }}>
                                                <span>{item.quantity}x </span>
                                                <span>{item.item.name} ({item.drinkType.name})</span>
                                            </div>
                                            <div className="font-medium" style={{ color: primaryColor }}>
                                                ฿{formatPrice(item.totalPrice * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-3 border-t flex justify-between items-center" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                                    <span className="font-semibold" style={{ color: primaryColor }}>ยอดรวมทั้งสิ้น</span>
                                    <span className="text-xl font-bold" style={{ color: primaryColor }}>
                                        ฿{formatPrice(getTotalPrice())}
                                    </span>
                                </div>
                            </div>

                            {/* Customer Information Form */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3" style={{ color: primaryColor }}>ข้อมูลลูกค้า</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-1 text-sm" style={{ color: accentColor }}>ชื่อ-นามสกุล</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.fullName ? 'border-red-500' : ''}`}
                                            style={{ borderColor: errors.fullName ? '' : '#e5e7eb', color: '#000000' }}
                                            placeholder="กรอกชื่อ-นามสกุล"
                                        />
                                        {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm" style={{ color: accentColor }}>เบอร์โทรศัพท์</label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.phoneNumber ? 'border-red-500' : ''}`}
                                            style={{ borderColor: errors.phoneNumber ? '' : '#e5e7eb', color: '#000000' }}
                                            placeholder="กรอกเบอร์โทรศัพท์"
                                        />
                                        {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3" style={{ color: primaryColor }}>วิธีการชำระเงิน</h3>
                                <div className="border rounded-md p-4 flex items-center space-x-3" style={{ backgroundColor, borderColor: secondaryColor }}>
                                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-white flex items-center justify-center">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18 5H6C4.34315 5 3 6.34315 3 8V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16V8C21 6.34315 19.6569 5 18 5Z" stroke={primaryColor} strokeWidth="2" />
                                            <path d="M3 10H21" stroke={primaryColor} strokeWidth="2" />
                                            <path d="M7 15H9" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
                                            <path d="M15 15H17" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-medium" style={{ color: primaryColor }}>PromptPay</h4>
                                        <p className="text-sm" style={{ color: accentColor }}>สแกน QR Code เพื่อชำระเงิน</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 mr-2 bg-gray-200 rounded-md text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 text-white rounded-md font-medium transition-colors"
                                    style={{ backgroundColor: primaryColor, boxShadow: `0 2px 0 ${accentColor}` }}
                                >
                                    ดำเนินการต่อ
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 2: PromptPay Payment */}
                    {currentStep === 'payment' && (
                        <>
                            <div className="text-center mb-6">
                                <p className="mb-4" style={{ color: accentColor }}>
                                    กรุณาสแกน QR Code ด้านล่างเพื่อชำระเงิน
                                </p>

                                <div className="my-6 flex justify-center">
                                    <div className="border p-2 inline-block bg-white rounded-lg">
                                        <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                            {/* Simple QR code placeholder */}
                                            <rect x="0" y="0" width="100" height="100" fill="white" />
                                            <g fill="black">
                                                <rect x="10" y="10" width="30" height="30" />
                                                <rect x="15" y="15" width="20" height="20" fill="white" />
                                                <rect x="60" y="10" width="30" height="30" />
                                                <rect x="65" y="15" width="20" height="20" fill="white" />
                                                <rect x="10" y="60" width="30" height="30" />
                                                <rect x="15" y="65" width="20" height="20" fill="white" />
                                                <rect x="40" y="40" width="20" height="20" />
                                                <rect x="45" y="45" width="10" height="10" fill="white" />
                                                <rect x="70" y="50" width="10" height="10" />
                                                <rect x="50" y="70" width="10" height="10" />
                                                <rect x="70" y="70" width="10" height="10" />
                                                <rect x="80" y="50" width="10" height="10" />
                                                <rect x="50" y="80" width="10" height="10" />
                                                <rect x="40" y="60" width="10" height="10" />
                                                <rect x="60" y="40" width="10" height="10" />
                                            </g>
                                        </svg>
                                    </div>
                                </div>

                                <div className="py-3 px-4 rounded-md inline-block mb-4" style={{ backgroundColor }}>
                                    <div className="text-sm" style={{ color: accentColor }}>จำนวนเงินที่ต้องชำระ</div>
                                    <div className="text-xl font-bold" style={{ color: primaryColor }}>
                                        ฿{formatPrice(getTotalPrice())}
                                    </div>
                                </div>

                                <p className="text-sm mb-4" style={{ color: accentColor }}>
                                    พร้อมเพย์ชื่อ: ROAST KOFF CAFE
                                </p>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => setCurrentStep('info')}
                                    className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                                >
                                    ย้อนกลับ
                                </button>
                                <button
                                    onClick={handlePaymentConfirm}
                                    className="px-4 py-2 text-white rounded-md font-medium transition-colors"
                                    style={{ backgroundColor: primaryColor, boxShadow: `0 2px 0 ${accentColor}` }}
                                >
                                    ฉันชำระเงินแล้ว
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 3: Processing */}
                    {currentStep === 'processing' && (
                        <div className="text-center py-8">
                            <div className="inline-block w-16 h-16 mb-4">
                                <svg className="animate-spin w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke={accentColor} strokeWidth="4"></circle>
                                    <path className="opacity-75" fill={primaryColor} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <p className="text-lg font-medium mb-2" style={{ color: primaryColor }}>กำลังตรวจสอบการชำระเงิน</p>
                            <p style={{ color: accentColor }}>โปรดรอสักครู่...</p>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {currentStep === 'success' && (
                        <div className="text-center py-6">
                            <div
                                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(0, 200, 83, 0.1)' }}
                            >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12L10 17L20 7" stroke="#00C853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <h3 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>ชำระเงินสำเร็จ</h3>
                            <p className="mb-4" style={{ color: accentColor }}>ขอบคุณสำหรับการสั่งซื้อ</p>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6 mx-auto max-w-xs">
                                <div className="text-sm mb-2" style={{ color: accentColor }}>รหัสอ้างอิง</div>
                                <div className="font-mono font-bold" style={{ color: primaryColor }}>{referenceId}</div>
                            </div>

                            <p className="text-sm mb-6" style={{ color: accentColor }}>
                                เราจะส่งข้อความยืนยันการสั่งซื้อไปที่เบอร์โทรศัพท์ของคุณ
                            </p>

                            <button
                                onClick={handleOrderComplete}
                                className="px-6 py-2 text-white rounded-md font-medium transition-colors w-full"
                                style={{ backgroundColor: primaryColor, boxShadow: `0 2px 0 ${accentColor}` }}
                            >
                                กลับสู่หน้าหลัก
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}