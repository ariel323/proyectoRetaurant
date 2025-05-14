package com.restaurant.repositories;

import com.restaurant.models.MenuItem;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {}


