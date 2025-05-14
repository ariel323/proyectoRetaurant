package com.restaurant.services;

import com.restaurant.models.MenuItem;
import com.restaurant.repositories.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService {
    private final MenuItemRepository repository;

    public MenuItemService(MenuItemRepository repository) {
        this.repository = repository;
    }

    public List<MenuItem> findAll() { return repository.findAll(); }
    public MenuItem save(MenuItem item) { return repository.save(item); }
    public void delete(Long id) { repository.deleteById(id); }

    public MenuItem update(Long id, MenuItem item) {
        MenuItem existente = repository.findById(id).orElseThrow();
        existente.setNombre(item.getNombre());
        existente.setCategoria(item.getCategoria());
        existente.setPrecio(item.getPrecio());
        return repository.save(existente);
    }
}
