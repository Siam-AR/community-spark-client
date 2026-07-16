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

const fallbackProjects: Idea[] = [
  {
    _id: '689b5a2d8f1c4d0b1a2e3f41',
    title: 'Neighborhood Food Garden',
    shortDescription: 'A shared garden that grows fresh produce for local families.',
    detailedDescription: 'A shared garden that grows fresh produce for local families and creates a volunteer-friendly learning space.',
    fullDescription: 'A shared garden that grows fresh produce for local families and creates a volunteer-friendly learning space.',
    category: 'Environment',
    tags: ['gardening', 'food', 'community'],
    imageURL: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
    ],
    location: 'Dhaka North',
    supportNeeded: 'Volunteers and basic gardening tools',
    priority: 'High',
    estimatedBudget: '$1200',
    targetAudience: 'Local families and school groups',
    problemStatement: 'Fresh produce access is limited for many nearby homes.',
    proposedSolution: 'Convert a small community lot into a productive shared garden.',
    userName: 'Aisha Rahman',
    userEmail: 'aisha@example.com',
    createdAt: '2026-01-12T10:00:00.000Z',
    updatedAt: '2026-01-12T10:00:00.000Z',
    likes: 24,
    commentCount: 6,
  },
  {
    _id: '689b5a2d8f1c4d0b1a2e3f43',
    title: 'Youth Coding Workshop',
    shortDescription: 'Weekly sessions that help local teens learn practical coding skills.',
    detailedDescription: 'Weekly sessions that help local teens learn practical coding skills and build confidence through real projects.',
    fullDescription: 'Weekly sessions that help local teens learn practical coding skills and build confidence through real projects.',
    category: 'Education',
    tags: ['education', 'technology', 'youth'],
    imageURL: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
    ],
    location: 'Uttara',
    supportNeeded: 'Mentors and laptops',
    priority: 'Medium',
    estimatedBudget: '$1800',
    targetAudience: 'Teen learners',
    problemStatement: 'Many young people lack access to structured digital learning.',
    proposedSolution: 'Launch a low-cost workshop series with community mentors.',
    userName: 'Nabil Hasan',
    userEmail: 'nabil@example.com',
    createdAt: '2026-02-03T14:30:00.000Z',
    updatedAt: '2026-02-03T14:30:00.000Z',
    likes: 17,
    commentCount: 4,
  },
  {
    _id: '689b5a2d8f1c4d0b1a2e3f45',
    title: 'Community Health Checkpoint',
    shortDescription: 'A pop-up health awareness event for families in underserved areas.',
    detailedDescription: 'A pop-up health awareness event for families in underserved areas with free screenings and guidance.',
    fullDescription: 'A pop-up health awareness event for families in underserved areas with free screenings and guidance.',
    category: 'Health',
    tags: ['health', 'wellness', 'outreach'],
    imageURL: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
    ],
    location: 'Banani',
    supportNeeded: 'Health volunteers and screening materials',
    priority: 'High',
    estimatedBudget: '$2200',
    targetAudience: 'Families and older adults',
    problemStatement: 'Local residents need easier access to preventive health support.',
    proposedSolution: 'Create a mobile-style health checkpoint with local partners.',
    userName: 'Mina Akter',
    userEmail: 'mina@example.com',
    createdAt: '2026-03-18T09:15:00.000Z',
    updatedAt: '2026-03-18T09:15:00.000Z',
    likes: 31,
    commentCount: 8,
  },
];

const getFallbackProjects = (filters: IdeaFilters = {}): Idea[] => {
  let projects = [...fallbackProjects];

  if (filters.category && filters.category !== 'All Categories') {
    projects = projects.filter((project) => project.category === filters.category);
  }

  if (filters.search) {
    const query = filters.search.toLowerCase();
    projects = projects.filter((project) => `${project.title} ${project.shortDescription}`.toLowerCase().includes(query));
  }

  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom);
    projects = projects.filter((project) => project.createdAt && new Date(project.createdAt) >= from);
  }

  if (filters.dateTo) {
    const to = new Date(filters.dateTo);
    to.setHours(23, 59, 59, 999);
    projects = projects.filter((project) => project.createdAt && new Date(project.createdAt) <= to);
  }

  return projects;
};

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
      return getFallbackProjects();
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
      return getFallbackProjects(filters);
    }
  },

  getById: async (id: string) => {
    try {
      return await apiCall<Idea>(`/projects/${id}`);
    } catch {
      const fallback = getFallbackProjects().find((project) => project._id === id || project.id === id);
      if (fallback) {
        return fallback;
      }

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

  getUserIdeas: () => apiCall<Idea[]>('/user/projects'),
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
