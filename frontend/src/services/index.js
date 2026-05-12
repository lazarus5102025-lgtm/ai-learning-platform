import api from "./api";

export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/me"),
};

export const courseService = {
  getAll: (params) => api.get("/courses", { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  updateProgress: (id, lessonId) => api.put(`/courses/${id}/progress`, { lessonId }),
};

export const quizService = {
  generate: (courseId, data) => api.post(`/quiz/generate/${courseId}`, data),
  submit: (quizId, answers) => api.post(`/quiz/${quizId}/submit`, { answers }),
  getResults: (quizId) => api.get(`/quiz/${quizId}/results`),
};

export const analyticsService = {
  getStudentStats: () => api.get("/analytics/student"),
  getCourseStats: (courseId) => api.get(`/analytics/course/${courseId}`),
  getAdminOverview: () => api.get("/analytics/admin"),
};

export const adminService = {
  getUsers: (params) => api.get("/admin/users", { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPlatformStats: () => api.get("/admin/stats"),
};
