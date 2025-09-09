import { ApiTableResponse, ApiHeaderConfig, DynamicProjectData } from '../types/apiTypes';
import { generateMockProjects } from '../lib/mockData';
import { IPlanset } from '@shared/types';

// --- Team Data ---

export interface TeamLead {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarColor: string;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  tasks: {
    fresh: number;
    revision: number;
    completed: number;
    total: number;
  };
  teamLeadId: string;
}

const mockTeamLeads: TeamLead[] = [
  { id: 'shivam', name: 'Shivam Kumar', email: '@mail', avatar: 'S', avatarColor: '#22c55e' },
  { id: 'abhishek', name: 'Abhishek Thukral', email: '@mail', avatar: 'A', avatarColor: '#8b5cf6' },
  { id: 'arshad', name: 'Arshad Malik', email: '@mail', avatar: 'A', avatarColor: '#06b6d4' },
   { id: 'shivam', name: 'Shivam Kumar', email: '@mail', avatar: 'S', avatarColor: '#22c55e' },
  { id: 'abhishek', name: 'Abhishek Thukral', email: '@mail', avatar: 'A', avatarColor: '#8b5cf6' },
  { id: 'arshad', name: 'Arshad Malik', email: '@mail', avatar: 'A', avatarColor: '#06b6d4' },
   { id: 'shivam', name: 'Shivam Kumar', email: '@mail', avatar: 'S', avatarColor: '#22c55e' },
  { id: 'abhishek', name: 'Abhishek Thukral', email: '@mail', avatar: 'A', avatarColor: '#8b5cf6' },
  { id: 'arshad', name: 'Arshad Malik', email: '@mail', avatar: 'A', avatarColor: '#06b6d4' }
];

const mockTeamMembers: TeamMember[] = [
    { id: 1, name: 'Taylor Majeed', email: 't.majeed@patsolar.com', role: 'Manager', avatar: 'T', tasks: { fresh: 54, revision: 2, completed: 52, total: 56 }, teamLeadId: 'shivam' },
    { id: 2, name: 'Momentum Solar', email: 'momentumsolar@proofly.com', role: 'Admin', avatar: 'M', tasks: { fresh: 29, revision: 3, completed: 26, total: 32 }, teamLeadId: 'shivam' },
    { id: 3, name: 'Lux Solar Energy', email: 'luxsolar@proofly.com', role: 'Admin', avatar: 'L', tasks: { fresh: 24, revision: 4, completed: 20, total: 28 }, teamLeadId: 'abhishek' },
    { id: 4, name: 'William Sanchez', email: 'livesoluno@proofly.com', role: 'Founder', avatar: 'W', tasks: { fresh: 35, revision: 3, completed: 32, total: 38 }, teamLeadId: 'abhishek' },
    { id: 5, name: 'FOREVER SOLAR', email: 'foreversolar@proofly.com', role: 'Admin', avatar: 'F', tasks: { fresh: 18, revision: 0, completed: 18, total: 18 }, teamLeadId: 'arshad' },
    { id: 6, name: 'Sarah Johnson', email: 'sarah@solardynamics.com', role: 'CEO', avatar: 'S', tasks: { fresh: 10, revision: 1, completed: 9, total: 11 }, teamLeadId: 'arshad' },
    { id: 7, name: 'Mike Chen', email: 'mike@greenenergy.com', role: 'CTO', avatar: 'M', tasks: { fresh: 45, revision: 3, completed: 42, total: 48 }, teamLeadId: 'shivam' },
    { id: 1, name: 'Taylor Majeed', email: 't.majeed@patsolar.com', role: 'Manager', avatar: 'T', tasks: { fresh: 54, revision: 2, completed: 52, total: 56 }, teamLeadId: 'shivam' },
    { id: 2, name: 'Momentum Solar', email: 'momentumsolar@proofly.com', role: 'Admin', avatar: 'M', tasks: { fresh: 29, revision: 3, completed: 26, total: 32 }, teamLeadId: 'shivam' },
    { id: 3, name: 'Lux Solar Energy', email: 'luxsolar@proofly.com', role: 'Admin', avatar: 'L', tasks: { fresh: 24, revision: 4, completed: 20, total: 28 }, teamLeadId: 'abhishek' },
    { id: 4, name: 'William Sanchez', email: 'livesoluno@proofly.com', role: 'Founder', avatar: 'W', tasks: { fresh: 35, revision: 3, completed: 32, total: 38 }, teamLeadId: 'abhishek' },
    { id: 5, name: 'FOREVER SOLAR', email: 'foreversolar@proofly.com', role: 'Admin', avatar: 'F', tasks: { fresh: 18, revision: 0, completed: 18, total: 18 }, teamLeadId: 'arshad' },
    { id: 6, name: 'Sarah Johnson', email: 'sarah@solardynamics.com', role: 'CEO', avatar: 'S', tasks: { fresh: 10, revision: 1, completed: 9, total: 11 }, teamLeadId: 'arshad' },
    { id: 7, name: 'Mike Chen', email: 'mike@greenenergy.com', role: 'CTO', avatar: 'M', tasks: { fresh: 45, revision: 3, completed: 42, total: 48 }, teamLeadId: 'shivam' },
    { id: 1, name: 'Taylor Majeed', email: 't.majeed@patsolar.com', role: 'Manager', avatar: 'T', tasks: { fresh: 54, revision: 2, completed: 52, total: 56 }, teamLeadId: 'shivam' },
    { id: 2, name: 'Momentum Solar', email: 'momentumsolar@proofly.com', role: 'Admin', avatar: 'M', tasks: { fresh: 29, revision: 3, completed: 26, total: 32 }, teamLeadId: 'shivam' },
    { id: 3, name: 'Lux Solar Energy', email: 'luxsolar@proofly.com', role: 'Admin', avatar: 'L', tasks: { fresh: 24, revision: 4, completed: 20, total: 28 }, teamLeadId: 'abhishek' },
    { id: 4, name: 'William Sanchez', email: 'livesoluno@proofly.com', role: 'Founder', avatar: 'W', tasks: { fresh: 35, revision: 3, completed: 32, total: 38 }, teamLeadId: 'abhishek' },
    { id: 5, name: 'FOREVER SOLAR', email: 'foreversolar@proofly.com', role: 'Admin', avatar: 'F', tasks: { fresh: 18, revision: 0, completed: 18, total: 18 }, teamLeadId: 'arshad' },
    { id: 6, name: 'Sarah Johnson', email: 'sarah@solardynamics.com', role: 'CEO', avatar: 'S', tasks: { fresh: 10, revision: 1, completed: 9, total: 11 }, teamLeadId: 'arshad' },
    { id: 7, name: 'Mike Chen', email: 'mike@greenenergy.com', role: 'CTO', avatar: 'M', tasks: { fresh: 45, revision: 3, completed: 42, total: 48 }, teamLeadId: 'shivam' },
    { id: 1, name: 'Taylor Majeed', email: 't.majeed@patsolar.com', role: 'Manager', avatar: 'T', tasks: { fresh: 54, revision: 2, completed: 52, total: 56 }, teamLeadId: 'shivam' },
    { id: 2, name: 'Momentum Solar', email: 'momentumsolar@proofly.com', role: 'Admin', avatar: 'M', tasks: { fresh: 29, revision: 3, completed: 26, total: 32 }, teamLeadId: 'shivam' },
    { id: 3, name: 'Lux Solar Energy', email: 'luxsolar@proofly.com', role: 'Admin', avatar: 'L', tasks: { fresh: 24, revision: 4, completed: 20, total: 28 }, teamLeadId: 'abhishek' },
    { id: 4, name: 'William Sanchez', email: 'livesoluno@proofly.com', role: 'Founder', avatar: 'W', tasks: { fresh: 35, revision: 3, completed: 32, total: 38 }, teamLeadId: 'abhishek' },
    { id: 5, name: 'FOREVER SOLAR', email: 'foreversolar@proofly.com', role: 'Admin', avatar: 'F', tasks: { fresh: 18, revision: 0, completed: 18, total: 18 }, teamLeadId: 'arshad' },
    { id: 6, name: 'Sarah Johnson', email: 'sarah@solardynamics.com', role: 'CEO', avatar: 'S', tasks: { fresh: 10, revision: 1, completed: 9, total: 11 }, teamLeadId: 'arshad' },
    { id: 7, name: 'Mike Chen', email: 'mike@greenenergy.com', role: 'CTO', avatar: 'M', tasks: { fresh: 45, revision: 3, completed: 42, total: 48 }, teamLeadId: 'shivam' },
    { id: 1, name: 'Taylor Majeed', email: 't.majeed@patsolar.com', role: 'Manager', avatar: 'T', tasks: { fresh: 54, revision: 2, completed: 52, total: 56 }, teamLeadId: 'shivam' },
    { id: 2, name: 'Momentum Solar', email: 'momentumsolar@proofly.com', role: 'Admin', avatar: 'M', tasks: { fresh: 29, revision: 3, completed: 26, total: 32 }, teamLeadId: 'shivam' },
    { id: 3, name: 'Lux Solar Energy', email: 'luxsolar@proofly.com', role: 'Admin', avatar: 'L', tasks: { fresh: 24, revision: 4, completed: 20, total: 28 }, teamLeadId: 'abhishek' },
    { id: 4, name: 'William Sanchez', email: 'livesoluno@proofly.com', role: 'Founder', avatar: 'W', tasks: { fresh: 35, revision: 3, completed: 32, total: 38 }, teamLeadId: 'abhishek' },
    { id: 5, name: 'FOREVER SOLAR', email: 'foreversolar@proofly.com', role: 'Admin', avatar: 'F', tasks: { fresh: 18, revision: 0, completed: 18, total: 18 }, teamLeadId: 'arshad' },
    { id: 6, name: 'Sarah Johnson', email: 'sarah@solardynamics.com', role: 'CEO', avatar: 'S', tasks: { fresh: 10, revision: 1, completed: 9, total: 11 }, teamLeadId: 'arshad' },
    { id: 7, name: 'Mike Chen', email: 'mike@greenenergy.com', role: 'CTO', avatar: 'M', tasks: { fresh: 45, revision: 3, completed: 42, total: 48 }, teamLeadId: 'shivam' },
];

// Mock API service for testing with dynamic headers
export class MockApiService {
  private static instance: MockApiService;
  
  static getInstance(): MockApiService {
    if (!MockApiService.instance) {
      MockApiService.instance = new MockApiService();
    }
    return MockApiService.instance;
  }

  // Mock API delay
  private async mockDelay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get table data for New Projects
  async getNewProjects(): Promise<ApiTableResponse<DynamicProjectData>> {
    await this.mockDelay();
    
    const headers: ApiHeaderConfig[] = [
      {
        key: "customer",
        label: "Customer Details",
        width: "30%",
        minWidth: 250,
        resizable: true,
        sortable: true,
        filterable: true,
        type: "customer"
      },
      {
        key: "projectDetails",
        label: "Project Details",
        width: "25%",
        minWidth: 200,
        resizable: true,
        sortable: true,
        filterable: true,
        type: "text"
      },
      {
        key: "keyDates",
        label: "Created Date",
        width: "15%",
        minWidth: 140,
        resizable: true,
        sortable: true,
        filterable: false,
        type: "date"
      },
      {
        key: "status",
        label: "Status",
        width: "12%",
        minWidth: 120,
        resizable: true,
        sortable: true,
        filterable: true,
        type: "status"
      },
      {
        key: "assignedTo",
        label: "Assigned To",
        width: "18%",
        minWidth: 150,
        resizable: true,
        sortable: true,
        filterable: true,
        type: "text"
      }
    ];

    // Convert existing mock data to dynamic format
    const mockProjects = generateMockProjects(30);
    const data: DynamicProjectData[] = mockProjects.map(project => ({
      id: project.id,
      customer: project.customer,
      projectDetails: project.projectDetails,
      keyDates: project.keyDates,
      status: project.status,
      assignedTo: project.assignedTo || 'Not assigned',
      // Add any additional fields for new projects
      priority: project.priority,
      budget: project.budget,
      estimatedHours: project.estimatedHours,
      actualHours: project.actualHours,
      progress: project.progress,
      tags: project.tags,
      notes: project.notes,
      portal: project.portal,
    }));

    return {
      headers,
      data,
      totalCount: data.length,
      filters: {
        available: ['status', 'customer'],
        current: {}
      }
    };
  }

  // Get table data for Hold Projects
  async getHoldProjects(): Promise<ApiTableResponse<DynamicProjectData>> {
    await this.mockDelay();
    
    const headers: ApiHeaderConfig[] = [
      {
        key: "customer",
        label: "Customer Details",
        width: "28%",
        minWidth: 220,
        resizable: true,
        sortable: true,
        filterable: true,
        type: "customer"
      },
      {
        key: "projectDetails",
        label: "Project Details",
        width: "22%",
        minWidth: 180,
        resizable: true,
        sortable: true,
        filterable: true,
        type: "text"
      },
      {
        key: "keyDates",
        label: "Hold Date",
        width: "15%",
        minWidth: 140,
        resizable: true,
        sortable: true,
        filterable: false,
        type: "date"
      },
      {
        key: "status",
        label: "Status",
        width: "12%",
        minWidth: 120,
        resizable: true,
        sortable: true,
        filterable: true,
        type: "status"
      },
      {
        key: "notes",
        label: "Hold Reason",
        width: "23%",
        minWidth: 180,
        resizable: true,
        sortable: false,
        filterable: false,
        type: "text"
      }
    ];

    const mockProjects = generateMockProjects(25);
    const data: DynamicProjectData[] = mockProjects.map(project => ({
      id: project.id,
      customer: project.customer,
      projectDetails: project.projectDetails,
      keyDates: project.keyDates,
      status: "On Hold", // Override status for hold projects
      notes: `Hold reason: ${['Client request', 'Budget approval', 'Resource unavailable', 'Weather conditions'][Math.floor(Math.random() * 4)]}`,
      // Include other fields that might be used
      priority: project.priority,
      assignedTo: project.assignedTo || 'Not assigned',
    }));

    return {
      headers,
      data,
      totalCount: data.length,
      filters: {
        available: ['status', 'customer'],
        current: {}
      }
    };
  }

  // Get table data for Completed Projects
  async getCompletedProjects(): Promise<ApiTableResponse<DynamicProjectData>> {
    await this.mockDelay();
    
    const headers: ApiHeaderConfig[] = [
      {
        key: "customer",
        label: "Customer Details",
        width: "25%",
        minWidth: 200,
        resizable: true,
        sortable: true,
        filterable: true,
        type: "customer"
      },
      {
        key: "projectDetails",
        label: "Project Details",
        width: "20%",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filterable: true,
        type: "text"
      },
      {
        key: "keyDates",
        label: "Completion Date",
        width: "15%",
        minWidth: 140,
        resizable: true,
        sortable: true,
        filterable: false,
        type: "date"
      },
      {
        key: "progress",
        label: "Progress",
        width: "10%",
        minWidth: 100,
        resizable: true,
        sortable: true,
        filterable: false,
        type: "progress"
      },
      {
        key: "actualHours",
        label: "Actual Hours",
        width: "12%",
        minWidth: 110,
        resizable: true,
        sortable: true,
        filterable: false,
        type: "number"
      },
      {
        key: "budget",
        label: "Budget",
        width: "18%",
        minWidth: 140,
        resizable: true,
        sortable: true,
        filterable: false,
        type: "number"
      }
    ];

    const mockProjects = generateMockProjects(20);
    const data: DynamicProjectData[] = mockProjects.map(project => ({
      id: project.id,
      customer: project.customer,
      projectDetails: project.projectDetails,
      keyDates: project.keyDates,
      progress: 100, // Override to 100% for completed projects
      actualHours: project.actualHours || Math.floor(Math.random() * 200) + 50,
      budget: project.budget || Math.floor(Math.random() * 50000) + 10000,
      status: "COMPLETED", // Override status for completed projects
      assignedTo: project.assignedTo || 'Not assigned',
    }));

    return {
      headers,
      data,
      totalCount: data.length,
      filters: {
        available: ['customer'],
        current: {}
      }
    };
  }

  // Get table data for Archived Projects
  async getArchivedProjects(): Promise<ApiTableResponse<DynamicProjectData>> {
    await this.mockDelay();
    
    const headers: ApiHeaderConfig[] = [
      {
        key: "customer",
        label: "Customer Details",
        width: "30%",
        minWidth: 240,
        resizable: true,
        sortable: true,
        filterable: true,
        type: "customer"
      },
      {
        key: "projectDetails",
        label: "Project Details",
        width: "25%",
        minWidth: 200,
        resizable: true,
        sortable: true,
        filterable: true,
        type: "text"
      },
      {
        key: "keyDates",
        label: "Archive Date",
        width: "18%",
        minWidth: 160,
        resizable: true,
        sortable: true,
        filterable: false,
        type: "date"
      },
      {
        key: "tags",
        label: "Archive Tags",
        width: "27%",
        minWidth: 200,
        resizable: true,
        sortable: false,
        filterable: true,
        type: "tags"
      }
    ];

    const mockProjects = generateMockProjects(15);
    const data: DynamicProjectData[] = mockProjects.map(project => ({
      id: project.id,
      customer: project.customer,
      projectDetails: project.projectDetails,
      keyDates: project.keyDates,
      tags: project.tags || ['archived', 'completed', 'old-project'],
      status: "ARCHIVED", // Override status for archived projects
      assignedTo: project.assignedTo || 'Not assigned',
    }));

    return {
      headers,
      data,
      totalCount: data.length,
      filters: {
        available: ['tags', 'customer'],
        current: {}
      }
    };
  }

  // Generic method to get table data by type
  async getTableData(tableType: string): Promise<ApiTableResponse<DynamicProjectData>> {
    const normalizedType = tableType.toLowerCase().replace(/[^a-z]/g, ''); // Remove non-letters
    console.log(`🔍 MockAPI: Getting data for normalized type: "${normalizedType}" (original: "${tableType}")`);
    
    switch (normalizedType) {
      case 'new':
      case 'newprojects':
      case 'newproject':
        console.log('📋 MockAPI: Returning new projects data');
        return this.getNewProjects();
      case 'hold':
      case 'holdprojects':
      case 'holdproject':
        console.log('📋 MockAPI: Returning hold projects data');
        return this.getHoldProjects();
      case 'completed':
      case 'completedprojects':
      case 'completedproject':
        console.log('📋 MockAPI: Returning completed projects data');
        return this.getCompletedProjects();
      case 'archived':
      case 'archivedprojects':
      case 'archivedproject':
        console.log('📋 MockAPI: Returning archived projects data');
        return this.getArchivedProjects();
      default:
        console.log(`⚠️ MockAPI: Unknown type "${tableType}", falling back to new projects`);
        return this.getNewProjects(); // Default fallback
    }
  }

  // Method to simulate real API call with potential failure
  async fetchTableData(
    tableType: string, 
    options?: { 
      mockApiFailure?: boolean;
      customHeaders?: ApiHeaderConfig[];
    }
  ): Promise<ApiTableResponse<DynamicProjectData>> {
    try {
      console.log(`🔄 Fetching table data for type: ${tableType}`);
      
      // Simulate API failure for testing fallback
      if (options?.mockApiFailure) {
        throw new Error('Simulated API connection failed');
      }

      // Use custom headers if provided (simulating API response)
      if (options?.customHeaders) {
        console.log('📋 Using custom headers provided');
        const mockProjects = generateMockProjects(10);
        const data: DynamicProjectData[] = mockProjects.map(project => {
          const dynamicData: DynamicProjectData = { id: project.id };
          
          options.customHeaders!.forEach(header => {
            if (header.key in project) {
              dynamicData[header.key] = project[header.key as keyof typeof project];
            } else {
              // Generate mock data for custom fields
              dynamicData[header.key] = `Mock ${header.label}`;
            }
          });
          
          return dynamicData;
        });

        return {
          headers: options.customHeaders,
          data,
          totalCount: data.length,
          filters: {
            available: options.customHeaders.filter(h => h.filterable).map(h => h.key),
            current: {}
          }
        };
      }

      // Get data by table type
      const result = await this.getTableData(tableType);
      console.log(`✅ Successfully fetched ${result.data.length} projects for ${tableType}`);
      return result;
      
    } catch (error) {
      console.error(`❌ API call failed for ${tableType}:`, error);
      console.log('🔄 Attempting fallback to default mock data...');
      
      try {
        // Fallback to new projects data
        const fallbackResult = await this.getNewProjects();
        console.log('✅ Fallback successful, using new projects data');
        return fallbackResult;
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        throw new Error(`Failed to load data for ${tableType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  // --- Team Methods ---

  async fetchTeamLeads(): Promise<TeamLead[]> {
    await this.mockDelay(300);
    return mockTeamLeads;
  }

  async fetchTeamMembers(leadId?: string): Promise<TeamMember[]> {
    await this.mockDelay(500);
    if (!leadId || leadId === 'all') {
      return mockTeamMembers;
    }
    return mockTeamMembers.filter(m => m.teamLeadId === leadId);
  }
}

// Export singleton instance
export const mockApiService = MockApiService.getInstance();