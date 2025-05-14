package com.restaurant.dto;

import java.util.List;

public class PedidoDTO {
    private Long id;
    private int numeroMesa;
    private List<String> nombresItems;
    private List<MenuItemDTO> items;
    private double total;
    private String estado;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNumeroMesa() {
        return numeroMesa;
    }

    public void setNumeroMesa(int numeroMesa) {
        this.numeroMesa = numeroMesa;
    }

    public List<String> getNombresItems() {
        return nombresItems;
    }

    public void setNombresItems(List<String> nombresItems) {
        this.nombresItems = nombresItems;
    }

    public List<MenuItemDTO> getItems() {
        return items;
    }

    public void setItems(List<MenuItemDTO> items) {
        this.items = items;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
