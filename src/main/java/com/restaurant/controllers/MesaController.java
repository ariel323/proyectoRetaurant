package com.restaurant.controllers;

import com.restaurant.models.Mesa;
import com.restaurant.services.MesaService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mesas")
public class MesaController {
    private final MesaService service;

    public MesaController(MesaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Mesa> getAll() { return service.findAll(); }

    @PostMapping
    public Mesa create(@RequestBody Mesa mesa) { return service.save(mesa); }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }

    @GetMapping("/libres")
    public List<Mesa> getMesasLibres() {
        return service.findByEstado("LIBRE");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Mesa update(@PathVariable Long id, @RequestBody Mesa mesa) {
        return service.update(id, mesa);
    }
}
