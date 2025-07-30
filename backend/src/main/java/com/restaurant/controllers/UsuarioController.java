package com.restaurant.controllers;

import com.restaurant.models.Usuario;
import com.restaurant.services.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {
    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<Usuario> getAll() {
        return service.findAll();
    }

    @PostMapping
    public Usuario create(@RequestBody Usuario usuario) {
        return service.save(usuario);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
