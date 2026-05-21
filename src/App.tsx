import { useState, useEffect } from 'react';
import { Car, Property, Expense, UserRole, TabType } from './types';
import { 
  getStoredCars, saveCars, 
  getStoredProperties, saveProperties, 
  getStoredExpenses, saveExpenses 
} from './data';

import LoginScreen from './components/LoginScreen';
import HomeTab from './components/HomeTab';
import CarsTab from './components/CarsTab';
import PropertiesTab from './components/PropertiesTab';
import AddTab from './components/AddTab';
import ReportsTab from './components/ReportsTab';
import FlutterCodeViewer from './components/FlutterCodeViewer';

import { 
  Sparkles, LogOut, RefreshCw, 
  Home, Car as CarIcon, Building, 
  PlusCircle, BarChart3, Layout, Smartphone 
} from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<UserRole>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Interactive Live States
  const [cars, setCars] = useState<Car[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Initialize data stores once on render
  useEffect(() => {
    setCars(getStoredCars());
    setProperties(getStoredProperties());
    setExpenses(getStoredExpenses());
  }, []);

  // Update actions
  const handleAddCar = (car: Car) => {
    const updated = [car, ...cars];
    setCars(updated);
    saveCars(updated);
  };

  const handleAddProperty = (prop: Property) => {
    const updated = [prop, ...properties];
    setProperties(updated);
    saveProperties(updated);
  };

  const handleAddExpense = (exp: Expense) => {
    const updated = [exp, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
  };

  const handleClearDatabase = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط قاعدة البيانات للبيانات التجريبية الأصلية؟')) {
      localStorage.removeItem('eladawy_cars');
      localStorage.removeItem('eladawy_properties');
      localStorage.removeItem('eladawy_expenses');
      setCars(getStoredCars());
      setProperties(getStoredProperties());
      setExpenses(getStoredExpenses());
      setActiveTab('home');
    }
  };

  // If user is not authenticated, render Login Screen
  if (!role) {
    return <LoginScreen onLoginSuccess={(userRole) => setRole(userRole)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/35 selection:text-white flex flex-col font-sans antialiased pb-20 md:pb-0">
      
      {/* 1. Showroom Ambient Lighting overlays */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-red-950/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[400px] left-10 w-[300px] h-[300px] bg-amber-950/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 2. Unified Premium Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-stone-900/80 border-b border-red-950/80 px-4 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Action controls / User Info */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRole(null)}
              className="p-2 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-all cursor-pointer"
              title="تسجيل خروج"
            >
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
            
            <button
              onClick={handleClearDatabase}
              className="p-2 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-all cursor-pointer"
              title="إعادة ضبط البيانات"
            >
              <RefreshCw className="w-4 h-4 shrink-0" />
            </button>

            {/* Role indicator */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/50 hover:bg-red-950/80 border border-red-900/40 text-red-450 rounded-lg text-xs font-bold transition-all">
              {role}
            </span>
          </div>

          {/* Logo brand */}
          <div className="text-center md:absolute md:left-1/2 md:-translate-x-1/2 select-none">
            <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 tracking-tight cursor-pointer" onClick={() => setActiveTab('home')}>
              ELADAWY GROUP
            </h1>
            <p className="text-[10px] text-amber-500/80 font-bold tracking-wider leading-none">
              مجموعة العدوي الاستثمارية
            </p>
          </div>

          {/* Large Screen Menu Tabs */}
          <nav className="hidden md:flex items-center gap-1.5" dir="rtl">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activeTab === 'home' 
                  ? 'bg-red-950/30 text-amber-400 border-amber-500/50' 
                  : 'text-neutral-400 hover:text-white border-transparent'
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => setActiveTab('cars')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activeTab === 'cars' 
                  ? 'bg-red-950/30 text-amber-400 border-amber-500/50' 
                  : 'text-neutral-400 hover:text-white border-transparent'
              }`}
            >
              السيارات
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activeTab === 'properties' 
                  ? 'bg-red-950/30 text-amber-400 border-amber-500/50' 
                  : 'text-neutral-400 hover:text-white border-transparent'
              }`}
            >
              العقارات
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activeTab === 'add' 
                  ? 'bg-red-950/30 text-amber-400 border-amber-500/50' 
                  : 'text-neutral-400 hover:text-white border-transparent'
              }`}
            >
              قيد وإضافة
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activeTab === 'reports' 
                  ? 'bg-red-950/30 text-amber-400 border-amber-500/50' 
                  : 'text-neutral-400 hover:text-white border-transparent'
              }`}
            >
              التقارير
            </button>
            <button
              onClick={() => setActiveTab('flutter-code')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/10 transition-all cursor-pointer flex items-center gap-1`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              تطبيق الجوال
            </button>
          </nav>

        </div>
      </header>

      {/* 3. Main Body Canvas Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 relative z-10">
        <div className="transition-all duration-300">
          {activeTab === 'home' && (
            <HomeTab 
              cars={cars} 
              properties={properties} 
              expenses={expenses} 
              role={role} 
              onNavigateToTab={(tab) => setActiveTab(tab)} 
            />
          )}
          {activeTab === 'cars' && <CarsTab cars={cars} />}
          {activeTab === 'properties' && <PropertiesTab properties={properties} />}
          {activeTab === 'add' && (
            <AddTab 
              onAddCar={handleAddCar}
              onAddProperty={handleAddProperty}
              onAddExpense={handleAddExpense}
            />
          )}
          {activeTab === 'reports' && <ReportsTab expenses={expenses} role={role} />}
          {activeTab === 'flutter-code' && <FlutterCodeViewer />}
        </div>
      </main>

      {/* 4. Bottom Tab Navigation (For Collapsed View / Mobile Simulators) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-stone-900/90 border-t border-neutral-850 py-2.5 px-4 shadow-xl">
        <div className="flex items-center justify-around gap-2 text-center">
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'home' ? 'text-amber-400' : 'text-neutral-450'}`}
          >
            <Home className="w-5 h-5 shrink-0" />
            <span>الرئيسية</span>
          </button>

          <button 
            onClick={() => setActiveTab('cars')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'cars' ? 'text-amber-400' : 'text-neutral-450'}`}
          >
            <CarIcon className="w-5 h-5 shrink-0" />
            <span>السيارات</span>
          </button>

          <button 
            onClick={() => setActiveTab('properties')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'properties' ? 'text-amber-400' : 'text-neutral-450'}`}
          >
            <Building className="w-5 h-5 shrink-0" />
            <span>العقارات</span>
          </button>

          <button 
            onClick={() => setActiveTab('add')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'add' ? 'text-amber-400' : 'text-neutral-450'}`}
          >
            <PlusCircle className="w-5 h-5 shrink-0" />
            <span>قيد جديد</span>
          </button>

          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'reports' ? 'text-amber-400' : 'text-neutral-450'}`}
          >
            <BarChart3 className="w-5 h-5 shrink-0" />
            <span>التقارير</span>
          </button>

          <button 
            onClick={() => setActiveTab('flutter-code')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${activeTab === 'flutter-code' ? 'text-amber-400' : 'text-neutral-450'}`}
          >
            <Smartphone className="w-5 h-5 shrink-0" />
            <span>فلاتر</span>
          </button>
          
        </div>
      </div>

    </div>
  );
}
