class ContractType {
  int id;
  String name;

  ContractType({required this.id, required this.name});

  factory ContractType.fromJson(Map<String, dynamic> json) {
    return ContractType(id: json['id'], name: json['name']);
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name};
  }
}
