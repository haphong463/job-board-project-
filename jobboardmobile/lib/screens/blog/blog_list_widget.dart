import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:jobboardmobile/models/blog_model.dart';
import 'package:jobboardmobile/models/user_model.dart';
import 'package:jobboardmobile/screens/blog-details/blog_detail_screen_widget.dart';

class BlogList extends StatelessWidget {
  final List<BlogPost> blogs;

  const BlogList({super.key, required this.blogs});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: blogs.length,
      itemBuilder: (context, index) {
        String modifiedImageUrl = blogs[index]
            .imageUrl
            .replaceAll('http://localhost:8080', 'http://192.168.1.17:8080');

        return BlogCard(
          blog: BlogPost(
              id: blogs[index].id,
              description: blogs[index].description,
              imageUrl: modifiedImageUrl,
              title: blogs[index].title,
              citation: blogs[index].citation,
              createdAt: blogs[index].createdAt,
              user: blogs[index].user,
              slug: blogs[index].slug),
        );
      },
    );
  }
}

class BlogCard extends StatelessWidget {
  final BlogPost blog;

  const BlogCard({super.key, required this.blog});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => BlogDetail(blog: blog),
          ),
        );
      },
      child: Card(
        margin: const EdgeInsets.all(10),
        child: Padding(
          padding: const EdgeInsets.all(10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Image.network(blog.imageUrl),
              const SizedBox(height: 10),
              Text(
                blog.title,
                style:
                    const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 5),
              Text(
                blog.citation,
                maxLines: 4,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 10),
              Text(
                DateFormat.yMMMd().format(blog.createdAt),
                style: const TextStyle(color: Colors.grey),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class BlogPost {
  final int id;
  final String imageUrl;
  final String title;
  final String citation;
  final DateTime createdAt;
  final User user;
  final String slug;
  final String description;

  BlogPost(
      {required this.imageUrl,
      required this.id,
      required this.title,
      required this.description,
      required this.citation,
      required this.createdAt,
      required this.user,
      required this.slug});
}
