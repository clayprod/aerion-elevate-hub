import React from 'react';

interface AutelLogoProps {
  className?: string;
  textFallback?: string;
  showText?: boolean;
}

export const AutelLogo: React.FC<AutelLogoProps> = ({ 
  className = "h-16 md:h-20 w-auto", 
  textFallback = "Produtos Autel",
  showText = false
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError || showText) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-navy-deep">
          {textFallback}
        </h1>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/images/logos/autel-logo.png"
        alt="Autel Robotics"
        className="h-full w-auto object-contain"
        onError={handleImageError}
      />
    </div>
  );
};
