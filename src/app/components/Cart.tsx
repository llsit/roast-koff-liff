'use client';

import { useState } from 'react';
import { useCart, CartItem } from './CartProvider';
import Checkout from './Checkout';

interface CartProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  onClose: () => void;
}

export default function Cart({
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundColor,
  onClose
}: CartProps) {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // Format price with comma separator
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle checkout success
  const handleCheckoutSuccess = () => {
    setIsCheckoutOpen(false);
    setShowOrderSuccess(true);
    
    // Automatically close the success message after 3 seconds
    setTimeout(() => {
      setShowOrderSuccess(false);
      onClose();
    }, 3000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      <div 
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50 flex flex-col animate-fadeIn"
        style={{ backgroundColor: 'white' }}
      >
        {/* Cart header */}
        <div className="p-5 border-b sticky top-0 bg-white z-10" style={{ borderColor: backgroundColor }}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold" style={{ color: primaryColor }}>ตะกร้าสินค้า</h2>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill={primaryColor}>
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cart content */}
        <div className="flex-1 overflow-y-auto p-5">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke={accentColor}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg font-medium mb-2" style={{ color: primaryColor }}>ตะกร้าว่างเปล่า</p>
              <p className="text-center mb-6" style={{ color: accentColor }}>เลือกเครื่องดื่มที่คุณชื่นชอบและเพิ่มลงตะกร้า</p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-white rounded-md transition-colors font-medium"
                style={{ backgroundColor: primaryColor, boxShadow: `0 2px 0 ${accentColor}` }}
              >
                เลือกเครื่องดื่ม
              </button>
            </div>
          ) : (
            <div>
              {/* Cart items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <CartItemComponent 
                    key={item.id} 
                    item={item} 
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    accentColor={accentColor}
                    backgroundColor={backgroundColor}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cart footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t sticky bottom-0 bg-white" style={{ borderColor: backgroundColor }}>
            {/* Total price */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold" style={{ color: primaryColor }}>ยอดรวม</span>
              <span className="text-xl font-bold" style={{ color: primaryColor }}>฿{formatPrice(getTotalPrice())}</span>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="px-4 py-2 border rounded-md font-medium flex-grow transition-colors"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                ล้างตะกร้า
              </button>
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="px-4 py-2 text-white rounded-md font-medium flex-grow transition-colors"
                style={{ backgroundColor: primaryColor, boxShadow: `0 2px 0 ${accentColor}` }}
              >
                ชำระเงิน
              </button>
            </div>
          </div>
        )}

        {/* Success message overlay */}
        {showOrderSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm text-center animate-fadeIn">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-100">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12L10 17L20 7" stroke="#00C853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>ขอบคุณสำหรับการสั่งซื้อ</h3>
              <p style={{ color: accentColor }}>การสั่งซื้อของคุณเสร็จสมบูรณ์แล้ว</p>
            </div>
          </div>
        )}
      </div>

      {/* Checkout modal */}
      {isCheckoutOpen && (
        <Checkout
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
          backgroundColor={backgroundColor}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </>
  );
}

interface CartItemComponentProps {
  item: CartItem;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
}

function CartItemComponent({
  item,
  updateQuantity,
  removeFromCart,
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundColor
}: CartItemComponentProps) {
  // Format price with comma separator
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="border rounded-lg p-4" style={{ borderColor: '#f0f0f0' }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-medium" style={{ color: primaryColor }}>{item.item.name}</h4>
          <p className="text-sm mb-1" style={{ color: accentColor }}>{item.drinkType.name}</p>
          
          {/* Display toppings if any */}
          {item.toppings.length > 0 && (
            <p className="text-xs" style={{ color: accentColor }}>
              Toppings: {item.toppings.map(t => t.name).join(', ')}
            </p>
          )}
          
          {/* Display coffee strength if applicable */}
          {item.strength && (
            <p className="text-xs" style={{ color: accentColor }}>
              ความเข้ม: {item.strength.name}
            </p>
          )}
          
          {/* Display notes if any */}
          {item.note && (
            <p className="text-xs italic mt-1" style={{ color: accentColor }}>
              หมายเหตุ: {item.note}
            </p>
          )}
        </div>
        
        <div className="text-right">
          <p className="font-medium" style={{ color: primaryColor }}>฿{formatPrice(item.totalPrice * item.quantity)}</p>
          <p className="text-xs" style={{ color: accentColor }}>฿{formatPrice(item.totalPrice)} × {item.quantity}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-1 rounded hover:bg-gray-100"
          aria-label="Remove item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={accentColor}>
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex items-center border rounded" style={{ borderColor: '#f0f0f0' }}>
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-2 py-1 text-lg font-medium"
            aria-label="Decrease quantity"
            style={{ color: accentColor }}
          >
            -
          </button>
          <span className="px-3 py-1 text-sm font-medium" style={{ color: primaryColor }}>
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-2 py-1 text-lg font-medium"
            aria-label="Increase quantity"
            style={{ color: accentColor }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}