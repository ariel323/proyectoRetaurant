package com.restaurant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class RestaurantApplication {
    public static void main(String[] args) {
        // Configurar propiedades del sistema antes de iniciar
        System.setProperty("server.port", "8080");
        System.setProperty("spring.profiles.active", "development");
        
        SpringApplication app = new SpringApplication(RestaurantApplication.class);
        
        // Banner personalizado
        app.setBannerMode(org.springframework.boot.Banner.Mode.CONSOLE);
        
        // Iniciar aplicación
        app.run(args);
        
        // Log de inicio
        System.out.println("\n" +
            "🍽️  ================================================\n" +
            "    RESTAURANT API INICIADA CORRECTAMENTE\n" +
            "    URL: http://localhost:8080\n" +
            "    Documentación: http://localhost:8080/swagger-ui\n" +
            "    Health Check: http://localhost:8080/actuator/health\n" +
            "🍽️  ================================================\n");
    }

    // Configuración CORS global (opcional si ya tienes CorsConfig.java)
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(
                            "http://localhost:3000",  // frontend-cliente
                            "http://localhost:3001"   // frontend-admin
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}


