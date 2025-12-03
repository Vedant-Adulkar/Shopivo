import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
    selectFilters,
    selectAvailableFilterOptions,
    selectActiveFilterCount,
    toggleCategoryFilter,
    setPriceRange,
    toggleBrandFilter,
    toggleTagFilter,
    clearFilters,
    fetchProducts,
    selectSearchQuery,
} from "../../store/slices/productsSlice";
import "./FilterSidebar.css";

export const FilterSidebar = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const filters = useSelector(selectFilters);
    const searchQuery = useSelector(selectSearchQuery);
    const { categories, brands, tags } = useSelector(selectAvailableFilterOptions);
    const activeFilterCount = useSelector(selectActiveFilterCount);

    const [priceInputs, setPriceInputs] = useState({
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
    });

    // Automatically fetch products when filters change
    useEffect(() => {
        dispatch(fetchProducts({ searchQuery, filters }));
    }, [filters, dispatch, searchQuery]);

    const handleCategoryToggle = (category) => {
        dispatch(toggleCategoryFilter(category));
    };

    const handleBrandToggle = (brand) => {
        dispatch(toggleBrandFilter(brand));
    };

    const handleTagToggle = (tag) => {
        dispatch(toggleTagFilter(tag));
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setPriceInputs(prev => ({ ...prev, [name]: value }));
    };

    const handlePriceApply = () => {
        dispatch(setPriceRange(priceInputs));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
        setPriceInputs({ minPrice: "", maxPrice: "" });
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div className="filter-overlay" onClick={onClose}></div>
            )}

            {/* Sidebar */}
            <aside className={`filter-sidebar ${isOpen ? "open" : ""}`}>
                {/* Header */}
                <div className="filter-header">
                    <div className="filter-title-wrapper">
                        <h2 className="filter-title">Filters</h2>
                        {activeFilterCount > 0 && (
                            <span className="filter-badge">{activeFilterCount}</span>
                        )}
                    </div>
                    <button className="filter-close-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* Clear All Button */}
                {activeFilterCount > 0 && (
                    <button className="clear-all-btn" onClick={handleClearFilters}>
                        Clear All Filters
                    </button>
                )}

                {/* Filter Sections */}
                <div className="filter-content">
                    {/* Price Range */}
                    <div className="filter-section">
                        <h3 className="filter-section-title">Price Range</h3>

                        <div className="price-slider-container">
                            {/* Compact Price Inputs */}
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">Min:</span>
                                    <input
                                        type="number"
                                        name="minPrice"
                                        min="0"
                                        max="10000"
                                        value={priceInputs.minPrice}
                                        onChange={(e) => {
                                            const value = Math.max(0, Math.min(10000, Number(e.target.value) || 0));
                                            const maxPrice = priceInputs.maxPrice || 10000;
                                            if (value <= maxPrice) {
                                                handlePriceChange(e);
                                            }
                                        }}
                                        onBlur={handlePriceApply}
                                        className="w-20 px-2 py-1 bg-slate-900/50 border border-white/10 rounded text-white text-sm focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">Max:</span>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        min="0"
                                        max="10000"
                                        value={priceInputs.maxPrice}
                                        onChange={(e) => {
                                            const value = Math.max(0, Math.min(10000, Number(e.target.value) || 0));
                                            const minPrice = priceInputs.minPrice || 0;
                                            if (value >= minPrice) {
                                                handlePriceChange(e);
                                            }
                                        }}
                                        onBlur={handlePriceApply}
                                        className="w-20 px-2 py-1 bg-slate-900/50 border border-white/10 rounded text-white text-sm focus:border-violet-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Integrated Range Slider */}
                            <div className="price-slider-wrapper">
                                <input
                                    type="range"
                                    name="minPrice"
                                    min="0"
                                    max="10000"
                                    step="10"
                                    value={priceInputs.minPrice || 0}
                                    onChange={handlePriceChange}
                                    onMouseUp={handlePriceApply}
                                    onTouchEnd={handlePriceApply}
                                    className="price-slider price-slider-min"
                                />
                                <input
                                    type="range"
                                    name="maxPrice"
                                    min="0"
                                    max="10000"
                                    step="10"
                                    value={priceInputs.maxPrice || 10000}
                                    onChange={handlePriceChange}
                                    onMouseUp={handlePriceApply}
                                    onTouchEnd={handlePriceApply}
                                    className="price-slider price-slider-max"
                                />
                            </div>

                            {/* Range Display */}
                            <div className="price-values mt-2">
                                <span className="price-value">${priceInputs.minPrice || 0}</span>
                                <span className="text-slate-500">—</span>
                                <span className="price-value">${priceInputs.maxPrice || 10000}</span>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    {categories.length > 0 && (
                        <div className="filter-section">
                            <h3 className="filter-section-title">Categories</h3>
                            <div className="filter-options">
                                {categories.map((category) => (
                                    <label key={category} className="filter-option">
                                        <input
                                            type="checkbox"
                                            checked={filters.categories.includes(category)}
                                            onChange={() => handleCategoryToggle(category)}
                                            className="filter-checkbox"
                                        />
                                        <span className="filter-label">{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Brands */}
                    {brands.length > 0 && (
                        <div className="filter-section">
                            <h3 className="filter-section-title">Brands</h3>
                            <div className="filter-options">
                                {brands.map((brand) => (
                                    <label key={brand} className="filter-option">
                                        <input
                                            type="checkbox"
                                            checked={filters.brands.includes(brand)}
                                            onChange={() => handleBrandToggle(brand)}
                                            className="filter-checkbox"
                                        />
                                        <span className="filter-label">{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="filter-section">
                            <h3 className="filter-section-title">Tags</h3>
                            <div className="filter-options">
                                {tags.slice(0, 10).map((tag) => (
                                    <label key={tag} className="filter-option">
                                        <input
                                            type="checkbox"
                                            checked={filters.tags.includes(tag)}
                                            onChange={() => handleTagToggle(tag)}
                                            className="filter-checkbox"
                                        />
                                        <span className="filter-label">{tag}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};
