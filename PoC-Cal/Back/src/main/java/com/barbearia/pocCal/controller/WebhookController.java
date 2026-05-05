package com.barbearia.pocCal.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.barbearia.pocCal.model.Agendamento;
import com.barbearia.pocCal.repository.AgendamentoRepository;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
public class WebhookController {
    private AgendamentoRepository repository;

    public WebhookController(AgendamentoRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> receberWebhook(@RequestBody String payload) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(payload);

            if (json.path("triggerEvent").asText().equals("PING")) {
                return ResponseEntity.ok("Ping OK");
            }

            JsonNode body = json.path("payload");

            String clienteId = body.path("responses").path("clienteId").path("value").asText();
            String barbeiroId = body.path("responses").path("barbeiroId").path("value").asText();
            String servicoId = body.path("responses").path("servicoId").path("value").asText();
            String data = body.path("startTime").asText();

            LocalDateTime dataConvertida = LocalDateTime.parse(data.replace("Z", ""));

            Agendamento agendamento = new Agendamento();
            agendamento.setClienteId(Integer.parseInt(clienteId));
            agendamento.setBarbeiroId(Integer.parseInt(barbeiroId));
            agendamento.setServicoId(Integer.parseInt(servicoId));
            agendamento.setData(dataConvertida);

            repository.save(agendamento);

            System.out.println("SALVO! no banco");

            return ResponseEntity.ok("OK");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro");
        }
    }

}
