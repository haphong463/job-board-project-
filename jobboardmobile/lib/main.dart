import 'package:flutter/material.dart';
import 'package:jobboardmobile/screens/blog/blog_screen_widget.dart';

import 'screens/login_register/login_screen.dart';
import 'screens/login_register/signup_screen.dart';
import 'screens/main/main_screen.dart';
import 'screens/main/search_page.dart';
import 'screens/job/job_info_page.dart';
import 'screens/quiz/quiz_screen.dart';
import 'screens/login_register/forgotpassword_screen.dart';
import 'screens/login_register/resetpassword_screen.dart';

import 'screens/login_register/verify_screen.dart';
import 'screens/login_register/verifyreset_screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Job Board App',
      theme: ThemeData(primarySwatch: Colors.blue),
      //* Nhớ sửa lại chỗ này, em đang test blog nên để init là blog
      //* Oke nhé emmm - Nam
      initialRoute: '/blog',
      routes: {
        '/login': (context) => LoginScreen(),
        '/blog': (context) => BlogScreenWidget(),
        '/signup': (context) => SignupScreen(),
        '/forgot_password': (context) => ForgotPasswordScreen(),
        '/main': (context) => MainScreen(),
        '/reset_password': (context) => ResetPasswordScreen(),
        '/search': (context) => SearchPage(),
        '/application': (context) => MainScreen(),
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
      },
    );
  }
}
