package com.restaurant.dto;

public class MenuItemDTO {
    private Long id;
    private String nombre;
    private String categoria; // <-- Agregar este campo
    private double precio;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCategoria() { return categoria; } // <-- Agregar
    public void setCategoria(String categoria) { this.categoria = categoria; } // <-- Agregar

    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }
}
