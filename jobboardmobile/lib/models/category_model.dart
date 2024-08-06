class Category {
  int id;
  String name;

  Category({
    required this.id,
    required this.name,
  });

  // Factory method to create a Category from JSON
  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'],
      name: json['name'],
    );
  }
}
