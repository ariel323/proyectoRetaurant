package com.restaurant.services;

import com.restaurant.models.Usuario;
import com.restaurant.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<Usuario> findAll() { return repository.findAll(); }
    public Usuario save(Usuario usuario) { return repository.save(usuario); }
    public void delete(Long id) { repository.deleteById(id); }
}
