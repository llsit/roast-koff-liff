'use client';

import React, { useState } from 'react';
import { useCart, CartItem } from './CartProvider';

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
  
  if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg w-full max-w-md relative animate-fadeIn overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-6 pb-3" style={{ borderBottom: `2px solid ${backgroundColor}` }}>
            <h2 className="text-xl font-bold" style={{ color: primaryColor }}>ตะกร้าสินค้า</h2>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full"
              style={{ backgroundColor: backgroundColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={primaryColor}>
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="text-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke={accentColor}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg" style={{ color: primaryColor }}>ตะกร้าของคุณว่างเปล่า</p>
            <button 
              onClick={onClose}
              className="mt-6 px-5 py-2 text-white rounded-md transition-colors font-medium"
              style={{ backgroundColor: primaryColor, boxShadow: `0 2px 0 ${accentColor}` }}
            >
              เลือกเครื่องดื่ม
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative animate-fadeIn overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 pb-3" style={{ borderBottom: `2px solid ${backgroundColor}` }}>
          <h2 className="text-xl font-bold" style={{ color: primaryColor }}>ตะกร้าสินค้า</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full"
            style={{ backgroundColor: backgroundColor }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={primaryColor}>
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <CartItemCard 
              key={item.id} 
              item={item} 
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              accentColor={accentColor}
              backgroundColor={backgroundColor}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>
        
        <div className="p-4 rounded-md mb-6" style={{ backgroundColor }}>
          <div className="flex justify-between items-center">
            <span className="font-semibold" style={{ color: primaryColor }}>ราคารวมทั้งหมด:</span>
            <span className="text-xl font-bold" style={{ color: primaryColor }}>{getTotalPrice()} บาท</span>
          </div>
        </div>
        
        <div className="flex justify-between gap-3 mt-6">
          <button
            onClick={clearCart}
            className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors font-medium"
            style={{ color: primaryColor }}
          >
            ล้างตะกร้า
          </button>
          <button
            onClick={() => alert('ดำเนินการชำระเงิน')}
            className="px-5 py-2 text-white rounded-md transition-colors font-medium"
            style={{ backgroundColor: primaryColor, boxShadow: `0 2px 0 ${accentColor}` }}
          >
            ชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );
}

interface CartItemCardProps {
  item: CartItem;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
}

function CartItemCard({
  item,
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundColor,
  updateQuantity,
  removeFromCart
}: CartItemCardProps) {
  return (
    <div className="p-4 border rounded-lg" style={{ borderColor: secondaryColor }}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold" style={{ color: primaryColor }}>{item.item.name}</h3>
          <p className="text-sm" style={{ color: accentColor }}>{item.item.englishName}</p>
          
          <div className="mt-2 text-sm">
            <p><span className="font-medium">ประเภท:</span> {item.drinkType.name}</p>
            
            {item.toppings.length > 0 && (
              <p><span className="font-medium">Toppings:</span> {item.toppings.map(t => t.name).join(', ')}</p>
            )}
            
            {item.strength && (
              <p><span className="font-medium">ความเข้ม:</span> {item.strength.name}</p>
            )}
            
            {item.note && (
              <p><span className="font-medium">หมายเหตุ:</span> {item.note}</p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-bold" style={{ color: primaryColor }}>{item.totalPrice} บาท</p>
          
          <div className="flex items-center justify-end mt-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md"
              style={{ backgroundColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill={primaryColor}>
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            
            <span className="mx-2 w-6 text-center">{item.quantity}</span>
            
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md"
              style={{ backgroundColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill={primaryColor}>
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-sm mt-2 text-red-500 hover:text-red-700"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  );
}