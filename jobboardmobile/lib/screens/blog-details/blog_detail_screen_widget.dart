import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:intl/intl.dart';
import 'package:jobboardmobile/models/comment_model.dart';
import 'package:jobboardmobile/models/user_model.dart';
import 'package:jobboardmobile/screens/blog-details/comment_widget.dart';
import 'package:jobboardmobile/screens/blog-details/full_screen_image_widget.dart';
import 'package:jobboardmobile/screens/blog/blog_list_widget.dart';
import 'package:jobboardmobile/service/comment_service.dart';

class BlogDetail extends StatefulWidget {
  final BlogPost blog;

  const BlogDetail({super.key, required this.blog});

  @override
  _BlogDetailState createState() => _BlogDetailState();
}

class _BlogDetailState extends State<BlogDetail> {
  final CommentService _commentService = CommentService();
  TextEditingController commentEditingController = TextEditingController();
  FocusNode commentFocusNode = FocusNode(); // Step 1: Declare FocusNode

  List<Comment> _comments = [];

  @override
  void initState() {
    super.initState();
    _loadComments();
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
          'username': "haphong2134"
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
        _comments.removeWhere((comment) => comment.id == id);
      });
    } catch (e) {
      print('Failed to delete comment: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.blog.title),
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
                  .map((comment) => CommentWidget(comment: comment))
                  .toList(),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Padding(
        padding: MediaQuery.of(context).viewInsets,
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  decoration: const InputDecoration(
                    hintText: 'Enter your comment',
                    border: OutlineInputBorder(),
                  ),
                  controller: commentEditingController,
                  focusNode: commentFocusNode, // Step 2: Assign FocusNode
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
      ),
    );
  }
}
