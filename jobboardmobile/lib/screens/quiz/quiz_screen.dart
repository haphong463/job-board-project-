import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../models/quiz_model.dart';
import '../../service/quiz_service.dart';
import 'quiz_detail_screen.dart';
import 'package:jobboardmobile/constant/endpoint.dart';

class QuizListScreen extends StatefulWidget {
  @override
  _QuizListScreenState createState() => _QuizListScreenState();
}

class _QuizListScreenState extends State<QuizListScreen> {
  final QuizService _quizService = QuizService();
  late Future<List<Quiz>> _futureQuizzes;
  final storage = FlutterSecureStorage();
  int? userId;
  Map<int, AttemptsInfo> attemptsInfo = {};

  @override
  void initState() {
    super.initState();
    _initializeUserId();
    _futureQuizzes = _quizService.fetchQuizzes();
  }

  Future<void> _initializeUserId() async {
    String? storedUserId = await storage.read(key: 'userId');
    if (storedUserId != null) {
      setState(() {
        userId = int.parse(storedUserId);
      });
    } else {
      print('User ID not found in storage');
    }
  }

  void fetchAttemptsInfo(int quizId, int userId) async {
    try {
      final attemptsData = await _quizService.getAttemptsInfo(quizId, userId);
      setState(() {
        attemptsInfo[quizId] = AttemptsInfo.fromJson(attemptsData);
      });
    } catch (e) {
      print('Error fetching attempts info: $e');
    }
  }

  Widget customCard(Quiz quiz) {
    // Replace localhost with the base URL
    String modifiedImageUrl =
        quiz.imageUrl.replaceAll('http://localhost:8080', Endpoint.imageUrl);

    return Padding(
      padding: EdgeInsets.symmetric(
        vertical: 20.0,
        horizontal: 30.0,
      ),
      child: InkWell(
        onTap: () async {
          if (userId != null) {
            fetchAttemptsInfo(quiz.id, userId!);
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => QuizDetailScreen(
                  quiz: quiz,
                  userId: userId!,
                ),
              ),
            );
          } else {
            print('User ID is not available');
          }
        },
        child: Material(
          color: Colors.indigoAccent,
          elevation: 10.0,
          borderRadius: BorderRadius.circular(25.0),
          child: Container(
            child: Column(
              children: <Widget>[
                Padding(
                  padding: EdgeInsets.symmetric(
                    vertical: 10.0,
                  ),
                  child: Material(
                    elevation: 5.0,
                    borderRadius: BorderRadius.circular(100.0),
                    child: Container(
                      height: 150.0,
                      width: 150.0,
                      child: ClipOval(
                        child: Image.network(
                          modifiedImageUrl,
                          fit: BoxFit.cover,
                          loadingBuilder: (BuildContext context, Widget child,
                              ImageChunkEvent? loadingProgress) {
                            if (loadingProgress == null) return child;
                            return Center(
                              child: CircularProgressIndicator(
                                value: loadingProgress.expectedTotalBytes !=
                                        null
                                    ? loadingProgress.cumulativeBytesLoaded /
                                        (loadingProgress.expectedTotalBytes ??
                                            1)
                                    : null,
                              ),
                            );
                          },
                          errorBuilder: (BuildContext context, Object error,
                              StackTrace? stackTrace) {
                            return Icon(Icons.error);
                          },
                        ),
                      ),
                    ),
                  ),
                ),
                Center(
                  child: Text(
                    quiz.title,
                    style: TextStyle(
                      fontSize: 20.0,
                      color: Colors.white,
                      fontFamily: "Quando",
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                Container(
                  padding: EdgeInsets.all(20.0),
                  child: Text(
                    quiz.description ?? '',
                    style: TextStyle(
                        fontSize: 18.0,
                        color: Colors.white,
                        fontFamily: "Alike"),
                    maxLines: 5,
                    textAlign: TextAlign.justify,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: Colors.black),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pushNamedAndRemoveUntil(
                context, '/main', (route) => false);
          },
        ),
        title: Column(
          children: [
            Text(
              'Danh sách Quiz',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.black,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            )
          ],
        ),
      ),
      body: FutureBuilder<List<Quiz>>(
        future: _futureQuizzes,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Lỗi: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('Không có quiz nào'));
          } else {
            return ListView.builder(
              padding: EdgeInsets.all(16),
              itemCount: snapshot.data!.length,
              itemBuilder: (context, index) {
                final quiz = snapshot.data![index];
                return customCard(quiz);
              },
            );
          }
        },
      ),
    );
  }
}
