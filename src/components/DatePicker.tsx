import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  activeDates: string[];
  minDate?: string;
  maxDate?: string;
}

export default function DatePicker({ value, onChange, activeDates, minDate, maxDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = new Date(value);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('sl-SI', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isDateActive = (dateString: string) => {
    return activeDates.includes(dateString);
  };

  const isDateInRange = (dateString: string) => {
    if (minDate && dateString < minDate) return false;
    if (maxDate && dateString > maxDate) return false;
    return true;
  };

  const handleDateClick = (dateString: string) => {
    if (isDateInRange(dateString)) {
      onChange(dateString);
      setIsOpen(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('sl-SI', { month: 'long', year: 'numeric' });

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-9" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = formatDateString(year, month, day);
    const isActive = isDateActive(dateString);
    const isSelected = dateString === value;
    const isInRange = isDateInRange(dateString);

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(dateString)}
        disabled={!isInRange}
        className={`
          h-9 rounded text-sm font-medium transition-all relative
          ${isSelected ? 'bg-blue-600 text-white ring-2 ring-blue-400' : ''}
          ${!isSelected && isActive ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : ''}
          ${!isSelected && !isActive && isInRange ? 'text-gray-400 hover:bg-[#2a2c36]' : ''}
          ${!isInRange ? 'text-gray-600 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {day}
        {isActive && !isSelected && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />
        )}
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#111217] border border-[#2a2c36] text-white rounded px-3 py-2 text-sm hover:border-[#3a3c46] focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
      >
        <Calendar size={16} className="text-gray-400" />
        <span>{formatDisplayDate(value)}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-[#111217] border border-[#2a2c36] rounded-lg shadow-2xl p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-[#2a2c36] rounded transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
            <span className="text-sm font-medium text-white capitalize">{monthName}</span>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-[#2a2c36] rounded transition-colors"
            >
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['N', 'P', 'T', 'S', 'Č', 'P', 'S'].map((day, i) => (
              <div key={i} className="h-9 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>

          <div className="mt-4 pt-3 border-t border-[#2a2c36] flex items-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>Aktivni dnevi</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
