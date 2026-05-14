import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDays, X, Plus } from 'lucide-react';
interface CustomDatePickerProps {
  value: string;
  onChange: (val: string) => void;
  label: string;
  name?: string;
  id?: string;
}

export const CustomDatePicker = ({ value, onChange, label, name, id }: CustomDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'calendar' | 'years'>('calendar');
  const [viewDate, setViewDate] = useState(value ? new Date(value + 'T00:00:00') : new Date());
  const [inputValue, setInputValue] = useState(value ? new Date(value + 'T00:00:00').toLocaleDateString('pt-BR') : '');

  useEffect(() => {
    if (value) {
      setInputValue(new Date(value + 'T00:00:00').toLocaleDateString('pt-BR'));
    }
  }, [value]);

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
  const handleSelect = (day: number) => {
    const d = String(day).padStart(2, '0');
    const m = String(viewDate.getMonth() + 1).padStart(2, '0');
    const y = viewDate.getFullYear();
    const formattedDate = `${y}-${m}-${d}`;
    onChange(formattedDate);
    setInputValue(`${d}/${m}/${y}`);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 8) v = v.slice(0, 8);
    
    let display = v;
    if (v.length > 2) display = v.slice(0, 2) + "/" + v.slice(2);
    if (v.length > 4) display = display.slice(0, 5) + "/" + display.slice(5);
    setInputValue(display);

    if (v.length === 8) {
      const day = parseInt(v.slice(0, 2));
      const month = parseInt(v.slice(2, 4)) - 1;
      const year = parseInt(v.slice(4, 8));
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime()) && month >= 0 && month < 12 && day > 0 && day <= daysInMonth(month, year)) {
        const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(formatted);
        setViewDate(date);
      }
    }
  };

  const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - 80 + i);

  function changeMonth(offset: number) {
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(next);
  }

  return (
    <div className="relative w-full group">
      <label className="block text-[10px] font-black uppercase text-indigo-400 mb-1.5 ml-1 tracking-widest">{label}</label>
      <div className="flex items-center bg-indigo-50/50 border border-indigo-100 rounded-xl hover:border-indigo-300 transition-all px-2.5 group-hover:shadow-sm">
        <input 
          type="text"
          placeholder="DD/MM/AAAA"
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
          className="flex-1 bg-transparent py-3 text-[13px] font-bold text-indigo-900 outline-none placeholder:text-indigo-200"
        />
        <input type="hidden" name={name} id={id} value={value} />
        <button type="button" onClick={() => setIsOpen(!isOpen)} className="p-1">
          <CalendarDays className="w-4 h-4 text-indigo-400 hover:text-indigo-600 transition-colors" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => { setIsOpen(false); setView('calendar'); }} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-72 bg-white border border-indigo-50 rounded-[2.5rem] shadow-2xl z-[70] p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <button type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-indigo-50 rounded-full text-indigo-300 transition-colors">
                  <X className="w-4 h-4 rotate-45" />
                </button>
                <div className="text-center cursor-pointer hover:scale-105 transition-transform" onClick={() => setView(view === 'years' ? 'calendar' : 'years')}>
                  <p className="text-[10px] uppercase font-black text-indigo-300 leading-none">{view === 'calendar' ? 'Mudar Ano' : 'Voltar'}</p>
                  <p className="text-base font-black text-indigo-900">{view === 'calendar' ? `${months[viewDate.getMonth()]} ${viewDate.getFullYear()}` : 'Selecionar Ano'}</p>
                </div>
                <button type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-indigo-50 rounded-full text-indigo-300 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {view === 'calendar' ? (
                <>
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                      <span key={d} className="text-[10px] font-black text-indigo-100">{d}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear()) }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth(viewDate.getMonth(), viewDate.getFullYear()) }).map((_, i) => {
                      const day = i + 1;
                      const isSelected = value === `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      return (
                        <button 
                          key={day} 
                          type="button"
                          onClick={() => handleSelect(day)}
                          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-indigo-50 text-indigo-900'}`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1 scrollbar-hide">
                  {years.reverse().map(y => (
                    <button 
                      key={y} 
                      type="button"
                      onClick={() => { setViewDate(new Date(y, viewDate.getMonth(), 1)); setView('calendar'); }}
                      className={`py-2 text-xs font-bold rounded-xl transition-all ${viewDate.getFullYear() === y ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-indigo-50 text-indigo-800'}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
              
              <button 
                type="button" 
                onClick={() => {
                  const today = new Date();
                  onChange(today.toISOString().split('T')[0]);
                  setInputValue(today.toLocaleDateString('pt-BR'));
                  setViewDate(today);
                  setIsOpen(false);
                }}
                className="w-full mt-6 py-2 text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-600 border-t border-indigo-50 pt-4"
              >
                Hoje
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
