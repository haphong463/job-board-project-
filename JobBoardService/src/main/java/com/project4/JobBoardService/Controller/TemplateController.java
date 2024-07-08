package com.project4.JobBoardService.Controller;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.project4.JobBoardService.Entity.Template;
import com.project4.JobBoardService.Entity.User;
import com.project4.JobBoardService.Entity.UserCV;
import com.project4.JobBoardService.Repository.TemplateRepository;
import com.project4.JobBoardService.Repository.UserCvRepository;
import com.project4.JobBoardService.Repository.UserRepository;
import com.project4.JobBoardService.Service.TemplateService;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

	@Autowired
	private TemplateRepository templateRepository;
	
	@Autowired
	private UserCvRepository userCvRepository;
	
	@Autowired
	private UserRepository userRepository;
 
  
	 private final TemplateService templateService;
	    private final TemplateEngine templateEngine;
	   

 
	    public TemplateController(TemplateService templateService, TemplateEngine templateEngine) {
	        this.templateService = templateService;
	        this.templateEngine = templateEngine;
	       
	    }
	
	   
	@PostMapping("/create")
    public ResponseEntity<Map<String, String>> createTemplate(@ModelAttribute("template") Template template,
                                                              @RequestParam("templateImage") MultipartFile templateImage,
                                                              @RequestParam("templateFilePath") String templateFilePath) throws IOException {
        Map<String, String> response = new HashMap<>();

        // Handle the image separately
        if (!templateImage.isEmpty()) {
            byte[] imageBytes = templateImage.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            template.setTemplateImageBase64(base64Image);
        }

        template.setCreatedAt(LocalDateTime.now());
        template.setUpdatedAt(LocalDateTime.now());
        template.setTemplateFilePath(templateFilePath); // Assuming templateFilePath is a URL

        // Save template using JPA repository
        Template savedTemplate = templateRepository.save(template);
        response.put("message", "Template created successfully");

        return ResponseEntity.ok(response);
    }
    @PostMapping("/upload")
    public Mono<ResponseEntity<Map<String, String>>> uploadTemplate(@RequestParam("file") MultipartFile file,
                                                                    @RequestParam("templateName") String templateName) throws IOException {
        Map<String, String> response = new HashMap<>();

        // Check if file is null or empty
        if (file == null || file.isEmpty()) {
            response.put("message", "Error uploading template: File must not be null or empty.");
            return Mono.just(ResponseEntity.badRequest().body(response));
        }

        // Save template to Cloudflare using TemplateService
        return templateService.storeTemplate(templateName, new String(file.getBytes()))
                .map(result -> {
                    response.put("message", "Template uploaded successfully.");
                    return ResponseEntity.ok(response);
                })
                .onErrorResume(e -> {
                    response.put("message", "Error uploading template: " + e.getMessage());
                    return Mono.just(ResponseEntity.status(500).body(response));
                });
    }

 
    @GetMapping("/selected")
    public ResponseEntity<String> getTemplateContent(@RequestParam Long templateId) {
        // Find the template by templateId
        Template template = templateRepository.findById(templateId).orElse(null);

        if (template == null) {
            return ResponseEntity.notFound().build();
        }

        // Fetch template content from templateFilePath (assuming it's a URL)
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(template.getTemplateFilePath(), String.class);

        return ResponseEntity.ok(response.getBody());
    }
    
    @GetMapping("/list-template")
    public List<Template> listTemplates() {
        return templateRepository.findAll();
    }
   
   
    @PutMapping("/select-template")
	 public ResponseEntity<String> selectTemplate(@RequestParam("userId") Long userId,
	                                              @RequestParam("templateId") Long templateId) {
	     try {
	         // Find User by userId
	         User user = userRepository.findById(userId).orElse(null);
	         if (user == null) {
	             return ResponseEntity.badRequest().body("Invalid user ID");
	         }

	         // Find Template by templateId
	         Template template = templateRepository.findById(templateId).orElse(null);
	         if (template == null) {
	             return ResponseEntity.badRequest().body("Invalid template ID");
	         }

	         // Find UserCV by user
	         UserCV userCV = userCvRepository.findByUser(user);
	         if (userCV == null) {
	             return ResponseEntity.notFound().build();
	         }

	         // Update template
	         userCV.setTemplate(template);

	         // Save updated UserCV
	         userCvRepository.save(userCV);

	         return ResponseEntity.ok("UserCV updated successfully with selected template");
	     } catch (Exception e) {
	         return ResponseEntity.badRequest().body("Failed to update UserCV: " + e.getMessage());
	     }
	 }
    @GetMapping("/review-template/{key}/{userId}")
    public Mono<ResponseEntity<String>> getTemplate(@PathVariable("key") String key, @PathVariable("userId") Long userId, Model model) {
        return Mono.justOrEmpty(userCvRepository.findByUserId(userId))
            .switchIfEmpty(Mono.just(new UserCV())) // Return empty UserCV if not found (optional)
            .flatMap(userCV -> {
                // Add UserCV to the model
                model.addAttribute("userCV", userCV);

                // Retrieve the template
                return templateService.retrieveTemplate(key)
                    .flatMap(template -> {
                        // Create Thymeleaf context and add the model attributes
                        Context context = new Context();
                        model.asMap().forEach(context::setVariable);

                        // Render the template with Thymeleaf
                        String renderedHtml = templateEngine.process(template, context);

                        // Return the rendered HTML as the response
                        return Mono.just(ResponseEntity.ok(renderedHtml));
                    })
                    .defaultIfEmpty(ResponseEntity.notFound().build())
                    .onErrorResume(e -> Mono.just(ResponseEntity.status(500).body("Error retrieving template: " + e.getMessage())));
            });
    }
    @GetMapping("/print-to-pdf/{key}/{userId}")
    public Mono<Object> printToPdf(@PathVariable("key") String key, @PathVariable("userId") Long userId, Model model) {
        return Mono.justOrEmpty(userCvRepository.findByUserId(userId))
            .switchIfEmpty(Mono.just(new UserCV())) // Return empty UserCV if not found (optional)
            .flatMap(userCV -> {
                // Retrieve the template and render HTML
                return templateService.retrieveTemplate(key)
                    .flatMap(htmlContent -> {
                        try {
                            // Generate PDF from HTML content
                            byte[] pdfBytes = templateService.generatePdfFromHtml(htmlContent);

                            // Set headers for PDF response
                            HttpHeaders headers = new HttpHeaders();
                            headers.add("Content-Disposition", "inline; filename=output.pdf");

                            // Return ResponseEntity with PDF bytes and headers
                            return Mono.just(ResponseEntity.ok()
                                    .headers(headers)
                                    .contentType(MediaType.APPLICATION_PDF)
                                    .body(pdfBytes));
                        } catch (Exception e) {
                            // Handle exception if PDF generation fails
                            return Mono.just(ResponseEntity.status(500).body(null)); // Or appropriate error response
                        }
                    })
                    .defaultIfEmpty(ResponseEntity.notFound().build())
                    .onErrorResume(e -> Mono.just(ResponseEntity.status(500).body(null))); // Handle error in retrieving template
            });
    }
   
}
