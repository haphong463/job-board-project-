package Project4.JobBoard.Service;

import Project4.JobBoard.Entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategorybyId(Long id);

    void savedCategory(Category category);

    void deleteCategorybyId(Long id);

}
