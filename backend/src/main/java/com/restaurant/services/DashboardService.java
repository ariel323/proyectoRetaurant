package com.restaurant.services;

import com.restaurant.repositories.MesaRepository;
import com.restaurant.repositories.MenuItemRepository;
import com.restaurant.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {
    
    private final UsuarioRepository usuarioRepository;
    private final MesaRepository mesaRepository;
    private final MenuItemRepository menuItemRepository;
    
    public DashboardService(UsuarioRepository usuarioRepository, 
                           MesaRepository mesaRepository,
                           MenuItemRepository menuItemRepository) {
        this.usuarioRepository = usuarioRepository;
        this.mesaRepository = mesaRepository;
        this.menuItemRepository = menuItemRepository;
    }
    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Estadísticas de usuarios
        long totalUsuarios = usuarioRepository.count();
        stats.put("totalUsuarios", totalUsuarios);
        
        // Estadísticas de mesas
        long totalMesas = mesaRepository.count();
        long mesasLibres = mesaRepository.findByEstado("LIBRE").size();
        long mesasOcupadas = mesaRepository.findByEstado("OCUPADA").size();
        long mesasReservadas = mesaRepository.findByEstado("RESERVADA").size();
        
        stats.put("totalMesas", totalMesas);
        stats.put("mesasLibres", mesasLibres);
        stats.put("mesasOcupadas", mesasOcupadas);
        stats.put("mesasReservadas", mesasReservadas);
        stats.put("mesasActivas", mesasOcupadas + mesasReservadas);
        
        // Estadísticas de menú
        long totalProductos = menuItemRepository.count();
        long entradas = menuItemRepository.findByCategoria("ENTRADAS").size();
        long platos = menuItemRepository.findByCategoria("PLATOS_PRINCIPALES").size();
        long postres = menuItemRepository.findByCategoria("POSTRES").size();
        long bebidas = menuItemRepository.findByCategoria("BEBIDAS").size();
        long desayunos = menuItemRepository.findByCategoria("DESAYUNOS").size();
        
        stats.put("totalProductos", totalProductos);
        stats.put("entradas", entradas);
        stats.put("platosPrincipales", platos);
        stats.put("postres", postres);
        stats.put("bebidas", bebidas);
        stats.put("desayunos", desayunos);
        
        // Estadísticas simuladas para el dashboard
        stats.put("pedidosHoy", 15); // Simulado
        stats.put("ventasHoy", 1850.75); // Simulado
        stats.put("promedioMesa", totalMesas > 0 ? 1850.75 / totalMesas : 0);
        
        return stats;
    }
}