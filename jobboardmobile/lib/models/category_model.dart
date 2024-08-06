class Category {
  int categoryId;
  String name;

  Category({
    required this.categoryId,
    required this.name,
  });

  // Factory method to create a Category from JSON
  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      categoryId: json['categoryId'],
      name: json['name'],
    );
  }
}
