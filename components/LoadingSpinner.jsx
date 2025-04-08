// components/LoadingSpinner.jsx
import React from 'react';

/**
 * A simple loading spinner component.
 *
 * @param {object} props - The component props.
 * @param {'sm'|'md'|'lg'|string} [props.size='md'] - Size of the spinner ('sm', 'md', 'lg', or Tailwind h/w class like 'h-10 w-10').
 * @param {string} [props.className=''] - Additional Tailwind classes for the spinner container.
 * @param {string} [props.spinnerColor='border-blue-500'] - Tailwind border color class for the spinning part (e.g., 'border-white', 'border-primary').
 * @param {string} [props.trackColor='border-neutral-300/30'] - Tailwind border color class for the track (non-spinning part). Includes opacity.
 * @param {number} [props.thickness=4] - Border thickness (maps to border-{thickness}).
 * @param {string} [props.label='Loading...'] - Accessible label for screen readers.
 */
const LoadingSpinner = ({
    size = 'md',
    className = '',
    spinnerColor = 'border-blue-500', // Default to blue
    trackColor = 'border-neutral-300/30', // Default to light gray with opacity
    thickness = 4,
    label = 'Loading...'
}) => {

    const sizeClasses = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    // Use predefined size or allow direct Tailwind class string
    const finalSizeClass = sizeClasses[size] || size;
    const borderClass = `border-${thickness}`;

    return (
        <div
            role="status"
            aria-live="polite" // Announce changes politely
            className={`inline-block animate-spin rounded-full ${borderClass} ${trackColor} ${spinnerColor} border-t-transparent ${finalSizeClass} ${className}`} // Use border-t-transparent for a cleaner look
        >
            <span className="sr-only">{label}</span> {/* Screen-reader only text */}
        </div>
    );
};

export default LoadingSpinner;