import React from "react";

const VideoPlayer = ({ videoKey }) => {
    if (!videoKey) return null;
    return (
        <div className="aspect-video max-w-3xl mx-auto"> 
             <iframe
                width="100%"
                 height="100%"
                 src={`https://www.youtube.com/embed/${videoKey}`}
                 title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
             ></iframe>
        </div>
    );
};

export default VideoPlayer;