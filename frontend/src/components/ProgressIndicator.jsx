import React from 'react';
import { Check, ShoppingBag, MapPin, CreditCard, Package } from 'lucide-react';

const ProgressIndicator = ({ 
  steps = [], 
  currentStep = 1,
  showIcons = true,
  showLabels = true,
  variant = 'default',
  onStepClick
}) => {
  const defaultSteps = [
    { id: 1, label: 'Cart', icon: <ShoppingBag size={18} />, description: 'Review items' },
    { id: 2, label: 'Delivery', icon: <MapPin size={18} />, description: 'Address & time' },
    { id: 3, label: 'Payment', icon: <CreditCard size={18} />, description: 'Payment method' },
    { id: 4, label: 'Confirm', icon: <Package size={18} />, description: 'Order review' },
  ];

  const stepsToUse = steps.length > 0 ? steps : defaultSteps;
  const totalSteps = stepsToUse.length;

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getVariantClasses = (status) => {
    const baseClasses = {
      default: {
        completed: 'bg-gradient-to-r from-brand-primary to-brand-teal text-white',
        current: 'bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow text-white',
        upcoming: 'bg-gray-100 text-gray-400'
      },
      minimal: {
        completed: 'bg-green-100 text-green-600',
        current: 'bg-blue-100 text-blue-600',
        upcoming: 'bg-gray-100 text-gray-400'
      },
      colorful: {
        completed: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
        current: 'bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow text-white',
        upcoming: 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500'
      }
    };

    return baseClasses[variant]?.[status] || baseClasses.default[status];
  };

  const getConnectionColor = (stepId) => {
    if (stepId < currentStep) {
      return variant === 'colorful' 
        ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
        : 'bg-green-500';
    }
    return 'bg-gray-200';
  };

  return (
    <div className="w-full">
      {/* Steps container */}
      <div className="flex items-center justify-between relative">
        {/* Connection lines */}
        <div className="absolute top-5 left-0 right-0 h-1 -translate-y-1/2 z-0">
          <div className="flex h-full">
            {stepsToUse.slice(0, -1).map((_, index) => (
              <div key={index} className="flex-1 h-full">
                <div 
                  className={`h-full transition-all duration-500 ${getConnectionColor(index + 1)}`}
                  style={{ 
                    width: index + 1 < currentStep ? '100%' : '0%',
                    transitionDelay: `${index * 100}ms`
                  }}
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gray-200 -z-10" />
        </div>

        {/* Steps */}
        {stepsToUse.map((step, index) => {
          const status = getStepStatus(step.id);
          const isClickable = onStepClick && step.id <= currentStep;

          return (
            <div 
              key={step.id} 
              className="flex flex-col items-center relative z-10"
              style={{ width: `${100 / totalSteps}%` }}
            >
              {/* Step circle */}
              <button
                onClick={isClickable ? () => onStepClick(step.id) : undefined}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 transform hover:scale-110 active:scale-95 ${getVariantClasses(status)} ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                disabled={!isClickable}
              >
                {status === 'completed' ? (
                  <Check size={20} className="text-white" />
                ) : (
                  <div className="flex items-center justify-center">
                    {showIcons && step.icon}
                    {!showIcons && (
                      <span className="font-bold">{step.id}</span>
                    )}
                  </div>
                )}
              </button>

              {/* Step labels */}
              {showLabels && (
                <div className="mt-4 text-center">
                  <div className={`text-sm font-bold transition-colors duration-300 ${
                    status === 'completed' ? 'text-green-600' :
                    status === 'current' ? 'text-brand-vibrant-orange' :
                    'text-gray-400'
                  }`}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 mt-1 hidden md:block">
                      {step.description}
                    </div>
                  )}
                </div>
              )}

              {/* Current step indicator */}
              {status === 'current' && (
                <div className="absolute -bottom-2 w-4 h-1 bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow rounded-full animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress percentage (optional) */}
      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow rounded-full transition-all duration-700"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-gray-700">
            {Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)}%
          </span>
        </div>
      </div>

      {/* Step instructions */}
      {stepsToUse.find(step => step.id === currentStep)?.instructions && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-r from-brand-vibrant-blue to-brand-smoothies p-2 rounded-lg">
              <Info size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {stepsToUse.find(step => step.id === currentStep)?.instructions}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Multi-step form wrapper
export const MultiStepForm = ({ children, currentStep, totalSteps, onNext, onBack, canProceed = true }) => {
  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={currentStep} variant="colorful" />
      
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-lg">
        {children}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={currentStep === 1}
          className={`px-8 py-3 rounded-xl font-bold transition-all ${currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}
        >
          ← Back
        </button>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </span>
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${canProceed ? 'bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow text-white hover:shadow-lg hover:-translate-y-0.5 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            {currentStep === totalSteps ? 'Complete Order' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Step completion animation
export const StepCompletionAnimation = ({ isComplete = false }) => {
  if (!isComplete) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in duration-300">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-700">
          <Check size={40} className="text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Step Complete! 🎉</h3>
        <p className="text-gray-600 mb-6">Great job! Ready to move to the next step?</p>
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;