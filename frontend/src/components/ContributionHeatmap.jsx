import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flame, TrendingUp, Award } from 'lucide-react';

const ContributionHeatmap = ({ data = [] }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Sample data - replace with your actual data
  const sampleData = [
    { date: "2025-01-01", count: 0 },
    { date: "2025-01-02", count: 1 },
    { date: "2025-01-03", count: 3 },
    { date: "2025-01-04", count: 0 },
    { date: "2025-01-05", count: 2 },
    { date: "2025-01-06", count: 5 },
    { date: "2025-01-07", count: 4 },
    { date: "2025-01-08", count: 1 },
    { date: "2025-01-09", count: 0 },
    { date: "2025-01-10", count: 2 },
    { date: "2025-01-11", count: 8 },
    { date: "2025-01-12", count: 3 },
    { date: "2025-01-13", count: 6 },
    { date: "2025-01-14", count: 1 },
    { date: "2025-01-15", count: 4 },
    { date: "2025-05-28", count: 6 },
    { date: "2025-05-29", count: 6 },
    { date: "2025-05-30", count: 2 },
    { date: "2025-05-31", count: 4 },
    { date: "2025-06-01", count: 1 },
  ];

  const contributionData = data.length > 0 ? data : sampleData;

  // Generate all dates for the year
  const generateYearData = (year) => {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const dates = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    return dates;
  };

  const yearDates = generateYearData(selectedYear);
  
  // Create a map for quick lookup
  const contributionMap = useMemo(() => {
    const map = new Map();
    contributionData.forEach(item => {
      map.set(item.date, item.count);
    });
    return map;
  }, [contributionData]);

  // Get contribution level (0-4) based on count
  const getContributionLevel = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  // Get color class based on level
  const getColorClass = (level, isDark = false) => {
    const lightColors = [
      'bg-gray-100 border-gray-200', // Level 0
      'bg-green-100 border-green-200', // Level 1
      'bg-green-300 border-green-400', // Level 2
      'bg-green-500 border-green-600', // Level 3
      'bg-green-700 border-green-800', // Level 4
    ];
    
    const darkColors = [
      'bg-gray-800 border-gray-700', // Level 0
      'bg-green-900 border-green-800', // Level 1
      'bg-green-700 border-green-600', // Level 2
      'bg-green-500 border-green-400', // Level 3
      'bg-green-400 border-green-300', // Level 4
    ];
    
    return isDark ? darkColors[level] : lightColors[level];
  };

  // Group dates by weeks
  const getWeekData = () => {
    const weeks = [];
    let currentWeek = [];
    
    // Find the first Sunday of the year or start from Monday
    const firstDate = yearDates[0];
    const firstDay = firstDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Add empty cells for days before the first date
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null);
    }
    
    yearDates.forEach(date => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      const dateString = date.toISOString().split('T')[0];
      const count = contributionMap.get(dateString) || 0;
      
      currentWeek.push({
        date: dateString,
        count,
        level: getContributionLevel(count)
      });
    });
    
    // Add the last week if it has content
    if (currentWeek.length > 0) {
      // Fill remaining days with null
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const weeks = getWeekData();
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate statistics
  const totalContributions = contributionData.reduce((sum, item) => sum + item.count, 0);
  const currentStreak = useMemo(() => {
    const sortedData = [...contributionData]
      .filter(item => item.count > 0)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedData.length; i++) {
      const itemDate = new Date(sortedData[i].date);
      const daysDiff = Math.floor((today - itemDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }, [contributionData]);

  const maxContributions = Math.max(...contributionData.map(item => item.count), 0);
  const activeDays = contributionData.filter(item => item.count > 0).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-green-600" />
            Contribution Activity
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {totalContributions} contributions in {selectedYear}
          </p>
        </div>
        
        {/* Year selector */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="mt-4 lg:mt-0 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500"
        >
          {[2023, 2024, 2025].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Total</span>
          </div>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">{totalContributions}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Streak</span>
          </div>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{currentStreak}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Best Day</span>
          </div>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{maxContributions}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Active Days</span>
          </div>
          <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">{activeDays}</p>
        </motion.div>
      </div>

      {/* Heatmap */}
      <div className="relative">
        {/* Month labels */}
        <div className="flex mb-2 ml-8">
          {months.map((month, index) => (
            <div
              key={month}
              className="flex-1 text-xs text-gray-600 dark:text-gray-400 text-center"
              style={{ minWidth: `${100/12}%` }}
            >
              {month}
            </div>
          ))}
        </div>

        {/* Main heatmap container */}
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col mr-2">
            {days.map((day, index) => (
              <div
                key={day}
                className="h-3 mb-1 text-xs text-gray-600 dark:text-gray-400 flex items-center"
                style={{ height: '12px', marginBottom: '2px' }}
              >
                {index % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm border cursor-pointer transition-all duration-200 ${
                      day 
                        ? `${getColorClass(day.level, document.documentElement.classList.contains('dark'))} hover:ring-2 hover:ring-green-400 hover:scale-110`
                        : 'bg-transparent'
                    }`}
                    onMouseEnter={() => day && setHoveredCell(day)}
                    onMouseLeave={() => setHoveredCell(null)}
                    whileHover={{ scale: 1.2 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute z-10 bg-gray-900 dark:bg-gray-700 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none"
            style={{
              top: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-medium">
              {hoveredCell.count} contribution{hoveredCell.count !== 1 ? 's' : ''}
            </div>
            <div className="text-gray-300 dark:text-gray-400">
              {formatDate(hoveredCell.date)}
            </div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-400">Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm border ${getColorClass(level, document.documentElement.classList.contains('dark'))}`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">More</span>
      </div>
    </motion.div>
  );
};

export default ContributionHeatmap; 