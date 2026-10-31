import React from 'react';

const ColorfulSection = ({ 
  children, 
  gradient = 'from-brand-vibrant-blue via-brand-vibrant-green to-brand-vibrant-lime',
  bgColor = 'bg-white',
  borderColor = 'border-gray-100',
  padding = 'py-12 px-6',
  rounded = 'rounded-3xl',
  shadow = 'shadow-xl',
  className = ''
}) => {
  return (
    <div className={`relative ${padding} ${rounded} ${shadow} ${borderColor} border overflow-hidden ${bgColor} ${className}`}>
      {/* Gradient background overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 pointer-events-none`} />
      
      {/* Animated gradient border */}
      <div className="absolute inset-0 border-2 border-transparent rounded-3xl pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-brand-vibrant-orange/10 to-brand-vibrant-yellow/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-brand-vibrant-green/10 to-brand-vibrant-lime/10 rounded-full blur-3xl" />
    </div>
  );
};

// Pre-styled colorful sections
export const ColorfulCard = ({ children, color = 'blue', ...props }) => {
  const gradients = {
    blue: 'from-brand-vibrant-blue to-brand-smoothies',
    orange: 'from-brand-vibrant-orange to-brand-vibrant-yellow',
    green: 'from-brand-primary via-brand-vibrant-green to-brand-vibrant-lime',
    lime: 'from-brand-vibrant-lime to-brand-vibrant-green',
    teal: 'from-brand-teal to-brand-vibrant-blue',
    fruits: 'from-brand-fruits to-brand-vibrant-orange',
    vegetables: 'from-brand-vegetables to-brand-teal',
    herbs: 'from-brand-herbs to-brand-vibrant-green',
    smoothies: 'from-brand-smoothies to-brand-vibrant-blue',
  };

  return (
    <ColorfulSection
      gradient={gradients[color] || gradients.blue}
      bgColor="bg-white"
      borderColor="border-transparent"
      padding="p-8"
      rounded="rounded-2xl"
      shadow="shadow-lg hover:shadow-2xl"
      className="transition-all duration-300 hover:-translate-y-1"
      {...props}
    >
      {children}
    </ColorfulSection>
  );
};

export const ColorfulBanner = ({ children, ...props }) => (
  <ColorfulSection
    gradient="from-brand-vibrant-orange via-brand-vibrant-yellow to-brand-vibrant-coral"
    bgColor="bg-gradient-to-r from-brand-vibrant-orange/10 to-brand-vibrant-yellow/10"
    borderColor="border-transparent"
    padding="py-16 px-8"
    rounded="rounded-3xl"
    shadow="shadow-2xl"
    className="text-center"
    {...props}
  >
    {children}
  </ColorfulSection>
);

export const ColorfulFeature = ({ icon, title, description, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-gradient-to-r from-brand-vibrant-blue to-brand-smoothies',
    orange: 'bg-gradient-to-r from-brand-vibrant-orange to-brand-vibrant-yellow',
    green: 'bg-gradient-to-r from-brand-primary to-brand-vibrant-lime',
  };

  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className={`w-20 h-20 ${colorClasses[color]} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
        <div className="text-white text-3xl">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ColorfulSection;