import { Car, Property, Expense, UserRole } from '../types';
import { Landmark, Car as CarIcon, Building, ArrowUpRight, ShieldCheck, Sparkles, Plus, Wallet } from 'lucide-react';

interface HomeTabProps {
  cars: Car[];
  properties: Property[];
  expenses: Expense[];
  role: UserRole;
  onNavigateToTab: (tab: 'cars' | 'properties' | 'add' | 'reports' | 'flutter-code') => void;
}

export default function HomeTab({ cars, properties, expenses, role, onNavigateToTab }: HomeTabProps) {
  
  // Computations
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalCarsValue = cars.reduce((sum, c) => sum + c.price, 0);
  const totalPropertiesValue = properties.reduce((sum, p) => sum + p.price, 0);

  // Helper formatting to Egyptian Pounds (Milli / Thousands)
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toLocaleString('ar-EG', { maximumFractionDigits: 2 })} مليون ج.م`;
    }
    return `${amount.toLocaleString('ar-EG')} ج.م`;
  };

  const availableCars = cars.filter(c => c.status === 'متوفر').length;
  const availableProps = properties.filter(p => p.status === 'معروض للبيع' || p.status === 'معروض للإيجار').length;

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden backdrop-blur-md bg-gradient-to-l from-red-950/40 via-neutral-900 to-black border border-red-950/60 rounded-2xl p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative">
          <div className="space-y-1.5 text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              مجموعة العدوي الاستثمارية والمالية
            </span>
            <h2 className="text-2xl font-black text-white mt-1">
              مرحباً بك في لوحة الإدارة الشاملة
            </h2>
            <p className="text-xs text-neutral-400">
              تابع وحرّك القيود، المخزون، والمحافظ الاستثمارية للسيارات الفاخرة والعقارات بكفاءة.
            </p>
          </div>

          <div className="inline-flex items-center self-start md:self-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <div className="text-right">
              <p className="text-[10px] text-neutral-500 font-bold leading-none">الصلاحية المفعلة</p>
              <p className="text-xs font-extrabold text-white mt-1">حساب: {role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Statistical Panels */}
      <div>
        <h3 className="text-right text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
          ملخص قيم الأصول والمصاريف
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Expenses */}
          <div className="group relative overflow-hidden backdrop-blur-md bg-stone-900/40 border border-red-950/60 rounded-2xl p-6 hover:border-red-900/80 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-neutral-400">إجمالي المصروفات الإدارية</span>
              <div className="p-2.5 rounded-xl bg-red-950/60 text-red-400 border border-red-900/40">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-2xl font-black text-red-400 leading-none">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-[11px] text-neutral-500 font-bold">
                للشهر الحالي (مايو 2026)
              </p>
            </div>
            <button 
              onClick={() => onNavigateToTab('reports')}
              className="mt-5 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 font-bold border border-neutral-800 transition-all cursor-pointer"
            >
              عرض الفواتير والتفاصيل
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cars Asset Pool */}
          <div className="group relative overflow-hidden backdrop-blur-md bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 hover:border-amber-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-neutral-400">أسطول معرض السيارات</span>
              <div className="p-2.5 rounded-xl bg-neutral-950 text-amber-500 border border-neutral-800">
                <CarIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-2xl font-black text-white leading-none">
                {formatCurrency(totalCarsValue)}
              </p>
              <p className="text-[11px] text-neutral-500 font-bold">
                {cars.length} طرازات في الصالة (متاح {availableCars})
              </p>
            </div>
            <button 
              onClick={() => onNavigateToTab('cars')}
              className="mt-5 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-amber-500 font-bold border border-amber-500/10 transition-all cursor-pointer"
            >
              تصفح سيارات الصالة
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Properties Asset Pool */}
          <div className="group relative overflow-hidden backdrop-blur-md bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 hover:border-amber-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-neutral-400">المحفظة العقارية الحالية</span>
              <div className="p-2.5 rounded-xl bg-neutral-950 text-amber-500 border border-neutral-800">
                <Building className="w-5 h-5" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-2xl font-black text-white leading-none">
                {formatCurrency(totalPropertiesValue)}
              </p>
              <p className="text-[11px] text-neutral-500 font-bold">
                {properties.length} عقارات استثمارية (متاح {availableProps})
              </p>
            </div>
            <button 
              onClick={() => onNavigateToTab('properties')}
              className="mt-5 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-amber-500 font-bold border border-amber-500/10 transition-all cursor-pointer"
            >
              فتح المحفظة العقارية
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Operational Shortcuts */}
      <div className="pt-2">
        <h3 className="text-right text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
          لوحة العمليات والترقيات السريعة
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => onNavigateToTab('add')}
            className="group flex flex-col items-center justify-center p-6 bg-neutral-900/50 hover:bg-red-950/20 border border-neutral-800/60 hover:border-red-900 rounded-2xl transition-all cursor-pointer text-center duration-300"
          >
            <div className="p-3 bg-red-950/60 text-red-500 rounded-full group-hover:scale-110 transition-all">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-black text-white mt-3 block">قيد سيارة جديدة</span>
            <span className="text-[10px] text-neutral-400 mt-1 block">إضافة المعروض بالمواصفات</span>
          </button>

          <button 
            onClick={() => onNavigateToTab('add')}
            className="group flex flex-col items-center justify-center p-6 bg-neutral-900/50 hover:bg-amber-950/20 border border-neutral-800/60 hover:border-amber-500/40 rounded-2xl transition-all cursor-pointer text-center duration-300"
          >
            <div className="p-3 bg-amber-950/60 text-amber-400 rounded-full group-hover:scale-110 transition-all">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-black text-white mt-3 block">إدراج وحدة عقارية</span>
            <span className="text-[10px] text-neutral-400 mt-1 block">موقع، مساحة وتصنيف</span>
          </button>

          <button 
            onClick={() => onNavigateToTab('add')}
            className="group flex flex-col items-center justify-center p-6 bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800/60 rounded-2xl transition-all cursor-pointer text-center duration-300"
          >
            <div className="p-3 bg-neutral-850 text-neutral-300 rounded-full group-hover:scale-110 transition-all">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-black text-white mt-3 block">تسجيل مصروفات</span>
            <span className="text-[10px] text-neutral-400 mt-1 block">الخدمات، صيانة، ترويج</span>
          </button>

          <button 
            onClick={() => onNavigateToTab('flutter-code')}
            className="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-500/5 to-amber-500/10 hover:from-amber-500/10 hover:to-amber-500/15 border border-amber-500/20 hover:border-amber-500 rounded-2xl transition-all cursor-pointer text-center duration-300"
          >
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-full group-hover:scale-110 transition-all border border-amber-500/30">
              <Landmark className="w-6 h-6" />
            </div>
            <span className="text-sm font-black text-amber-400 mt-3 block">تطبيق الجوال Flutter</span>
            <span className="text-[10px] text-neutral-300 mt-1 block">نسخ الكود المتكامل وجاهز</span>
          </button>
        </div>
      </div>
    </div>
  );
}
