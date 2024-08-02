import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/models/blog_model.dart';
import 'package:jobboardmobile/models/content_model.dart';
import 'package:jobboardmobile/models/user_model.dart';
import 'package:jobboardmobile/screens/blog-details/blog_detail_screen_widget.dart';

class BlogList extends StatelessWidget {
  final List<ContentModel> blogs;

  const BlogList({super.key, required this.blogs});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: blogs.length,
      itemBuilder: (context, index) {
        String modifiedImageUrl = blogs[index]
            .imageUrl
            .replaceAll('http://localhost:8080', Endpoint.imageUrl);

        return BlogCard(
          blog: ContentModel(
            id: blogs[index].id,
            content: blogs[index].content,
            imageUrl: modifiedImageUrl,
            title: blogs[index].title,
            citation: blogs[index].citation,
            createdAt: blogs[index].createdAt,
            user: blogs[index].user,
            slug: blogs[index].slug,
            categories: blogs[index].categories,
            hashtags: blogs[index].hashtags,
            thumbnailUrl: blogs[index].thumbnailUrl,
            updatedAt: blogs[index].updatedAt,
          ),
        );
      },
    );
  }
}

class BlogCard extends StatelessWidget {
  final ContentModel blog;

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
              // Display category chips
              Wrap(
                spacing: 6.0,
                runSpacing: 6.0,
                children: blog.categories.map((category) {
                  return Chip(
                    label: Text(
                        category.name), // Adjust based on your category model
                    backgroundColor: Colors.blue.shade100,
                    padding: const EdgeInsets.symmetric(horizontal: 8.0),
                  );
                }).toList(),
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
