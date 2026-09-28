const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Core HTTP Request wrapper with token attachment & error handling
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set application/json if body is not FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status === 401) {
      // Clear token on auth failure if not on login page
      if (!window.location.pathname.includes('/auth')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    throw error;
  }
}

export const api = {
  // Authentication
  auth: {
    register: (name, email, password) =>
      request('/auth/register', { method: 'POST', body: { name, email, password } }),
    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: { email, password } }),
    demoLogin: () =>
      request('/auth/demo', { method: 'POST' }),
    getMe: () =>
      request('/auth/me', { method: 'GET' })
  },

  // Document Uploads
  upload: {
    resume: (file) => {
      const formData = new FormData();
      formData.append('resume', file);
      return request('/upload/resume', { method: 'POST', body: formData });
    },
    jobDescription: (fileOrText, meta = {}) => {
      if (typeof fileOrText === 'string') {
        return request('/upload/job-description', {
          method: 'POST',
          body: { text: fileOrText, ...meta }
        });
      }
      const formData = new FormData();
      formData.append('file', fileOrText);
      if (meta.title) formData.append('title', meta.title);
      if (meta.company) formData.append('company', meta.company);
      return request('/upload/job-description', { method: 'POST', body: formData });
    }
  },

  // Analysis
  analysis: {
    create: (payload) =>
      request('/analysis', {
        method: 'POST',
        body: payload
      }),
    loadDemo: () =>
      request('/analysis/demo', { method: 'POST' }),
    getAll: () =>
      request('/analysis', { method: 'GET' }),
    getById: (id) =>
      request(`/analysis/${id}`, { method: 'GET' }),
    delete: (id) =>
      request(`/analysis/${id}`, { method: 'DELETE' }),
    updateSkill: (analysisId, skillId, data) =>
      request(`/analysis/${analysisId}/skills/${skillId}`, {
        method: 'PATCH',
        body: data
      }),
    selectQuestions: (analysisId, selectedQuestionIds) =>
      request(`/analysis/${analysisId}/interview-questions`, {
        method: 'POST',
        body: { selectedQuestionIds }
      }),
    updateAnswer: (analysisId, questionId, data) =>
      request(`/analysis/${analysisId}/interview-questions/${questionId}`, {
        method: 'PATCH',
        body: data
      }),
    toggleTask: (analysisId, taskId, completed) =>
      request(`/analysis/${analysisId}/learning-plan/tasks/${taskId}`, {
        method: 'PATCH',
        body: { completed }
      })
  }
};
