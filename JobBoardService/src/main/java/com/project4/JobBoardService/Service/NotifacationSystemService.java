package com.project4.JobBoardService.Service;

import com.project4.JobBoardService.DTO.NoficationSystemDTO;
import com.project4.JobBoardService.Entity.NoficationSystem;
import com.project4.JobBoardService.Repository.NotifacationSystemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class NotifacationSystemService {


    @Autowired
    private NotifacationSystemRepository notifacationSystemRepository;


    public List<NoficationSystemDTO> findAll() {
        return notifacationSystemRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public NoficationSystemDTO create(NoficationSystemDTO notificationSystemDTO) {
        NoficationSystem notificationSystem = toEntity(notificationSystemDTO);
        notificationSystem.setCreatedAt(LocalDateTime.now());
        notificationSystem = notifacationSystemRepository.save(notificationSystem);
        return toDto(notificationSystem);
    }


    public NoficationSystemDTO edit(Long id, NoficationSystemDTO notificationSystemDTO) {
        NoficationSystem existingNotificationSystem = notifacationSystemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        existingNotificationSystem.setTitle(notificationSystemDTO.getTitle());
        existingNotificationSystem.setMessage(notificationSystemDTO.getMessage());
        existingNotificationSystem = notifacationSystemRepository.save(existingNotificationSystem);

        return toDto(existingNotificationSystem);
    }

    public void delete(Long id) {
        notifacationSystemRepository.deleteById(id);
    }

    private NoficationSystemDTO toDto(NoficationSystem entity) {
        return NoficationSystemDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .message(entity.getMessage())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private NoficationSystem toEntity(NoficationSystemDTO dto) {
        return NoficationSystem.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .message(dto.getMessage())
                .createdAt(dto.getCreatedAt())
                .build();
    }
}




