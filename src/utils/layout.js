// Default aspect ratios for different content types
export const ASPECT_RATIOS = {
    anime: 1.5, // 3:2 aspect ratio for anime thumbnails
    banner: 2.5, // 5:2 aspect ratio for banner images
    portrait: 0.67, // 2:3 aspect ratio for portrait images
};

// Calculate padding based on aspect ratio
export const calculatePadding = (aspectRatio) => {
    return `${(1 / aspectRatio) * 100}%`;
};

// Calculate dimensions maintaining aspect ratio
export const calculateDimensions = (width, aspectRatio) => {
    return {
        width,
        height: width / aspectRatio
    };
};
