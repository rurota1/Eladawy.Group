import { useState } from 'react';
import { Property } from '../types';
import { Building2, Search, MapPin, AreaChart, CircleDot, ShieldAlert } from 'lucide-react';

interface PropertiesTabProps {
  properties: Property[];
}

export default function PropertiesTab({ properties }: PropertiesTabProps) {
  const [filterType, setFilterType] = useState<'all' | 'villa' | 'apartment' | 'building' | 'land' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = properties.filter(p => {
    const matchesType = filterType === 'all' || p.type === filterType;
    const matchesSearch = p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeNameAr = (type: string) => {
    switch (type) {
      case 'villa': return 'فيلا مستقلة فاخرة';
      case 'apartment': return 'شقة دوبلكس راقية';
      case 'building': return 'برج تجاري / عمارة';
      case 'land': return 'أرض استثمارية';
      default: return type;
    }
  };

  return (
    <div className="space-y-6 text-right">
      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between bg-neutral-900/40 p-5 border border-neutral-800 rounded-2xl">
        <div className="relative flex-1">
          <input
            type="text"
            dir="rtl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن وحدة عقارية بالشارع أو المنطقة..."
            className="w-full text-right bg-black border border-neutral-800 focus:border-amber-500/80 rounded-xl pr-11 pl-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none transition-all focus:ring-1 focus:ring-amber-500/30"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
            <Search className="w-5 h-5" />
          </div>
        </div>

        {/* Real Estate Categories */}
        <div className="flex flex-wrap gap-2" dir="rtl">
          {(['all', 'villa', 'apartment', 'building'] as const).map((type) => {
            const label = type === 'all' ? 'الكل' : type === 'villa' ? 'فلل' : type === 'apartment' ? 'شقق' : 'مباني وعمارات';
            const isActive = filterType === type;
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
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

      {/* Grid List */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-16 backdrop-blur-md bg-neutral-900/20 border border-neutral-800/80 rounded-2xl">
          <Building2 className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <p className="text-sm text-neutral-400 font-bold">المحفظة العقارية خالية من هذا الصنف حالياً</p>
          <p className="text-xs text-neutral-500 mt-1">جرب التصفية عبر التصنيفات الأخرى المتاحة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4" dir="rtl">
          {filteredProperties.map((prop) => {
            const isAvailable = prop.status !== 'تم البيع';
            return (
              <div 
                key={prop.id}
                className="group relative overflow-hidden backdrop-blur-md bg-stone-900/30 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Property Visual Icon + Details */}
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-amber-500 shrink-0 group-hover:scale-105 transition-transform">
                      <Building2 className="w-7 h-7" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20">
                          {getTypeNameAr(prop.type)}
                        </span>
                        
                        {/* Area Indicator */}
                        <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400 font-medium font-mono">
                          <AreaChart className="w-3.5 h-3.5 text-neutral-550" />
                          {prop.area} م²
                        </span>
                      </div>

                      <h4 className="text-lg font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                        {prop.location}
                      </h4>
                    </div>
                  </div>

                  {/* Financial Value & Contract Flag */}
                  <div className="md:text-left flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center border-t md:border-t-0 border-neutral-800/60 pt-4 md:pt-0 gap-2">
                    <div className="text-right md:text-left">
                      <span className="text-[10px] text-neutral-500 font-bold block">القيمة الاستثمارية الكاملة</span>
                      <span className="text-xl font-black text-amber-500">
                        {prop.price.toLocaleString('ar-EG')} ج.م
                      </span>
                    </div>

                    <div className="pt-1">
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/35">
                          <CircleDot className="w-3 h-3 fill-emerald-400 animate-pulse" />
                          {prop.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-neutral-400 bg-neutral-950 border border-neutral-850">
                          <ShieldAlert className="w-3 h-3 text-red-500" />
                          تم التسوية والبيع
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
