package com.restaurant.config;

import com.restaurant.repositories.MesaRepository;
import com.restaurant.repositories.MenuItemRepository;
import com.restaurant.repositories.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private final UsuarioRepository usuarioRepository;
    private final MesaRepository mesaRepository;
    private final MenuItemRepository menuItemRepository;
    
    public DataInitializer(UsuarioRepository usuarioRepository, 
                          MesaRepository mesaRepository,
                          MenuItemRepository menuItemRepository) {
        this.usuarioRepository = usuarioRepository;
        this.mesaRepository = mesaRepository;
        this.menuItemRepository = menuItemRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 === VERIFICANDO ESTADO DEL SISTEMA ===");
        
        // Solo mostrar resumen de lo que ya cargó data.sql
        showDataSummary();
        
        System.out.println("✅ === SISTEMA LISTO ===");
    }
    
    private void showDataSummary() {
        System.out.println("\n📊 === RESUMEN DEL SISTEMA ===");
        
        // Verificar usuarios
        long totalUsuarios = usuarioRepository.count();
        System.out.println("👥 Total usuarios: " + totalUsuarios);
        if (totalUsuarios == 0) {
            System.out.println("⚠️ No hay usuarios - verificar data.sql");
        }
        
        // Verificar mesas
        long totalMesas = mesaRepository.count();
        if (totalMesas > 0) {
            long mesasLibres = mesaRepository.findByEstado("LIBRE").size();
            long mesasOcupadas = mesaRepository.findByEstado("OCUPADA").size();
            long mesasReservadas = mesaRepository.findByEstado("RESERVADA").size();
            
            System.out.println("🪑 Total mesas: " + totalMesas);
            System.out.println("   - Libres: " + mesasLibres);
            System.out.println("   - Ocupadas: " + mesasOcupadas);
            System.out.println("   - Reservadas: " + mesasReservadas);
        } else {
            System.out.println("⚠️ No hay mesas - verificar data.sql");
        }
        
        // Verificar productos del menú
        long totalProductos = menuItemRepository.count();
        if (totalProductos > 0) {
            long entradas = menuItemRepository.findByCategoria("ENTRADAS").size();
            long platos = menuItemRepository.findByCategoria("PLATOS_PRINCIPALES").size();
            long postres = menuItemRepository.findByCategoria("POSTRES").size();
            long bebidas = menuItemRepository.findByCategoria("BEBIDAS").size();
            long desayunos = menuItemRepository.findByCategoria("DESAYUNOS").size();
            
            System.out.println("🍽️ Total productos: " + totalProductos);
            System.out.println("   - Entradas: " + entradas);
            System.out.println("   - Platos principales: " + platos);
            System.out.println("   - Postres: " + postres);
            System.out.println("   - Bebidas: " + bebidas);
            System.out.println("   - Desayunos: " + desayunos);
            
            System.out.println("\n🎯 Dashboard listo con datos reales de data.sql");
        } else {
            System.out.println("⚠️ No hay productos - verificar data.sql");
            System.out.println("💡 Tip: Usar endpoint /api/menu/init para cargar productos de prueba");
        }
    }
}