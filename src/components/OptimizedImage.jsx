import { useState, useEffect, useRef } from 'react';
import { observeLCP, preloadAsset, addPriorityHint } from '../utils/performance';
import { ASPECT_RATIOS, calculatePadding } from '../utils/layout';

const OptimizedImage = ({ 
    src, 
    alt, 
    className, 
    fallbackSrc, 
    priority = false,
    width = 300,
    aspectRatio = ASPECT_RATIOS.anime,
    containerStyle = {}
}) => {
    const [loaded, setLoaded] = useState(false);
    const [webpSupported, setWebpSupported] = useState(false);
    const [avifSupported, setAvifSupported] = useState(false);
    const [imageDimensions, setImageDimensions] = useState(null);
    const imageRef = useRef(null);
    const isLCP = useRef(false);

    useEffect(() => {
        // Check WebP support
        const checkWebP = new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = function () {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });

        // Check AVIF support
        const checkAVIF = new Promise((resolve) => {
            const avif = new Image();
            avif.onload = avif.onerror = function () {
                resolve(avif.height === 2);
            };
            avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        });

        // Pre-calculate image dimensions
        if (src) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                setImageDimensions({
                    width: img.width,
                    height: img.height,
                    aspectRatio: img.width / img.height
                });
            };
        }

        // Set format support states
        Promise.all([checkWebP, checkAVIF]).then(([webP, avif]) => {
            setWebpSupported(webP);
            setAvifSupported(avif);
        });

        // Preload high-priority images
        if (priority && src) {
            preloadAsset(src);
        }

        // Observe LCP
        const cleanup = observeLCP((entry) => {
            if (imageRef.current && entry.element === imageRef.current) {
                isLCP.current = true;
                addPriorityHint(imageRef.current);
            }
        });

        return () => {
            cleanup();
        };
    }, [src, priority]);

    // Convert image URL to WebP if supported
    const getOptimizedImageUrl = (originalUrl) => {
        if (!originalUrl) return fallbackSrc;
        
        // If the URL is already using a next-gen format, return as is
        if (originalUrl.match(/\.(webp|avif)$/i)) return originalUrl;

        try {
            const url = new URL(originalUrl);
            
            // For URLs that support format conversion (like CDNs)
            if (avifSupported) {
                url.searchParams.set('format', 'avif');
                return url.toString();
            }
            if (webpSupported) {
                url.searchParams.set('format', 'webp');
                return url.toString();
            }
        } catch (e) {
            // If URL parsing fails, return original
            console.warn('Invalid URL:', originalUrl);
        }
        
        return originalUrl;
    };

    // Calculate container style with aspect ratio
    const containerStyles = {
        ...containerStyle,
        width: `${width}px`,
        paddingBottom: calculatePadding(aspectRatio),
        position: 'relative',
    };

    return (
        <div 
            className={`image-container ${className}`} 
            style={containerStyles}
            data-priority={priority}
        >
            <div className="image-placeholder" style={{ 
                backgroundColor: '#f0f0f0',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }} />
            
            <picture style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            }}>
                {avifSupported && (
                    <source
                        type="image/avif"
                        srcSet={`${getOptimizedImageUrl(src)} 1x`}
                        sizes={`${width}px`}
                    />
                )}
                {webpSupported && (
                    <source
                        type="image/webp"
                        srcSet={`${getOptimizedImageUrl(src)} 1x`}
                        sizes={`${width}px`}
                    />
                )}
                <img
                    ref={imageRef}
                    src={src}
                    alt={alt}
                    className={`full-image ${loaded ? 'loaded' : ''}`}
                    onLoad={() => setLoaded(true)}
                    loading={priority ? 'eager' : 'lazy'}
                    fetchPriority={priority ? 'high' : 'auto'}
                    decoding={priority ? 'sync' : 'async'}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackSrc;
                    }}
                />
            </picture>
            
            {!priority && loaded && (
                <div 
                    className={`skeleton-loader ${loaded ? 'fade-out' : ''}`}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite'
                    }}
                />
            )}
        </div>
    );
};

export default OptimizedImage;
