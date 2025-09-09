import { IPlanset, SortConfig, TableFilters } from '@shared/types';


export function generateMockProjects(count = 50): IPlanset[] {
  const firstNames = ["Adam", "Sandra", "Richard", "Peter", "Bruce", "Tony", "Natasha"];
  const lastNames = ["Golightly", "Clark", "Prager", "Wayne", "Kent", "Stark", "Romanoff"];
  const statuses: IPlanset['status'][] = ["IN PROGRESS", "READY FOR DESIGN", "COMPLETED", "ON HOLD"];
  const priorities: IPlanset['priority'][] = ["HIGH", "MEDIUM", "LOW"];
  const colors = ["#4CAF50", "#3B82F6", "#F59E0B", "#607D8B", "#E53935", "#8E24AA"];
  const projectTags = ["Solar", "Battery", "Roof", "Commercial", "Residential", "Urgent", "Permit", "Inspection"];
  const sampleNotes = ["Customer wants premium panels", "Need permit approval", "Follow up on inspection", "Waiting for equipment delivery", "Customer requested schedule change"];
  const states = [
    { code: 'AZ', name: 'Arizona' },
    { code: 'CJ', name: 'Colorado' },
    { code: 'DR', name: 'Delaware' },
    { code: 'KS', name: 'Kansas' },
    { code: 'CA', name: 'California' }
  ];
  const portals = [
    { id: 'portal', name: 'Portal' },
    { id: 'portal-gamma', name: 'Portal Gamma' },
    { id: 'portal-delta', name: 'Portal Delta' },
    { id: 'portal-beta', name: 'Portal Beta' }
  ];

  const projects: IPlanset[] = [];
  for (let i = 1; i <= count; i++) {
    const customerName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const initials = customerName.split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 2);
    const createdDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    const receivedDate = new Date(createdDate);
    receivedDate.setDate(createdDate.getDate() + Math.floor(Math.random() * 5) + 1);
    const selectedState = states[Math.floor(Math.random() * states.length)];
    const selectedPortal = portals[Math.floor(Math.random() * portals.length)];

    projects.push({
      id: `proj_${i}`,
      customer: {
        name: customerName,
        type: Math.random() > 0.5 ? 'Residential' : 'Commercial',
        address: `${1000 + i} Main St, Phoenix, ${selectedState.code} 85033, USA`,
        state: selectedState.code,
        initials,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
      projectDetails: `PV${Math.random() > 0.5 ? '+Battery' : ''}`,
      keyDates: {
        created: createdDate.toLocaleString('en-US', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
        received: receivedDate.toLocaleString('en-US', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
      },
      status: statuses[Math.floor(Math.random() * statuses.length)],
      assignedTo: Math.random() > 0.4 ? undefined : 'Not assigned',
      countdown: '02:00:00',
      autoComplete: 'Auto-Complete',
      priority: Math.random() > 0.3 ? priorities[Math.floor(Math.random() * priorities.length)] : undefined,
      budget: Math.random() > 0.3 ? Math.floor(Math.random() * 50000) + 10000 : undefined,
      estimatedHours: Math.random() > 0.3 ? Math.floor(Math.random() * 200) + 20 : undefined,
      actualHours: Math.random() > 0.5 ? Math.floor(Math.random() * 150) + 10 : undefined,
      progress: Math.random() > 0.3 ? Math.floor(Math.random() * 101) : undefined,
      tags: Math.random() > 0.4 ? undefined : Array.from({length: Math.floor(Math.random() * 3) + 1}, () => projectTags[Math.floor(Math.random() * projectTags.length)]),
      notes: Math.random() > 0.5 ? undefined : sampleNotes[Math.floor(Math.random() * sampleNotes.length)],
      portal: selectedPortal.id,
    });
  }
  return projects;
}