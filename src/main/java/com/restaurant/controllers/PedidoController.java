package com.restaurant.controllers;

import com.restaurant.models.Pedido;
import com.restaurant.services.PedidoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Pedido> getAll() { return service.findAll(); }

    @PostMapping
    public Pedido create(@RequestBody Pedido pedido) { return service.save(pedido); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
