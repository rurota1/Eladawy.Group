import { useState } from 'react';
import { Copy, Check, FileCode, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export default function FlutterCodeViewer() {
  const [activeFile, setActiveFile] = useState<'main' | 'pubspec'>('main');
  const [copied, setCopied] = useState(false);

  const pubspecCode = `name: eladawy_group
description: "نظام إدارة المعرض والعقارات والمصاريف لمجموعة العدوي - تطبيق فلاتر فاخر"
publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  path_provider: ^2.1.1

dev_dependencies:
  flutter_test:
    sdk: flutter

flutter:
  uses-material-design: true

  # تهيئة وإعداد الصور والملفات المحددة
  assets:
    - assets/images/image_7.png
    - assets/images/image_8.png`;

  const mainDartCode = `import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:path_provider/path_provider.dart' as path_provider;

/// =========================================
/// 1. الثوابت وإعدادات الأنماط والألوان الفاخرة
/// =========================================
class AppColors {
  static const Color background = Color(0xFF000000); // خلفية سوداء مطلقة
  static const Color surface = Color(0xFF121212);    // أسطح رمادية داكنة جداً
  static const Color primaryRed = Color(0xFF8B0000);  // أحمر داكن عميق (كريمزون)
  static const Color accentGold = Color(0xFFD4AF37);  // ذهبي ملكي للتمييز والنصوص الهامة
  static const Color textPrimary = Color(0xFFFFFFFF); // نصوص بيضاء نقية
  static const Color textSecondary = Color(0xFFB0B0B0); // نصوص فرعية رمادية
  static const Color cardBorder = Color(0xFF331111);  // حدود حمراء داكنة جداً بطابع زجاجي
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // تهيئة Hive لقاعدة البيانات المحلية
  final appDocumentDir = await path_provider.getApplicationDocumentsDirectory();
  await Hive.initFlutter(appDocumentDir.path);
  
  // تسجيل المحولات اليدوية لتجنب الحاجة للـ build_runner
  Hive.registerAdapter(CarAdapter());
  Hive.registerAdapter(PropertyAdapter());
  Hive.registerAdapter(ExpenseAdapter());
  
  // فتح الصناديق لتخزين البيانات
  await DBService.initializeBoxes();
  
  runApp(const EladawyGroupApp());
}

class EladawyGroupApp extends StatelessWidget {
  const EladawyGroupApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Eladawy Group',
      debugShowCheckedModeBanner: false,
      locale: const Locale('ar', 'EG'), // واجهة عربية كاملة RTL
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.background,
        primaryColor: AppColors.primaryRed,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.primaryRed,
          secondary: AppColors.accentGold,
          background: AppColors.background,
          surface: AppColors.surface,
        ),
        fontFamily: 'Cairo', // خط عربي فاخر
        textTheme: const TextTheme(
          displayLarge: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 26),
          titleLarge: TextStyle(color: AppColors.accentGold, fontWeight: FontWeight.bold, fontSize: 18),
          bodyLarge: TextStyle(color: AppColors.textPrimary, fontSize: 14),
          bodyMedium: TextStyle(color: AppColors.textSecondary, fontSize: 12),
        ),
      ),
      home: const LoginScreen(),
    );
  }
}

/// =========================================
/// 2. نماذج البيانات (Models + Manual Adapters)
/// =========================================

// زمل السيارات
class Car {
  final String id;
  final String model;
  final double price;
  final String status; // 'available' (متاحة), 'reserved' (محجوزة), 'sold' (مباعة)

  Car({
    required this.id,
    required this.model,
    required this.price,
    required this.status,
  });
}

class CarAdapter extends TypeAdapter<Car> {
  @override
  final int typeId = 0;

  @override
  Car read(BinaryReader reader) {
    return Car(
      id: reader.read() as String,
      model: reader.read() as String,
      price: reader.read() as double,
      status: reader.read() as String,
    );
  }

  @override
  void write(BinaryWriter writer, Car obj) {
    writer.write(obj.id);
    writer.write(obj.model);
    writer.write(obj.price);
    writer.write(obj.status);
  }
}

// نموذج العقارات
class Property {
  final String id;
  final String type; // 'apartment' (شقة), 'villa' (فيلا), 'land' (أرض), 'building' (عمارة)
  final String location;
  final double area;
  final double price;
  final String status; // 'available' (متاح), 'sold' (مباع)

  Property({
    required this.id,
    required this.type,
    required this.location,
    required this.area,
    required this.price,
    required this.status,
  });
}

class PropertyAdapter extends TypeAdapter<Property> {
  @override
  final int typeId = 1;

  @override
  Property read(BinaryReader reader) {
    return Property(
      id: reader.read() as String,
      type: reader.read() as String,
      location: reader.read() as String,
      area: reader.read() as double,
      price: reader.read() as double,
      status: reader.read() as String,
    );
  }

  @override
  void write(BinaryWriter writer, Property obj) {
    writer.write(obj.id);
    writer.write(obj.type);
    writer.write(obj.location);
    writer.write(obj.area);
    writer.write(obj.price);
    writer.write(obj.status);
  }
}

// نموذج المصاريف
class Expense {
  final String date;
  final double amount;
  final String description;

  Expense({
    required this.date,
    required this.amount,
    required this.description,
  });
}

class ExpenseAdapter extends TypeAdapter<Expense> {
  @override
  final int typeId = 2;

  @override
  Expense read(BinaryReader reader) {
    return Expense(
      date: reader.read() as String,
      amount: reader.read() as double,
      description: reader.read() as String,
    );
  }

  @override
  void write(BinaryWriter writer, Expense obj) {
    writer.write(obj.date);
    writer.write(obj.amount);
    writer.write(obj.description);
  }
}

/// =========================================
/// 3. خدمة البيانات المحلية (DB Service)
/// =========================================
class DBService {
  static const String carBoxName = 'cars_box';
  static const String propertyBoxName = 'properties_box';
  static const String expenseBoxName = 'expenses_box';

  static Future<void> initializeBoxes() async {
    final carsBox = await Hive.openBox<Car>(carBoxName);
    final propBox = await Hive.openBox<Property>(propertyBoxName);
    final expBox = await Hive.openBox<Expense>(expenseBoxName);

    // إضافة بيانات تجريبية فاخرة في حال كانت قاعدة البيانات فارغة
    if (carsBox.isEmpty) {
      await carsBox.addAll([
        Car(id: '1', model: 'مرسيدس G-Class G63 AMG 2024', price: 18500000, status: 'available'),
        Car(id: '2', model: 'رينج روفر سبورت HSE Dynamic 2024', price: 12000000, status: 'reserved'),
        Car(id: '3', model: 'بورش 911 كاريرا GTS 2023', price: 14800000, status: 'available'),
        Car(id: '4', model: 'بي إم دبليو M5 Competition 2023', price: 9500000, status: 'sold'),
      ]);
    }

    if (propBox.isEmpty) {
      await propBox.addAll([
        Property(id: '1', type: 'villa', location: 'التجمع الخامس - ياسمين فيلاز', area: 450, price: 25000000, status: 'available'),
        Property(id: '2', type: 'apartment', location: 'الشيخ زايد - الكرمة دوبلكس', area: 280, price: 8400000, status: 'available'),
        Property(id: '3', type: 'building', location: 'العاصمة الإدارية - حي المال والأعمال', area: 1200, price: 65000000, status: 'sold'),
      ]);
    }

    if (expBox.isEmpty) {
      await expBox.addAll([
        Expense(date: '2026-05-10', amount: 120000, description: 'صيانة وتجهيز صالة العرض الرئيسية'),
        Expense(date: '2026-05-15', amount: 45000, description: 'حملة إعلانية رقمية على شوارع القاهرة'),
        Expense(date: '2026-05-19', amount: 180000, description: 'رواتب الموظفين والعمولات الشهرية'),
        Expense(date: '2026-05-20', amount: 12500, description: 'مصاريف مياه وكهرباء المعرض'),
      ]);
    }
  }

  static List<Car> getCars() {
    return Hive.box<Car>(carBoxName).values.toList();
  }

  static Future<void> addCar(Car car) async {
    await Hive.box<Car>(carBoxName).add(car);
  }

  static List<Property> getProperties() {
    return Hive.box<Property>(propertyBoxName).values.toList();
  }

  static Future<void> addProperty(Property property) async {
    await Hive.box<Property>(propertyBoxName).add(property);
  }

  static List<Expense> getExpenses() {
    return Hive.box<Expense>(expenseBoxName).values.toList();
  }

  static Future<void> addExpense(Expense expense) async {
    await Hive.box<Expense>(expenseBoxName).add(expense);
  }
}

/// =========================================
/// 4. رسم الأيقونات الفنية المخصصة (CustomPaint)
/// =========================================

// رسم أيقونة سيارة فاخرة ديناميكية
class CarIconPainter extends CustomPainter {
  final Color color;
  CarIconPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    Paint paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    Path path = Path();
    // تصميم هيكل سيارة رياضي انسيابي
    path.moveTo(0, size.height * 0.7);
    path.lineTo(size.width * 0.1, size.height * 0.7);
    path.quadraticBezierTo(size.width * 0.2, size.height * 0.45, size.width * 0.35, size.height * 0.4);
    path.lineTo(size.width * 0.65, size.height * 0.4);
    path.quadraticBezierTo(size.width * 0.8, size.height * 0.45, size.width * 0.9, size.height * 0.7);
    path.lineTo(size.width, size.height * 0.7);
    path.lineTo(size.width, size.height * 0.85);
    path.lineTo(0, size.height * 0.85);
    path.close();
    canvas.drawPath(path, paint);

    // العجلات
    Paint wheelPaint = Paint()
      ..color = AppColors.accentGold
      ..style = PaintingStyle.fill;

    canvas.drawCircle(Offset(size.width * 0.25, size.height * 0.85), size.width * 0.1, wheelPaint);
    canvas.drawCircle(Offset(size.width * 0.75, size.height * 0.85), size.width * 0.1, wheelPaint);

    Paint centerPaint = Paint()
      ..color = AppColors.background
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(size.width * 0.25, size.height * 0.85), size.width * 0.04, centerPaint);
    canvas.drawCircle(Offset(size.width * 0.75, size.height * 0.85), size.width * 0.04, centerPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// رسم أيقونة مبنى/برج تجاري وعقاري فاخر
class PropertyIconPainter extends CustomPainter {
  final Color color;
  PropertyIconPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    Paint paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    // المبنى الرئيسي
    canvas.drawRect(Rect.fromLTWH(size.width * 0.15, size.height * 0.1, size.width * 0.4, size.height * 0.8), paint);
    
    // مبنى جانبي
    Paint sidePaint = Paint()
      ..color = color.withOpacity(0.8)
      ..style = PaintingStyle.fill;
    canvas.drawRect(Rect.fromLTWH(size.width * 0.55, size.height * 0.35, size.width * 0.3, size.height * 0.55), sidePaint);

    // النوافذ الذهبية للمبنى الراقي
    Paint windowPaint = Paint()
      ..color = AppColors.accentGold
      ..style = PaintingStyle.fill;

    for (double y = size.height * 0.2; y < size.height * 0.8; y += size.height * 0.15) {
      canvas.drawRect(Rect.fromLTWH(size.width * 0.23, y, size.width * 0.08, size.height * 0.08), windowPaint);
      canvas.drawRect(Rect.fromLTWH(size.width * 0.39, y, size.width * 0.08, size.height * 0.08), windowPaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// رسم قائمة إحصاءات فاخرة بدون أيقونات خارجية
class MenuIconPainter extends CustomPainter {
  final Color color;
  MenuIconPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    Paint paint = Paint()
      ..color = color
      ..strokeWidth = 3.5
      ..strokeCap = StrokeCap.round;

    // ثلاثة أسطر متدرجة في الأطوال بجمالية ملكية
    canvas.drawLine(Offset(size.width * 0.15, size.height * 0.3), Offset(size.width * 0.85, size.height * 0.3), paint);
    
    Paint goldPaint = Paint()
      ..color = AppColors.accentGold
      ..strokeWidth = 3.5
      ..strokeCap = StrokeCap.round;
    canvas.drawLine(Offset(size.width * 0.3, size.height * 0.5), Offset(size.width * 0.85, size.height * 0.5), goldPaint);
    
    canvas.drawLine(Offset(size.width * 0.45, size.height * 0.7), Offset(size.width * 0.85, size.height * 0.7), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// =========================================
/// 5. الشاشات وواجهة المستخدم الكاملة
/// =========================================

// شاشة تسجبل الدخول بالـ PIN
class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _pinController = TextEditingController();
  String _errorMessage = '';

  void _handleLogin() {
    String enteredPin = _pinController.text;
    String role = '';

    if (enteredPin == '1111') {
      role = 'مدير';
    } else if (enteredPin == '2222') {
      role = 'مبيعات';
    } else {
      setState(() {
        _errorMessage = 'رمز PIN غير صحيح. جرب 1111 أو 2222';
      });
      return;
    }

    _pinController.clear();
    setState(() {
      _errorMessage = '';
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'أهلاً بك، تم الدخول بنجاح بصلاحية $role',
          textDirection: TextDirection.rtl,
          style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black),
        ),
        backgroundColor: AppColors.accentGold,
        duration: const Duration(seconds: 2),
      ),
    );

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => MainDashboard(userRole: role),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // خلفية المعرض المظلمة جراج (assets/images/image_7.png)
          Positioned.fill(
            child: Image.asset(
              'assets/images/image_7.png',
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                // بديل ممتاز في حال لم يعثر على الصورة الرياضية
                return Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [AppColors.background, Color(0xFF1B0000)],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                  ),
                );
              },
            ),
          ),
          // طبقة تظليل سوداء ناعمة للفخامة
          Positioned.fill(
            child: Container(
              color: Colors.black.withOpacity(0.75),
            ),
          ),
          // محتوى صف الدخول
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Card(
                elevation: 12,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: const BorderSide(color: AppColors.primaryRed, width: 1.2),
                ),
                color: Colors.black.withOpacity(0.85),
                child: Padding(
                  padding: const EdgeInsets.all(32.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // شعار المجموعة (assets/images/image_8.png)
                      Image.asset(
                        'assets/images/image_8.png',
                        height: 90,
                        errorBuilder: (context, error, stackTrace) {
                          return Column(
                            children: const [
                              Text(
                                'ELADAWY GROUP',
                                style: TextStyle(
                                  color: AppColors.accentGold,
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 2,
                                ),
                              ),
                              Text(
                                'مــجـمـوعــة الــعــدوي',
                                style: TextStyle(
                                  color: AppColors.textPrimary,
                                  fontSize: 16,
                                  letterSpacing: 1,
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                      const SizedBox(height: 12),
                      Container(
                        height: 2,
                        width: 80,
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Colors.transparent, AppColors.accentGold, Colors.transparent],
                          ),
                        ),
                      ),
                      const SizedBox(height: 30),
                      const Text(
                        'تسجيل دخول الموظفين والشركاء',
                        style: TextStyle(
                          fontSize: 15,
                          color: AppColors.textSecondary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 20),
                      // حقل PIN غامض أنيق
                      TextField(
                        controller: _pinController,
                        obscureText: true,
                        keyboardType: TextInputType.number,
                        maxLength: 4,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: AppColors.accentGold,
                          fontSize: 22,
                          letterSpacing: 12,
                          fontWeight: FontWeight.bold,
                        ),
                        decoration: InputDecoration(
                          counterText: '',
                          hintText: '••••',
                          hintStyle: TextStyle(
                            color: Colors.white24,
                            fontSize: 22,
                            letterSpacing: 12,
                          ),
                          filled: true,
                          fillColor: AppColors.surface,
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Colors.white12),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: AppColors.accentGold, width: 1.5),
                          ),
                          prefixIcon: const Icon(Icons.lock_outline, color: AppColors.primaryRed),
                        ),
                        onSubmitted: (_) => _handleLogin(),
                      ),
                      if (_errorMessage.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        Text(
                          _errorMessage,
                          style: const TextStyle(color: Colors.redAccent, fontSize: 13, fontWeight: FontWeight.bold),
                        ),
                      ],
                      const SizedBox(height: 24),
                      // زر الدخول
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: _handleLogin,
                          style: ElevatedButton.styleFrom(
                            primary: AppColors.primaryRed,
                            elevation: 5,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: const BorderSide(color: AppColors.accentGold, width: 0.8),
                            ),
                          ),
                          child: const Text(
                            'بوابة العبور الآمن',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'صلاحيات الوصول: المدير (1111) ・ المبيعات (2222)',
                        style: TextStyle(fontSize: 10, color: Colors.white38),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// لوحة التحكم الرئيسية المنظمة بـ 5 تبويبات
class MainDashboard extends StatefulWidget {
  final String userRole;
  const MainDashboard({Key? key, required this.userRole}) : super(key: key);

  @override
  State<MainDashboard> createState() => _MainDashboardState();
}

class _MainDashboardState extends State<MainDashboard> {
  int _currentIndex = 0;

  // الحفاظ على صندوق الحالة للبيانات
  List<Car> _cars = [];
  List<Property> _properties = [];
  List<Expense> _expenses = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  void _loadData() {
    setState(() {
      _cars = DBService.getCars();
      _properties = DBService.getProperties();
      _expenses = DBService.getExpenses();
    });
  }

  // تجديد البيانات بعد الإضافة
  void _onItemAdded() {
    _loadData();
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> tabs = [
      HomeTab(cars: _cars, properties: _properties, expenses: _expenses, role: widget.userRole),
      CarsTab(cars: _cars),
      PropertiesTab(properties: _properties),
      AddTab(onSuccess: _onItemAdded),
      ReportsTab(expenses: _expenses, role: widget.userRole),
    ];

    return Scaffold(
      drawer: Drawer(
        backgroundColor: AppColors.background,
        child: Column(
          children: [
            UserAccountsDrawerHeader(
              decoration: const BoxDecoration(
                color: AppColors.surface,
                border: Border(bottom: BorderSide(color: AppColors.primaryRed, width: 2)),
              ),
              currentAccountPicture: CircleAvatar(
                backgroundColor: AppColors.primaryRed,
                child: Text(
                  widget.userRole[0],
                  style: const TextStyle(color: AppColors.accentGold, fontSize: 28, fontWeight: FontWeight.bold),
                ),
              ),
              accountName: Text(
                'مستخدم: \${widget.userRole}',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              accountEmail: const Text('info@eladawygroup.com'),
            ),
            ListTile(
              leading: const Icon(Icons.dashboard_outlined, color: AppColors.accentGold),
              title: const Text('الرئيسية'),
              onTap: () {
                Navigator.pop(context);
                setState(() => _currentIndex = 0);
              },
            ),
            ListTile(
              leading: const Icon(Icons.directions_car_outlined, color: AppColors.accentGold),
              title: const Text('معرض السيارات'),
              onTap: () {
                Navigator.pop(context);
                setState(() => _currentIndex = 1);
              },
            ),
            ListTile(
              leading: const Icon(Icons.business_outlined, color: AppColors.accentGold),
              title: const Text('المحفظة العقارية'),
              onTap: () {
                Navigator.pop(context);
                setState(() => _currentIndex = 2);
              },
            ),
            ListTile(
              leading: const Icon(Icons.add_circle_outline, color: AppColors.accentGold),
              title: const Text('إدراج جديد'),
              onTap: () {
                Navigator.pop(context);
                setState(() => _currentIndex = 3);
              },
            ),
            ListTile(
              leading: const Icon(Icons.bar_chart_outlined, color: AppColors.accentGold),
              title: const Text('التقارير المالية والمصاريف'),
              onTap: () {
                Navigator.pop(context);
                setState(() => _currentIndex = 4);
              },
            ),
            const Spacer(),
            const Divider(color: Colors.white12),
            ListTile(
              leading: const Icon(Icons.logout, color: Colors.amber),
              title: const Text('تسجيل الخروج الآمن'),
              onTap: () {
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                  (route) => false,
                );
              },
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
      appBar: AppBar(
        title: Image.asset(
          'assets/images/image_8.png',
          height: 48,
          errorBuilder: (context, error, stackTrace) {
            return const Text(
              'ELADAWY GROUP',
              style: TextStyle(color: AppColors.accentGold, fontWeight: FontWeight.bold),
            );
          },
        ),
        centerTitle: true,
        backgroundColor: AppColors.surface,
        elevation: 10,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: AppColors.accentGold),
            onPressed: () {
              _loadData();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('تم تحديث البيانات بنجاح', textDirection: TextDirection.rtl),
                  backgroundColor: AppColors.primaryRed,
                  duration: Duration(milliseconds: 800),
                ),
              );
            },
          ),
        ],
      ),
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: tabs[_currentIndex],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        backgroundColor: AppColors.surface,
        selectedItemColor: AppColors.accentGold,
        unselectedItemColor: AppColors.textSecondary,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home, color: AppColors.accentGold),
            label: 'الرئيسية',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.directions_car_outlined),
            activeIcon: Icon(Icons.directions_car, color: AppColors.accentGold),
            label: 'السيارات',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.business_outlined),
            activeIcon: Icon(Icons.business, color: AppColors.accentGold),
            label: 'العقارات',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.add_circle_outline),
            activeIcon: Icon(Icons.add_circle, color: AppColors.accentGold),
            label: 'إضافة',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bar_chart_outlined),
            activeIcon: Icon(Icons.bar_chart, color: AppColors.accentGold),
            label: 'التقارير',
          ),
        ],
      ),
    );
  }
}

/// =========================================
/// 6. التبويب الأول: الشاشة الرئيسية (HomeTab)
/// =========================================
class HomeTab extends StatelessWidget {
  final List<Car> cars;
  final List<Property> properties;
  final List<Expense> expenses;
  final String role;

  const HomeTab({
    Key? key,
    required this.cars,
    required this.properties,
    required this.expenses,
    required this.role,
  }) : super(key: key);

  double get totalExpenses => expenses.fold(0, (sum, item) => sum + item.amount);
  double get totalCarsValue => cars.fold(0, (sum, item) => sum + item.price);
  double get totalPropertiesValue => properties.fold(0, (sum, item) => sum + item.price);

  String formatCurrency(double amount) {
    if (amount >= 1000000) {
      return '\${(amount / 1000000).toStringAsFixed(2)} مليون ج.م';
    } else {
      return '\${amount.toStringAsFixed(0)} ج.م';
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ترحيب وصلاحية زجاجية فاخرة
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: AppColors.primaryRed.withOpacity(0.5)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'مرحباً بك في نظام الإدارة الرئيسي',
                      style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'مجموعة العدوي للاستشارات والاستثمار',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.accentGold),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.primaryRed.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.accentGold),
                  ),
                  child: Text(
                    'الدور: \$role',
                    style: const TextStyle(fontSize: 12, color: AppColors.accentGold, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          const Text(
            'الملخص العام للمجموعة',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.accentGold),
          ),
          const SizedBox(height: 12),

          // بطاقة إجمالي المصاريف
          _buildStatCard(
            title: 'إجمالي المصاريف المسجلة',
            value: formatCurrency(totalExpenses),
            icon: CustomPaint(
              size: const Size(24, 24),
              painter: MenuIconPainter(color: Colors.red),
            ),
            gradientColors: [const Color(0xFF2C0202), const Color(0xFF140000)],
          ),
          const SizedBox(height: 12),

          // بطاقات إحصائيات بصفين
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  title: 'أسطول السيارات',
                  value: '\${cars.length} سيارات',
                  subtitle: 'قيمة: \${formatCurrency(totalCarsValue)}',
                  icon: CustomPaint(
                    size: const Size(24, 24),
                    painter: CarIconPainter(color: AppColors.accentGold),
                  ),
                  gradientColors: [const Color(0xFF1B1B1B), const Color(0xFF0F0F0F)],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                  title: 'المحفظة العقارية',
                  value: '\${properties.length} عقارات',
                  subtitle: 'قيمة: \${formatCurrency(totalPropertiesValue)}',
                  icon: CustomPaint(
                    size: const Size(24, 24),
                    painter: PropertyIconPainter(color: AppColors.accentGold),
                  ),
                  gradientColors: [const Color(0xFF1B1B1B), const Color(0xFF0F0F0F)],
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 24),
          const Text(
            'الاختصارات السريعة',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.accentGold),
          ),
          const SizedBox(height: 12),
          
          // صف الاختصارات التفاعلية السريعة
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildShortcutButton(
                context, 
                title: 'إضافة سيارة',
                icon: Icons.add_road,
                color: AppColors.primaryRed,
              ),
              _buildShortcutButton(
                context, 
                title: 'شقة جديدة', 
                icon: Icons.add_home_work_outlined,
                color: AppColors.accentGold,
              ),
              _buildShortcutButton(
                context, 
                title: 'أضف مصروف', 
                icon: Icons.add_alert_outlined,
                color: Colors.grey,
              ),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    String? subtitle,
    required Widget icon,
    required List<Color> gradientColors,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: gradientColors,
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primaryRed.withOpacity(0.3), width: 1),
      ),
      child: Stack(
        children: [
          Row(
            children: [
              CircleAvatar(
                backgroundColor: AppColors.background,
                radius: 24,
                child: icon,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                    const SizedBox(height: 4),
                    Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                    if (subtitle != null) ...[
                      const SizedBox(height: 4),
                      Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.accentGold)),
                    ]
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildShortcutButton(BuildContext context, {required String title, required IconData icon, required Color color}) {
    return Expanded(
      child: Card(
        color: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: color.withOpacity(0.3)),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('انتقل لتبويب "إضافة" لإتمام العملية السريعة', textDirection: TextDirection.rtl),
                backgroundColor: AppColors.primaryRed,
              ),
            );
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: Column(
              children: [
                Icon(icon, color: color, size: 28),
                const SizedBox(height: 8),
                Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// =========================================
/// 7. التبويب الثاني: سيارات المعرض (CarsTab)
/// =========================================
class CarsTab extends StatefulWidget {
  final List<Car> cars;
  const CarsTab({Key? key, required this.cars}) : super(key: key);

  @override
  State<CarsTab> createState() => _CarsTabState();
}

class _CarsTabState extends State<CarsTab> {
  String _filterStatus = 'all'; // all, available, reserved, sold
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    // تصفية السيارات بناء على الفلتر والبحث
    final filteredCars = widget.cars.where((car) {
      final matchesStatus = _filterStatus == 'all' || car.status == _filterStatus;
      final matchesSearch = car.model.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    }).toList();

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          // شريط البحث المطور
          TextField(
            controller: _searchController,
            onChanged: (val) {
              setState(() {
                _searchQuery = val;
              });
            },
            decoration: InputDecoration(
              hintText: 'ابحث عن سيارة معينة بالاسم...',
              prefixIcon: const Icon(Icons.search, color: AppColors.accentGold),
              filled: true,
              fillColor: AppColors.surface,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
          const SizedBox(height: 12),

          // فلاتر الحالة الفاخرة
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterButton('الكل', 'all'),
                const SizedBox(width: 8),
                _buildFilterButton('متاحة', 'available'),
                const SizedBox(width: 8),
                _buildFilterButton('محجوزة', 'reserved'),
                const SizedBox(width: 8),
                _buildFilterButton('مباعة', 'sold'),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // قائمة السيارات التفاعلية
          Expanded(
            child: filteredCars.isEmpty
                ? const Center(
                    child: Text(
                      'لا توجد سيارات مطابقة لبحثك في المعرض الآن',
                      style: TextStyle(color: AppColors.textSecondary),
                    ),
                  )
                : ListView.builder(
                    itemCount: filteredCars.length,
                    itemBuilder: (context, index) {
                      final car = filteredCars[index];
                      return _buildCarCard(car);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterButton(String label, String status) {
    final isSelected = _filterStatus == status;
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.black : Colors.white70,
          fontWeight: FontWeight.bold,
        ),
      ),
      selected: isSelected,
      onSelected: (selected) {
        if (selected) {
          setState(() {
            _filterStatus = status;
          });
        }
      },
      selectedColor: AppColors.accentGold,
      backgroundColor: AppColors.surface,
    );
  }

  Widget _buildCarCard(Car car) {
    Color badgeColor;
    String statusText;

    switch (car.status) {
      case 'available':
        badgeColor = Colors.green;
        statusText = 'متاحة للبيع فوراً';
        break;
      case 'reserved':
        badgeColor = Colors.amber;
        statusText = 'محجوزة لعميل';
        break;
      case 'sold':
        badgeColor = AppColors.primaryRed;
        statusText = 'تم البيع';
        break;
      default:
        badgeColor = Colors.grey;
        statusText = 'غير محدد';
    }

    return Card(
      color: AppColors.surface,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15),
        side: BorderSide(color: badgeColor.withOpacity(0.4)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            // أيقونة مرسومة خصيصاً بالجمالية الملكية
            CustomPaint(
              size: const Size(50, 50),
              painter: CarIconPainter(color: badgeColor),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    car.model,
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '\${(car.price / 1000000).toStringAsFixed(2)} مليون ج.م',
                    style: const TextStyle(color: AppColors.accentGold, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: badgeColor.withOpacity(0.15),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: badgeColor),
              ),
              child: Text(
                statusText,
                style: TextStyle(color: badgeColor, fontSize: 11, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// =========================================
/// 8. التبويب الثالث: العقارات (PropertiesTab)
/// =========================================
class PropertiesTab extends StatefulWidget {
  final List<Property> properties;
  const PropertiesTab({Key? key, required this.properties}) : super(key: key);

  @override
  State<PropertiesTab> createState() => _PropertiesTabState();
}

class _PropertiesTabState extends State<PropertiesTab> {
  String _filterType = 'all'; // all, apartment, villa, building

  @override
  Widget build(BuildContext context) {
    final filteredProps = _filterType == 'all'
        ? widget.properties
        : widget.properties.where((p) => p.type == _filterType).toList();

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          // فلاتر نوع العقار
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterButton('كل العقارات', 'all'),
                const SizedBox(width: 8),
                _buildFilterButton('فلل فاخرة', 'villa'),
                const SizedBox(width: 8),
                _buildFilterButton('شقق سكنية', 'apartment'),
                const SizedBox(width: 8),
                _buildFilterButton('مباني استثمارية', 'building'),
              ],
            ),
          ),
          const SizedBox(height: 16),

          Expanded(
            child: filteredProps.isEmpty
                ? const Center(
                    child: Text(
                      'لا توجد عقارات مضافة في هذا التصنيف حالياً',
                      style: TextStyle(color: AppColors.textSecondary),
                    ),
                  )
                : ListView.builder(
                    itemCount: filteredProps.length,
                    itemBuilder: (context, index) {
                      final prop = filteredProps[index];
                      return _buildPropertyCard(prop);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterButton(String label, String type) {
    final isSelected = _filterType == type;
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.black : Colors.white70,
          fontWeight: FontWeight.bold,
        ),
      ),
      selected: isSelected,
      onSelected: (selected) {
        if (selected) {
          setState(() {
            _filterType = type;
          });
        }
      },
      selectedColor: AppColors.accentGold,
      backgroundColor: AppColors.surface,
    );
  }

  Widget _buildPropertyCard(Property prop) {
    String typeAr = '';
    IconData iconData = Icons.business;

    switch (prop.type) {
      case 'villa':
        typeAr = 'فيلا ملكية';
        iconData = Icons.holiday_village_outlined;
        break;
      case 'apartment':
        typeAr = 'شقة سكنية راقية';
        iconData = Icons.apartment;
        break;
      case 'building':
        typeAr = 'مبنى تجاري واستثماري';
        iconData = Icons.home_work_outlined;
        break;
      default:
        typeAr = 'وحدة عقارية';
    }

    final isAvailable = prop.status == 'available';

    return Card(
      color: AppColors.surface,
      margin: const EdgeInsets.only(bottom: 14),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15),
        side: BorderSide(
          color: isAvailable ? AppColors.accentGold.withOpacity(0.3) : AppColors.primaryRed.withOpacity(0.4),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ListTile(
            leading: CustomPaint(
              size: const Size(40, 40),
              painter: PropertyIconPainter(color: isAvailable ? AppColors.accentGold : AppColors.primaryRed),
            ),
            title: Text(
              prop.location,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
            ),
            subtitle: Text(
              'التصنيف: \$typeAr | المساحة: \${prop.area} م²',
              style: const TextStyle(fontSize: 12),
            ),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: isAvailable ? Colors.green.withOpacity(0.1) : AppColors.primaryRed.withOpacity(0.1),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: isAvailable ? Colors.green : AppColors.primaryRed, width: 0.8),
              ),
              child: Text(
                isAvailable ? 'متاح للتعاقد' : 'مباع',
                style: TextStyle(color: isAvailable ? Colors.green : AppColors.primaryRed, fontSize: 10, fontWeight: FontWeight.bold),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 16.0, right: 16.0, bottom: 16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'قيمة الاستثمار الكاملة:',
                  style: TextStyle(color: Colors.white38, fontSize: 12),
                ),
                Text(
                  '\${(prop.price / 1000000).toStringAsFixed(2)} مليون ج.م',
                  style: const TextStyle(
                    color: AppColors.accentGold,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// =========================================
/// 9. التبويب الرابع: إضافة أصل (AddTab)
/// =========================================
class AddTab extends StatefulWidget {
  final VoidCallback onSuccess;
  const AddTab({Key? key, required this.onSuccess}) : super(key: key);

  @override
  State<AddTab> createState() => _AddTabState();
}

class _AddTabState extends State<AddTab> {
  String _activeForm = 'car'; // car, property, expense

  // حقول السيارة
  final _carModelController = TextEditingController();
  final _carPriceController = TextEditingController();
  String _carStatus = 'available';

  // حقول العقار
  final _propLocationController = TextEditingController();
  final _propAreaController = TextEditingController();
  final _propPriceController = TextEditingController();
  String _propType = 'apartment';
  String _propStatus = 'available';

  // حقول المصروف
  final _expAmountController = TextEditingController();
  final _expDescController = TextEditingController();

  final _formKey = GlobalKey<FormState>();

  void _clearForms() {
    _carModelController.clear();
    _carPriceController.clear();
    _propLocationController.clear();
    _propAreaController.clear();
    _propPriceController.clear();
    _expAmountController.clear();
    _expDescController.clear();
  }

  void _submitData() async {
    if (!_formKey.currentState!.validate()) return;

    try {
      if (_activeForm == 'car') {
        final newCar = Car(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          model: _carModelController.text.trim(),
          price: double.parse(_carPriceController.text.trim()),
          status: _carStatus,
        );
        await DBService.addCar(newCar);
      } else if (_activeForm == 'property') {
        final newProp = Property(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          type: _propType,
          location: _propLocationController.text.trim(),
          area: double.parse(_propAreaController.text.trim()),
          price: double.parse(_propPriceController.text.trim()),
          status: _propStatus,
        );
        await DBService.addProperty(newProp);
      } else {
        final newExp = Expense(
          date: DateTime.now().toString().substring(0, 10),
          amount: double.parse(_expAmountController.text.trim()),
          description: _expDescController.text.trim(),
        );
        await DBService.addExpense(newExp);
      }

      _clearForms();
      widget.onSuccess();

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('تم حفظ البيانات بنجاح في قاعدة البيانات', textDirection: TextDirection.rtl),
          backgroundColor: AppColors.accentGold,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('خطأ أثناء الحفظ: تأكد من كتابة الأرقام الإنجليزية الصحيحة', textDirection: TextDirection.rtl),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'إدراج في دفاتــر المجموعة',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.accentGold),
            ),
            const SizedBox(height: 6),
            const Text(
              'اختر نوع الأصل لإضافته إلى محفظة مجموعة العدوي الاستثمارية والمالية مباشرة',
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 20),

            // محدد التبويب الجزئي
            Row(
              children: [
                _buildToggleTab('سيارة جديدة', 'car'),
                const SizedBox(width: 8),
                _buildToggleTab('عقار جديد', 'property'),
                const SizedBox(width: 8),
                _buildToggleTab('مصروف مالي', 'expense'),
              ],
            ),
            const SizedBox(height: 24),

            // توليد النموذج المناسب
            if (_activeForm == 'car') _buildCarForm(),
            if (_activeForm == 'property') _buildPropertyForm(),
            if (_activeForm == 'expense') _buildExpenseForm(),

            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _submitData,
                style: ElevatedButton.styleFrom(
                  primary: AppColors.primaryRed,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: const BorderSide(color: AppColors.accentGold, width: 0.8),
                  ),
                ),
                child: const Text(
                  'تثبيت وقيد الأصل المختار',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildToggleTab(String label, String formName) {
    final isSelected = _activeForm == formName;
    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() {
            _activeForm = formName;
            _clearForms();
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primaryRed : AppColors.surface,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: isSelected ? AppColors.accentGold : Colors.white12),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: isSelected ? Colors.white : AppColors.textSecondary,
              fontSize: 13,
            ),
          ),
        ),
      ),
    );
  }

  // نموذج السيارة
  Widget _buildCarForm() {
    return Column(
      children: [
        _buildTextField('موديل ومواصفات السيارة المسجلة كاملة', _carModelController, icon: Icons.directions_car),
        const SizedBox(height: 16),
        _buildTextField('السعر التقديري (بالجنيه المصري)', _carPriceController, isNumber: true, icon: Icons.payments_outlined),
        const SizedBox(height: 16),
        DropdownButtonFormField<String>(
          value: _carStatus,
          decoration: _buildInputDecoration('حالة توافر المعرض للمشترين', icon: Icons.check_circle_outline),
          dropdownColor: AppColors.surface,
          items: const [
            DropdownMenuItem(value: 'available', child: Text('متاحة للبيع')),
            DropdownMenuItem(value: 'reserved', child: Text('محجوزة لعميل')),
            DropdownMenuItem(value: 'sold', child: Text('مباعة بالكامل')),
          ],
          onChanged: (val) {
            setState(() {
              _carStatus = val!;
            });
          },
        ),
      ],
    );
  }

  // نموذج العقار
  Widget _buildPropertyForm() {
    return Column(
      children: [
        _buildTextField('موقع وتفاصيل العقار الدقيقة ورابطه', _propLocationController, icon: Icons.location_on_outlined),
        const SizedBox(height: 16),
        _buildTextField('مساحة العقار المسجلة بالكامل م²', _propAreaController, isNumber: true, icon: Icons.square_foot),
        const SizedBox(height: 16),
        _buildTextField('السعر التقديري الكلي للاستثمار ج.م', _propPriceController, isNumber: true, icon: Icons.payments_outlined),
        const SizedBox(height: 16),
        DropdownButtonFormField<String>(
          value: _propType,
          decoration: _buildInputDecoration('تصنيف الوحدة العقارية', icon: Icons.holiday_village_outlined),
          dropdownColor: AppColors.surface,
          items: const [
            DropdownMenuItem(value: 'apartment', child: Text('شقة سكنية راقية')),
            DropdownMenuItem(value: 'villa', child: Text('فيلا ملكية مستقلة')),
            DropdownMenuItem(value: 'building', child: Text('مبنى تجاري / إداري')),
          ],
          onChanged: (val) {
            setState(() {
              _propType = val!;
            });
          },
        ),
        const SizedBox(height: 16),
        DropdownButtonFormField<String>(
          value: _propStatus,
          decoration: _buildInputDecoration('حالة العقار للتعاقد', icon: Icons.check_circle_outline),
          dropdownColor: AppColors.surface,
          items: const [
            DropdownMenuItem(value: 'available', child: Text('متاح للبيع الفوري')),
            DropdownMenuItem(value: 'sold', child: Text('مباع لشركاء')),
          ],
          onChanged: (val) {
            setState(() {
              _propStatus = val!;
            });
          },
        ),
      ],
    );
  }

  // نموذج المصاريف
  Widget _buildExpenseForm() {
    return Column(
      children: [
        _buildTextField('قيمة المصروف المدفوع (جنيه مصري)', _expAmountController, isNumber: true, icon: Icons.attach_money_rounded),
        const SizedBox(height: 16),
        _buildTextField('تفاصيل المصروف ووصف الجهة الإدارية', _expDescController, maxLines: 4, icon: Icons.description_outlined),
      ],
    );
  }

  Widget _buildTextField(
    String label, 
    TextEditingController controller, {
    bool isNumber = false, 
    int maxLines = 1,
    required IconData icon,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: isNumber ? TextInputType.number : TextInputType.text,
      maxLines: maxLines,
      style: const TextStyle(color: Colors.white),
      decoration: _buildInputDecoration(label, icon: icon),
      validator: (value) {
        if (value == null || value.trim().isEmpty) {
          return 'هذا الحقل هام لتسجيل القيود';
        }
        if (isNumber && double.tryParse(value) == null) {
          return 'فضلاً اكتب أرقام صحيحة إنجليزية فقط';
        }
        return null;
      },
    );
  }

  InputDecoration _buildInputDecoration(String label, {required IconData icon}) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
      filled: true,
      fillColor: AppColors.surface,
      prefixIcon: Icon(icon, color: AppColors.accentGold),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Colors.white12),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.accentGold, width: 1.2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Colors.redAccent, width: 1.2),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Colors.redAccent, width: 1.2),
      ),
    );
  }
}

/// =========================================
/// 10. التبويب الخامس: تقرير المصاريف (ReportsTab)
/// =========================================
class ReportsTab extends StatelessWidget {
  final List<Expense> expenses;
  final String role;

  const ReportsTab({Key? key, required this.expenses, required this.role}) : super(key: key);

  double get total => expenses.fold(0, (sum, item) => sum + item.amount);

  @override
  Widget build(BuildContext context) {
    // تفعيل الصلاحية الأمنية للمدير لمراجعة الدفاتر المالية الكبيرة
    final isAuthorized = role == 'مدير';

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'مراجعة الدفاتر والمصاريف الإدارية',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.accentGold),
              ),
              if (isAuthorized)
                const Icon(Icons.verified, color: Colors.greenAccent)
              else
                const Icon(Icons.lock_person, color: Colors.amber),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            isAuthorized 
                ? 'مرحباً، لديك كامل الصلاحية لفحص كشف الحساب والبيانات المصرفية للمجموعة'
                : 'تنبيه: صلاحياتك كموظف مبيعات تتيح لك العرض لآخر المعاملات فقط دون التعديل',
            style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 20),

          // لوحة مراجعة زجاجية
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF2C0202), AppColors.surface],
                begin: Alignment.topRight,
                end: Alignment.bottomLeft,
              ),
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: AppColors.primaryRed.withOpacity(0.4)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('القيمة الإجمالية للمصاريف المصروفة', style: TextStyle(color: Colors.white54, fontSize: 12)),
                    const SizedBox(height: 6),
                    Text(
                      '\${total.toStringAsFixed(0)} ج.م',
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.accentGold),
                    ),
                  ],
                ),
                const Icon(Icons.account_balance, color: AppColors.accentGold, size: 38),
              ],
            ),
          ),
          const SizedBox(height: 20),

          const Text(
            'سجل المصاريف المفصل بالتاريخ والجهة',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),

          Expanded(
            child: expenses.isEmpty
                ? const Center(
                    child: Text('لا توجد مصاريف مدرجة في القيود حتى اللحظة'),
                  )
                : ListView.builder(
                    itemCount: expenses.length,
                    itemBuilder: (context, index) {
                      final item = expenses[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.white12),
                        ),
                        child: ListTile(
                          leading: const CircleAvatar(
                            backgroundColor: AppColors.primaryRed,
                            child: Icon(Icons.outbox, color: Colors.white, size: 18),
                          ),
                          title: Text(
                            item.description,
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text(
                            'التاريخ المالي: \${item.date}',
                            style: const TextStyle(fontSize: 11),
                          ),
                          trailing: Text(
                            '\${item.amount.toStringAsFixed(0)} ج.م',
                            style: const TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
`;

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/40 p-5 border border-neutral-800 rounded-2xl">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <FileCode className="text-amber-500 w-5 h-5" />
            تصدير كود تطبيق الجوال Flutter المتكامل
          </h3>
          <p className="text-xs text-neutral-400">
            لقد تم بناء وهيكلة الملفات المطلوبة للتطبيق الهجين بأعلى معايير الهيكلة. انسخها مباشرة لشغلها في مشروعك.
          </p>
        </div>

        {/* Copy Trigger */}
        <button
          onClick={() => copyToClipboard(activeFile === 'main' ? mainDartCode : pubspecCode)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-red-800 to-red-950 border border-amber-500/25 rounded-xl text-xs font-extrabold hover:from-red-750 cursor-pointer shadow-md text-white transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>تم النسخ للحافظة!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-amber-500 shrink-0" />
              <span>نسخ الكود النشط</span>
            </>
          )}
        </button>
      </div>

      {/* Guide details panel */}
      <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl text-xs leading-6 text-neutral-300">
        <div className="flex items-center gap-2 text-amber-500 font-extrabold mb-1">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>تعليمات تركيب تطبيق الهاتف الذكي Flutter:</span>
        </div>
        <ul className="list-decimal list-inside space-y-1 text-neutral-400 pr-1">
          <li>أنشئ مشروع Flutter فارغ جديد بترميز <code className="bg-neutral-900 px-1 py-0.5 rounded text-amber-500 font-mono text-[10px]">flutter create eladawy_group</code></li>
          <li>استبدل محتويات ملف <code className="bg-neutral-900 px-1 py-0.5 rounded text-amber-500 font-mono text-[10px]">pubspec.yaml</code> تماماً بالكود الظاهر أدناه.</li>
          <li>انسخ ملف كود فلاتر الموحد <code className="bg-neutral-900 px-1 py-0.5 rounded text-amber-500 font-mono text-[10px]">lib/main.dart</code> واستبدله بمشروعك.</li>
          <li>نفّذ <code className="bg-neutral-900 px-1 py-0.5 rounded text-amber-500 font-mono text-[10px]">flutter pub get</code> ثم انطلق بالتشغيل مباشرة!</li>
        </ul>
      </div>

      {/* Selector Tabs */}
      <div className="flex bg-neutral-900 border border-neutral-800 rounded-xl p-1.5 w-fit gap-2">
        <button
          onClick={() => { setActiveFile('main'); setCopied(false); }}
          className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeFile === 'main'
              ? 'bg-neutral-950 text-amber-400 border border-amber-500/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          lib/main.dart (برمجة التطبيق الشاملة)
        </button>
        <button
          onClick={() => { setActiveFile('pubspec'); setCopied(false); }}
          className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeFile === 'pubspec'
              ? 'bg-neutral-950 text-amber-400 border border-amber-500/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          pubspec.yaml (المكتبات والتبعيات)
        </button>
      </div>

      {/* Code Viewer Canvas */}
      <div className="relative rounded-2xl border border-neutral-800 bg-neutral-950 p-5 overflow-hidden">
        {/* Shadow Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none" />
        
        <pre className="text-[11px] leading-5 text-neutral-300 font-mono overflow-auto max-h-[400px] text-left select-all pr-2 whitespace-pre">
          {activeFile === 'main' ? mainDartCode : pubspecCode}
        </pre>
      </div>

    </div>
  );
}
