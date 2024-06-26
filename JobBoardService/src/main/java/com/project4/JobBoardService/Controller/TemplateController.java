package com.project4.JobBoardService.Controller;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.project4.JobBoardService.Entity.Template;
import com.project4.JobBoardService.Entity.UserCV;
import com.project4.JobBoardService.Entity.UserDetail;
import com.project4.JobBoardService.Repository.TemplateRepository;
import com.project4.JobBoardService.Repository.UserCvRepository;
import com.project4.JobBoardService.Service.TemplateService;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

	@Autowired
	private TemplateRepository templateRepository;
	@Autowired
	private UserCvRepository userCvRepository;

	private final TemplateService templateService;

	public TemplateController(TemplateService templateService) {
		this.templateService = templateService;
	}

	@GetMapping("/upload")
	public String showUploadForm(Model model) {
		return "upload-template"; // Thymeleaf template for upload form
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

 
 

    @GetMapping("/list-template")
    public List<Template> listTemplates() {
        return templateRepository.findAll();
    }
//    @GetMapping("/{key}")
//    public Mono<String> getRenderedTemplate(@PathVariable("key") String key) {
//        return templateService.retrieveTemplate(key)
//                .flatMap(htmlTemplate -> renderTemplateWithData(htmlTemplate));
//    }

//    private Mono<String> renderTemplateWithData(String htmlTemplate) {
//        // Replace Thymeleaf expressions with actual data
//        // For simplicity, let's assume you have a hard-coded data map
//        Map<String, Object> data = new HashMap<>();
//        data.put("detail", new UserDetail("John Doe", "123 Main St", "john.doe@example.com", "123-456-7890", "A brief summary"));
//
//        // Use Thymeleaf's TemplateEngine to process the template
//        Context context = new Context();
//        context.setVariables(data);
//
//        String processedHtml = new SpringTemplateEngine().process(htmlTemplate, context);
//        return Mono.just(processedHtml);
//    }

   
//	@GetMapping("/list-template/{id}")
//	public String viewTemplate(@PathVariable("id") Long templateId, Model model) {
//		// Retrieve template from repository
//		Template template = templateRepository.findById(templateId)
//				.orElseThrow(() -> new RuntimeException("Template not found"));
//
//		// Fetch HTML content from URL specified in templateFilePath
//		try {
//			String htmlContent = fetchHtmlContent(template.getTemplateFilePath());
//			model.addAttribute("htmlContent", htmlContent);
//		} catch (IOException e) {
//			// Handle file reading error
//			model.addAttribute("htmlContent", "<p>Failed to load HTML content from URL.</p>");
//			e.printStackTrace(); // Consider logging the exception instead
//		}
//
//		// Add template to model for rendering details
//		model.addAttribute("template", template);
//
//		return "view-template-closer"; // Return the view template name
//	}

	// Method to fetch HTML content from URL
	private String fetchHtmlContent(String url) throws IOException {
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
		return response.getBody();
	}

//    @GetMapping("/preview/{id}")
//    public String previewTemplate(@PathVariable Long id, Model model) {
//        // Find template by ID
//        Template template = templateRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("Invalid template ID: " + id));
//
//        // Add template to model
//        model.addAttribute("template", template);
//
//        return "preview-template"; // Return the name of the preview page HTML file
//    }
 
}
