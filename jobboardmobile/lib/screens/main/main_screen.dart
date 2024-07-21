import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jobboardmobile/constant/endpoint.dart';
import 'package:jobboardmobile/service/quiz_service.dart';

import '../../core/utils/color_util.dart';
import '../../service/auth_service.dart';
import '../../widget/box_icon.dart';
import '../../widget/custom_app_bar.dart';
import '../../core/utils/asset_path_list.dart' as assetPath;
import '../../widget/search_icon.dart';

class SearchIcon extends StatelessWidget {
  final Function onTapSuffix;

  const SearchIcon({super.key, required this.onTapSuffix});

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.search),
      onPressed: () => onTapSuffix(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  final AuthService _authService = AuthService();
  final storage = const FlutterSecureStorage();
  String? firstName;
  String? lastName;
  String? email;
  String? imageUrl;
  @override
  void initState() {
    super.initState();
    _fetchUserDetails();
  }

  void _fetchUserDetails() async {
    firstName = await _authService.getFirstName();
    lastName = await _authService.getLastName();
    email = await _authService.getEmail();
    imageUrl = await _authService.getImageUrl();

    setState(() {});
  }

  void _logout() async {
    await _authService.logout();
    Navigator.pushReplacementNamed(context, '/login');
  }

  final List<Map<String, dynamic>> _listForYouData = [
    {
      "icon-path": assetPath.SPOTIFY_ICON_PATH,
      "type": "Full Time",
      "position": "UI/UX Designer",
      "salary": "\$450/hr",
      "is-active": true,
    },
    {
      "icon-path": assetPath.GOOGLE_ICON_PATH,
      "type": "Full Time",
      "position": "Senior Developer",
      "salary": "\$500/hr",
      "is-active": false,
    },
    {
      "icon-path": assetPath.IBM_ICON_PATH,
      "type": "Part Time",
      "position": "Visual Designer",
      "salary": "\$450/hr",
      "is-active": false,
    },
  ];

  final List<Map<String, dynamic>> _listRecentlyAddedData = [
    {
      "icon-path": assetPath.IBM_ICON_PATH,
      "company": "IBM",
      "position": "Visual Designer",
      "salary": "\$450/hr",
    },
    {
      "icon-path": assetPath.GOOGLE_ICON_PATH,
      "company": "Google",
      "position": "Server Technician",
      "salary": "\$500/hr",
    },
    {
      "icon-path": assetPath.FACEBOOK_ICON_PATH,
      "company": "Facebook",
      "position": "Ajax Developer",
      "salary": "\$250/hr",
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: ColorUtil.primaryColor,
        actions: [
          SearchIcon(
            onTapSuffix: () => Navigator.of(context).pushNamed('/search'),
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            UserAccountsDrawerHeader(
              accountName: Text('${firstName ?? ''} ${lastName ?? ''}'),
              accountEmail: Text(email ?? ''),
              currentAccountPicture: imageUrl != null
                  ? ClipOval(
                      child: Image.network(
                      imageUrl!.replaceFirst(
                        'http://localhost:8080',
                        Endpoint.imageUrl,
                      ),
                      fit: BoxFit.cover,
                      width: 40,
                      height: 40,
                    ))
                  : const Icon(
                      Icons.face,
                      size: 48.0,
                      color: Colors.white,
                    ),
              otherAccountsPictures: const [
                Icon(
                  Icons.bookmark_border,
                  color: Colors.white,
                ),
              ],
              decoration: BoxDecoration(
                color: ColorUtil.primaryColor,
              ),
            ),
            ListTile(
              leading: const Icon(Icons.note_add),
              title: const Text('Blog'),
              onTap: () {
                Navigator.pushNamed(context, '/blog');
              },
            ),
            ListTile(
              leading: const Icon(Icons.notifications),
              title: const Text('Notifications'),
              onTap: () {
                Navigator.pushNamed(context, '/notifications');
              },
            ),
            ListTile(
              leading: const Icon(Icons.note_add),
              title: const Text('Quiz'),
              onTap: () {
                Navigator.pushNamed(context, '/quizzes');
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.settings),
              title: const Text('Settings'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.logout),
              title: const Text('Logout'),
              onTap: () {
                _logout();
              },
            ),
          ],
        ),
      ),
      body: Container(
        margin: const EdgeInsets.symmetric(horizontal: 25),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTags(),
            const SizedBox(height: 10),
            _buildForYouSection(),
            const SizedBox(height: 10),
            _buildRecentlyAddedSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildTags() {
    return Container(
      child: Row(
        children: [
          _buildFlatButton("New York"),
          const SizedBox(width: 15),
          _buildFlatButton("Full Time"),
        ],
      ),
    );
  }

  Widget _buildFlatButton(String title) {
    return TextButton(
      style: TextButton.styleFrom(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
      onPressed: () {},
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 10),
        child: Row(
          children: [
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                color: ColorUtil.primaryColor,
              ),
            ),
            const SizedBox(width: 5),
            Icon(
              Icons.close,
              color: ColorUtil.primaryColor,
              size: 23,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildForYouSection() {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 15),
      child: Column(
        children: [
          const Align(
            alignment: Alignment.centerLeft,
            child: Text(
              "For You",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            height: 190,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemBuilder: (context, index) {
                return _buildForYouCard(_listForYouData[index]);
              },
              separatorBuilder: (content, index) => const SizedBox(
                width: 15,
              ),
              itemCount: _listForYouData.length,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildForYouCard(Map<String, dynamic> data) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
      width: 210,
      decoration: BoxDecoration(
        color: data["is-active"] ? ColorUtil.primaryColor : Colors.white,
        borderRadius: const BorderRadius.all(
          Radius.circular(10.0),
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Image.asset(
                  data["icon-path"],
                  height: 40,
                  width: 40,
                ),
                Text(
                  data["type"],
                  style: TextStyle(
                    color: data["is-active"] ? Colors.white : Colors.black,
                    fontSize: 15,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ],
            ),
          ),
          Container(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  data["position"],
                  style: TextStyle(
                    color: data["is-active"] ? Colors.white : Colors.black,
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 15),
                Text(
                  data["salary"],
                  style: TextStyle(
                    color: data["is-active"] ? Colors.white : Colors.black,
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentlyAddedSection() {
    return Expanded(
      child: Container(
        constraints: const BoxConstraints.expand(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Recently Added",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),
            Expanded(
              child: Container(
                padding: const EdgeInsets.only(top: 5, bottom: 10),
                child: ListView.separated(
                  padding: EdgeInsets.zero,
                  itemBuilder: (context, index) {
                    return _buildRecentlyAddedCard(
                        _listRecentlyAddedData[index]);
                  },
                  separatorBuilder: (content, index) => const SizedBox(
                    height: 10,
                  ),
                  itemCount: _listRecentlyAddedData.length,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentlyAddedCard(Map<String, dynamic> data) {
    return Container(
      height: 75,
      padding: const EdgeInsets.all(15),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.all(
          Radius.circular(10.0),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.only(right: 15),
            child: Image.asset(
              data["icon-path"],
              height: 40,
              width: 40,
            ),
          ),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  data["position"],
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  data["company"],
                  style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: ColorUtil.tertiaryColor),
                ),
              ],
            ),
          ),
          Text(
            data["salary"],
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          )
        ],
      ),
    );
  }
}
