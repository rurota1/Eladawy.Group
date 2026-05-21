import { useState } from 'react';
import { Car } from '../types';
import { Search, CarFront, CheckCircle, Clock, Ban } from 'lucide-react';

interface CarsTabProps {
  cars: Car[];
}

export default function CarsTab({ cars }: CarsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'متوفر' | 'تحت الصيانة' | 'مباع'>('all');

  // Filter computations
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || car.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Arabic status mapping
  const getStatusConfig = (status: 'متوفر' | 'تحت الصيانة' | 'مباع') => {
    switch (status) {
      case 'متوفر':
        return {
          label: 'متاحة للبيع فوراً',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/35',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          dot: 'bg-emerald-500',
        };
      case 'تحت الصيانة':
        return {
          label: 'تحت الفحص والصيانة',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/35',
          icon: <Clock className="w-3.5 h-3.5" />,
          dot: 'bg-amber-500',
        };
      case 'مباع':
        return {
          label: 'مباعة بالكامل',
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
          icon: <Ban className="w-3.5 h-3.5" />,
          dot: 'bg-rose-500',
        };
    }
  };

  return (
    <div className="space-y-6 text-right">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between bg-neutral-900/40 p-5 border border-neutral-800 rounded-2xl">
        <div className="relative flex-1">
          <input
            type="text"
            dir="rtl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن سيارة فاخرة بالاسم أو الشركة..."
            className="w-full text-right bg-black border border-neutral-800 focus:border-amber-500/80 rounded-xl pr-11 pl-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-all focus:ring-1 focus:ring-amber-500/30"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
            <Search className="w-5 h-5" />
          </div>
        </div>

        {/* Status Chips */}
        <div className="flex flex-wrap gap-2" dir="rtl">
          {(['all', 'متوفر', 'تحت الصيانة', 'مباع'] as const).map((status) => {
            const label = status === 'all' ? 'الكل' : status === 'متوفر' ? 'متاحة' : status === 'تحت الصيانة' ? 'تحت الصيانة' : 'مباعة';
            const isActive = filterStatus === status;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Cars */}
      {filteredCars.length === 0 ? (
        <div className="text-center py-16 backdrop-blur-md bg-neutral-900/20 border border-neutral-800/80 rounded-2xl">
          <CarFront className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <p className="text-sm text-neutral-400 font-bold">لا توجد طرازات مطابقة لبحثك في الصالة حالياً</p>
          <p className="text-xs text-neutral-500 mt-1">جرب تغيير الكلمات المفتاحية أو فلاتر الحالة المعروضة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" dir="rtl">
          {filteredCars.map((car) => {
            const statusCfg = getStatusConfig(car.status);
            return (
              <div 
                key={car.id} 
                className="group relative backdrop-blur-md bg-stone-900/30 border border-neutral-800 rounded-2xl overflow-hidden hover:border-amber-500/30 hover:shadow-xl transition-all duration-300"
              >
                {/* Decorative Sporty Mesh Backdrop */}
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-red-650 via-amber-500 to-transparent opacity-60" />

                <div className="p-5 flex gap-4 items-start">
                  
                  {/* Styled Image Placeholder */}
                  <div className="w-20 h-20 shrink-0 bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-850 rounded-xl flex flex-col items-center justify-center p-2 text-amber-500 group-hover:bg-neutral-900 transition-colors">
                    <CarFront className="w-9 h-9 opacity-80" />
                    <span className="text-[9px] text-neutral-500 font-bold mt-1 tracking-widest uppercase">ELADAWY</span>
                  </div>

                  {/* Car Description Details */}
                  <div className="flex-1 space-y-2">
                    <h4 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors">
                      {car.model}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                      <div className="text-amber-500 font-black">
                        {car.price.toLocaleString('ar-EG')} ج.م
                      </div>
                      <div className="text-neutral-550">
                        وسيط مالي معتمد للخدمة
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="pt-1 select-none">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${statusCfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.icon}
                        {statusCfg.label}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Micro specification badges */}
                <div className="grid grid-cols-3 border-t border-neutral-800/60 bg-black/40 text-center py-2 text-[10px] text-neutral-500 font-bold">
                  <div className="border-l border-neutral-800/60 font-mono">2024 AMG SPEC</div>
                  <div className="border-l border-neutral-800/60 font-mono">0 KM WARRANTY</div>
                  <div className="font-mono">V8 BITURBO</div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
