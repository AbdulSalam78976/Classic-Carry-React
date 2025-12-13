import { Link } from 'react-router-dom';

const DkartLogo = ({ 
  className = "", 
  size = "default", 
  linkTo = "/",
  onClick = null 
}) => {
  // Size variants for logo images
  const imageSizeClasses = {
    small: "h-8 w-8 md:h-10 md:w-10",
    default: "h-12 w-12 md:h-14 md:w-14", 
    large: "h-14 w-14 md:h-16 md:w-16"
  };

  const LogoContent = () => (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-shrink-0">
        <img 
          src="/assets/images/logo.png"
          alt="dKart"
          className={`${imageSizeClasses[size]} object-contain`}
        />
      </div>
    </div>
  );

  // If onClick is provided, render as button
  if (onClick) {
    return (
      <button onClick={onClick} className="focus:outline-none focus:ring-2 focus:ring-primary rounded-lg">
        <LogoContent />
      </button>
    );
  }

  // Default: render as Link
  return (
    <Link 
      to={linkTo}
      className="focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
    >
      <LogoContent />
    </Link>
  );
};

export default DkartLogo;