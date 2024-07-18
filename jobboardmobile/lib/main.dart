import 'package:flutter/material.dart';
import 'package:jobboardmobile/screens/notification/notification_screen.dart';
import 'package:kommunicate_flutter/kommunicate_flutter.dart';
import 'package:jobboardmobile/screens/blog/blog_screen_widget.dart';
import 'screens/login_register/login_screen.dart';
import 'screens/login_register/signup_screen.dart';
import 'screens/main/main_screen.dart';
import 'screens/main/search_page.dart';
import 'screens/job/job_info_page.dart';
import 'screens/quiz/quiz_result.dart';
import 'screens/quiz/quiz_screen.dart';
import 'screens/login_register/forgotpassword_screen.dart';
import 'screens/login_register/resetpassword_screen.dart';
import 'screens/login_register/verify_screen.dart';
import 'screens/login_register/verifyreset_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Job Board App',
      theme: ThemeData(primarySwatch: Colors.blue),
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/blog': (context) => const BlogScreenWidget(),
        '/signup': (context) => SignupScreen(),
        '/forgot_password': (context) => ForgotPasswordScreen(),
        '/main': (context) => const MainScreen(),
        '/reset_password': (context) => ResetPasswordScreen(),
        '/search': (context) => SearchPage(),
        '/application': (context) => const MainScreen(),
        '/job': (context) => JobInfoPage(),
        '/quizzes': (context) => QuizListScreen(),
        '/verify': (context) => VerifyScreen(email: ''),
        '/verify_reset': (context) {
          final args = ModalRoute.of(context)?.settings.arguments
              as Map<String, dynamic>?;

          return VerifyResetScreen(
            email: args?['email'] ?? '',
          );
        },
        '/notifications': (context) => const NotificationScreen(),
      },
      onGenerateRoute: (settings) {
        if (settings.name!.startsWith('/quiz/')) {
          final uri = Uri.parse(settings.name!);
          if (uri.pathSegments.length == 3 && uri.pathSegments[2] == 'result') {
            final args = settings.arguments as Map<String, dynamic>;
            return MaterialPageRoute(
              builder: (context) => QuizResultPage(arguments: args),
            );
          }
        }
        return null;
      },
    );
  }
}
