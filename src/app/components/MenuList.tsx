'use client';

import { useEffect, useState } from 'react';
import { usedrinkOptions } from './DrinkOptionsProvider';
import { useCart } from './CartProvider';
import NavBar from './Navbar';

interface Item {
  name: string;
  englishName: string;
}

interface Menu {
  category: string;
  items: Item[];
}

interface PriceItem {
  name: string;
  price: number;
}

interface OrderItem {
  item: Item;
  category: string;
  drinkType: PriceItem | null;
  toppings: PriceItem[];
  sweet: PriceItem | null;
  strength: PriceItem | null;
  note: string;
  totalPrice: number;
}

interface MenuListProps {
  primaryColor: string;   // Deep brown
  secondaryColor: string; // Light brown
  accentColor: string;    // Medium brown
  backgroundColor: string; // Cream
}

export default function MenuList({
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundColor
}: MenuListProps) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  // Use the cart context
  const { addToCart } = useCart();

  // Use the context to get options
  const { options, isLoading, getDrinkTypeOptions } = usedrinkOptions();

  // State for selected options
  const [selectedDrinkType, setSelectedDrinkType] = useState<PriceItem | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<PriceItem[]>([]);
  const [selectedSweet, setSelectedSweet] = useState<PriceItem | null>(null);
  const [selectedStrength, setSelectedStrength] = useState<PriceItem | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Toast notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetch('/menu.json')
      .then((res) => res.json())
      .then((data) => {
        setMenus(data);
        if (data.length > 0) {
          setActiveCategory(`menu-0`); // Set first category as active by default
        }
      })
      .catch(error => console.error('Error loading menu data:', error));
  }, []);

  // Set active category based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Add offset for better detection

      // Find the currently visible section
      const sections = menus.map((_, idx) => {
        const element = document.getElementById(`menu-${idx}`);
        if (!element) return { id: `menu-${idx}`, top: 0, bottom: 0 };

        const rect = element.getBoundingClientRect();
        return {
          id: `menu-${idx}`,
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY
        };
      });

      for (const section of sections) {
        if (scrollPosition >= section.top && scrollPosition < section.bottom) {
          setActiveCategory(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menus]);

  useEffect(() => {
    // Calculate total price whenever selections change
    if (selectedDrinkType) {
      let price = selectedDrinkType.price;

      // Add toppings prices
      selectedToppings.forEach(topping => {
        price += topping.price;
      });

      setTotalPrice(price);
    } else {
      setTotalPrice(0);
    }
  }, [selectedDrinkType, selectedToppings]);

  useEffect(() => {
    // Set default values when a new item is selected
    if (selectedItem && options) {
      const drinkTypeOptions = getDrinkTypeOptions(selectedCategory);

      // Set default drink type (first option)
      if (drinkTypeOptions.length > 0) {
        setSelectedDrinkType(drinkTypeOptions[0]);
      }

      // Reset toppings
      setSelectedToppings([]);

      // Set default sweet (first option)
      if (options.sweetness.length > 0) {
        setSelectedSweet(options.sweetness[0]);
      }

      // Set default strength (first option for coffee)
      if (selectedCategory.includes('กาแฟ') && options.coffeeStrength.length > 0) {
        setSelectedStrength(options.coffeeStrength[0]);
      } else {
        setSelectedStrength(null);
      }

      // Reset note
      setNote('');
    }
  }, [selectedItem, options, selectedCategory, getDrinkTypeOptions]);

  const openModal = (item: Item, category: string) => {
    setSelectedItem(item);
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
    setNote('');
  };

  const handleDrinkTypeChange = (drinkType: PriceItem) => {
    setSelectedDrinkType(drinkType);
  };

  const handleToppingToggle = (topping: PriceItem) => {
    if (selectedToppings.some(t => t.name === topping.name)) {
      setSelectedToppings(selectedToppings.filter(t => t.name !== topping.name));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleSweetChange = (sweet: PriceItem) => {
    setSelectedSweet(sweet);
  };

  const handleStrengthChange = (strength: PriceItem) => {
    setSelectedStrength(strength);
  };

  const handleAddToCart = () => {
    if (!selectedItem || !selectedDrinkType) return;

    const cartItem = {
      item: selectedItem,
      category: selectedCategory,
      drinkType: selectedDrinkType,
      toppings: selectedToppings,
      sweet: selectedSweet,
      strength: selectedStrength,
      note: note,
      totalPrice: totalPrice
    };

    // Add to cart
    addToCart(cartItem);

    // Show toast notification
    setToastMessage(`เพิ่ม ${selectedItem.name} ลงในตะกร้าแล้ว`);
    setShowToast(true);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);

    // Close the modal after submission
    setIsModalOpen(false);
    setSelectedItem(null);
    setNote('');
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  if (isLoading || !options) {
    return (
      <div className="text-center py-8" style={{ color: primaryColor }}>
        <div className="flex justify-center items-center">
          <svg className="animate-spin h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke={accentColor} strokeWidth="4"></circle>
            <path className="opacity-75" fill={primaryColor} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>กำลังโหลด...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Using the extracted NavBar component */}
      <NavBar 
        menus={menus}
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        accentColor={accentColor}
        backgroundColor={backgroundColor}
      />

      {/* === Menu Sections === */}
      {menus.map((menu, index) => (
        <div id={`menu-${index}`} key={index} className="mb-10 pt-4 scroll-mt-20">
          <h2 className="text-xl font-bold mb-6 relative" style={{ color: primaryColor }}>
            <span className="inline-block border-b-2 pb-1" style={{ borderColor: secondaryColor }}>{menu.category}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menu.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-300" style={{ borderLeft: `3px solid ${secondaryColor}` }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium" style={{ color: primaryColor }}>{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.englishName}</p>
                  </div>
                  <button
                    onClick={() => openModal(item, menu.category)}
                    className="flex items-center gap-1 text-sm text-white px-3 py-1 rounded-md transition-colors duration-200"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span className="text-lg">+</span> เพิ่ม
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedItem && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative animate-fadeIn overflow-y-auto max-h-[90vh] shadow-xl">
            <div className="flex justify-between items-center mb-4 pb-3" style={{ borderBottom: `1px solid ${secondaryColor}` }}>
              <div>
                <h2 className="text-xl font-bold" style={{ color: primaryColor }}>{selectedItem.name}</h2>
                <small className="text-gray-500">{selectedItem.englishName}</small>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={primaryColor}>
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* ประเภทเครื่องดื่ม */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3" style={{ color: primaryColor }}>เลือกประเภทเครื่องดื่ม</h3>
              <div className="flex flex-wrap gap-2">
                {getDrinkTypeOptions(selectedCategory).map((option) => (
                  <label
                    key={option.name}
                    className={`flex items-center p-2 border rounded-md cursor-pointer hover:bg-gray-100`}
                    style={{
                      borderColor: selectedDrinkType?.name === option.name ? secondaryColor : '#e5e7eb',
                      backgroundColor: selectedDrinkType?.name === option.name ? backgroundColor : '#f9fafb'
                    }}
                  >
                    <input
                      type="radio"
                      name="drinkType"
                      checked={selectedDrinkType?.name === option.name}
                      onChange={() => handleDrinkTypeChange(option)}
                      className="mr-2"
                      style={{ accentColor: secondaryColor }}
                    />
                    <span style={{ color: primaryColor }}>{option.name} (+{option.price}฿)</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Toppings */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3" style={{ color: primaryColor }}>เลือก Toppings</h3>
              <div className="grid grid-cols-2 gap-2">
                {options.toppings.map((topping) => (
                  <label
                    key={topping.name}
                    className={`flex items-center p-2 border rounded-md cursor-pointer hover:bg-gray-100`}
                    style={{
                      borderColor: selectedToppings.some(t => t.name === topping.name) ? secondaryColor : '#e5e7eb',
                      backgroundColor: selectedToppings.some(t => t.name === topping.name) ? backgroundColor : '#f9fafb'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedToppings.some(t => t.name === topping.name)}
                      onChange={() => handleToppingToggle(topping)}
                      className="mr-2"
                      style={{ accentColor: secondaryColor }}
                    />
                    <span style={{ color: primaryColor }}>{topping.name} (+{topping.price}฿)</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ระดับความหวาน */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3" style={{ color: primaryColor }}>เลือกระดับความหวาน</h3>
              <div className="grid grid-cols-2 gap-2">
                {options.sweetness.map((sweet) => (
                  <label
                    key={sweet.name}
                    className={`flex items-center p-2 border rounded-md cursor-pointer hover:bg-gray-100`}
                    style={{
                      borderColor: selectedSweet?.name === sweet.name ? secondaryColor : '#e5e7eb',
                      backgroundColor: selectedSweet?.name === sweet.name ? backgroundColor : '#f9fafb'
                    }}
                  >
                    <input
                      type="radio"
                      name="coffeeSweet"
                      checked={selectedSweet?.name === sweet.name}
                      onChange={() => handleSweetChange(sweet)}
                      className="mr-2"
                      style={{ accentColor: secondaryColor }}
                    />
                    <span style={{ color: primaryColor }}>{sweet.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ความเข้ม - แสดงเฉพาะเมนูกาแฟ */}
            {selectedCategory.includes('กาแฟ') && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: primaryColor }}>เลือกระดับความเข้ม</h3>
                <div className="grid grid-cols-2 gap-2">
                  {options.coffeeStrength.map((strength) => (
                    <label
                      key={strength.name}
                      className={`flex items-center p-2 border rounded-md cursor-pointer hover:bg-gray-100`}
                      style={{
                        borderColor: selectedStrength?.name === strength.name ? secondaryColor : '#e5e7eb',
                        backgroundColor: selectedStrength?.name === strength.name ? backgroundColor : '#f9fafb'
                      }}
                    >
                      <input
                        type="radio"
                        name="coffeeStrength"
                        checked={selectedStrength?.name === strength.name}
                        onChange={() => handleStrengthChange(strength)}
                        className="mr-2"
                        style={{ accentColor: secondaryColor }}
                      />
                      <span style={{ color: primaryColor }}>{strength.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* หมายเหตุ */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3" style={{ color: primaryColor }}>หมายเหตุ</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="เพิ่มหมายเหตุ เช่น หวานน้อย ไม่ใส่น้ำแข็ง"
                className="w-full p-3 border rounded-md focus:outline-none"
                style={{
                  borderColor: '#e5e7eb',
                  boxShadow: 'none',
                  color: primaryColor,
                  backgroundColor: '#f9fafb'
                }}
                rows={3}
              />
            </div>

            {/* แสดงราคารวม */}
            <div className="p-4 rounded-md mb-6" style={{ backgroundColor }}>
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{ color: primaryColor }}>ราคารวม:</span>
                <span className="text-xl font-bold" style={{ color: primaryColor }}>{totalPrice} บาท</span>
              </div>
            </div>

            {/* ปุ่มกด */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors font-medium"
                style={{ color: primaryColor }}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddToCart}
                className="px-5 py-2 text-white rounded-md transition-colors font-medium"
                style={{ backgroundColor: primaryColor, boxShadow: `0 2px 0 ${accentColor}` }}
              >
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {showToast && (
        <div
          className="fixed bottom-4 right-4 px-4 py-3 rounded-md shadow-lg animate-fadeIn"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="white">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-white">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}