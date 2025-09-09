import React from 'react';
import { TeamLead } from '@/services/mockApiService';

interface TeamLeadSidebarProps {
  teamLeads: TeamLead[];
  activeLeadId: string;
  onSelectLead: (id: string) => void;
}

export const TeamLeadSidebar: React.FC<TeamLeadSidebarProps> = ({ teamLeads, activeLeadId, onSelectLead }) => {
  return (
    <aside className="w-72 flex-shrink-0 bg-gray-800 p-4 rounded-xl">
      <h3 className="text-lg font-semibold mb-4 text-white px-2">Team Lead</h3>
      <ul className="space-y-2">
        {teamLeads.map((lead) => (
          <li
            key={lead.id}
            className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              activeLeadId === lead.id
                ? 'bg-green-500 text-white shadow-lg' // Active state with green background
                : 'hover:bg-gray-700' // Hover state
            }`}
            onClick={() => onSelectLead(lead.id)}
          >
            <div
              className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: lead.avatarColor }}
            >
              {lead.avatar}
            </div>
            <div>
              <p className="font-semibold text-sm">{lead.name}</p>
              <p className={`text-xs ${activeLeadId === lead.id ? 'text-green-100' : 'text-gray-400'}`}>
                {lead.email}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};