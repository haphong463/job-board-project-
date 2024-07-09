import 'package:flutter/material.dart';

import 'screens/login_register/forgotpassword_screen.dart';
import 'screens/login_register/login_screen.dart';
import 'screens/login_register/resetpassword_screen.dart';
import 'screens/login_register/signup_screen.dart';
import 'screens/main/main_screen.dart';
import 'screens/main/search_page.dart';
import 'screens/job/application_page.dart';
import 'screens/job/job_info_page.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Job Board App',
      theme: ThemeData(primarySwatch: Colors.blue),
      initialRoute: '/login',
      routes: {
        '/login': (context) => LoginScreen(),
        '/signup': (context) => SignupScreen(),
        '/forgot_password': (context) => ForgotPasswordScreen(),
        '/main': (context) => MainScreen(),
        '/reset_password': (context) => ResetPasswordScreen(
              email: '',
              token: '',
            ),
        '/search': (context) => SearchPage(),
        '/application': (context) => MainScreen(),
        '/job': (context) => JobInfoPage(),
      },
    );
  }
}
