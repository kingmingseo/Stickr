import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { getCategoryLabels } from '../constants/categories';

// Context 타입 정의
interface FilterContextType {
  selectedCategory: string;
  sortBy: 'recent' | 'popular';
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: 'recent' | 'popular') => void;
}

// Context 생성
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Context 사용을 위한 훅
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

// Provider 컴포넌트
export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const language = useLanguageStore((state) => state.language);
  const initialCategory = getCategoryLabels(language)[0]; // '전체' 또는 'All'
  
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const value: FilterContextType = {
    selectedCategory,
    sortBy,
    setSelectedCategory,
    setSortBy,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};
