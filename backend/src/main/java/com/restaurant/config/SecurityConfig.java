package com.restaurant.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // <-- Permite todo temporalmente
            );
        return http.build();
    }

    // Usuarios en memoria para pruebas
    @Bean
    public UserDetailsService users() {
        return new InMemoryUserDetailsManager(
            User.withUsername("admin").password("{noop}admin123").roles("ADMIN").build(),
            User.withUsername("cliente").password("{noop}cliente123").roles("CLIENTE").build()
        );
    }
}
