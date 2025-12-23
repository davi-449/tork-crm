export const API_URL = '/api';

export const getAuthHeaders = (): HeadersInit => {
    if (typeof window === 'undefined') {
        return { 'Content-Type': 'application/json' };
    }

    const token = localStorage.getItem('tork_token');

    // Strict Auth Validation
    if (!token) {
        // Prevent infinite loop if already on login
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/crm/login';
        }
        throw new Error('No authentication token found');
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Helper to handle 401s universally
const handleResponse = async (res: Response) => {
    if (res.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('tork_token');
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/crm/login';
            }
        }
        throw new Error('Unauthorized');
    }
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Request failed with status ${res.status}`);
    }
    return res.json();
};

// Stages
export const fetchStages = async () => {
    // Force trailing slash to avoid 307 Redirects that strip Authorization
    const res = await fetch(`${API_URL}/crm/stages/`, {
        headers: getAuthHeaders()
    });
    return handleResponse(res);
};

export const createStage = async (data: { name: string; slug: string; order?: number; color?: string }) => {
    const res = await fetch(`${API_URL}/crm/stages/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(res);
};

export const updateStage = async (id: number, data: { name?: string; order?: number; color?: string }) => {
    // PATCH /crm/stages/{id}/
    const res = await fetch(`${API_URL}/crm/stages/${id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(res);
};

export const deleteStage = async (id: number) => {
    // DELETE /crm/stages/{id}/
    const res = await fetch(`${API_URL}/crm/stages/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return handleResponse(res);
};

// Leads
export const fetchLeads = async () => {
    // Force trailing slash
    const res = await fetch(`${API_URL}/crm/leads/`, {
        headers: getAuthHeaders()
    });
    return handleResponse(res);
};

export const updateLeadStatus = async (leadId: number, status: string) => {
    // PATCH /crm/leads/{id}/
    const res = await fetch(`${API_URL}/crm/leads/${leadId}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });
    return handleResponse(res);
};
