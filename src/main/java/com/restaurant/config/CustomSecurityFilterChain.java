package com.restaurant.config;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

public class CustomSecurityFilterChain {

    @Bean
    public SecurityFilterChain customFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .antMatchers("/api/usuarios/rol").authenticated() // <--- PROTEGER ESTE ENDPOINT
                .antMatchers("/api/menu").permitAll()
                .antMatchers("/api/menu/**").hasRole("ADMIN")
                .antMatchers("/api/mesas/**").hasRole("ADMIN")
                .anyRequest().permitAll()
            )
            .formLogin()
            .and()
            .httpBasic();
        return http.build();
    }
}
