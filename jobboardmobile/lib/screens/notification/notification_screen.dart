import 'package:flutter/material.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/notification_model.dart';
import 'package:jobboardmobile/screens/blog-details/blog_detail_screen_widget.dart';
import 'package:jobboardmobile/screens/blog/blog_list_widget.dart';
import 'package:jobboardmobile/service/auth_service.dart';
import 'package:jobboardmobile/service/notification_service.dart';
import 'package:jobboardmobile/service/blog_service.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  _NotificationScreenState createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  final NotificationService _notificationService = NotificationService();
  final AuthService _authService = AuthService();
  final BlogService _blogService = BlogService();
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

  void _handleReadNotification(bool read, int id, String url) async {
    if (!read) {
      NotificationModel? updated =
          await _notificationService.markNotificationAsRead(id);
    }

    final slug = extractSlug(url);
    final commentId = extractCommentId(url);

    print(">>> CommentId: $commentId");

    final blog = await _blogService.getBlogBySlug(slug);

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => BlogDetail(
            blog: BlogPost(
                id: blog!.id,
                citation: blog.citation,
                createdAt: blog.createdAt,
                description: blog.content,
                imageUrl: blog.imageUrl.replaceFirst(
                  'http://localhost:8080',
                  Endpoint.imageUrl,
                ),
                slug: blog.slug,
                title: blog.title,
                user: blog.user),
            commentId: commentId),
      ),
    );
  }

  String extractSlug(String url) {
    final regex = RegExp(r'/blog/([^#]+)');
    final match = regex.firstMatch(url);
    return match != null ? match.group(1)! : '';
  }

  String extractCommentId(String url) {
    final regex = RegExp(r'comment-(\d+)$');
    final match = regex.firstMatch(url);
    return match != null ? match.group(1)! : '';
  }

  void _handleDeleteNotification(int id) async {
    bool success = await _notificationService.deleteNotification(id);
    if (success) {
      setState(() {
        _notifications = _notifications!.then((notifications) => notifications
            .where((notification) => notification.id != id)
            .toList());
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to delete notification')),
      );
    }
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
                        leading: Stack(
                          children: [
                            ClipOval(
                              child: Image.network(
                                notification.sender.imageUrl.isNotEmpty
                                    ? notification.sender.imageUrl.replaceFirst(
                                        "http://localhost:8080",
                                        Endpoint.imageUrl)
                                    : 'https://via.placeholder.com/40',
                                fit: BoxFit.cover,
                                width: 40,
                                height: 40,
                              ),
                            ),
                            Positioned(
                              bottom: 0,
                              right: 0,
                              child: Container(
                                padding: const EdgeInsets.all(2),
                                decoration: const BoxDecoration(
                                  color: Colors.white,
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  notification.type == 'COMMENT'
                                      ? Icons.comment
                                      : Icons
                                          .work, // Use Icons.work for "apply"
                                  size: 12,
                                  color: Colors.blue,
                                ),
                              ),
                            ),
                          ],
                        ),
                        title: RichText(
                          text: TextSpan(
                            children: [
                              TextSpan(
                                text:
                                    '${notification.sender.firstName} ${notification.sender.lastName}',
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
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: Icon(
                                notification.read
                                    ? Icons.mark_email_read
                                    : Icons.mark_email_unread,
                                color: notification.read
                                    ? Colors.green
                                    : Colors.red,
                              ),
                              onPressed: () {
                                _handleReadNotification(notification.read,
                                    notification.id, notification.url);
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete, color: Colors.red),
                              onPressed: () {
                                _handleDeleteNotification(notification.id);
                              },
                            ),
                          ],
                        ),
                        onTap: () {
                          _handleReadNotification(notification.read,
                              notification.id, notification.url);
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
