package com.restaurant.repositories;

import com.restaurant.models.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    // Buscar por categoría
    List<MenuItem> findByCategoria(String categoria);

    // Obtener todas las categorías únicas
    @Query("SELECT DISTINCT m.categoria FROM MenuItem m")
    List<String> findAllCategorias();
}


