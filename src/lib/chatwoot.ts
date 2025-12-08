import axios from 'axios';

const CHATWOOT_API_URL = process.env.CHATWOOT_API_URL || 'http://bot-chatwoot-rails-1:3000';
const CHATWOOT_ACCESS_TOKEN = process.env.CHATWOOT_ACCESS_TOKEN;
const CHATWOOT_ACCOUNT_ID = process.env.CHATWOOT_ACCOUNT_ID || '1';

const api = axios.create({
    baseURL: `${CHATWOOT_API_URL}/api/v1/accounts/${CHATWOOT_ACCOUNT_ID}`,
    headers: {
        'api_access_token': CHATWOOT_ACCESS_TOKEN,
        'Content-Type': 'application/json'
    }
});

export const createChatwootContact = async (name: string, email?: string, phone?: string) => {
    try {
        if (!CHATWOOT_ACCESS_TOKEN) {
            console.warn('CHATWOOT_ACCESS_TOKEN not set. Skipping contact creation.');
            return null;
        }

        const payload: any = { name };
        if (email) payload.email = email;
        if (phone) payload.phone_number = phone;

        // Tenta buscar primeiro para evitar duplicatas (ou o Chatwoot já trata isso retornando o existente)
        // O Chatwoot retorna erro se duplicado ou retorna o existente? 
        // Normalmente o endpoint search/contacts resolve, mas vamos tentar criar direto e tratar erro 422 se necessário
        // Porém, a doc diz que criar duplicado retorna erro ou o contato.
        // Vamos fazer search primeiro por segurança.

        let existingId = null;
        if (email) {
            const search = await api.get(`/contacts/search?q=${email}`);
            if (search.data.payload.length > 0) existingId = search.data.payload[0].id;
        } else if (phone) {
            const search = await api.get(`/contacts/search?q=${phone}`);
            if (search.data.payload.length > 0) existingId = search.data.payload[0].id;
        }

        if (existingId) {
            console.log(`Contact already exists in Chatwoot (ID: ${existingId}). Updating...`);
            const update = await api.put(`/contacts/${existingId}`, payload);
            return update.data.payload;
        }

        const response = await api.post('/contacts', payload);
        return response.data.payload;

    } catch (error: any) {
        console.error('Error syncing contact to Chatwoot:', error.response?.data || error.message);
        return null; // Silently fail so we don't block CRM logic
    }
};

export const getChatwootContacts = async (page = 1) => {
    try {
        if (!CHATWOOT_ACCESS_TOKEN) return [];
        const response = await api.get(`/contacts?page=${page}`);
        return response.data.payload; // Array of contacts
    } catch (error: any) {
        console.error('Error fetching Chatwoot contacts:', error.message);
        return [];
    }
};
