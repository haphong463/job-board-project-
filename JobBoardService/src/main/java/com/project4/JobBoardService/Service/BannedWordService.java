package com.project4.JobBoardService.Service;

import java.util.List;

public interface BannedWordService {
    List<String> filterBannedWords(List<String> words);
    void addBannedWord(String word);
}
