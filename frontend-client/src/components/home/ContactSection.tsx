import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
}

export interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactSectionProps {
  /**
   * Título de la sección
   */
  title?: string;
  
  /**
   * Subtítulo de la sección
   */
  subtitle?: string;
  
  /**
   * Información de contacto
   */
  contact: ContactInfo;
  
  /**
   * Redes sociales
   */
  socialMedia?: SocialMedia[];
  
  /**
   * Mostrar formulario de contacto
   */
  showContactForm?: boolean;
  
  /**
   * Mostrar redes sociales
   */
  showSocialMedia?: boolean;
  
  /**
   * Función para manejar el envío del formulario
   */
  onSubmitForm?: (data: ContactForm) => Promise<void>;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente ContactSection - Sección de contacto con información y formulario
 */
export const ContactSection: React.FC<ContactSectionProps> = ({
  title = "Contáctanos",
  subtitle = "Estamos aquí para ayudarte",
  contact,
  socialMedia = [],
  showContactForm = true,
  showSocialMedia = true,
  onSubmitForm,
  className,
}) => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!onSubmitForm) {
      console.log('Formulario enviado:', formData);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSubmitForm(formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${contact.phone}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${contact.email}`;
  };

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank');
  };

  const contactItems = [
    {
      icon: '📞',
      label: 'Teléfono',
      value: contact.phone,
      action: handlePhoneClick
    },
    {
      icon: '✉️',
      label: 'Email',
      value: contact.email,
      action: handleEmailClick
    },
    {
      icon: '📍',
      label: 'Dirección',
      value: contact.address,
      action: undefined
    },
    {
      icon: '🕐',
      label: 'Horarios',
      value: contact.hours,
      action: undefined
    }
  ];

  const subjectOptions = [
    { value: '', label: 'Selecciona un tema' },
    { value: 'reserva', label: 'Reserva de mesa' },
    { value: 'evento', label: 'Evento privado' },
    { value: 'catering', label: 'Servicio de catering' },
    { value: 'feedback', label: 'Comentarios y sugerencias' },
    { value: 'trabajo', label: 'Oportunidades de trabajo' },
    { value: 'otro', label: 'Otro' }
  ];

  return (
    <section className={cn('py-16 bg-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Información de Contacto
              </h3>
              
              <div className="space-y-4">
                {contactItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 text-2xl">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {item.label}
                      </p>
                      {item.action ? (
                        <button
                          onClick={item.action}
                          className="text-gray-600 hover:text-orange-600 transition-colors text-left"
                        >
                          {item.value}
                        </button>
                      ) : (
                        <p className="text-gray-600">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Redes sociales */}
            {showSocialMedia && socialMedia.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Síguenos
                </h3>
                <div className="flex space-x-4">
                  {socialMedia.map((social, index) => (
                    <button
                      key={index}
                      onClick={() => handleSocialClick(social.url)}
                      className="w-12 h-12 bg-gray-100 hover:bg-orange-100 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      title={`Visitar ${social.platform}`}
                    >
                      <span className="text-2xl">{social.icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mapa o información adicional */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                ¿Tienes alguna pregunta?
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                No dudes en contactarnos. Nuestro equipo está disponible para ayudarte 
                con reservas, eventos especiales o cualquier consulta que tengas.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                  Respuesta rápida
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Atención personalizada
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Soporte multicanal
                </span>
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          {showContactForm && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Envíanos un Mensaje
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Tu nombre completo"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="+52 (55) 1234-5678"
                  />
                </div>

                {/* Asunto */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  >
                    {subjectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mensaje */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                  />
                </div>

                {/* Status messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex">
                      <div className="text-green-400 mr-3">✅</div>
                      <div>
                        <p className="text-green-800 font-medium">¡Mensaje enviado!</p>
                        <p className="text-green-600 text-sm mt-1">
                          Gracias por contactarnos. Te responderemos pronto.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                      <div className="text-red-400 mr-3">❌</div>
                      <div>
                        <p className="text-red-800 font-medium">Error al enviar</p>
                        <p className="text-red-600 text-sm mt-1">
                          Hubo un problema. Inténtalo de nuevo o contáctanos directamente.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'w-full bg-orange-500 text-white px-6 py-3 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                    isSubmitting 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-orange-600'
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar Mensaje'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  * Campos obligatorios
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;