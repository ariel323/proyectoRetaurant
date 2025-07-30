package com.restaurant.controllers;

import com.restaurant.models.Mesa;
import com.restaurant.services.MesaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mesas")
@CrossOrigin(origins = "http://localhost:3000")
public class MesaController {
    private final MesaService service;

    public MesaController(MesaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Mesa> getAll() {
        return service.findAll();
    }

    @PostMapping
    public Mesa create(@RequestBody Mesa mesa) {
        return service.save(mesa);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mesa> update(@PathVariable Long id, @RequestBody Mesa mesa) {
        try {
            Mesa mesaActualizada = service.update(id, mesa);
            return ResponseEntity.ok(mesaActualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        try {
            System.out.println("Intentando eliminar mesa con ID: " + id);
            Mesa mesa = service.findById(id); // Verificar que existe
            System.out.println("Mesa encontrada: " + mesa.getNumero());
            service.delete(id);
            System.out.println("Mesa " + id + " eliminada exitosamente");
            return ResponseEntity.ok("{\"message\":\"Mesa eliminada exitosamente\"}");
        } catch (Exception e) {
            System.err.println("Error al eliminar mesa " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("{\"error\":\"Mesa no encontrada\"}");
        }
    }
}
