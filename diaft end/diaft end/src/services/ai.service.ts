
import { apiRequest, ApiResponse } from './api-client';

export const AiAPI = {
    generateWelcome: async (guestName: string, hotelName: string, roomType: string): Promise<ApiResponse<{ message: string }>> => {
        return apiRequest<{ message: string }>('/ai/welcome', {
            method: 'POST',
            body: JSON.stringify({ guestName, hotelName, roomType })
        });
    },
    translate: async (text: string | object): Promise<ApiResponse<{ translated: string | any }>> => {
        return apiRequest<{ translated: string | any }>('/ai/translate', {
            method: 'POST',
            body: JSON.stringify({ text })
        });
    }
};
