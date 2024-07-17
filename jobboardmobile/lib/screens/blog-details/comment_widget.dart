import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/comment_model.dart';
import 'package:jobboardmobile/service/auth_service.dart';
import 'package:jobboardmobile/service/comment_service.dart';

class CommentWidget extends StatefulWidget {
  final Comment comment;
  final int level;
  final void Function(String) deleteComment;
  final void Function(bool) toggleMainCommentField; // Add this parameter

  const CommentWidget({
    super.key,
    required this.comment,
    this.level = 0,
    required this.deleteComment,
    required this.toggleMainCommentField,
  });

  @override
  _CommentWidgetState createState() => _CommentWidgetState();
}

class _CommentWidgetState extends State<CommentWidget> {
  final CommentService _commentService = CommentService();
  final AuthService _authService = AuthService();

  String? username;
  bool _replying = false;
  bool _isEditing = false;
  TextEditingController editEditingController = TextEditingController();
  TextEditingController replyEditingController = TextEditingController();
  FocusNode replyFocusNode = FocusNode();

  void _fetchUserDetails() async {
    username = await _authService.getUsername();
    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    _fetchUserDetails();
    editEditingController.text = widget.comment.content;
  }

  void _editComment(BuildContext context) {
    setState(() {
      _isEditing = true;
      widget.toggleMainCommentField(false);
    });
  }

  void _addReply(String content, Comment parentComment) async {
    try {
      String temporaryCommentId = '${DateTime.now().millisecondsSinceEpoch}';

      var reply = {
        'id': temporaryCommentId,
        'blog': {'id': parentComment.blog.id},
        'parent': {'id': parentComment.id},
        'content': content,
        'user': {'username': username},
      };
      Comment createdReply = await _commentService.createComment(reply);
      setState(() {
        parentComment.children.add(createdReply);
        _toggleReply();
      });
    } catch (e) {
      print('Failed to add reply: $e');
    }
  }

  void _saveEdit() async {
    try {
      var updatedComment = {
        'content': editEditingController.text,
        'user': {'username': username}
      };
      await _commentService.updateComment(widget.comment.id, updatedComment);
      setState(() {
        widget.comment.content = editEditingController.text;
        _isEditing = false;
        widget.toggleMainCommentField(true);
      });
    } catch (e) {
      print('Failed to edit comment: $e');
    }
  }

  void _toggleReply() {
    setState(() {
      _replying = !_replying;

      if (!_replying) {
        widget.toggleMainCommentField(
            true); // Call the function to hide/show main comment TextField
        replyFocusNode.unfocus();
        replyEditingController.clear();
      } else {
        widget.toggleMainCommentField(false);
        replyFocusNode.requestFocus();
      }
    });
  }

  void _confirmDelete(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          content: const Text('Are you sure you want to delete this comment?'),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                widget.deleteComment(widget.comment.id);
              },
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );
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
                child: ClipOval(
                  child: Image.network(
                    widget.comment.user.imageUrl.replaceFirst(
                      'http://localhost:8080',
                      Endpoint.imageUrl,
                    ),
                    fit: BoxFit.cover,
                    width: 40,
                    height: 40,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          "${widget.comment.user.firstName} ${widget.comment.user.lastName}",
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
                                if (username ==
                                    widget.comment.user.username) ...[
                                  const PopupMenuItem<String>(
                                    value: 'Edit',
                                    child: Text('Edit'),
                                  ),
                                  const PopupMenuItem<String>(
                                    value: 'Delete',
                                    child: Text('Delete'),
                                  ),
                                ]
                              ],
                            ).then((value) {
                              if (value == 'Reply') {
                                _toggleReply();
                              } else if (value == 'Edit') {
                                _editComment(context);
                              } else if (value == 'Delete') {
                                _confirmDelete(context);
                              }
                            });
                          },
                          child: const Icon(Icons.more_vert),
                        ),
                      ],
                    ),
                    if (_isEditing)
                      TextField(
                        controller: editEditingController,
                        decoration: const InputDecoration(
                          hintText: 'Edit your comment',
                          border: OutlineInputBorder(),
                        ),
                      )
                    else
                      Text(widget.comment.content),
                    if (_isEditing)
                      Row(
                        children: [
                          TextButton(
                            onPressed: _saveEdit,
                            child: const Text('Save'),
                          ),
                          TextButton(
                            onPressed: () {
                              setState(() {
                                _isEditing = false;
                                widget.toggleMainCommentField(true);
                              });
                            },
                            child: const Text('Cancel'),
                          ),
                        ],
                      ),
                    Text(
                      DateFormat.yMMMd().format(widget.comment.createdAt),
                      style: const TextStyle(color: Colors.grey),
                    ),
                    if (_replying)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: TextField(
                                    decoration: const InputDecoration(
                                      hintText: 'Enter your reply',
                                      border: OutlineInputBorder(),
                                    ),
                                    controller: replyEditingController,
                                    focusNode: replyFocusNode,
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.send),
                                  onPressed: () {
                                    _addReply(replyEditingController.text,
                                        widget.comment);
                                  },
                                ),
                              ],
                            ),
                            TextButton(
                              onPressed: _toggleReply,
                              child: const Text('Cancel'),
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
          ...widget.comment.children.map((child) => CommentWidget(
                comment: child,
                level: widget.level + 1,
                deleteComment: widget.deleteComment,
                toggleMainCommentField:
                    widget.toggleMainCommentField, // Pass the toggle function
              )),
        ],
      ),
    );
  }
}
