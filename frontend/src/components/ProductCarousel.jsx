import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductCarousel = ({ products, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [itemsPerScreen, setItemsPerScreen] = useState(4);

    // Responsive items per screen
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerScreen(1);
            else if (window.innerWidth < 1024) setItemsPerScreen(2);
            else setItemsPerScreen(4);
        };

        handleResize(); // Set initial
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-advance
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, isPaused, itemsPerScreen, products.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + 1 >= products.length - itemsPerScreen + 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? products.length - itemsPerScreen : prevIndex - 1
        );
    };

    // Ensure we don't scroll past the end
    const maxIndex = Math.max(0, products.length - itemsPerScreen);
    const effectiveIndex = Math.min(currentIndex, maxIndex);

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="overflow-hidden rounded-xl py-4">
                <div
                    className="flex transition-transform duration-500 ease-in-out gap-6"
                    style={{ transform: `translateX(-${effectiveIndex * (100 / itemsPerScreen)}%)` }}
                >
                    {products.map((product) => (
                        <div
                            key={product._id || product.id}
                            className="flex-shrink-0"
                            style={{ width: `calc(${100 / itemsPerScreen}% - ${(24 * (itemsPerScreen - 1)) / itemsPerScreen}px)` }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-3 rounded-full shadow-lg text-gray-700 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-0 z-10 disabled:opacity-50"
                disabled={effectiveIndex === 0 && false} // Loop enabled
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-3 rounded-full shadow-lg text-gray-700 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-0 z-10"
            >
                <ChevronRight size={24} />
            </button>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: Math.ceil(products.length / itemsPerScreen) }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx * itemsPerScreen)}
                        className={`w-2 h-2 rounded-full transition-all ${Math.floor(effectiveIndex / itemsPerScreen) === idx
                            ? 'bg-primary w-6'
                            : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductCarousel;
