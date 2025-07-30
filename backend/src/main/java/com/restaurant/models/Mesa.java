package com.restaurant.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Mesa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int numero;
    private String estado; // "LIBRE", "OCUPADA", "RESERVADA"

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getNumero() { return numero; }
    public void setNumero(int numero) { this.numero = numero; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
