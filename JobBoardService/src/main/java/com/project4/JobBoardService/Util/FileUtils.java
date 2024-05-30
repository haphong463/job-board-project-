package com.project4.JobBoardService.Util;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.web.multipart.MultipartFile;

public class FileUtils {

    public static Path saveFile(String uploadDir, MultipartFile file) throws IOException {
        Path resourceDirectory = Paths.get("src", "main", "resources", uploadDir).toAbsolutePath().normalize();

        String fileName = file.getOriginalFilename();
        Path filePath = resourceDirectory.resolve(fileName);

        if (Files.notExists(resourceDirectory)) {
            Files.createDirectories(resourceDirectory);
        }

        Files.copy(file.getInputStream(), filePath);

        return filePath;
    }
}
