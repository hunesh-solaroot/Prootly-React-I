import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface StatCardProps {
  value: number;
  label: string;
}
const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 flex items-center justify-center flex-col text-center">
    <p className="text-2xl font-bold text-green-400">{value}</p>
    <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">{label}</p>
  </div>
);

export const TeamsPageHeader: React.FC = () => {
  return (
    <header className="flex-shrink-0">
      <div className="flex justify-between items-center w-full gap-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard value={8} label="Total Members" />
          <StatCard value={156} label="Fresh Tasks" />
          <StatCard value={7} label="In Revision" />
          <StatCard value={166} label="Completed" />
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            className="w-80 bg-gray-700 border border-gray-600 rounded-lg py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition placeholder-gray-400"
            placeholder="Search here..."
            type="text"
          />
        </div>
      </div>
    </header>
  );
};