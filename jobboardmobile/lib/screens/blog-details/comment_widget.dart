import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:jobboardmobile/models/comment_model.dart';
import 'package:jobboardmobile/service/comment_service.dart';

class CommentWidget extends StatefulWidget {
  final Comment comment;
  final int level;

  const CommentWidget({super.key, required this.comment, this.level = 0});

  @override
  _CommentWidgetState createState() => _CommentWidgetState();
}

class _CommentWidgetState extends State<CommentWidget> {
  final CommentService _commentService = CommentService();
  bool _replying = false;
  TextEditingController replyEditingController = TextEditingController();

  void _editComment(BuildContext context, Comment comment) {
    // Handle edit comment action
  }

  void _deleteComment(BuildContext context, Comment comment) {
    // Handle delete comment action
  }

  void _toggleReply() {
    setState(() {
      _replying = !_replying;
      if (!_replying) {
        replyEditingController.clear();
      }
    });
  }

  void _addReply(String content) async {
    try {
      String temporaryCommentId = '${DateTime.now().millisecondsSinceEpoch}';

      var reply = {
        'id': temporaryCommentId,
        'blog': {'id': widget.comment.blog.id},
        'parentComment': {'id': widget.comment.id}, // Set parent comment id
        'content': content,
        'user': {
          'username': "haphong2134"
        }, // Assuming user.username is the username
      };
      // You'll need to adjust this based on your CommentService implementation
      // to handle adding replies
      Comment createdReply = await _commentService.createComment(reply);
      print(createdReply.content);
      setState(() {
        widget.comment.children.add(createdReply);
        _toggleReply(); // Hide reply field after successful reply
      });
    } catch (e) {
      print('Failed to add reply: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:
          EdgeInsets.only(left: 16.0 * widget.level, top: 8.0, bottom: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircleAvatar(
                child: Text(widget.comment.user
                    .email[0]), // Placeholder cho avatar người dùng
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          widget.comment.user
                              .email, // Placeholder cho tên người dùng
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const Spacer(),
                        GestureDetector(
                          onTap: () {
                            final RenderBox renderBox =
                                context.findRenderObject() as RenderBox;
                            final Offset offset =
                                renderBox.localToGlobal(Offset.zero);

                            showMenu(
                              context: context,
                              position: RelativeRect.fromLTRB(
                                offset.dx + renderBox.size.width,
                                offset.dy,
                                offset.dx + renderBox.size.width + 100,
                                offset.dy + renderBox.size.height,
                              ),
                              items: <PopupMenuEntry<String>>[
                                const PopupMenuItem<String>(
                                  value: 'Reply',
                                  child: Text('Reply'),
                                ),
                                const PopupMenuItem<String>(
                                  value: 'Edit',
                                  child: Text('Edit'),
                                ),
                                const PopupMenuItem<String>(
                                  value: 'Delete',
                                  child: Text('Delete'),
                                ),
                              ],
                            ).then((value) {
                              if (value == 'Reply') {
                                _toggleReply();
                              } else if (value == 'Edit') {
                                _editComment(context, widget.comment);
                              } else if (value == 'Delete') {
                                _deleteComment(context, widget.comment);
                              }
                            });
                          },
                          child: const Icon(Icons.more_vert),
                        ),
                      ],
                    ),
                    Text(widget.comment.content),
                    Text(
                      DateFormat.yMMMd().format(widget.comment.createdAt),
                      style: const TextStyle(color: Colors.grey),
                    ),
                    if (_replying)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        child: Row(
                          children: [
                            Expanded(
                              child: TextField(
                                decoration: const InputDecoration(
                                  hintText: 'Enter your reply',
                                  border: OutlineInputBorder(),
                                ),
                                controller: replyEditingController,
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.send),
                              onPressed: () {
                                _addReply(replyEditingController.text);
                              },
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ...widget.comment.children.map((child) =>
              CommentWidget(comment: child, level: widget.level + 1)),
        ],
      ),
    );
  }
}
