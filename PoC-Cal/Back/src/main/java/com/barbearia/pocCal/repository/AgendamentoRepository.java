package com.barbearia.pocCal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.barbearia.pocCal.model.Agendamento;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Integer> {
}
