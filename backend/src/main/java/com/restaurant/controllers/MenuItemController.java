package com.restaurant.controllers;

import com.restaurant.models.MenuItem;
import com.restaurant.services.MenuItemService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.net.MalformedURLException;
import java.io.IOException;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "http://localhost:3000")
public class MenuItemController {
    private final MenuItemService service;

    public MenuItemController(MenuItemService service) {
        this.service = service;
    }

    @GetMapping
    public List<MenuItem> getAll() {
        System.out.println("GET /api/menu - Obteniendo todos los productos del menú");
        List<MenuItem> items = service.findAll();
        System.out.println("Productos encontrados: " + items.size());
        
        // Debug: mostrar algunos productos
        for (int i = 0; i < Math.min(3, items.size()); i++) {
            MenuItem item = items.get(i);
            System.out.println("  - " + item.getNombre() + " (" + item.getCategoria() + ") - $" + item.getPrecio());
        }
        
        return items;
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<?> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            MenuItem item = service.findById(id);

            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String original = StringUtils.cleanPath(file.getOriginalFilename());
            String filename = id + "_" + System.currentTimeMillis() + "_" + original;
            Path target = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            // Set imagen URL to the serving endpoint
            String imagenUrl = "/api/menu/uploads/" + filename;
            item.setImagen(imagenUrl);
            service.save(item);

            return ResponseEntity.ok(item);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = Paths.get("uploads").resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/debug")
    public Map<String, Object> debug() {
        try {
            List<MenuItem> items = service.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalItems", items.size());
            response.put("message", "Debug info para menu items");
            
            if (items.isEmpty()) {
                response.put("warning", "No hay productos en la base de datos");
                response.put("suggestion", "Ejecutar script de inicialización de datos");
            } else {
                response.put("sampleItems", items.subList(0, Math.min(5, items.size())));
            }
            
            return response;
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return errorResponse;
        }
    }

    @PostMapping("/init")
    public Map<String, Object> initializeData() {
        try {
            // Verificar si ya hay datos
            List<MenuItem> existingItems = service.findAll();
            if (!existingItems.isEmpty()) {
                return Map.of(
                    "message", "Los productos ya existen",
                    "count", existingItems.size()
                );
            }
            
            // Crear algunos productos de ejemplo
            MenuItem item1 = new MenuItem();
            item1.setNombre("Pizza Margherita");
            item1.setCategoria("PLATOS_PRINCIPALES");
            item1.setPrecio(14.50);
            service.save(item1);
            
            MenuItem item2 = new MenuItem();
            item2.setNombre("Ensalada César");
            item2.setCategoria("ENTRADAS");
            item2.setPrecio(8.75);
            service.save(item2);
            
            MenuItem item3 = new MenuItem();
            item3.setNombre("Tiramisu");
            item3.setCategoria("POSTRES");
            item3.setPrecio(6.99);
            service.save(item3);
            
            System.out.println("✅ Productos de ejemplo creados");
            
            return Map.of(
                "message", "Productos creados exitosamente",
                "count", 3
            );
            
        } catch (Exception e) {
            System.err.println("Error al crear productos: " + e.getMessage());
            return Map.of("error", e.getMessage());
        }
    }

    @PostMapping
    public MenuItem create(@RequestBody MenuItem item) {
        System.out.println("POST /api/menu - Creando producto: " + item.getNombre());
        return service.save(item);
    }

    @PutMapping("/{id}")
    public MenuItem update(@PathVariable Long id, @RequestBody MenuItem item) {
        System.out.println("PUT /api/menu/" + id + " - Actualizando producto");
        return service.update(id, item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        System.out.println("DELETE /api/menu/" + id + " - Eliminando producto");
        service.delete(id);
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        return service.getCategories();
    }

    @GetMapping("/category/{categoria}")
    public List<MenuItem> getByCategory(@PathVariable String categoria) {
        return service.findByCategory(categoria);
    }
}
