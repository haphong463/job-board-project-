import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:kommunicate_flutter/kommunicate_flutter.dart';
import '../../service/auth_service.dart';
import 'signup_screen.dart';
import 'forgotpassword_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final AuthService _authService = AuthService();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String _errorMessage = '';

  void _login() async {
    final response = await _authService.login(
      _usernameController.text,
      _passwordController.text,
    );

    if (response.statusCode == 200) {
      Navigator.pushReplacementNamed(context, '/main');
    } else {
      setState(() {
        _errorMessage = 'Invalid username or password';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: <Widget>[
          Container(
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: AssetImage('assets/images/hero_1.jpg'),
                fit: BoxFit.fitWidth,
                alignment: Alignment.topCenter,
              ),
            ),
          ),
          Container(
            width: MediaQuery.of(context).size.width,
            margin: const EdgeInsets.only(top: 270),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              color: Colors.white,
            ),
            child: Padding(
              padding: const EdgeInsets.all(23),
              child: ListView(
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.fromLTRB(0, 20, 0, 20),
                    child: Container(
                      color: const Color(0xfff5f5f5),
                      child: TextFormField(
                        controller: _usernameController,
                        style: const TextStyle(
                          color: Colors.black,
                          fontFamily: 'SFUIDisplay',
                        ),
                        decoration: const InputDecoration(
                          border: OutlineInputBorder(),
                          labelText: 'Username',
                          prefixIcon: Icon(Icons.person_outline),
                          labelStyle: TextStyle(
                            fontSize: 15,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Container(
                    color: const Color(0xfff5f5f5),
                    child: TextFormField(
                      controller: _passwordController,
                      obscureText: true,
                      style: const TextStyle(
                        color: Colors.black,
                        fontFamily: 'SFUIDisplay',
                      ),
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Password',
                        prefixIcon: Icon(Icons.lock_outline),
                        labelStyle: TextStyle(
                          fontSize: 15,
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(top: 20),
                    child: MaterialButton(
                      onPressed: _login,
                      color: const Color.fromARGB(255, 45, 255, 132),
                      elevation: 0,
                      minWidth: 400,
                      height: 50,
                      textColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text('SIGN IN',
                          style: TextStyle(
                              fontSize: 15,
                              fontFamily: 'SFUIDisplay',
                              fontWeight: FontWeight.bold)),
                    ),
                  ),
                  if (_errorMessage.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 20),
                      child: Center(
                        child: Text(
                          _errorMessage,
                          style: const TextStyle(
                            fontFamily: 'SFUIDisplay',
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: Colors.red,
                          ),
                        ),
                      ),
                    ),
                  Padding(
                    padding: const EdgeInsets.only(top: 20),
                    child: Center(
                      child: GestureDetector(
                        onTap: () {
                          Navigator.pushNamed(context, '/forgot_password');
                        },
                        child: const Text(
                          'Forgot your password?',
                          style: TextStyle(
                            fontFamily: 'SFUIDisplay',
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(top: 30),
                    child: Center(
                      child: RichText(
                        text: TextSpan(
                          children: [
                            const TextSpan(
                              text: "Don't have an account? ",
                              style: TextStyle(
                                fontFamily: 'SFUIDisplay',
                                color: Colors.black,
                                fontSize: 15,
                              ),
                            ),
                            TextSpan(
                              text: "Sign up",
                              style: const TextStyle(
                                fontFamily: 'SFUIDisplay',
                                color: Color(0xffff2d55),
                                fontSize: 15,
                              ),
                              recognizer: TapGestureRecognizer()
                                ..onTap = () {
                                  Navigator.pushReplacementNamed(
                                      context, '/signup');
                                },
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.message),
        onPressed: () async {
          dynamic conversationObject = {
            'appId': '4ad31fa80e50f3c68e389cbfeffad7ac',
            'isSingleConversation': false
          };
          KommunicateFlutterPlugin.buildConversation(conversationObject)
              .then((result) {
            print(
                "Conversation builder success: $result"); //result.toString() will be the clientChannelKey
          }).catchError((error) {
            print("Conversation builder error occurred : $error");
          });
        },
      ),
    );
  }
}
