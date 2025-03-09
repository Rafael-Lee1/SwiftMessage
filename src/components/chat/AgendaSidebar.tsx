
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Sample agenda data
const agendaItems = [
  { id: 1, date: '8 March', title: 'Meeting with Fuad regarding Muhammad Fauzi and team project' },
  { id: 2, date: '9 March', title: 'Deadline project details with UI $3000' },
  { id: 3, date: '10 March', title: 'Meeting from previous honda activity at digiz dan esb' },
  { id: 4, date: '11 March', title: 'Send email to Jaya untuk technical meeting' },
  { id: 5, date: '12 March', title: 'Follow up with the team' },
];

const AgendaSidebar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [highlightedDate, setHighlightedDate] = useState(21); // Match with image

  // Calendar functionality
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  // Create calendar days
  const days = [];
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-cell"></div>);
  }
  
  // Cells for the days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(
      <div 
        key={`day-${i}`} 
        className={`calendar-cell cursor-pointer hover:bg-gray-100 ${i === highlightedDate ? 'date-active' : ''}`}
        onClick={() => setHighlightedDate(i)}
      >
        {i}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border-l border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-base">My Agenda</h2>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">{monthName} {year}</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar header */}
        <div className="calendar-grid mb-2">
          {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
            <div key={day} className="calendar-cell text-gray-500 text-xs font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="calendar-grid">
          {days}
        </div>
      </div>

      {/* Agenda items */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="font-medium mb-3">8 March</h3>
        {agendaItems.map(item => (
          <div key={item.id} className="agenda-item">
            <p className="font-medium">{item.date}</p>
            <p className="text-gray-600">{item.title}</p>
          </div>
        ))}

        <div className="text-center mt-6">
          <Button variant="outline" className="text-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add New Agenda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgendaSidebar;
