import React from 'react';
import { TeamMember } from '@/services/mockApiService';
import { FaEdit , FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

interface TeamsDataTableProps {
  members: TeamMember[];
  isLoading: boolean;
}

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
    const roleColors: { [key: string]: string } = {
        manager: 'bg-purple-500/20 text-purple-300',
        admin: 'bg-blue-500/20 text-blue-300',
        founder: 'bg-yellow-500/20 text-yellow-300',
        ceo: 'bg-cyan-500/20 text-cyan-300',
        cto: 'bg-indigo-500/20 text-indigo-300',
    };
    const colorClass = roleColors[role.toLowerCase()] || 'bg-gray-500/20 text-gray-300';
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
            {role}
        </span>
    );
};

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <th scope="col" className="px-6 py-3">
        <div className="flex items-center gap-2">
            <span>{children}</span>
            <FaSort className="text-gray-500" />
        </div>
    </th>
);


export const TeamsDataTable: React.FC<TeamsDataTableProps> = ({ members, isLoading }) => {
  if (isLoading) {
    return <div className="text-center p-12 text-gray-400">Loading Team Members...</div>;
  }

  return (
    <div className="h-full overflow-hidden">
      <table className="w-full text-sm text-left text-gray-400">
        <thead className="text-xs text-gray-400 uppercase bg-gray-800 sticky top-0">
          <tr>
            <TableHeader>Team Member</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Fresh</TableHeader>
            <TableHeader>Revision</TableHeader>
            <TableHeader>Completed</TableHeader>
            <TableHeader>Total</TableHeader>
            <th scope="col" className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700 overflow-auto">
          {members.map(member => (
            <tr key={member.id} className="hover:bg-gray-700/50">
              <td className="px-6 py-4 font-medium text-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center text-white font-bold text-lg">
                    {member.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{member.name}</div>
                    <div className="text-gray-400">{member.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <RoleBadge role={member.role} />
              </td>
              <td className="px-6 py-4 font-semibold text-center text-green-400">{member.tasks.fresh}</td>
              <td className="px-6 py-4 font-semibold text-center text-red-400">{member.tasks.revision}</td>
              <td className="px-6 py-4 font-semibold text-center text-blue-400">{member.tasks.completed}</td>
              <td className="px-6 py-4 font-bold text-center text-white">{member.tasks.total}</td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button className="flex items-center gap-1.5 font-semibold text-white bg-green-600 hover:bg-green-700 transition px-3 py-1.5 rounded-md text-xs">
                     <FaEdit /> Edit
                  </button>
                  <button className="text-gray-400 bg-gray-700 hover:bg-gray-600 p-2 rounded-md transition">
                    <BsThreeDots />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};