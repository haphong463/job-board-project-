import 'package:flutter/material.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/notification_model.dart';
import 'package:jobboardmobile/service/auth_service.dart';
import 'package:jobboardmobile/service/notification_service.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  _NotificationScreenState createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  final NotificationService _notificationService = NotificationService();
  final AuthService _authService = AuthService();
  Future<List<NotificationModel>>? _notifications;
  String? userId;

  @override
  void initState() {
    super.initState();
    _fetchUserDetails();
  }

  void _fetchUserDetails() async {
    userId = await _authService.getUserId();

    if (userId != null) {
      setState(() {
        _notifications = _notificationService
            .getNotificationsByRecipientId(int.parse(userId!));
      });
    }
  }

  Future<void> _handleReadNotification(int id) async {
    NotificationModel? updated =
        await _notificationService.markNotificationAsRead(id);
    setState(() {
      _notifications = _notifications!.then((notifications) {
        int index =
            notifications.indexWhere((notification) => notification.id == id);
        if (index != -1) {
          notifications[index] = updated!;
        }
        return notifications;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
      ),
      body: _notifications == null
          ? const Center(child: CircularProgressIndicator())
          : FutureBuilder<List<NotificationModel>>(
              future: _notifications,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(child: Text('No notifications'));
                } else {
                  return ListView.builder(
                    itemCount: snapshot.data!.length,
                    itemBuilder: (context, index) {
                      final notification = snapshot.data![index];
                      return ListTile(
                        leading: ClipOval(
                          child: Image.network(
                            notification.sender.imageUrl.isNotEmpty
                                ? notification.sender.imageUrl.replaceFirst(
                                    "http://localhost:8080", Endpoint.imageUrl)
                                : 'https://via.placeholder.com/40',
                            fit: BoxFit.cover,
                            width: 40,
                            height: 40,
                          ),
                        ),
                        title: RichText(
                          text: TextSpan(
                            children: [
                              TextSpan(
                                text:
                                    '${notification.sender.firstName} ${notification.sender.lastName}: ',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black,
                                ),
                              ),
                              TextSpan(
                                text: notification.message,
                                style: const TextStyle(
                                  color: Colors.black,
                                ),
                              ),
                            ],
                          ),
                        ),
                        subtitle: Text('From: ${notification.sender.username}'),
                        trailing: Icon(
                          notification.read
                              ? Icons.mark_email_read
                              : Icons.mark_email_unread,
                          color: notification.read ? Colors.green : Colors.red,
                        ),
                        onTap: () {
                          _handleReadNotification(notification.id);
                        },
                      );
                    },
                  );
                }
              },
            ),
    );
  }
}
