
import React from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

const CastCard = ({ member }) => {
    const imageBaseUrl = useSelector(state => state.movieData.imageURL); // Get base URL
    const profileUrl = imageBaseUrl && member.profile_path
        ? `${imageBaseUrl}w185${member.profile_path}` // Use appropriate size
        : '/user.png';


    const handleImageError = (e) => {
        // Prevent infinite loop if placeholder also fails
        if (e.target.src !== '/images/person-placeholder.png') {
            e.target.onerror = null;
            e.target.src = '/images/person-placeholder.png';
        }
    };

    return (
        <div className="flex-shrink-0 w-28 text-center">
            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden bg-neutral-700 mb-2">
                <Image
                    src={profileUrl}
                    alt={member.name}
                    fill
                    sizes="96px"
                    style={{ objectFit: 'cover' }}
                    priority
                    onError={handleImageError}
                />
            </div>
            <p className="text-sm font-medium text-white truncate">{member.name}</p>
            <p className="text-xs text-neutral-400 truncate">{member.character}</p>
        </div>
    );
};

export default CastCard;