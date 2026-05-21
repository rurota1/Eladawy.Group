import { Car, Property, Expense } from './types';

export const INITIAL_CARS: Car[] = [
  { id: '1', model: 'مرسيدس بنز S-Class 2024 V12', price: 18500000, status: 'متوفر' },
  { id: '2', model: 'بي إم دبليو M5 كومبتيشن Competition', price: 12000000, status: 'متوفر' },
  { id: '3', model: 'بورش 911 كاريرا S توربو GTS', price: 14800000, status: 'تحت الصيانة' },
  { id: '4', model: 'رينج روفر سبورت ليمتد 2024', price: 9500000, status: 'مباع' },
];

export const INITIAL_PROPERTIES: Property[] = [
  { id: '1', type: 'فيلا مستقلة صف أول - حمام سباحة خاص', location: 'التجمع الخامس - كمبوند ميفيدا', area: 450, price: 25000000, status: 'معروض للبيع' },
  { id: '2', type: 'شقة بنتهاوس فاخرة بإطلالة بانورامية', location: 'الشيخ زايد - الكرمة دوبلكس فاخر', area: 280, price: 8400000, status: 'معروض للبيع' },
  { id: '3', type: 'مجمع مكاتب إداري واستثماري', location: 'العاصمة الإدارية - برج إداري تجاري حي المال', area: 1200, price: 65000000, status: 'تم البيع' },
];

export const INITIAL_EXPENSES: Expense[] = [
  { date: '2026-05-19', amount: 120000, description: 'صيانة وتجهيز صالة العرض الكبرى بالتجمع' },
  { date: '2026-05-17', amount: 45000, description: 'حملة إعلانية وتسويقية رقمية على شوارع القاهرة لشهر مايو' },
  { date: '2026-05-11', amount: 180000, description: 'رواتب الموظفين والعمولات الشهرية لفريق المبيعات' },
];

// Helper functions for Local Storage persistence
export const getStoredCars = (): Car[] => {
  const data = localStorage.getItem('eladawy_cars');
  if (!data) {
    localStorage.setItem('eladawy_cars', JSON.stringify(INITIAL_CARS));
    return INITIAL_CARS;
  }
  return JSON.parse(data);
};

export const saveCars = (cars: Car[]) => {
  localStorage.setItem('eladawy_cars', JSON.stringify(cars));
};

export const getStoredProperties = (): Property[] => {
  const data = localStorage.getItem('eladawy_properties');
  if (!data) {
    localStorage.setItem('eladawy_properties', JSON.stringify(INITIAL_PROPERTIES));
    return INITIAL_PROPERTIES;
  }
  return JSON.parse(data);
};

export const saveProperties = (properties: Property[]) => {
  localStorage.setItem('eladawy_properties', JSON.stringify(properties));
};

export const getStoredExpenses = (): Expense[] => {
  const data = localStorage.getItem('eladawy_expenses');
  if (!data) {
    localStorage.setItem('eladawy_expenses', JSON.stringify(INITIAL_EXPENSES));
    return INITIAL_EXPENSES;
  }
  return JSON.parse(data);
};

export const saveExpenses = (expenses: Expense[]) => {
  localStorage.setItem('eladawy_expenses', JSON.stringify(expenses));
};

export const FLUTTER_PUBSPEC = `name: eladawy_group
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

export const FLUTTER_MAIN_CODE = `import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:path_provider/path_provider.dart' as path_provider;

// ==========================================
// 1. الثوابت والإعدادات (Constants & Theme)
// ==========================================
class AppColors {
  static const Color background = Color(0xFF000000); // خلفية سوداء فاخرة
  static const Color primary = Color(0xFF8B0000); // أحمر داكن ملكي
  static const Color primaryLight = Color(0xFFB22222); // أحمر ناري للتأثيرات
  static const Color accentGold = Color(0xFFFFD700); // ذهبي فاخر للنصوص والمؤشرات
  static const Color textWhite = Color(0xFFFFFFFF); // نصوص بيضاء واضحة
  static const Color textGray = Color(0xFFB3B3B3); // نصوص ثانوية رمادية
  static const Color cardBg = Color(0x1AFFFFFF); // خلفية زجاجية شفافة للبوردات
}

void main() async {
  // التأكد من تهيئة الـ Widgets
  WidgetsFlutterBinding.ensureInitialized();

  // تهيئة قاعدة البيانات المحلية Hive للـ Flutter
  await Hive.initFlutter();

  // تسجيل محولات البيانات (Adapters) للتخزين المحلي
  Hive.registerAdapter(CarAdapter());
  Hive.registerAdapter(PropertyAdapter());
  Hive.registerAdapter(ExpenseAdapter());

  // فتح الصناديق (Boxes) الخاصة بكل موديل
  await DBService.init();

  runApp(const EladawyGroupApp());
}

class EladawyGroupApp extends StatelessWidget {
  const EladawyGroupApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Eladawy Group',
      debugShowCheckedModeBanner: false,
      locale: const Locale('ar', 'EG'), // لغة عربية RTL
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.background,
        primaryColor: AppColors.primary,
        fontFamily: 'Cairo', // خط عربي مميز متناسق مع الفخامة
        colorScheme: const ColorScheme.dark(
          primary: AppColors.primary,
          secondary: AppColors.accentGold,
          background: AppColors.background,
        ),
      ),
      home: const LoginScreen(),
    );
  }
}

// ==========================================
// 2. نماذج البيانات (Models & Adapters)
// ==========================================

class Car {
  final int id;
  final String model;
  final double price;
  final String status; // 'متوفر' ، 'مباع' ، 'تحت الصيانة'

  Car({
    required this.id,
    required this.model,
    required this.price,
    required this.status,
  });
}

class Property {
  final int id;
  final String type; // 'شقة' ، 'فيلا' ، 'محل' ، 'أرض'
  final String location;
  final double area;
  final double price;
  final String status; // 'معروض للبيع' ، 'معروض للإيجار' ، 'تم البيع'

  Property({
    required this.id,
    required this.type,
    required this.location,
    required this.area,
    required this.price,
    required this.status,
  });
}

class Expense {
  final DateTime date;
  final double amount;
  final String description;

  Expense({
    required this.date,
    required this.amount,
    required this.description,
  });
}

// ---- محولات يدوية لـ Hive لعدم تطلب build_runner ----

class CarAdapter extends TypeAdapter<Car> {
  @override
  final int typeId = 0;

  @override
  Car read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Car(
      id: fields[0] as int,
      model: fields[1] as String,
      price: fields[2] as double,
      status: fields[3] as String,
    );
  }

  @override
  void write(BinaryWriter writer, Car obj) {
    writer
      ..writeByte(4)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.model)
      ..writeByte(2)
      ..write(obj.price)
      ..writeByte(3)
      ..write(obj.status);
  }
}

class PropertyAdapter extends TypeAdapter<Property> {
  @override
  final int typeId = 1;

  @override
  Property read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Property(
      id: fields[0] as int,
      type: fields[1] as String,
      location: fields[2] as String,
      area: fields[3] as double,
      price: fields[4] as double,
      status: fields[5] as String,
    );
  }

  @override
  void write(BinaryWriter writer, Property obj) {
    writer
      ..writeByte(6)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.type)
      ..writeByte(2)
      ..write(obj.location)
      ..writeByte(3)
      ..write(obj.area)
      ..writeByte(4)
      ..write(obj.price)
      ..writeByte(5)
      ..write(obj.status);
  }
}

class ExpenseAdapter extends TypeAdapter<Expense> {
  @override
  final int typeId = 2;

  @override
  Expense read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Expense(
      date: fields[0] as DateTime,
      amount: fields[1] as double,
      description: fields[2] as String,
    );
  }

  @override
  void write(BinaryWriter writer, Expense obj) {
    writer
      ..writeByte(3)
      ..writeByte(0)
      ..write(obj.date)
      ..writeByte(1)
      ..write(obj.amount)
      ..writeByte(2)
      ..write(obj.description);
  }
}

// ==========================================
// 3. خدمة قاعدة البيانات (DB Service)
// ==========================================
class DBService {
  static late Box<Car> carsBox;
  static late Box<Property> propertiesBox;
  static late Box<Expense> expensesBox;

  static Future<void> init() async {
    carsBox = await Hive.openBox<Car>('cars');
    propertiesBox = await Hive.openBox<Property>('properties');
    expensesBox = await Hive.openBox<Expense>('expenses');

    // إدخال بيانات تجريبية فاخرة في حال كانت قاعدة البيانات فارغة لتسهيل العرض
    if (carsBox.isEmpty) {
      await carsBox.addAll([
        Car(id: 1, model: 'مرسيدس بنز S-Class 2024', price: 125000, status: 'متوفر'),
        Car(id: 2, model: 'بي إم دبليو M5 كومبتيشن', price: 140000, status: 'متوفر'),
        Car(id: 3, model: 'بورتش 911 كاريرا S', price: 165000, status: 'تحت الصيانة'),
        Car(id: 4, model: 'رينج روفر سبورت 2024', price: 110000, status: 'مباع'),
      ]);
    }

    if (propertiesBox.isEmpty) {
      await propertiesBox.addAll([
        Property(id: 1, type: 'فيلا مستقلة', location: 'التجمع الخامس، القاهرة', area: 450, price: 950000, status: 'معروض للبيع'),
        Property(id: 2, type: 'شقة بنتهاوس فاخرة', location: 'الشيخ زايد، الجيزة', area: 280, price: 420000, status: 'معروض للإيجار'),
        Property(id: 3, type: 'مجمع مكاتب إداري', location: 'العاصمة الإدارية', area: 120, price: 680000, status: 'تم البيع'),
      ]);
    }

    if (expensesBox.isEmpty) {
      await expensesBox.addAll([
        Expense(date: DateTime.now().subtract(const Duration(days: 2)), amount: 1500, description: 'صيانة مصاعد المقر العام'),
        Expense(date: DateTime.now().subtract(const Duration(days: 4)), amount: 800, description: 'حملة إعلانات ترويجية للمعرض'),
        Expense(date: DateTime.now().subtract(const Duration(days: 10)), amount: 5000, description: 'دفعات فواتير تشغيل كهرباء ومياه مجمع المعارض'),
      ]);
    }
  }

  // دوال جلب البيانات
  static List<Car> getCars() => carsBox.values.toList();
  static List<Property> getProperties() => propertiesBox.values.toList();
  static List<Expense> getExpenses() => expensesBox.values.toList();

  // دوال الإضافة
  static Future<void> addCar(Car car) async => await carsBox.add(car);
  static Future<void> addProperty(Property prop) async => await propertiesBox.add(prop);
  static Future<void> addExpense(Expense exp) async => await expensesBox.add(exp);
}

// ==========================================
// 4. رسم الأيقونات الفاخرة يدوياً (CustomPaint)
// ==========================================

class CarIconPainter extends CustomPainter {
  final Color color;
  CarIconPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final path = Path();
    path.moveTo(0, size.height * 0.7);
    path.lineTo(size.width * 0.1, size.height * 0.5);
    path.quadraticBezierTo(size.width * 0.25, size.height * 0.2, size.width * 0.45, size.height * 0.2);
    path.lineTo(size.width * 0.7, size.height * 0.25);
    path.quadraticBezierTo(size.width * 0.85, size.height * 0.45, size.width, size.height * 0.55);
    path.lineTo(size.width, size.height * 0.75);
    path.lineTo(0, size.height * 0.75);
    path.close();
    canvas.drawPath(path, paint);

    final wheelPaint = Paint()
      ..color = Colors.black
      ..style = PaintingStyle.fill;
    final wheelInnerPaint = Paint()
      ..color = AppColors.accentGold
      ..style = PaintingStyle.fill;

    canvas.drawCircle(Offset(size.width * 0.25, size.height * 0.75), size.width * 0.12, wheelPaint);
    canvas.drawCircle(Offset(size.width * 0.25, size.height * 0.75), size.width * 0.05, wheelInnerPaint);

    canvas.drawCircle(Offset(size.width * 0.75, size.height * 0.75), size.width * 0.12, wheelPaint);
    canvas.drawCircle(Offset(size.width * 0.75, size.height * 0.75), size.width * 0.05, wheelInnerPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class PropertyIconPainter extends CustomPainter {
  final Color color;
  PropertyIconPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    canvas.drawRect(Rect.fromLTWH(size.width * 0.1, size.height * 0.2, size.width * 0.4, size.height * 0.8), paint);
    
    final paintSecondary = Paint()
      ..color = color.withOpacity(0.8)
      ..style = PaintingStyle.fill;
    canvas.drawRect(Rect.fromLTWH(size.width * 0.5, size.height * 0.4, size.width * 0.4, size.height * 0.6), paintSecondary);

    final accentPaint = Paint()
      ..color = AppColors.accentGold
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;
    canvas.drawLine(Offset(size.width * 0.1, size.height * 0.2), Offset(size.width * 0.5, size.height * 0.2), accentPaint);
    canvas.drawLine(Offset(size.width * 0.5, size.height * 0.4), Offset(size.width * 0.9, size.height * 0.4), accentPaint);

    final windowPaint = Paint()
      ..color = AppColors.accentGold.withOpacity(0.9)
      ..style = PaintingStyle.fill;

    canvas.drawRect(Rect.fromLTWH(size.width * 0.2, size.height * 0.3, size.width * 0.08, size.height * 0.1), windowPaint);
    canvas.drawRect(Rect.fromLTWH(size.width * 0.35, size.height * 0.3, size.width * 0.08, size.height * 0.1), windowPaint);
    canvas.drawRect(Rect.fromLTWH(size.width * 0.2, size.height * 0.5, size.width * 0.08, size.height * 0.1), windowPaint);
    canvas.drawRect(Rect.fromLTWH(size.width * 0.35, size.height * 0.5, size.width * 0.08, size.height * 0.1), windowPaint);

    final doorPaint = Paint()
      ..color = AppColors.accentGold
      ..style = PaintingStyle.fill;
    canvas.drawRect(Rect.fromLTWH(size.width * 0.26, size.height * 0.75, size.width * 0.12, size.height * 0.25), doorPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// ==========================================
// 5. تأثير الزجاج الشفاف (Glassmorphism Widget)
// ==========================================
class GlassContainer extends StatelessWidget {
  final Widget child;
  final double padding;
  final double borderRadius;
  final Color? borderColor;

  const GlassContainer({
    Key? key,
    required this.child,
    this.padding = 16.0,
    this.borderRadius = 16.0,
    this.borderColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(padding),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.55),
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(
          color: borderColor ?? AppColors.primary.withOpacity(0.25),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.12),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: child,
    );
  }
}

// ==========================================
// 6. شاشة تسجيل الدخول بـ PIN (Login Screen)
// ==========================================
class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  String pin = "";
  String errorMessage = "";

  void addDigit(String char) {
    if (pin.length < 4) {
      setState(() {
        pin += char;
        errorMessage = "";
      });
    }

    if (pin.length == 4) {
      validateAndLogin();
    }
  }

  void deleteDigit() {
    if (pin.isNotEmpty) {
      setState(() {
        pin = pin.substring(0, pin.length - 1);
        errorMessage = "";
      });
    }
  }

  void validateAndLogin() {
    if (pin == "1111") {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const MainDashboard(userRole: "المدير العام")),
      );
    } else if (pin == "2222") {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const MainDashboard(userRole: "المبيعات والدعم")),
      );
    } else {
      setState(() {
        pin = "";
        errorMessage = "الرمز المدخل غير صحيح. حاول مجدداً";
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('خطأ في الرمز! رمز الدخول غير مصرح به.', textAlign: TextAlign.center),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Container(
            width: double.infinity,
            height: double.infinity,
            decoration: const BoxDecoration(
              color: Colors.black,
              image: DecorationImage(
                image: AssetImage('assets/images/image_7.png'),
                fit: BoxFit.cover,
                opacity: 0.35,
              ),
            ),
          ),
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Hero(
                    tag: 'appLogo',
                    child: Container(
                      height: 120,
                      decoration: const BoxDecoration(
                        image: DecorationImage(
                          image: AssetImage('assets/images/image_8.png'),
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'مجموعة العدوي - ELADAWY GROUP',
                    style: TextStyle(
                      color: AppColors.accentGold,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.0,
                    ),
                  ),
                  const Text(
                    'سيارات وعقارات غاية في الفخامة والتميز',
                    style: TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                  const SizedBox(height: 35),
                  GlassContainer(
                    borderColor: AppColors.accentGold.withOpacity(0.3),
                    padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
                    child: Column(
                      children: [
                        const Text(
                          'تسجيل الدخول الآمن',
                          style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'برجاء إدخال الرمز السري الفعّال PIN الممنوح لك للاستمرار',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: AppColors.textGray, fontSize: 12),
                        ),
                        const SizedBox(height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: List.generate(4, (index) {
                            return Container(
                              margin: const EdgeInsets.symmetric(horizontal: 8),
                              width: 16,
                              height: 16,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: index < pin.length ? AppColors.accentGold : Colors.white24,
                                border: Border.all(
                                  color: AppColors.primary,
                                  width: 1.5,
                                ),
                              ),
                            );
                          }),
                        ),
                        if (errorMessage.isNotEmpty) ...[
                          const SizedBox(height: 12),
                          Text(errorMessage, style: const TextStyle(color: Colors.redAccent, fontSize: 12)),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 25),
                  Container(
                    maxWidth: 300,
                    child: GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 3,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                        childAspectRatio: 1.25,
                      ),
                      itemCount: 12,
                      itemBuilder: (context, index) {
                        if (index == 9) {
                          return InkWell(
                            onTap: deleteDigit,
                            borderRadius: BorderRadius.circular(40),
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.08),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.backspace_rounded, color: AppColors.primaryLight),
                            ),
                          );
                        } else if (index == 10) {
                          return buildKeyButton("0");
                        } else if (index == 11) {
                          return InkWell(
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('الدخول التجريبي: المدير (1111) - المبيعات (2222)', textAlign: TextAlign.center),
                                  duration: Duration(seconds: 4),
                                ),
                              );
                            },
                            borderRadius: BorderRadius.circular(40),
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.08),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.help_outline, color: AppColors.accentGold),
                            ),
                          );
                        } else {
                          return buildKeyButton((index + 1).toString());
                        }
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget buildKeyButton(String num) {
    return InkWell(
      onTap: () => addDigit(num),
      borderRadius: BorderRadius.circular(40),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.08),
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white.withOpacity(0.12), width: 1),
        ),
        child: Center(
          child: Text(
            num,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}

// ==========================================
// 7. اللوحة الرئيسية (MainDashboard)
// ==========================================
class MainDashboard extends StatefulWidget {
  final String userRole;
  const MainDashboard({Key? key, required this.userRole}) : super(key: key);

  @override
  State<MainDashboard> createState() => _MainDashboardState();
}

class _MainDashboardState extends State<MainDashboard> {
  int _currentIndex = 0;
  late List<Widget> _tabs;

  @override
  void initState() {
    super.initState();
    _tabs = [
      HomeTab(userRole: widget.userRole),
      const CarsTab(),
      const PropertiesTab(),
      const AddTab(),
      ReportsTab(userRole: widget.userRole),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: AppColors.background,
          elevation: 2,
          leading: Container(
            margin: const EdgeInsets.all(8),
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: AssetImage('assets/images/image_8.png'),
                fit: BoxFit.contain,
              ),
            ),
          ),
          centerTitle: true,
          title: Column(
            children: [
              const Text(
                'مجموعة العدوي',
                style: TextStyle(color: AppColors.accentGold, fontSize: 15, fontWeight: FontWeight.bold),
              ),
              Text(
                'الترخيّص: ' + widget.userRole,
                style: const TextStyle(color: AppColors.textGray, fontSize: 10),
              )
            ],
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.logout_rounded, color: AppColors.primaryLight),
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                );
              },
            ),
          ],
        ),
        body: IndexedStack(
          index: _currentIndex,
          children: _tabs,
        ),
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.black,
          selectedItemColor: AppColors.accentGold,
          unselectedItemColor: AppColors.textGray,
          selectedLabelStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
          unselectedLabelStyle: const TextStyle(fontSize: 10),
          items: [
            const BottomNavigationBarItem(
              icon: Icon(Icons.home_filled),
              label: 'الرئيسية',
            ),
            BottomNavigationBarItem(
              icon: SizedBox(
                width: 24,
                height: 24,
                child: CustomPaint(painter: CarIconPainter(color: AppColors.textGray)),
              ),
              activeIcon: SizedBox(
                width: 24,
                height: 24,
                child: CustomPaint(painter: CarIconPainter(color: AppColors.accentGold)),
              ),
              label: 'السيارات',
            ),
            BottomNavigationBarItem(
              icon: SizedBox(
                width: 24,
                height: 24,
                child: CustomPaint(painter: PropertyIconPainter(color: AppColors.textGray)),
              ),
              activeIcon: SizedBox(
                width: 24,
                height: 24,
                child: CustomPaint(painter: PropertyIconPainter(color: AppColors.accentGold)),
              ),
              label: 'العقارات',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.add_box_rounded),
              label: 'إضافة',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.bar_chart_outlined),
              label: 'التقارير',
            ),
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 8. التبويب الأول: الرئيسية (HomeTab)
// ==========================================
class HomeTab extends StatelessWidget {
  final String userRole;
  const HomeTab({Key? key, required this.userRole}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final carsCount = DBService.getCars().length;
    final propsCount = DBService.getProperties().length;
    final expenses = DBService.getExpenses();
    final double totalExpenses = expenses.fold(0, (sum, item) => sum + item.amount);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GlassContainer(
            borderColor: AppColors.primary,
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'مرحباً بك مجدداً ،',
                        style: TextStyle(color: AppColors.textGray, fontSize: 13),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        userRole,
                        style: const TextStyle(color: AppColors.accentGold, fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'مجموعة العدوي توفر لك متابعة حية لمخزون السيارات الفارهة، الأراضي والعقارات المتوفرة وسجلات الصرف بشكل فوري ومستقر.',
                        style: TextStyle(color: Colors.white80, fontSize: 11, height: 1.5),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  width: 70,
                  height: 70,
                  decoration: const BoxDecoration(
                    image: DecorationImage(
                      image: AssetImage('assets/images/image_8.png'),
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'الملخص والإحصائيات الحالية 📈',
            style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: buildStatCard(
                  title: 'إجمالي السيارات',
                  value: carsCount.toString() + ' سيارة',
                  subtitle: 'تفاصيل المعرض والوكالة',
                  icon: CarIconPainter(color: AppColors.accentGold),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: buildStatCard(
                  title: 'إجمالي العقارات',
                  value: propsCount.toString() + ' أصول',
                  subtitle: 'التملك والمشاريع المعروضة',
                  icon: PropertyIconPainter(color: AppColors.accentGold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Card(
            color: const Color(0xFF130101),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: const BorderSide(color: AppColors.primary, width: 1.2),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.monetization_on, color: AppColors.accentGold, size: 28),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'إجمالي مصاريف التشغيل',
                          style: TextStyle(color: AppColors.textGray, fontSize: 12),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '\\\\\\$' + totalExpenses.toStringAsFixed(2),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Text(
                    'تحديث مباشر',
                    style: TextStyle(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'الروابط السريعة المتاحة ⚡',
            style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                buildQuickLinkBtn('إضافة مخزون جديد', Icons.add_business_rounded),
                buildQuickLinkBtn('تقرير فواتير الصيانة', Icons.receipt_long),
                buildQuickLinkBtn('تصدير الكشوفات', Icons.ios_share_rounded),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget buildStatCard({
    required String title,
    required String value,
    required String subtitle,
    required CustomPainter icon,
  }) {
    return GlassContainer(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(color: AppColors.textGray, fontSize: 11)),
              SizedBox(
                width: 24,
                height: 24,
                child: CustomPaint(painter: icon),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(color: Colors.grey, fontSize: 9),
          ),
        ],
      ),
    );
  }

  Widget buildQuickLinkBtn(String text, IconData icon) {
    return Container(
      margin: const EdgeInsets.only(left: 10),
      child: ElevatedButton.icon(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.cardBg,
          foregroundColor: AppColors.accentGold,
          side: const BorderSide(color: AppColors.primary, width: 0.8),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
        icon: Icon(icon, size: 16),
        label: Text(text, style: const TextStyle(fontSize: 11)),
        onPressed: () {},
      ),
    );
  }
}

// ==========================================
// 9. التبويب الثاني: السيارات (CarsTab)
// ==========================================
class CarsTab extends StatefulWidget {
  const CarsTab({Key? key}) : super(key: key);

  @override
  State<CarsTab> createState() => _CarsTabState();
}

class _CarsTabState extends State<CarsTab> {
  late List<Car> _cars;

  @override
  void initState() {
    super.initState();
    _loadCars();
  }

  void _loadCars() {
    setState(() {
      _cars = DBService.getCars();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              Expanded(
                child: Container(
                  height: 45,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.06),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.primary.withOpacity(0.3), width: 1),
                  ),
                  child: const TextField(
                    decoration: InputDecoration(
                      hintText: 'ابحث عن سيارة أو طراز فخم...',
                      hintStyle: TextStyle(color: Colors.grey, fontSize: 12),
                      prefixIcon: Icon(Icons.search, color: Colors.grey, size: 18),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(vertical: 8),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                style: IconButton.styleFrom(
                  backgroundColor: AppColors.primary.withOpacity(0.3),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                icon: const Icon(Icons.tune_rounded, color: AppColors.accentGold),
                onPressed: () {},
              ),
            ],
          ),
        ),
        Expanded(
          child: _cars.isEmpty
              ? const Center(child: Text('لا توجد سيارات مضافة حالياً في المخبأ المحلي'))
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _cars.length,
                  itemBuilder: (context, index) {
                    final car = _cars[index];
                    return buildCarItem(car);
                  },
                ),
        ),
      ],
    );
  }

  Widget buildCarItem(Car car) {
    Color statusColor = Colors.greenAccent;
    if (car.status == 'تحت الصيانة') {
      statusColor = AppColors.accentGold;
    } else if (car.status == 'مباع') {
      statusColor = Colors.redAccent;
    }

    return Card(
      color: Colors.white.withOpacity(0.03),
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.white.withOpacity(0.06)),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        leading: Container(
          width: 55,
          height: 100,
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: CustomPaint(
            painter: CarIconPainter(color: AppColors.accentGold.withOpacity(0.85)),
          ),
        ),
        title: Text(
          car.model,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4.0),
          child: Text(
            'السعر الإجمالي: \\\\\\' + '\\$' + car.price.toStringAsFixed(0),
            style: const TextStyle(color: AppColors.textGray, fontSize: 11),
          ),
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: statusColor.withOpacity(0.12),
            borderRadius: BorderRadius.circular(30),
            border: Border.all(color: statusColor, width: 0.8),
          ),
          child: Text(
            car.status,
            style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }
}

// ==========================================
// 10. التبويب الثالث: العقارات (PropertiesTab)
// ==========================================
class PropertiesTab extends StatefulWidget {
  const PropertiesTab({Key? key}) : super(key: key);

  @override
  State<PropertiesTab> createState() => _PropertiesTabState();
}

class _PropertiesTabState extends State<PropertiesTab> {
  late List<Property> _properties;

  @override
  void initState() {
    super.initState();
    _loadProperties();
  }

  void _loadProperties() {
    setState(() {
      _properties = DBService.getProperties();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Row(
            children: [
              buildFilterChip('الكل 🏢', true),
              buildFilterChip('فلل 🏰', false),
              buildFilterChip('شقق بنتهاوس 🏙️', false),
              buildFilterChip('مباني تجارية 💼', false),
            ],
          ),
        ),
        Expanded(
          child: _properties.isEmpty
              ? const Center(child: Text('لا توجد عقارات في السجل'))
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _properties.length,
                  itemBuilder: (context, index) {
                    final prop = _properties[index];
                    return buildPropertyItem(prop);
                  },
                ),
        ),
      ],
    );
  }

  Widget buildFilterChip(String label, bool isSelected) {
    return Container(
      margin: const EdgeInsets.only(left: 8),
      child: ChoiceChip(
        label: Text(label, style: TextStyle(fontSize: 11, color: isSelected ? Colors.black : Colors.white)),
        selected: isSelected,
        selectedColor: AppColors.accentGold,
        backgroundColor: Colors.white.withOpacity(0.06),
        onSelected: (val) {},
      ),
    );
  }

  Widget buildPropertyItem(Property prop) {
    Color statColor = Colors.lightBlueAccent;
    if (prop.status == 'تم البيع') {
      statColor = Colors.redAccent;
    } else if (prop.status == 'معروض للبيع') {
      statColor = Colors.greenAccent;
    }

    return Card(
      color: Colors.white.withOpacity(0.03),
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.white.withOpacity(0.06)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ListTile(
            leading: SizedBox(
              width: 40,
              height: 40,
              child: CustomPaint(painter: PropertyIconPainter(color: AppColors.accentGold)),
            ),
            title: Text(prop.type, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            subtitle: Text(prop.location, style: const TextStyle(color: Colors.grey, fontSize: 10)),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: statColor.withOpacity(0.12),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: statColor, width: 0.8),
              ),
              child: Text(prop.status, style: TextStyle(color: statColor, fontSize: 9)),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.photo_size_select_small_rounded, color: Colors.grey, size: 14),
                    const SizedBox(width: 4),
                    Text('المساحة: ' + prop.area.toString() + ' م²', style: const TextStyle(color: AppColors.textGray, fontSize: 11)),
                  ],
                ),
                Text(
                  '\\\\\\$' + prop.price.toStringAsFixed(0),
                  style: const TextStyle(color: AppColors.accentGold, fontWeight: FontWeight.bold, fontSize: 14),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ==========================================
// 11. التبويب الرابع: الإضافة (AddTab)
// ==========================================
class AddTab extends StatefulWidget {
  const AddTab({Key? key}) : super(key: key);

  @override
  State<AddTab> createState() => _AddTabState();
}

class _AddTabState extends State<AddTab> {
  final _formKey = GlobalKey<FormState>();
  String _selectedType = 'سيارة';
  
  final _carModelCtrl = TextEditingController();
  final _carPriceCtrl = TextEditingController();
  String _carStatus = 'متوفر';

  final _propTypeCtrl = TextEditingController();
  final _propLocationCtrl = TextEditingController();
  final _propAreaCtrl = TextEditingController();
  final _propPriceCtrl = TextEditingController();
  String _propStatus = 'معروض للبيع';

  @override
  void dispose() {
    _carModelCtrl.dispose();
    _carPriceCtrl.dispose();
    _propTypeCtrl.dispose();
    _propLocationCtrl.dispose();
    _propAreaCtrl.dispose();
    _propPriceCtrl.dispose();
    super.dispose();
  }

  void _submitData() async {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedType == 'سيارة') {
      final model = _carModelCtrl.text.trim();
      final price = double.tryParse(_carPriceCtrl.text) ?? 0.0;
      final newCar = Car(id: DateTime.now().millisecondsSinceEpoch, model: model, price: price, status: _carStatus);
      await DBService.addCar(newCar);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('تم إضافة السيارة بنجاح لحافظة Hive!', textAlign: TextAlign.center), backgroundColor: Colors.green),
      );
      _carModelCtrl.clear();
      _carPriceCtrl.clear();
    } else {
      final type = _propTypeCtrl.text.trim();
      final loc = _propLocationCtrl.text.trim();
      final area = double.tryParse(_propAreaCtrl.text) ?? 100.0;
      final price = double.tryParse(_propPriceCtrl.text) ?? 0.0;

      final newProp = Property(
        id: DateTime.now().millisecondsSinceEpoch,
        type: type,
        location: loc,
        area: area,
        price: price,
        status: _propStatus,
      );
      await DBService.addProperty(newProp);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('تم إضافة العقار والمشروع بنجاح!', textAlign: TextAlign.center), backgroundColor: Colors.green),
      );
      _propTypeCtrl.clear();
      _propLocationCtrl.clear();
      _propAreaCtrl.clear();
      _propPriceCtrl.clear();
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
              'إضافة أصل جديد للمجموعة 📥',
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.06),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.primary, width: 1.0),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedType,
                  isExpanded: true,
                  dropdownColor: Colors.black,
                  icon: const Icon(Icons.arrow_drop_down, color: AppColors.accentGold),
                  items: <String>['سيارة', 'عقار'].map((String val) {
                    return DropdownMenuItem<String>(
                      value: val,
                      child: Text('نوع الإدخال: ' + val, style: const TextStyle(color: Colors.white, fontSize: 13)),
                    );
                  }).toList(),
                  onChanged: (val) {
                    setState(() {
                      _selectedType = val!;
                    });
                  },
                ),
              ),
            ),
            const SizedBox(height: 16),
            if (_selectedType == 'سيارة') ...[
              buildTextField(_carModelCtrl, 'طراز واسم السيارة (مثال: مرسيدس G-Class)', Icons.directions_car),
              const SizedBox(height: 12),
              buildTextField(_carPriceCtrl, 'سعر الفواتير الإجمالية (\$)', Icons.monetization_on, isNumber: true),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _carStatus,
                decoration: buildInputDecoration('الحالة الحالية بمستودع المعرض', Icons.settings_input_component),
                dropdownColor: Colors.black,
                items: <String>['متوفر', 'مباع', 'تحت الصيانة'].map((String v) {
                  return DropdownMenuItem(value: v, child: Text(v, style: const TextStyle(fontSize: 13)));
                }).toList(),
                onChanged: (val) => setState(() => _carStatus = val!),
              ),
            ] else ...[
              buildTextField(_propTypeCtrl, 'نوع العقار (مثال: شقة دوبلكس، فيلا)', Icons.apartment),
              const SizedBox(height: 12),
              buildTextField(_propLocationCtrl, 'العنوان والموقع التفصيلي', Icons.my_location_rounded),
              const SizedBox(height: 12),
              buildTextField(_propAreaCtrl, 'المساحة الإجمالية بالمتر المربع (م²)', Icons.photo_size_select_small_sharp, isNumber: true),
              const SizedBox(height: 12),
              buildTextField(_propPriceCtrl, 'سعر العرض الإجمالي (\$)', Icons.monetization_on, isNumber: true),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _propStatus,
                decoration: buildInputDecoration('الحالة بمستندات التوريد', Icons.verified_user),
                dropdownColor: Colors.black,
                items: <String>['معروض للبيع', 'معروض للإيجار', 'تم البيع'].map((String v) {
                  return DropdownMenuItem(value: v, child: Text(v, style: const TextStyle(fontSize: 13)));
                }).toList(),
                onChanged: (val) => setState(() => _propStatus = val!),
              ),
            ],
            const SizedBox(height: 24),
            Container(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 6,
                  shadowColor: AppColors.primary.withOpacity(0.4),
                ),
                child: const Text('حفظ وربط مع سجلات Hive 💾', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                onPressed: _submitData,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget buildTextField(TextEditingController ctrl, String hint, IconData icon, {bool isNumber = false}) {
    return TextFormField(
      controller: ctrl,
      keyboardType: isNumber ? TextInputType.number : TextInputType.text,
      decoration: buildInputDecoration(hint, icon),
      validator: (value) {
        if (value == null || value.trim().isEmpty) {
          return 'هذا الحقل مطلوب للتخزين من فضلك';
        }
        return null;
      },
    );
  }

  InputDecoration buildInputDecoration(String hint, IconData icon) {
    return InputDecoration(
      hintText: hint,
      prefixIcon: Icon(icon, color: AppColors.accentGold, size: 18),
      hintStyle: const TextStyle(color: Colors.grey, fontSize: 11),
      filled: true,
      fillColor: Colors.white.withOpacity(0.04),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.primary, width: 1.5)),
    );
  }
}

// ==========================================
// 12. التبويب الخامس: التقارير والمصاريف (ReportsTab)
// ==========================================
class ReportsTab extends StatefulWidget {
  final String userRole;
  const ReportsTab({Key? key, required this.userRole}) : super(key: key);

  @override
  State<ReportsTab> createState() => _ReportsTabState();
}

class _ReportsTabState extends State<ReportsTab> {
  final _amountCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  late List<Expense> _expenses;

  @override
  void initState() {
    super.initState();
    _loadExpenses();
  }

  void _loadExpenses() {
    setState(() {
      _expenses = DBService.getExpenses();
    });
  }

  void _addExpense() async {
    final amountText = _amountCtrl.text.trim();
    final desc = _descCtrl.text.trim();

    if (amountText.isEmpty || desc.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('يرجى ملء كافة تفاصيل المصروف!', textAlign: TextAlign.center)),
      );
      return;
    }

    final amount = double.tryParse(amountText) ?? 0.0;
    final newExp = Expense(date: DateTime.now(), amount: amount, description: desc);

    await DBService.addExpense(newExp);
    _amountCtrl.clear();
    _descCtrl.clear();
    _loadExpenses();

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('تم تسجيل وتقييد المصروف بنجاح!', textAlign: TextAlign.center), backgroundColor: Colors.green),
    );
  }

  @override
  void dispose() {
    _amountCtrl.dispose();
    _descCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final double totalExpenses = _expenses.fold(0, (sum, item) => sum + item.amount);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GlassContainer(
            borderColor: AppColors.accentGold,
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('إجمالي مصاريف التشغيل والصيانة للمكتب', style: TextStyle(color: AppColors.textGray, fontSize: 11)),
                    const SizedBox(height: 6),
                    Text(
                      '\\\\\\$' + totalExpenses.toStringAsFixed(2),
                      style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const Icon(Icons.analytics_rounded, color: AppColors.accentGold, size: 36),
              ],
            ),
          ),
          const SizedBox(height: 20),
          if (widget.userRole == "المدير العام") ...[
            const Text('تقييد وتسجيل حركات صرف وصيانة جديدة 🏗️', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            GlassContainer(
              padding: const EdgeInsets.all(12),
              child: Column(
                children: [
                  TextField(
                    controller: _amountCtrl,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'المبلغ المستحق ماليًا (\$)',
                      labelStyle: TextStyle(fontSize: 12),
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _descCtrl,
                    decoration: const InputDecoration(
                      labelText: 'غرض وبنود الصرف (مثال: صيانة مكييفات المعرض)',
                      labelStyle: TextStyle(fontSize: 12),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    height: 40,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('إدراج وتسجيل المصروف فورا', style: TextStyle(fontSize: 12)),
                      onPressed: _addExpense,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],
          const Text('سجل حركات الصرف الحالية 📜', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          _expenses.isEmpty
              ? const Center(child: Text('السجل فارغ'))
              : ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _expenses.length,
                  itemBuilder: (context, index) {
                    final exp = _expenses[index];
                    return Card(
                      color: Colors.white.withOpacity(0.02),
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        leading: const Icon(Icons.outbox_rounded, color: AppColors.primaryLight, size: 20),
                        title: Text(exp.description, style: const TextStyle(fontSize: 12)),
                        subtitle: Text(exp.date.toString(), style: const TextStyle(color: Colors.grey, fontSize: 10)),
                        trailing: Text(
                          '-\\\$' + exp.amount.toString(),
                          style: const TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                    );
                  },
                ),
        ],
      ),
    );
  }
}
`;
