import 'package:flutter/material.dart';
import 'package:jobboardmobile/models/blog_model.dart';
import 'package:jobboardmobile/screens/blog/blog_list_widget.dart';
import 'package:jobboardmobile/service/blog_service.dart';

class BlogScreenWidget extends StatefulWidget {
  const BlogScreenWidget({super.key});

  @override
  _BlogScreenWidgetState createState() => _BlogScreenWidgetState();
}

class _BlogScreenWidgetState extends State<BlogScreenWidget> {
  final TextEditingController _queryController = TextEditingController();
  final TextEditingController _typeController = TextEditingController();
  late Future<BlogModel> _futureBlogs;
  String _query = '';
  String _type = 'ALL';
  int _currentPage = 0;
  int _totalPages = 1;

  @override
  void initState() {
    super.initState();
    _fetchBlogs();
  }

  void _fetchBlogs() {
    setState(() {
      _futureBlogs =
          BlogService().searchBlogs(_query, _type, page: _currentPage);
    });
  }

  void _searchBlogs() {
    setState(() {
      _query = _queryController.text;
      _type = _typeController.text.isNotEmpty ? _typeController.text : 'ALL';
      _currentPage = 0;
      _fetchBlogs();
    });
  }

  void _nextPage() {
    if (_currentPage < _totalPages - 1) {
      setState(() {
        _currentPage++;
        _fetchBlogs();
      });
    }
  }

  void _previousPage() {
    if (_currentPage > 0) {
      setState(() {
        _currentPage--;
        _fetchBlogs();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Blog List'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _queryController,
                    decoration: const InputDecoration(
                      labelText: 'Search Query',
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: TextField(
                    controller: _typeController,
                    decoration: const InputDecoration(
                      labelText: 'Type',
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: _searchBlogs,
                  child: const Text('Search'),
                ),
              ],
            ),
          ),
          Expanded(
            child: FutureBuilder<BlogModel>(
              future: _futureBlogs,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (snapshot.hasData) {
                  _totalPages = snapshot.data!.totalPages;
                  print(snapshot.data!.content.length);
                  return Column(
                    children: [
                      Expanded(
                        child: BlogList(
                          blogs: snapshot.data!.content.map((content) {
                            return BlogPost(
                                description: content.content,
                                id: content.id,
                                imageUrl: content.imageUrl,
                                title: content.title,
                                createdAt: content.createdAt,
                                citation: content.citation,
                                user: content.user,
                                slug: content.slug);
                          }).toList(),
                        ),
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          ElevatedButton(
                            onPressed: _previousPage,
                            child: const Text('Previous'),
                          ),
                          Text('Page ${_currentPage + 1} of $_totalPages'),
                          ElevatedButton(
                            onPressed: _nextPage,
                            child: const Text('Next'),
                          ),
                        ],
                      ),
                    ],
                  );
                } else {
                  return const Center(child: Text('No blogs found'));
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
