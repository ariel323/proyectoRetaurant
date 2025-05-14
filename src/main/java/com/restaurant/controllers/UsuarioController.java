package com.restaurant.controllers;

import com.restaurant.models.Usuario;
import com.restaurant.services.UsuarioService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<Usuario> getAll() { return service.findAll(); }

    @PostMapping
    public Usuario create(@RequestBody Usuario usuario) { return service.save(usuario); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }

    @GetMapping("/rol")
    public Map<String, String> getRol(Authentication authentication) {
        String rol = "ANONIMO";
        if (authentication != null && authentication.isAuthenticated() && authentication.getAuthorities() != null) {
            rol = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .map(r -> r.replace("ROLE_", ""))
                    .findFirst()
                    .orElse("ANONIMO");
        }
        return Map.of("rol", rol);
    }
}
