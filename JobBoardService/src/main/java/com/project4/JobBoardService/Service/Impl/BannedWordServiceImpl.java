package com.project4.JobBoardService.Service.Impl;

import com.project4.JobBoardService.Entity.BannedWord;
import com.project4.JobBoardService.Repository.BannedWordRepository;
import com.project4.JobBoardService.Service.BannedWordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BannedWordServiceImpl implements BannedWordService {
    @Autowired
    private BannedWordRepository bannedWordRepository;

    @Override
    public List<String> filterBannedWords(List<String> words) {
        List<String> bannedWords = bannedWordRepository.findAll()
                .stream()
                .map(BannedWord::getWord)
                .toList();

        return words.stream()
                .filter(bannedWords::contains)
                .collect(Collectors.toList());
    }

    @Override
    public void addBannedWord(String word) {
        bannedWordRepository.save(new BannedWord(word));
    }
}
