import { useState, useEffect } from 'react';

// Hook to get current viewport size
export const useViewportSize = () => {
    const [viewportSize, setViewportSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setViewportSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return viewportSize;
};

// Hook to check if the viewport is in mobile view (less than 600px wide)
export const useIsMobileView = () => {
    const { width } = useViewportSize();
    return width < 768;
};

// Hook to check if the viewport is in tablet view (between 600px and 960px wide)
export const useIsTabletView = () => {
    const { width } = useViewportSize();
    return width >= 768 && width < 1200;
};

// Hook to check if the viewport is in desktop view (more than 960px wide)
export const useIsDesktopView = () => {
    const { width } = useViewportSize();
    return width > 1200;
};
