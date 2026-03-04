export const CALENDLY_CONFIG = {
    url: import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/erdemerolsuer/virtuenex',
    primaryColor: 'e4cc25', // VirtueNex Gold
    backgroundColor: '111111', // Match dark mode theme
    textColor: 'ffffff', // White
    hideGdprBanner: true, // We will handle cookie consent on our own site wrapper
    hideEventTypeDetails: false // Adjust based on design preference
};
