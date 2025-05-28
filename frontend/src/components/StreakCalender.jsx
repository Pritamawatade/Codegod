import React, { useState, useMemo } from 'react';

const StreakCalendar = () => {
  // Sample data - replace with your API data
  const streakData = [
    { date: "2025-05-01", count: 1 },
    { date: "2025-05-05", count: 2 },
    { date: "2025-05-06", count: 1 },
    { date: "2025-05-07", count: 3 },
    { date: "2025-05-08", count: 1 },
    { date: "2025-05-09", count: 2 },
    { date: "2025-05-10", count: 1 },
    { date: "2025-05-11", count: 1 },
    { date: "2025-05-12", count: 2 },
    { date: "2025-05-13", count: 1 },
    { date: "2025-05-14", count: 1 },
    { date: "2025-05-15", count: 1 },
    { date: "2025-05-16", count: 2 },
    { date: "2025-05-17", count: 1 },
    { date: "2025-05-18", count: 1 },
    { date: "2025-05-19", count: 1 },
    { date: "2025-05-20", count: 1 },
    { date: "2025-05-21", count: 2 },
    { date: "2025-05-23", count: 0 },
    { date: "2025-05-27", count: 1 }, // Today
  ];

  const [currentDate] = useState(new Date(2025, 4, 27)); // May 27, 2025

  // Create a map for quick lookup of streak data
  const streakMap = useMemo(() => {
    return streakData.reduce((map, item) => {
      map[item.date] = item.count;
      return map;
    }, {});
  }, []);

  // Calculate current and max streak
  const { currentStreak, maxStreak } = useMemo(() => {
    const sortedData = streakData
      .filter(item => item.count > 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    let maxStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;
    let lastDate = null;

    for (const item of sortedData) {
      const itemDate = new Date(item.date);
      
      if (lastDate) {
        const dayDiff = (itemDate - lastDate) / (1000 * 60 * 60 * 24);
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      
      maxStreak = Math.max(maxStreak, tempStreak);
      
      // Check if this extends to today
      const today = new Date();
      const daysFromToday = (today - itemDate) / (1000 * 60 * 60 * 24);
      if (daysFromToday <= 1) {
        currentStreak = tempStreak;
      }
      
      lastDate = itemDate;
    }

    return { currentStreak, maxStreak };
  }, [streakData]);

  // Get calendar data for the current month
  const getCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const days = [];
    const currentDateObj = new Date(startDate);

    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const dateStr = currentDateObj.toISOString().split('T')[0];
      const isCurrentMonth = currentDateObj.getMonth() === month;
      const dayNumber = currentDateObj.getDate();
      const streakCount = streakMap[dateStr];
      
      days.push({
        date: dateStr,
        day: dayNumber,
        isCurrentMonth,
        streakCount: streakCount !== undefined ? streakCount : null,
      });
      
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    return days;
  };

  const calendarData = getCalendarData();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getEmojiForDay = (streakCount, isCurrentMonth) => {
    if (!isCurrentMonth) return null;
    if (streakCount === null) return null; // No data for this day
    if (streakCount > 0) return '🔥';
    return '😢';
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Monthly Streak</h1>
      
      {/* Month */}
      <h2 className="text-xl font-semibold text-center mb-4">
        {monthNames[currentDate.getMonth()]}
      </h2>
      
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayLabels.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {calendarData.map((dayData, index) => {
          const emoji = getEmojiForDay(dayData.streakCount, dayData.isCurrentMonth);
          
          return (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center rounded-full text-sm relative
                ${dayData.isCurrentMonth 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-300 dark:text-gray-600'
                }
                ${emoji === '🔥' 
                  ? 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500 dark:border-orange-400' 
                  : ''
                }
                ${emoji === '😢' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400' 
                  : ''
                }
              `}
            >
              {dayData.isCurrentMonth && (
                <>
                  {emoji ? (
                    <span className="text-lg">{emoji}</span>
                  ) : (
                    <span className="text-sm">{dayData.day}</span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Current Streak</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">🔥</span>
            <span className="text-2xl font-bold">{currentStreak}</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Max Streak</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg text-orange-500">{'</>'}</span>
            <span className="text-2xl font-bold">{maxStreak}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;