package com.restaurant.utils;

import com.restaurant.models.Pedido;
import com.restaurant.dto.PedidoDTO;

public class PedidoMapper {
    public static PedidoDTO toDTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setNumeroMesa(pedido.getMesa().getNumero());
        // ...otros campos
        return dto;
    }
}
