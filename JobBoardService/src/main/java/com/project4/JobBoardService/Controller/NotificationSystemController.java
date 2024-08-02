package com.project4.JobBoardService.Controller;


import com.project4.JobBoardService.DTO.NoficationSystemDTO;
import com.project4.JobBoardService.Service.NotifacationSystemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificationsystem")
public class NotificationSystemController {
    @Autowired
    private NotifacationSystemService notificationSystemService;

    @GetMapping
    public List<NoficationSystemDTO> findAll() {
        return notificationSystemService.findAll();
    }

    @PostMapping("/save")
    public NoficationSystemDTO create(@RequestBody NoficationSystemDTO notificationSystemDTO) {
        return notificationSystemService.create(notificationSystemDTO);
    }

    @PutMapping("/{id}")
    public NoficationSystemDTO edit(@PathVariable Long id, @RequestBody NoficationSystemDTO notificationSystemDTO) {
        return notificationSystemService.edit(id, notificationSystemDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        notificationSystemService.delete(id);
    }
}