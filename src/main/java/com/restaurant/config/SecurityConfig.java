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
@EnableMethodSecurity // Habilita @PreAuthorize
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .antMatchers("/api/menu").permitAll() // GET libre
                .antMatchers("/api/menu/**").hasRole("ADMIN") // POST, PUT, DELETE solo admin
                .antMatchers("/api/mesas/**").hasRole("ADMIN")
                .antMatchers("/api/usuarios/rol").authenticated() // <-- debe estar así
                .anyRequest().permitAll()
            )
            .formLogin()
            .and()
            .httpBasic();
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
