"use client";

import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import type { RootState } from '../features/store';
import { setCategory, setSearch, setSort } from '../features/products/productsSlice';
import styles from '../styles/FilterBar.module.scss';

// Icons using SVG paths
const SearchIcon = () => (
  <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="11" cy="11" r="8"/>
    <path d="21 21l-4.35-4.35"/>
  </svg>
);

const FilterIcon = () => (
  <svg className={styles.filterIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const SortIcon = () => (
  <svg className={styles.sortIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M3 6h18M7 12h10m-7 6h4"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const XIcon = () => (
  <svg className={styles.clearIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const sortOptions = [
  { value: 'relevance', label: 'Best Match' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'newest', label: 'Newest First' },
];

export default function FilterBar() {
  const dispatch = useDispatch();
  const filter = useSelector((state: any) => state.products.filter);
  const allProducts = useSelector((state: any) => state.products.items);
  const [showFilters, setShowFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Dynamically generate categories from products with counts
  const uniqueCategories = Array.from(new Set(allProducts.map((p: any) => p.category as string)))
    .filter(Boolean) as string[];
  
  const categories: Array<{ value: string; label: string; count: number }> = [
    { value: 'all', label: 'All Categories', count: allProducts.length },
    ...uniqueCategories
      .map((categoryName: string) => ({
        value: categoryName,
        label: categoryName,
        count: allProducts.filter((p: any) => p.category === categoryName).length
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  ];

  const handleClearSearch = () => {
    dispatch(setSearch(''));
  };

  const handleClearFilters = () => {
    dispatch(setCategory('all'));
    dispatch(setSearch(''));
    dispatch(setSort('relevance'));
  };

  const hasActiveFilters = filter.category !== 'all' || filter.search || filter.sort !== 'relevance';

  return (
    <div className={styles.filterContainer}>
      {/* Header Section */}
      <div className={styles.filterHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Discover Products</h1>
          <p className={styles.pageSubtitle}>Find exactly what you're looking for</p>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon />
            Filters
            {hasActiveFilters && <span className={styles.filterBadge} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`${styles.searchSection} ${searchFocused ? styles.focused : ''}`}>
        <div className={styles.searchContainer}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search for products, brands, or categories..."
            value={filter.search}
            onChange={e => dispatch(setSearch(e.target.value))}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={styles.searchInput}
          />
          {filter.search && (
            <button onClick={handleClearSearch} className={styles.clearButton}>
              <XIcon />
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <div className={`${styles.filterPanel} ${showFilters ? styles.visible : ''}`}>
        <div className={styles.filterGrid}>
          {/* Categories Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              <FilterIcon />
              Category
            </label>
            <div className={styles.categoryGrid}>
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => dispatch(setCategory(cat.value))}
                  className={`${styles.categoryButton} ${
                    filter.category === cat.value ? styles.active : ''
                  }`}
                >
                  {cat.label}
                  {cat.count !== null && <span className={styles.count}>({cat.count})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              <SortIcon />
              Sort By
            </label>
            <div className={styles.customSelect}>
              <select 
                value={filter.sort} 
                onChange={e => dispatch(setSort(e.target.value as any))}
                className={styles.sortSelect}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon />
            </div>
          </div>
        </div>

        {/* Active Filters & Clear */}
        {hasActiveFilters && (
          <div className={styles.activeFiltersSection}>
            <div className={styles.activeFilters}>
              <span className={styles.activeFiltersLabel}>Active filters:</span>
              <div className={styles.filterTags}>
                {filter.category !== 'all' && (
                  <span className={styles.filterTag}>
                    Category: {categories.find(c => c.value === filter.category)?.label}
                    <button onClick={() => dispatch(setCategory('all'))}>
                      <XIcon />
                    </button>
                  </span>
                )}
                {filter.search && (
                  <span className={styles.filterTag}>
                    Search: "{filter.search}"
                    <button onClick={handleClearSearch}>
                      <XIcon />
                    </button>
                  </span>
                )}
                {filter.sort !== 'relevance' && (
                  <span className={styles.filterTag}>
                    Sort: {sortOptions.find(s => s.value === filter.sort)?.label}
                    <button onClick={() => dispatch(setSort('relevance'))}>
                      <XIcon />
                    </button>
                  </span>
                )}
              </div>
            </div>
            <button onClick={handleClearFilters} className={styles.clearAllButton}>
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
