package com.restaurant.dto;

import java.util.List;

public class CrearPedidoDTO {
    private Long mesaId;
    private List<Long> itemsIds;
    public Long getMesaId() {
        return mesaId;
    }
    public void setMesaId(Long mesaId) {
        this.mesaId = mesaId;
    }
    public List<Long> getItemsIds() {
        return itemsIds;
    }
    public void setItemsIds(List<Long> itemsIds) {
        this.itemsIds = itemsIds;
    }

    // Getters y setters
    
}
