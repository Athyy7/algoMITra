import React from 'react';

// Helper function to get the date string (e.g., "2025-11-13")
const getISODateString = (date) => {
  return date.toISOString().split('T')[0];
};

// Helper function to get the color based on count (using your green)
const getColor = (count) => {
  if (count === 0) return 'bg-slate-200/50';
  if (count <= 2) return 'bg-green-200';
  if (count <= 5) return 'bg-green-400';
  if (count <= 8) return 'bg-green-600';
  return 'bg-green-800';
};

const ActivityHeatmap = ({ activityData }) => {
  // 1. Create a map for quick lookups from the { "YYYY-MM-DD": count } object
  const activityMap = new Map(Object.entries(activityData || {}));

  // 2. Generate the last year of dates
  const today = new Date();
  const days = [];
  
  // Get the starting day (Sunday) of the week 52 weeks ago
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 365);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Rewind to the previous Sunday

  // We'll show 53 weeks to ensure the grid is full
  for (let i = 0; i < 7 * 53; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(date);
  }

  return (
    // Card styling to match your theme
    <div className="p-4 bg-white/30 border border-slate-300/40 rounded-xl backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Submission Activity
      </h3>
      
      {/* Grid container for the heatmap */}
      <div 
        className="grid grid-flow-col grid-rows-7 gap-1" 
        style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))' }}
      >
        {days.map((date) => {
          const dateString = getISODateString(date);
          const count = activityMap.get(dateString) || 0;
          const color = getColor(count);

          // Only render days that are in the past or today
          if (date > today) {
            return <div key={dateString} className="aspect-square w-full" />;
          }

          return (
            <div key={dateString} className="relative group aspect-square w-full">
              <div
                className={`w-full h-full rounded-[2px] ${color} transition-all`}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                {count} submissions on {date.toLocaleDateString()}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex justify-end items-center gap-2 mt-3 text-xs text-slate-600">
        <span>Less</span>
        <div className="w-3 h-3 rounded-[2px] bg-slate-200/50"></div>
        <div className="w-3 h-3 rounded-[2px] bg-green-200"></div>
        <div className="w-3 h-3 rounded-[2px] bg-green-400"></div>
        <div className="w-3 h-3 rounded-[2px] bg-green-600"></div>
        <div className="w-3 h-3 rounded-[2px] bg-green-800"></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;