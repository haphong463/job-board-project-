import 'package:flutter/material.dart';
import 'package:jobboardmobile/screens/quiz/questions_screen.dart';
import '../../models/quiz_model.dart';
import '../../service/quiz_service.dart';
import 'dart:async';

class QuizDetailScreen extends StatefulWidget {
  final Quiz quiz;
  final int userId;

  QuizDetailScreen({
    required this.quiz,
    required this.userId,
  });

  @override
  _QuizDetailScreenState createState() => _QuizDetailScreenState();
}

class _QuizDetailScreenState extends State<QuizDetailScreen> {
  late Future<AttemptsInfo?> _attemptsInfoFuture;

  @override
  void initState() {
    super.initState();
    _attemptsInfoFuture = _fetchAttemptsInfo();
  }

  Future<AttemptsInfo?> _fetchAttemptsInfo() async {
    try {
      final attemptsData =
          await QuizService().getAttemptsInfo(widget.quiz.id, widget.userId);
      return AttemptsInfo.fromJson(attemptsData);
    } catch (e) {
      print('Error fetching attempts info: $e');
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Chi tiết Quiz'),
      ),
      body: FutureBuilder<AttemptsInfo?>(
        future: _attemptsInfoFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error loading attempts info'));
          } else if (!snapshot.hasData) {
            return Center(child: Text('No attempts info available'));
          } else {
            final attemptsInfo = snapshot.data;
            return QuizDetailContent(
              quiz: widget.quiz,
              userId: widget.userId,
              attemptsInfo: attemptsInfo,
              onRefresh: () {
                setState(() {
                  _attemptsInfoFuture = _fetchAttemptsInfo();
                });
              },
            );
          }
        },
      ),
    );
  }
}

class QuizDetailContent extends StatefulWidget {
  final Quiz quiz;
  final int userId;
  final AttemptsInfo? attemptsInfo;
  final VoidCallback onRefresh;

  QuizDetailContent({
    required this.quiz,
    required this.userId,
    required this.attemptsInfo,
    required this.onRefresh,
  });

  @override
  _QuizDetailContentState createState() => _QuizDetailContentState();
}

class _QuizDetailContentState extends State<QuizDetailContent> {
  late int _timeLeft;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timeLeft = widget.attemptsInfo?.timeLeft ?? 0;
    if (_timeLeft > 0) {
      _startTimer();
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      if (_timeLeft > 0) {
        setState(() {
          _timeLeft--;
        });
      } else {
        timer.cancel();
        widget.onRefresh();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isLocked = widget.attemptsInfo?.locked ?? false;

    if (!isLocked) {
      _timer?.cancel();
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Image.network(
              widget.quiz.imageUrl,
              width: double.infinity,
              height: 200,
              fit: BoxFit.cover,
            ),
          ),
          SizedBox(height: 20),
          Text(
            widget.quiz.title,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 10),
          Text(
            widget.quiz.description,
            style: TextStyle(fontSize: 16),
          ),
          SizedBox(height: 20),
          Card(
            margin: EdgeInsets.symmetric(vertical: 10),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            elevation: 3,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Thông tin bài đánh giá',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 10),
                  _buildInfoItem(
                    Icons.info,
                    'Số lần làm bài còn lại: ${widget.attemptsInfo?.attemptsLeft ?? 0}',
                  ),
                  if (isLocked && _timeLeft > 0)
                    _buildInfoItem(
                      Icons.timer,
                      'Thời gian chờ: $_timeLeft giây',
                    ),
                  _buildInfoItem(
                    Icons.help,
                    '10 câu hỏi nhiều đáp án',
                  ),
                  _buildInfoItem(
                    Icons.access_time,
                    '10 phút làm bài',
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 20),
          Center(
            child: ElevatedButton(
              onPressed: isLocked
                  ? null
                  : () async {
                      await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => QuizQuestionsPage(
                            quizId: widget.quiz.id,
                            userId: widget.userId,
                          ),
                        ),
                      );
                      widget.onRefresh();
                    },
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                'Bắt đầu làm bài',
                style: TextStyle(fontSize: 16),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoItem(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        children: [
          Icon(icon, size: 20),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: TextStyle(fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }
}
