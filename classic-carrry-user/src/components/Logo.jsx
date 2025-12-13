import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

const Logo = ({
  className = "",
  size = "large",
  linkTo = "/",
  onClick = null,
  variant = "default" // default (dark text) or light (white text)
}) => {
  const { settings } = useSettings();

  // Size variants for logo images
  const imageSizeClasses = {
    small: "h-8 w-8 md:h-10 md:w-10",
    default: "h-12 w-12 md:h-14 md:w-14",
    large: "h-20 w-20 md:h-24 md:w-24" // Increased large size slightly
  };

  // Size variants for text
  const textSizeClasses = {
    small: "text-lg md:text-xl",
    default: "text-2xl md:text-3xl",
    large: "text-3xl md:text-4xl"
  };

  // Color variants for text
  const textColorClasses = {
    default: "text-gray-900",
    light: "text-white"
  };

  // Get logo configuration
  const logoType = settings.appearance?.logoType || 'image';
  const logoSrc = settings.appearance?.logoImage || '/assets/images/logo.png';
  const siteName = settings.appearance?.siteName || 'dKart';

  // Determine what to show based on logoType
  const showImage = logoType === 'image' || logoType === 'both';
  const showText = logoType === 'text' || logoType === 'both';

  const LogoContent = () => (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image - Show for 'image' and 'both' types */}
      {showImage && (
        <div className="flex-shrink-0">
          <img
            src={logoSrc}
            alt={siteName}
            className={`${imageSizeClasses[size]} object-contain ${variant === 'light' ? 'brightness-0 invert' : ''}`}
            onError={(e) => {
              // If uploaded logo fails, fallback to dkart logo
              if (e.target.src !== '/assets/images/logo.png') {
                e.target.src = '/assets/images/logo.png';
              }
            }}
          />
        </div>
      )}

      {/* Site Name - Show for 'text' and 'both' types */}
      {showText && (
        <span
          className={`${textSizeClasses[size]} font-bold ${textColorClasses[variant]} font-display tracking-tight hover:opacity-80 transition-opacity`}
        >
          {siteName}
        </span>
      )}
    </div>
  );

  // If onClick is provided, render as button
  if (onClick) {
    return (
      <button onClick={onClick} className="focus:outline-none rounded-lg">
        <LogoContent />
      </button>
    );
  }

  // Default: render as Link
  return (
    <Link
      to={linkTo}
      className="focus:outline-none rounded-lg"
    >
      <LogoContent />
    </Link>
  );
};

export default Logo;