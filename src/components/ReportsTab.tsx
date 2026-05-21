import { useState } from 'react';
import { Expense, UserRole } from '../types';
import { Landmark, Calendar, FileText, TrendingUp, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface ReportsTabProps {
  expenses: Expense[];
  role: 'مدير' | 'مبيعات';
}

export default function ReportsTab({ expenses, role }: ReportsTabProps) {
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const isAuthorized = role === 'مدير';

  // Find maximum amount for SVG scaling
  const maxAmount = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 1;

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* 1. Header & Credentials Box */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/40 p-5 border border-neutral-800 rounded-2xl">
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Landmark className="text-amber-500 w-5 h-5 shrink-0" />
            التقرير المالي وحساب المصاريف الإدارية
          </h3>
          <p className="text-xs text-neutral-400">
            {isAuthorized 
              ? 'مرحباً أيها المدير، لديك صلاحية فحص القيود والتحليلات البيانية والتدفقات المالية الكاملة.' 
              : 'صلاحيات المبيعات النشطة تسمح لك بمشاهدة الكشوفات دون تصدير أو كشف الدفاتر المخفية.'}
          </p>
        </div>

        {/* Auth Tag */}
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold ${
          isAuthorized 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
        }`}>
          {isAuthorized ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>صلاحية العرض: {role}</span>
        </div>
      </div>

      {/* 2. Total Outgoing Card with Golden Ambient Glow */}
      <div className="relative overflow-hidden backdrop-blur-md bg-gradient-to-l from-red-950/40 via-neutral-900 to-black border border-red-950/50 p-6 rounded-2xl shadow-xl">
        <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-10">
          <Landmark className="w-32 h-32 text-amber-500" />
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-1">
            <span className="text-xs text-neutral-450 font-bold tracking-wider uppercase">رأس المال المستهلك بالمصاريف</span>
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
              {total.toLocaleString('ar-EG')} ج.م
            </p>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-neutral-400 font-bold block">إجمالي المعاملات</span>
            <span className="text-lg font-extrabold text-white">{expenses.length} قيود فعلية</span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Luxury SVG Bar Chart - Visualizing Outgoings */}
      {isAuthorized && expenses.length > 0 && (
        <div className="backdrop-blur-md bg-stone-900/30 border border-neutral-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neural-400">تدفق المصروفات بقيم متناسبة</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-500 font-bold">
              <TrendingUp className="w-4 h-4" />
              رسم بياني تفاعلي
            </span>
          </div>

          {/* SVG Canvas Area */}
          <div className="w-full h-48 bg-black/40 rounded-xl p-4 border border-neutral-900 relative">
            <svg 
              viewBox="0 0 500 150" 
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              {/* Horizontal grid lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#ff0000" strokeWidth="0.5" strokeOpacity="0.08" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#ff0000" strokeWidth="0.5" strokeOpacity="0.08" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#ff0000" strokeWidth="0.5" strokeOpacity="0.08" />

              {/* Dynamic Bars mapping expenses */}
              {expenses.map((exp, idx) => {
                const colWidth = 500 / expenses.length;
                const barWidth = Math.min(colWidth * 0.5, 30);
                const xPos = idx * colWidth + (colWidth - barWidth) / 2;
                
                // Height ratio to scale
                const barHeight = (exp.amount / maxAmount) * 110; 
                const yPos = 130 - barHeight;

                const isHovered = hoveredBarIndex === idx;

                return (
                  <g 
                    key={idx}
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                    className="cursor-pointer transition-all duration-300"
                  >
                    {/* Glowing shadow behind bar */}
                    <rect
                      x={xPos - 2}
                      y={yPos}
                      width={barWidth + 4}
                      height={barHeight}
                      fill={isHovered ? "rgba(139, 0, 0, 0.2)" : "rgba(212, 175, 55, 0.05)"}
                      rx="3"
                    />
                    
                    {/* Real bar */}
                    <rect
                      x={xPos}
                      y={yPos}
                      width={barWidth}
                      height={barHeight}
                      className="transition-all duration-300"
                      fill={isHovered ? "#D4AF37" : "#8B0000"}
                      rx="2"
                    />

                    {/* Text values when hover */}
                    {isHovered && (
                      <g>
                        <rect 
                          x={Math.max(10, xPos - 35)} 
                          y={Math.max(5, yPos - 22)} 
                          width="100" 
                          height="18" 
                          fill="#1c1917" 
                          stroke="#D4AF37" 
                          strokeWidth="1"
                          rx="4" 
                        />
                        <text
                          x={Math.max(10, xPos - 35) + 50}
                          y={Math.max(10, yPos - 9)}
                          fill="#fff"
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                          dir="rtl"
                        >
                          {exp.amount.toLocaleString()} ج.م
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Bottom tooltip instruction and simple date metrics */}
            <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[8px] text-neutral-500 font-mono font-bold leading-none select-none">
              <span>*مرّر المؤشر على الأعمدة لقراءة الفاتورة</span>
              <span>مخطط مايو 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Detailed History Ledger Table */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-neural-300 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-neutral-500 shrink-0" />
          كشف القيود وتاريخ المعاملات المفصلة
        </h4>

        {expenses.length === 0 ? (
          <div className="text-center py-10 bg-neutral-900/30 border border-neutral-800 rounded-xl">
            <p className="text-xs text-neutral-500">لا توجد سجلات تصفية أو مصاريف مدرجة حالياً</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {expenses.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-stone-900/40 hover:bg-neutral-900/60 border border-neutral-800/80 hover:border-red-950/40 rounded-xl transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-950/50 rounded-lg text-red-400 border border-red-900/35 shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  
                  <div className="space-y-0.5 text-right">
                    <p className="text-xs font-extrabold text-white leading-tight">
                      {item.description}
                    </p>
                    <p className="text-[10px] text-neutral-500 font-mono">
                      تاريخ الصرف: {item.date}
                    </p>
                  </div>
                </div>

                <div className="text-left font-mono font-bold text-rose-450 shrink-0">
                  -{item.amount.toLocaleString('ar-EG')} ج.م
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
