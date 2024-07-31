class JobType {
  int id;
  String name;

  JobType({required this.id, required this.name});

  factory JobType.fromJson(Map<String, dynamic> json) {
    return JobType(id: json['id'], name: json['name']);
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name};
  }
}
