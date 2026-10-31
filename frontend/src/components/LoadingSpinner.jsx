import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'primary', text = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-3',
    large: 'w-16 h-16 border-4',
    xlarge: 'w-24 h-24 border-4'
  };

  const colorClasses = {
    primary: 'border-primary border-t-transparent',
    white: 'border-white border-t-transparent',
    orange: 'border-brand-vibrant-orange border-t-transparent',
    blue: 'border-brand-vibrant-blue border-t-transparent',
    green: 'border-brand-vibrant-green border-t-transparent',
    gradient: 'border-transparent border-t-brand-vibrant-green border-r-brand-vibrant-lime border-b-brand-vibrant-teal border-l-brand-primary'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`} />
      {text && (
        <div className="text-center">
          <p className="text-gray-600 font-medium animate-pulse">{text}</p>
          {size === 'xlarge' && (
            <p className="text-gray-400 text-sm mt-2">Preparing your colorful experience...</p>
          )}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

// Loading overlay for specific sections
export const LoadingOverlay = ({ isLoading, children, overlay = true }) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {children}
      {overlay && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
          <LoadingSpinner size="medium" color="gradient" text="Loading content..." />
        </div>
      )}
    </div>
  );
};

// Skeleton loader for product cards
export const ProductCardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card h-full flex flex-col relative bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
          {/* Image skeleton */}
          <div className="relative overflow-hidden h-64 bg-gradient-to-r from-gray-100 to-gray-200">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>

          {/* Content skeleton */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="h-4 bg-gray-200 rounded-full w-1/3 mb-4" />
            <div className="h-6 bg-gray-200 rounded-full w-2/3 mb-3" />
            <div className="h-4 bg-gray-200 rounded-full w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded-full w-4/5 mb-4" />
            
            <div className="mt-auto">
              <div className="flex items-baseline justify-between mb-4">
                <div className="h-8 bg-gray-200 rounded-full w-1/4" />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-4 h-4 bg-gray-200 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Button skeleton */}
          <div className="px-6 pb-6 pt-0">
            <div className="w-full h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Loading states for different scenarios
export const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-vibrant-teal/5 via-brand-vibrant-green/5 to-brand-vibrant-lime/5">
    <div className="text-center">
      <LoadingSpinner size="xlarge" color="gradient" text="Loading FreshCart..." />
      <div className="mt-8 space-y-2">
        <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-64 mx-auto" />
        <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-48 mx-auto" />
        <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-56 mx-auto" />
      </div>
    </div>
  </div>
);

export default LoadingSpinner;