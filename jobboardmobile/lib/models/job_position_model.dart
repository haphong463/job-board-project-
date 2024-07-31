class JobPosition {
  int id;
  String name;

  JobPosition({required this.id, required this.name});

  factory JobPosition.fromJson(Map<String, dynamic> json) {
    return JobPosition(id: json['id'], name: json['name']);
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name};
  }
}
