// src/utils/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1'; // ✅ Real BE URL

class ApiService {
  private instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Request interceptor - Add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle common errors
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );
  }

  async get(url: string, params?: any) {
    return this.instance.get(url, { params });
  }

  async post(url: string, data?: any) {
    return this.instance.post(url, data);
  }

  async put(url: string, data?: any) {
    return this.instance.put(url, data);
  }

  async patch(url: string, data?: any) {
    return this.instance.patch(url, data);
  }

  async delete(url: string) {
    return this.instance.delete(url);
  }
}

export const api = new ApiService();
