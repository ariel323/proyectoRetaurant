package com.restaurant.controllers;

import com.restaurant.models.Usuario;
import com.restaurant.services.UsuarioService;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    private final UsuarioService usuarioService;
    
    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("🔐 === INICIO LOGIN ===");
            System.out.println("📧 Username recibido: '" + request.getUsername() + "'");
            System.out.println("🔑 Password recibido: '" + request.getPassword() + "'");
            
            // Buscar todos los usuarios para debug
            List<Usuario> usuarios = usuarioService.findAll();
            System.out.println("👥 Total usuarios en BD: " + usuarios.size());
            
            // Mostrar todos los usuarios para debug
            for (Usuario u : usuarios) {
                System.out.println("   - Usuario: '" + u.getUsername() + "', Password: '" + u.getPassword() + "', Rol: '" + u.getRol() + "'");
            }
            
            // Buscar usuario por username
            Usuario usuario = usuarios.stream()
                .filter(u -> u.getUsername().equals(request.getUsername()))
                .findFirst()
                .orElse(null);
            
            if (usuario == null) {
                System.out.println("❌ Usuario NO encontrado: '" + request.getUsername() + "'");
                System.out.println("🔍 Usuarios disponibles:");
                usuarios.forEach(u -> System.out.println("   - '" + u.getUsername() + "'"));
                
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Usuario no encontrado");
                errorResponse.put("error", "Usuario '" + request.getUsername() + "' no existe");
                
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            System.out.println("✅ Usuario encontrado: '" + usuario.getUsername() + "'");
            System.out.println("🔍 Password en BD: '" + usuario.getPassword() + "'");
            System.out.println("🔍 Password recibido: '" + request.getPassword() + "'");
            
            // Verificar password (comparación exacta para debug)
            boolean passwordMatch = usuario.getPassword().equals(request.getPassword());
            System.out.println("🔑 Passwords coinciden: " + passwordMatch);
            
            if (!passwordMatch) {
                System.out.println("❌ Password INCORRECTO para usuario: '" + request.getUsername() + "'");
                
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Credenciales inválidas");
                errorResponse.put("error", "Password incorrecto");
                
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            // Login exitoso
            System.out.println("🎉 LOGIN EXITOSO para usuario: '" + request.getUsername() + "'");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login exitoso");
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", usuario.getId());
            userInfo.put("username", usuario.getUsername());
            userInfo.put("rol", usuario.getRol());
            response.put("user", userInfo);
            
            response.put("token", "fake-jwt-token-" + usuario.getId());
            
            System.out.println("📤 Respuesta enviada: " + response);
            System.out.println("🔐 === FIN LOGIN ===");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("💥 ERROR CRÍTICO en login: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error interno del servidor");
            errorResponse.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Logout exitoso"
        ));
    }
    
    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyToken(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Token no válido"));
        }
        
        // Verificación simple del token (en producción usar JWT real)
        String tokenValue = token.substring(7);
        if (tokenValue.startsWith("fake-jwt-token-")) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Token válido"
            ));
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("error", "Token inválido"));
    }
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        try {
            List<Usuario> usuarios = usuarioService.findAll();
            System.out.println("🧪 TEST: Usuarios encontrados: " + usuarios.size());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Auth controller funcionando");
            response.put("usuariosCount", usuarios.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error en test: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/debug-users")
    public ResponseEntity<Map<String, Object>> debugUsers() {
        try {
            List<Usuario> usuarios = usuarioService.findAll();
            
            System.out.println("=== DEBUG USUARIOS ===");
            System.out.println("Total usuarios: " + usuarios.size());
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalUsuarios", usuarios.size());
            response.put("usuarios", new ArrayList<>());
            
            for (Usuario u : usuarios) {
                System.out.println("ID: " + u.getId() + ", Username: '" + u.getUsername() + "', Password: '" + u.getPassword() + "', Rol: '" + u.getRol() + "'");
                
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", u.getId());
                userInfo.put("username", u.getUsername());
                userInfo.put("password", u.getPassword()); // Solo para debug
                userInfo.put("rol", u.getRol());
                
                ((List<Map<String, Object>>) response.get("usuarios")).add(userInfo);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error al obtener usuarios: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // Clase interna para el request de login
    public static class LoginRequest {
        @JsonProperty("username")
        private String username;
        
        @JsonProperty("password")
        private String password;
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        
        @Override
        public String toString() {
            return "LoginRequest{username='" + username + "', password='***'}";
        }
    }
}