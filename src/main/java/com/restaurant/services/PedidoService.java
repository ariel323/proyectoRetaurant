package com.restaurant.services;

import com.restaurant.models.Pedido;
import com.restaurant.models.Mesa;
import com.restaurant.models.MenuItem;
import com.restaurant.repositories.PedidoRepository;
import com.restaurant.repositories.MesaRepository;
import com.restaurant.repositories.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {
    private final PedidoRepository pedidoRepository;
    private final MesaRepository mesaRepository;
    private final MenuItemRepository menuItemRepository;

    public PedidoService(PedidoRepository pedidoRepository, MesaRepository mesaRepository, MenuItemRepository menuItemRepository) {
        this.pedidoRepository = pedidoRepository;
        this.mesaRepository = mesaRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public List<Pedido> findAll() { return pedidoRepository.findAll(); }

    public Pedido save(Pedido pedido) {
        double total = 0.0;
        List<MenuItem> itemsConPrecio = new java.util.ArrayList<>();
        if (pedido.getItems() != null) {
            for (MenuItem item : pedido.getItems()) {
                MenuItem itemBD = menuItemRepository.findById(item.getId()).orElse(null);
                if (itemBD != null) {
                    total += itemBD.getPrecio();
                    itemsConPrecio.add(itemBD);
                }
            }
        }
        pedido.setItems(itemsConPrecio);
        pedido.setTotal(total);

        if (pedido.getEstado() == null) {
            pedido.setEstado("ABIERTO");
        }

        Mesa mesa = pedido.getMesa();
        if (mesa != null) {
            mesa.setEstado("OCUPADA");
            mesaRepository.save(mesa);
        }

        return pedidoRepository.save(pedido);
    }

    public void delete(Long id) { pedidoRepository.deleteById(id); }
}
