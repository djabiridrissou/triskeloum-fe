// Builds complete image URL by prepending base URL if needed
export const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    return `${import.meta.env.VITE_BASE_WITHOUT_ORIGIN}/${imagePath}`;
};