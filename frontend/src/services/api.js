import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const login = (credentials) => API.post('/users/login', credentials);
export const register = (userData) => API.post('/users/register', userData);

// Teams API calls
export const createTeam = (teamData) => API.post('/teams', teamData);
export const getAllTeams = () => API.get('/teams');

// Projects API calls
export const createProject = (projectData) => API.post('/projects', projectData);
export const getTeamProjects = (teamId) => API.get(`/projects/${teamId}`);
export const getAllProjects = () => API.get('/projects');

// Tasks API calls
export const createTask = (taskData) => API.post('/tasks', taskData);
export const updateTaskStatus = (taskId, status) => API.put(`/tasks/${taskId}/status`, { status });
export const getProjectTasks = (projectId) => API.get(`/tasks/${projectId}`);

// Logs API calls
export const createLog = (logData) => API.post('/logs', logData);
export const getAllLogs = () => API.get('/logs');