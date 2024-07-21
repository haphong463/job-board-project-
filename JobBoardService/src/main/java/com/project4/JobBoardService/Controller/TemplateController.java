package com.project4.JobBoardService.Controller;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.zip.GZIPOutputStream;


import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.project4.JobBoardService.Service.CloudflareConfig;
//import com.project4.JobBoardService.Util.PdfUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
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
	private CloudflareConfig cloudflareConfig;


	public TemplateController(TemplateService templateService, TemplateEngine templateEngine) {
		this.templateService = templateService;
		this.templateEngine = templateEngine;

	}

	@GetMapping
	public ResponseEntity<List<Template>> getAllTemplate() {
		List<Template> templates = templateRepository.findAll();
		return ResponseEntity.ok(templates);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Template> getTemplateById(@PathVariable Long id) {
		Optional<Template> optionalTemplate = templateRepository.findById(id);
		if (optionalTemplate.isPresent()) {
			return ResponseEntity.ok(optionalTemplate.get());
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Map<String, String>> deleteTemplate(@PathVariable("id") Long id) {
		Map<String, String> response = new HashMap<>();

		// Fetch the existing template by id
		Optional<Template> optionalTemplate = templateRepository.findById(id);
		if (optionalTemplate.isPresent()) {
			templateRepository.deleteById(id);
			response.put("message", "Template deleted successfully");
		} else {
			response.put("message", "Template not found");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}

		return ResponseEntity.ok(response);
	}

	@PutMapping("/update/{id}")
	public Mono<ResponseEntity<Map<String, String>>> updateTemplate(@PathVariable("id") Long id,
																	@ModelAttribute("template") Template template,
																	@RequestParam(value = "templateImage", required = false) MultipartFile templateImage,
																	@RequestParam(value = "templateHtmlFile", required = false) MultipartFile templateHtmlFile) throws IOException {
		Map<String, String> response = new HashMap<>();

		// Fetch the existing template by id
		Optional<Template> optionalTemplate = templateRepository.findById(id);
		if (optionalTemplate.isPresent()) {
			Template existingTemplate = optionalTemplate.get();

			// Handle the image separately if provided
			if (templateImage != null && !templateImage.isEmpty()) {
				byte[] imageBytes = templateImage.getBytes();
				String base64Image = java.util.Base64.getEncoder().encodeToString(imageBytes);
				existingTemplate.setTemplateImageBase64(base64Image);
			}

			// Update fields from the request except templateName
			existingTemplate.setTemplateDescription(template.getTemplateDescription());
			existingTemplate.setUpdatedAt(LocalDateTime.now());

			// Save the updated template using JPA repository
			templateRepository.save(existingTemplate);

			// Handle HTML file upload to Cloudflare
			if (templateHtmlFile != null && !templateHtmlFile.isEmpty()) {
				byte[] htmlBytes = templateHtmlFile.getBytes();
				String htmlContent = new String(htmlBytes);

				return templateService.storeTemplate(existingTemplate.getTemplateName(), htmlContent)
						.map(result -> {
							response.put("message", "Template updated successfully");
							return ResponseEntity.ok(response);
						})
						.onErrorResume(e -> {
							response.put("message", "Failed to update HTML file on Cloudflare: " + e.getMessage());
							return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response));
						});
			} else {
				response.put("message", "Template updated successfully");
				return Mono.just(ResponseEntity.ok(response));
			}
		} else {
			response.put("message", "Template not found");
			return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(response));
		}
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

//	@GetMapping("/generate/{userId}")
//	public Mono<ResponseEntity<byte[]>> generatePDF(@PathVariable Long userId) {
//		return Mono.justOrEmpty(userCvRepository.findByUserId(userId))
//				.switchIfEmpty(Mono.error(new RuntimeException("UserCV not found")))
//				.flatMap(userCV -> {
//					String templateKey = userCV.getTemplate().getTemplateName();
//					return templateService.retrieveTemplate(templateKey)
//							.flatMap(template -> {
//								Context context = new Context();
//								context.setVariable("userCV", userCV);
//
//								String renderedHtml = templateEngine.process(template, context);
//
//								ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//
//								ConverterProperties props = new ConverterProperties();
//								props.setBaseUri("classpath:/static/");
//
//								HtmlConverter.convertToPdf(renderedHtml, outputStream, props);
//
//								byte[] pdfBytes = outputStream.toByteArray();
//
//								// Compress the PDF data
//								ByteArrayOutputStream baos = new ByteArrayOutputStream();
//								try (GZIPOutputStream gzipOutputStream = new GZIPOutputStream(baos)) {
//									gzipOutputStream.write(pdfBytes);
//								} catch (IOException e) {
//									return Mono.error(new RuntimeException("Error compressing PDF", e));
//								}
//								byte[] compressedBytes = baos.toByteArray();
//
//								// Save the compressed PDF
//								try {
//									pdfDocumentService.savePdf(compressedBytes, "generated_cv.pdf", userId);
//								} catch (IOException e) {
//									return Mono.error(new RuntimeException("Error saving compressed PDF", e));
//								}
//
//								HttpHeaders headers = new HttpHeaders();
//								headers.setContentType(MediaType.APPLICATION_PDF);
//								headers.setContentDispositionFormData("filename", "cv.pdf");
//
//								return Mono.just(new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK));
//							});
//				})
//				.onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//						.body(("Error generating PDF: " + e.getMessage()).getBytes())));
//	}
	@GetMapping("/generate/{userId}")
	public Mono<ResponseEntity<byte[]>> generatePDF(@PathVariable Long userId) {
		return Mono.justOrEmpty(userCvRepository.findByUserId(userId))
				.switchIfEmpty(Mono.error(new RuntimeException("UserCV not found")))
				.flatMap(userCV -> {
					String templateKey = userCV.getTemplate().getTemplateName();
					return templateService.retrieveTemplate(templateKey)
							.flatMap(template -> {
								Context context = new Context();
								context.setVariable("userCV", userCV);

								String renderedHtml = templateEngine.process(template, context);

								ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

								ConverterProperties props = new ConverterProperties();
								props.setBaseUri("classpath:/static/");

								HtmlConverter.convertToPdf(renderedHtml, outputStream, props);

								byte[] pdfBytes = outputStream.toByteArray();

								HttpHeaders headers = new HttpHeaders();
								headers.setContentType(MediaType.APPLICATION_PDF);
								headers.setContentDispositionFormData("filename", "cv.pdf");

								return Mono.just(new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK));
							});
				})
				.onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.body(("Error generating PDF: " + e.getMessage()).getBytes())));
	}
//	@PostMapping("/pdf-documents/save/{userId}")
//	public ResponseEntity<?> savePdfDocument(
//			@PathVariable Long userId,
//			@RequestParam("name") String name,
//			@RequestParam("fileData") MultipartFile fileData) {
//		try {
//			byte[] fileBytes = fileData.getBytes();
//			pdfDocumentService.savePdf(fileBytes, name, userId);
//
//			return ResponseEntity.ok().body("PDF saved successfully");
//		} catch (Exception e) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//					.body("Error saving PDF: " + e.getMessage());
//		}
//	}
//	bo cai nay
//	@GetMapping("/generate/{userId}")
//	public Mono<ResponseEntity<byte[]>> generatePDF(@PathVariable Long userId) {
//		return Mono.justOrEmpty(userCvRepository.findByUserId(userId))
//				.switchIfEmpty(Mono.error(new RuntimeException("UserCV not found")))
//				.flatMap(userCV -> {
//					String templateKey = userCV.getTemplate().getTemplateName();
//					return templateService.retrieveTemplate(templateKey)
//							.flatMap(template -> {
//								Context context = new Context();
//								context.setVariable("userCV", userCV);
//
//								String renderedHtml = templateEngine.process(template, context);
//
//								ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//
//								ConverterProperties props = new ConverterProperties();
//								props.setBaseUri("classpath:/static/");
//								props.setMediaDeviceDescription(new MediaDeviceDescription(MediaType.PRINT));
//								FontProvider fontProvider = new DefaultFontProvider(false, false, false);
//								fontProvider.addStandardPdfFonts();
//								fontProvider.addSystemFonts();
//								props.setFontProvider(fontProvider);
//
//								PdfWriter writer = new PdfWriter(outputStream);
//								PdfDocument pdf = new PdfDocument(writer);
//								pdf.setDefaultPageSize(PageSize.A4);
//
//								// Create a Document with margins
//								Document document = new Document(pdf);
//								document.setMargins(20, 20, 20, 20); // top, right, bottom, left
//
//								HtmlConverter.convertToPdf(renderedHtml, pdf, props);
//
//								byte[] pdfBytes = outputStream.toByteArray();
//
//								HttpHeaders headers = new HttpHeaders();
//								headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
//								headers.setContentDispositionFormData("filename", "cv.pdf");
//
//								return Mono.just(new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK));
//							});
//				})
//				.onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//						.body(("Error generating PDF: " + e.getMessage()).getBytes())));
//	}
}
