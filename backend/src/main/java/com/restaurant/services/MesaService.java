package com.restaurant.services;

import com.restaurant.models.Mesa;
import com.restaurant.repositories.MesaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MesaService {
    private final MesaRepository repository;

    public MesaService(MesaRepository repository) {
        this.repository = repository;
    }

    public List<Mesa> findAll() { 
        return repository.findAll(); 
    }
    
    public List<Mesa> findByEstado(String estado) { 
        return repository.findByEstado(estado); 
    }
    
    public Mesa save(Mesa mesa) { 
        return repository.save(mesa); 
    }
    
    public void delete(Long id) { 
        if (!repository.existsById(id)) {
            throw new RuntimeException("Mesa con ID " + id + " no encontrada");
        }
        repository.deleteById(id); 
    }
    
    public Mesa findById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Mesa con ID " + id + " no encontrada"));
    }
    
    public Mesa update(Long id, Mesa mesa) {
        Mesa existente = findById(id); // Esto ya lanza excepción si no existe
        existente.setNumero(mesa.getNumero());
        existente.setEstado(mesa.getEstado());
        return repository.save(existente);
    }
}
