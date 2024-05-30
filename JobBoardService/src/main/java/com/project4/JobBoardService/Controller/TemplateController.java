package com.project4.JobBoardService.Controller;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.project4.JobBoardService.Entity.Template;
import com.project4.JobBoardService.Repository.TemplateRepository;

@Controller
@RequestMapping("/api/templates")
public class TemplateController {

    @Autowired
    private TemplateRepository templateRepository;

  

    @GetMapping("")
    public String getAllTemplates(Model model) {
        List<Template> templates = templateRepository.findAll();
        model.addAttribute("templates", templates);
        return "templates";
    }
    
//    @GetMapping("/list-template/{id}")
//    public String viewTemplate(@PathVariable("id") Long templateId, Model model) {
//        Template template = templateRepository.findById(templateId)
//            .orElseThrow(() -> new RuntimeException("Template not found"));
//        try {
//            String htmlContent = HtmlFileReader.readHtmlFile(template.getTemplateFilePath());
//            model.addAttribute("htmlContent", htmlContent);
//        } catch (IOException e) {
//            // Handle file reading error
//            e.printStackTrace();
//        }
//        model.addAttribute("template", template);
//        return "view-template";
//    }
    @GetMapping("/viewNewTemplate")
    public String addTemplate(Model model) {
		model.addAttribute("templates", new Template());
		return "create-template";
	}
    @PostMapping("/addNewTemplate")
    public String addTemplate(@RequestParam("templateName") String templateName,
                              @RequestParam("templateDescription") String templateDescription,
                              @RequestParam("htmlFile") MultipartFile htmlFile) throws IOException {

        // Save the HTML file to a specific directory
    	String uploadDirPath = "/tmp/uploads";
        Path uploadPath = Paths.get(uploadDirPath);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = htmlFile.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, htmlFile.getBytes());

        // Create a new Template entity
        Template template = new Template();
        template.setTemplateName(templateName);
        template.setTemplateDescription(templateDescription);
        template.setTemplateFilePath(filePath.toString());
        template.setCreatedAt(LocalDateTime.now());
        template.setUpdatedAt(LocalDateTime.now());

        // Save the template to the database
        templateRepository.save(template);

       
        return "redirect:/api/templates";
    }
 

 
}
