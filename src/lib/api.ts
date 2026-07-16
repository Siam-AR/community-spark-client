import type { ApiErrorResponse, AuthResponse, Comment, Idea, User } from '@/types';

export interface ApiCallOptions extends RequestInit {
  headers?: Record<string, string>;
}

export interface IdeaFilters {
  category?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}


const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }

  const explicitUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SERVER_URL;
  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, '');
  }

  return 'https://community-spark-server.vercel.app';
};

export const apiCall = async <T = unknown>(endpoint: string, options: ApiCallOptions = {}): Promise<T> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const apiBaseUrl = getApiBaseUrl();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = new URL(endpoint, apiBaseUrl).toString();
  const response = await fetch(url, {
    ...options,
    headers,
    mode: 'cors',
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    let message = `Request failed with status ${response.status}`;

    if (contentType.includes('application/json')) {
      const error = (await response.json()) as ApiErrorResponse;
      message = error.message || message;
    } else {
      const errorText = await response.text();
      if (errorText) {
        message = errorText;
      }
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
};

export const authAPI = {
  register: (data: Record<string, unknown>) => apiCall<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (data: Record<string, unknown>) => apiCall<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  googleLogin: (data: Record<string, unknown>) => apiCall<AuthResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getUser: () => apiCall<{ user: User }>('/auth/user'),

  updateUser: (data: Partial<User>) => apiCall<{ user: User }>('/auth/user', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};

export const ideasAPI = {
  getFeatured: async () => {
    try {
      return await apiCall<Idea[]>('/projects/featured');
    } catch {
      return [];
    }
  },

  getAll: async (filters: IdeaFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    try {
      return await apiCall<Idea[]>(`/projects?${params.toString()}`);
    } catch {
      return [];
    }
  },

  getById: async (id: string) => {
    try {
      return await apiCall<Idea>(`/projects/${id}`);
    } catch {
      throw new Error('Unable to load this project right now.');
    }
  },

  create: (data: Partial<Idea>) => apiCall<Idea>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: Partial<Idea>) => apiCall<Idea>(`/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiCall<void>(`/projects/${id}`, {
    method: 'DELETE',
  }),

  getUserIdeas: async () => {
    try {
      return await apiCall<Idea[]>('/user/projects');
    } catch {
      return [];
    }
  },
};

export const commentsAPI = {
  getByIdeaId: (ideaId: string) => apiCall<Comment[]>(`/comments/${ideaId}`),

  getMyComments: () => apiCall<Comment[]>('/comments/me'),

  create: (data: Partial<Comment>) => apiCall<Comment>('/comments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: Partial<Comment>) => apiCall<Comment>(`/comments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiCall<void>(`/comments/${id}`, {
    method: 'DELETE',
  }),
};
