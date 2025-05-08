'use client';

import { useState, useEffect } from 'react';

interface Menu {
  category: string;
  items: any[];
}

interface NavBarProps {
  menus: Menu[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
}

export default function NavBar({
  menus,
  activeCategory,
  onCategoryClick,
  primaryColor = '#4B5563',
  secondaryColor = '#E5E7EB',
  accentColor = '#9CA3AF',
  backgroundColor = '#FFFFFF'
}: NavBarProps) {
  
  const handleCategoryClick = (categoryId: string, event: React.MouseEvent) => {
    event.preventDefault();
    onCategoryClick(categoryId);
    
    // Smooth scroll to section
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-30 py-2 shadow-md bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 pt-4">
        <ul className="flex space-x-3 md:space-x-4 overflow-x-auto py-2 px-2 max-w-full no-scrollbar">
          {menus.map((menu, idx) => {
            const categoryId = `menu-${idx}`;
            const isActive = activeCategory === categoryId;

            return (
              <li key={idx} className="flex-shrink-0">
                <a
                  id={`nav-${categoryId}`}
                  href={`#${categoryId}`}
                  onClick={(e) => handleCategoryClick(categoryId, e)}
                  className={`px-3 py-2 rounded-lg text-sm md:text-base font-medium whitespace-nowrap transition-all duration-200 flex items-center ${
                    isActive 
                      ? 'bg-gray-100 text-gray-800 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  {/* Coffee icon for coffee categories */}
                  {menu.category.includes('กาแฟ') && (
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 13.846 4.632 15 6 15h10a1 1 0 000-2H6l.39-.39 2.3-2.3h5.379l-.319 1.277a1.002 1.002 0 00.15.917A.998.998 0 0015 13h1a1 1 0 100-2h-.078L13.65 4.5H16a1 1 0 100-2H3zm2.5 5.9l1-4h9l-1 4H5.5z" />
                    </svg>
                  )}

                  {/* Tea icon for tea categories */}
                  {menu.category.includes('ชา') && (
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a3 3 0 11-6 0 3 3 0 016 0zm-1 11a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
                    </svg>
                  )}

                  {/* Default drink icon for other categories */}
                  {!menu.category.includes('กาแฟ') && !menu.category.includes('ชา') && (
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" />
                    </svg>
                  )}

                  {menu.category}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}