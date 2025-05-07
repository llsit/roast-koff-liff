'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PriceItem {
  name: string;
  price: number;
}

interface DrinkOptions {
  drinkTypes: {
    regular: PriceItem[];
    soda: PriceItem[];
  };
  sweetness: PriceItem[];
  toppings: PriceItem[];
  coffeeStrength: PriceItem[];
}

interface DrinkOptionsContextType {
  options: DrinkOptions | null;
  isLoading: boolean;
  error: string | null;
  getDrinkTypeOptions: (category: string) => PriceItem[];
}

const DrinkOptionsContext = createContext<DrinkOptionsContextType>({
  options: null,
  isLoading: true,
  error: null,
  getDrinkTypeOptions: () => [],
});

export const usedrinkOptions = () => useContext(DrinkOptionsContext);

export const DrinkOptionsProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<DrinkOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/menu-options.json');
        if (!response.ok) {
          throw new Error('Failed to fetch options');
        }
        const data = await response.json();
        setOptions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error loading options:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const getDrinkTypeOptions = (category: string): PriceItem[] => {
    if (!options) return [];

    // Check if the category is "โซดา", if yes return soda options, otherwise return regular options
    return category === "โซดา" ? options.drinkTypes.soda : options.drinkTypes.regular;
  };

  return (
    <DrinkOptionsContext.Provider value={{ options, isLoading, error, getDrinkTypeOptions }}>
      {children}
    </DrinkOptionsContext.Provider>
  );
};