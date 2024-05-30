package com.project4.JobBoardService.Util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

public class FileUtils {

    private static int serverPort = 8080;

    private static String uploadDir = "src/main/resources/uploads";

    public static Path saveFile(MultipartFile file) throws IOException {
        System.out.println(">>> uploadDir: " + uploadDir);
        Path resourceDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();

        // Get the original filename and add a timestamp to make it unique
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            fileExtension = originalFilename.substring(dotIndex);
            originalFilename = originalFilename.substring(0, dotIndex);
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String uniqueFileName = originalFilename + "_" + timestamp + fileExtension;

        Path filePath = resourceDirectory.resolve(uniqueFileName);

        if (Files.notExists(resourceDirectory)) {
            Files.createDirectories(resourceDirectory);
        }

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath;
    }

    public static String convertToUrl(Path filePath) {
        String fileName = filePath.getFileName().toString();
        return "http://localhost:" + serverPort + "/uploads/" + fileName;
    }
}