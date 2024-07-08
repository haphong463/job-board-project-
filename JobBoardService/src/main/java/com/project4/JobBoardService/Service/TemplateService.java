package com.project4.JobBoardService.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.IBlockElement;
import com.itextpdf.layout.element.IElement;
import com.itextpdf.layout.element.Paragraph;

import reactor.core.publisher.Mono;

@Service
public class TemplateService {

    private final CloudflareService cloudflareService;
    private final CloudflareConfig cloudflareConfig;

    @Autowired
    public TemplateService(CloudflareService cloudflareService, CloudflareConfig cloudflareConfig) {
        this.cloudflareService = cloudflareService;
        this.cloudflareConfig = cloudflareConfig;
    }

    public Mono<String> storeTemplate(String templateName, String templateHtml) {
        String key = templateName; // Generate a unique key based on templateName
        String kvNamespace = cloudflareConfig.getKvNamespace();
        String accountId = cloudflareConfig.getAccountId();

        return cloudflareService.storeTemplate(key, templateHtml, accountId, kvNamespace);
    }

    public Mono<String> retrieveTemplate(String key) {
        String kvNamespace = cloudflareConfig.getKvNamespace();
        String accountId = cloudflareConfig.getAccountId();

        return cloudflareService.getTemplate(key, accountId, kvNamespace);
    }

    public byte[] generatePdfFromHtml(String htmlContent) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // Step 1: Create PdfWriter
        PdfWriter writer = new PdfWriter(outputStream);

        // Step 2: Create PdfDocument
        PdfDocument pdf = new PdfDocument(writer);

        // Step 3: Create Document
        Document document = new Document(pdf);

        // Step 4: Convert HTML content to PDF elements
		List<IElement> elements = HtmlConverter.convertToElements(htmlContent);

		// Step 5: Add elements to the document
		for (IElement element : elements) {
		    if (element instanceof IBlockElement) {
		        document.add((IBlockElement) element); // Add IBlockElement directly
		    } else {
		        document.add(new Paragraph(element.toString())); // Wrap non-block elements in Paragraph
		    }
		}

        // Step 6: Close Document
        document.close();

        return outputStream.toByteArray();
    }
}
