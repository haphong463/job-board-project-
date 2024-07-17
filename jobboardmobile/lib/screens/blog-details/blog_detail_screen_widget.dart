import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:intl/intl.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/core/utils/color_util.dart';
import 'package:jobboardmobile/models/comment_model.dart';
import 'package:jobboardmobile/models/user_model.dart';
import 'package:jobboardmobile/screens/blog-details/comment_widget.dart';
import 'package:jobboardmobile/screens/blog-details/full_screen_image_widget.dart';
import 'package:jobboardmobile/screens/blog/blog_list_widget.dart';
import 'package:jobboardmobile/service/auth_service.dart';
import 'package:jobboardmobile/service/comment_service.dart';

class BlogDetail extends StatefulWidget {
  final BlogPost blog;

  const BlogDetail({super.key, required this.blog});

  @override
  _BlogDetailState createState() => _BlogDetailState();
}

class _BlogDetailState extends State<BlogDetail> {
  final AuthService _authService = AuthService();

  String? username;
  String? imageUrl;
  bool isShow = true; // Add this variable

  void _fetchUserDetails() async {
    username = await _authService.getUsername();
    imageUrl = await _authService.getImageUrl();
    setState(() {});
  }

  final CommentService _commentService = CommentService();
  TextEditingController commentEditingController = TextEditingController();
  FocusNode commentFocusNode = FocusNode(); // Step 1: Declare FocusNode

  List<Comment> _comments = [];

  @override
  void initState() {
    super.initState();
    _loadComments();
    _fetchUserDetails();
  }

  void _loadComments() async {
    try {
      List<Comment> comments =
          await _commentService.getCommentsByBlogSlug(widget.blog.slug);
      setState(() {
        _comments = comments;
      });
    } catch (e) {
      print('Failed to load comments: $e');
    }
  }

  void _addComment(String content) async {
    try {
      String temporaryCommentId = '${DateTime.now().millisecondsSinceEpoch}';

      var comment = {
        'id': temporaryCommentId,
        'blog': {'id': widget.blog.id},
        'content': content,
        'user': {
          'username': username
        }, // Assuming user.username is the username
      };
      Comment createdComment = await _commentService.createComment(comment);
      print(createdComment.content);
      setState(() {
        _comments.add(createdComment);
      });
      commentEditingController.clear();
      commentFocusNode.unfocus();
    } catch (e) {
      print('Failed to add comment: $e');
    }
  }

  void _updateComment(String id, Comment updatedComment) async {
    try {
      Comment updated = await _commentService.updateComment(id, updatedComment);
      setState(() {
        int index = _comments.indexWhere((comment) => comment.id == updated.id);
        if (index != -1) {
          _comments[index] = updated;
        }
      });
    } catch (e) {
      print('Failed to update comment: $e');
    }
  }

  void _deleteComment(String id) async {
    try {
      await _commentService.deleteComment(id);

      setState(() {
        _comments = _removeCommentFromTree(_comments, id);
      });
    } catch (e) {
      print('Failed to delete comment: $e');
    }
  }

  List<Comment> _removeCommentFromTree(
      List<Comment> comments, String commentId) {
    return comments
        .map((comment) {
          if (comment.id == commentId) {
            return null;
          } else {
            return Comment(
              id: comment.id,
              content: comment.content,
              user: comment.user,
              createdAt: comment.createdAt,
              children: _removeCommentFromTree(comment.children, commentId),
              blog: comment.blog,
              updatedAt: comment.updatedAt,
            );
          }
        })
        .where((comment) => comment != null) // Filter out null values
        .map((comment) => comment!) // Convert Comment? to Comment
        .toList();
  }

  void _toggleCommentField(bool isVisibility) {
    setState(() {
      isShow = isVisibility;
      if (!isShow) {
        commentFocusNode.unfocus();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.blog.title,
          style: const TextStyle(color: Colors.white),
        ),
        backgroundColor: ColorUtil.primaryColor,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GestureDetector(
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) =>
                        FullScreenImage(imageUrl: widget.blog.imageUrl),
                  ),
                );
              },
              child: Hero(
                tag: widget.blog.imageUrl,
                child: Image.network(widget.blog.imageUrl),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              widget.blog.title,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              DateFormat.yMMMd().format(widget.blog.createdAt),
              style: const TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 16),
            Html(
              data: widget.blog.description,
              style: {
                "body": Style(
                    fontSize: FontSize(16.0),
                    listStyleType: ListStyleType.none),
              },
            ),
            const SizedBox(height: 16),
            const Divider(),
            const Text(
              'Comments',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            Column(
              children: _comments
                  .map((comment) => CommentWidget(
                        key: ValueKey(comment.id),
                        comment: comment,
                        deleteComment: _deleteComment,
                        toggleMainCommentField:
                            _toggleCommentField, // Pass the toggle function
                      ))
                  .toList(),
            ),
          ],
        ),
      ),
      bottomNavigationBar: isShow
          ? Padding(
              padding: MediaQuery.of(context).viewInsets,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  children: [
                    if (imageUrl != null)
                      ClipOval(
                        child: Image.network(
                          imageUrl!.replaceFirst(
                            'http://localhost:8080',
                            Endpoint.imageUrl,
                          ),
                          fit: BoxFit.cover,
                          width: 40,
                          height: 40,
                        ),
                      )
                    else
                      ClipOval(
                        child: Container(
                          color:
                              Colors.grey[200], // Background color for the icon
                          width: 40,
                          height: 40,
                          child: const Icon(Icons.person,
                              size: 24, color: Colors.grey), // Default icon
                        ),
                      ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: TextField(
                        decoration: const InputDecoration(
                          hintText: 'Enter your comment',
                          border: OutlineInputBorder(),
                        ),
                        controller: commentEditingController,
                        focusNode: commentFocusNode,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.send),
                      onPressed: () {
                        _addComment(commentEditingController.text);
                      },
                    ),
                  ],
                ),
              ),
            )
          : null,
    );
  }
}
