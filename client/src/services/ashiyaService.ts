const ASHIYA_BASE_URL = 'http://localhost:5000';

export interface AshiyaResponse {
    response: string;
    session_id: string;
    timestamp: string;
    type: string;
    model: string;
}

export interface ProjectContextResponse {
    success: boolean;
    message: string;
    project_id: string;
    customer_name: string;
    context_set: boolean;
}

export const ashiyaService = {
    async sendMessage(message: string, stream: boolean = false): Promise<AshiyaResponse> {
        const response = await fetch(`${ASHIYA_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, stream })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    },

    async setProjectContext(projectId: string, customerName?: string): Promise<ProjectContextResponse> {
        const response = await fetch(`${ASHIYA_BASE_URL}/set_project_context`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                project_id: projectId,
                customer_name: customerName 
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    },

    async healthCheck() {
        const response = await fetch(`${ASHIYA_BASE_URL}/health`);
        return response.json();
    },

    async clearConversation() {
        const response = await fetch(`${ASHIYA_BASE_URL}/clear_conversation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    }
};