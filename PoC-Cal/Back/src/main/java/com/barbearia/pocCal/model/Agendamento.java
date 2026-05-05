package com.barbearia.pocCal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer clienteId;
    private Integer barbeiroId;
    private Integer servicoId;
    private LocalDateTime data;

    public Integer getId() { return id; }

    public Integer getClienteId() { return clienteId; }
    public void setClienteId(Integer clienteId) { this.clienteId = clienteId; }

    public Integer getBarbeiroId() { return barbeiroId; }
    public void setBarbeiroId(Integer barbeiroId) { this.barbeiroId = barbeiroId; }

    public Integer getServicoId() { return servicoId; }
    public void setServicoId(Integer servicoId) { this.servicoId = servicoId; }

    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }
}
