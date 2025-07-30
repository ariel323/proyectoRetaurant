package com.restaurant.controllers;

import com.restaurant.services.DashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }
    
    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        System.out.println("📊 Obteniendo estadísticas del dashboard...");
        Map<String, Object> stats = dashboardService.getDashboardStats();
        System.out.println("✅ Estadísticas generadas: " + stats.size() + " métricas");
        return stats;
    }
}