'use client';

import { useState } from 'react';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import { DrinkOptionsProvider } from './components/DrinkOptionsProvider';
import { CartProvider, useCart } from './components/CartProvider';
import { colors } from './theme';

function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  return (
    <main className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header with navigation */}
      <header className="sticky top-0 z-40 shadow-md" style={{ backgroundColor: colors.deepBrown }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.cream }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8H20M20 8C21.1046 8 22 8.89543 22 10V17C22 19.2091 20.2091 21 18 21H6C3.79086 21 2 19.2091 2 17V8M20 8V6C20 3.79086 18.2091 2 16 2H8C5.79086 2 4 3.79086 4 6V8"
                  stroke={colors.deepBrown} strokeWidth="2" strokeLinecap="round" />
                <path d="M9 13V16M15 13V16" stroke={colors.deepBrown} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.cream }}>
              ROAST KOFF
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="p-2 relative"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={colors.cream}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" style={{ backgroundColor: colors.lightBrown }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <div className="rounded-lg p-6 mb-8 shadow-sm" style={{ backgroundColor: colors.cream }}>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.deepBrown }}>สั่งเครื่องดื่มโดย ROAST KOFF</h2>
          <p style={{ color: colors.mediumBrown }}>เลือกเครื่องดื่มที่คุณชื่นชอบและเพิ่มลงตะกร้า</p>
        </div>

        <DrinkOptionsProvider>
          <MenuList
            primaryColor={colors.deepBrown}
            secondaryColor={colors.lightBrown}
            accentColor={colors.mediumBrown}
            backgroundColor={colors.cream}
          />
        </DrinkOptionsProvider>
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <Cart
          primaryColor={colors.deepBrown}
          secondaryColor={colors.lightBrown}
          accentColor={colors.mediumBrown}
          backgroundColor={colors.cream}
          onClose={() => setIsCartOpen(false)}
        />
      )}

      {/* Footer */}
      <footer style={{ backgroundColor: colors.deepBrown }} className="text-white py-6 mt-10">
        <div className="container mx-auto px-4 text-center">
          <p style={{ color: colors.cream }}>© 2025 ROAST KOFF - ติดต่อเรา: 062-XXX-XXXX</p>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <HomePage />
    </CartProvider>
  );
}