// src/app/service/document/service.ts
import axios from "axios";
import { IDocument } from "../../types/document/type";

const API_URL = "http://localhost:3001/api/documents";

// Lấy Token từ LocalStorage để gửi kèm request
const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("user_token")}` }
});

export const documentService = {
    getAll: async (): Promise<IDocument[]> => {
        const res = await axios.get(API_URL, getAuthHeaders());
        return res.data;
    },

    upload: async (file: File, title: string): Promise<IDocument> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);

        const res = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                ...getAuthHeaders().headers,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    delete: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    }
};