// Home Components - Componentes principales para la página de inicio
export { HeroSection } from './HeroSection';
export { FeaturedMenu } from './FeaturedMenu';
export { CategoriesSection } from './CategoriesSection';
export { RestaurantInfo } from './RestaurantInfo';
export { Testimonials } from './Testimonials';
export { OpeningHours } from './OpeningHours';
export { CallToAction } from './CallToAction';
export { ContactSection } from './ContactSection';
export { LocationMap } from './LocationMap';

// Exportar también los componentes por defecto para mayor flexibilidad
export { default as HeroSectionDefault } from './HeroSection';
export { default as FeaturedMenuDefault } from './FeaturedMenu';
export { default as CategoriesSectionDefault } from './CategoriesSection';
export { default as RestaurantInfoDefault } from './RestaurantInfo';
export { default as TestimonialsDefault } from './Testimonials';
export { default as OpeningHoursDefault } from './OpeningHours';
export { default as CallToActionDefault } from './CallToAction';
export { default as ContactSectionDefault } from './ContactSection';
export { default as LocationMapDefault } from './LocationMap';

// Tipos y interfaces disponibles desde los componentes
export type { CTAButton, CTAVariant, CallToActionProps } from './CallToAction';
export type { ContactInfo, SocialMedia, ContactForm, ContactSectionProps } from './ContactSection';

/**
 * Tipos de componentes home disponibles
 */
export type HomeComponentType = 
  | 'hero'
  | 'featuredMenu'
  | 'categories'
  | 'restaurantInfo'
  | 'testimonials'
  | 'openingHours'
  | 'callToAction'
  | 'contact'
  | 'location';

/**
 * Configuraciones por defecto para los componentes home
 */
export const HOME_COMPONENTS_CONFIG = {
  hero: {
    defaultVariant: "default" as const,
    supportedVariants: ["default", "minimal", "fullscreen"] as const
  },
  featuredMenu: {
    defaultItemsToShow: 6,
    supportedLayouts: ["grid", "carousel"] as const
  },
  categories: {
    defaultLayout: "grid" as const,
    supportedLayouts: ["grid", "carousel"] as const
  },
  restaurantInfo: {
    defaultVariant: "default" as const,
    supportedVariants: ["default", "minimal", "detailed"] as const
  },
  testimonials: {
    defaultInterval: 5000,
    defaultAutoplay: true
  },
  openingHours: {
    defaultVariant: "default" as const,
    supportedVariants: ["default", "compact", "detailed"] as const,
    defaultTimezone: "America/Mexico_City"
  },
  callToAction: {
    defaultVariant: "default" as const,
    supportedVariants: ["default", "minimal", "centered"] as const
  },
  contact: {
    defaultShowForm: true,
    defaultShowSocial: true
  },
  location: {
    defaultMapHeight: "400px",
    defaultShowTransport: true
  }
} as const;