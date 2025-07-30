import React from 'react';
import { 
  HeroSection,
  FeaturedMenu,
  CategoriesSection,
  RestaurantInfo,
  Testimonials,
  ContactSection,
  CallToAction,
  OpeningHours,
  LocationMap
} from '../../components/home';

const HomePage: React.FC = () => {

  return (
    <div className="min-h-screen">
      {/* Hero Section - Principal call to action */}
      <HeroSection />
      
      {/* Featured Menu Items */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <FeaturedMenu />
        </div>
      </section>
      
      {/* Categories Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <CategoriesSection />
        </div>
      </section>
      
      {/* Restaurant Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <RestaurantInfo />
            <OpeningHours />
          </div>
        </div>
      </section>
      
      {/* Customer Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Testimonials />
        </div>
      </section>
      
      {/* Contact and Location */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactSection 
              contact={{
                phone: '+1 (555) 123-4567',
                email: 'contacto@restaurante.com',
                address: 'Calle Principal 123, Ciudad',
                hours: 'Lun-Dom: 11:00 AM - 10:00 PM'
              }}
            />
            <LocationMap />
          </div>
        </div>
      </section>
      
      {/* Final Call to Action */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4">
          <CallToAction />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
