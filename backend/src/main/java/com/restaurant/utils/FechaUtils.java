package com.restaurant.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class FechaUtils {
    public static String formatearFecha(LocalDateTime fecha) {
        return fecha.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }
}
