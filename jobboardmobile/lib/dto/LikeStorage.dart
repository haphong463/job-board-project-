import 'package:shared_preferences/shared_preferences.dart';

class LikeStorage {
  static Future<void> saveLikeStatus(int reviewId, bool isLiked) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('review_$reviewId', isLiked);
  }

  static Future<bool> getLikeStatus(int reviewId) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('review_$reviewId') ?? false;
  }
}
