// notification_model.dart
class NotificationModel {
  int id;
  Recipient sender;
  Recipient recipient;
  String message;
  String url;
  bool read;

  NotificationModel({
    required this.id,
    required this.sender,
    required this.recipient,
    required this.message,
    required this.url,
    required this.read,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'],
      sender: Recipient.fromJson(json['sender']),
      recipient: Recipient.fromJson(json['recipient']),
      message: json['message'],
      url: json['url'],
      read: json['read'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'sender': sender.toJson(),
      'recipient': recipient.toJson(),
      'message': message,
      'url': url,
      'read': read,
    };
  }
}

class Recipient {
  int id;
  String email;
  String username;
  String firstName;
  String lastName;
  String gender;
  String imageUrl;
  String bio;
  bool isEnabled;
  List<Role> roles;

  Recipient({
    required this.id,
    required this.email,
    required this.username,
    required this.firstName,
    required this.lastName,
    required this.gender,
    required this.imageUrl,
    required this.bio,
    required this.isEnabled,
    required this.roles,
  });

  factory Recipient.fromJson(Map<String, dynamic> json) {
    var rolesFromJson = json['roles'] as List;
    List<Role> roleList =
        rolesFromJson.map((roleJson) => Role.fromJson(roleJson)).toList();

    return Recipient(
      id: json['id'],
      email: json['email'],
      username: json['username'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      gender: json['gender'],
      imageUrl: json['imageUrl'],
      bio: json['bio'],
      isEnabled: json['isEnabled'],
      roles: roleList,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'username': username,
      'firstName': firstName,
      'lastName': lastName,
      'gender': gender,
      'imageUrl': imageUrl,
      'bio': bio,
      'isEnabled': isEnabled,
      'roles': roles.map((role) => role.toJson()).toList(),
    };
  }
}

class Role {
  int id;
  String name;

  Role({
    required this.id,
    required this.name,
  });

  factory Role.fromJson(Map<String, dynamic> json) {
    return Role(
      id: json['id'],
      name: json['name'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
    };
  }
}
