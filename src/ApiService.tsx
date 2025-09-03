import api from "./services/api";

class ApiService {
  static async getGroups() {
    const response = await api.get('/groups');
    return response.data;
  }

  static async getThemes() {
    const response = await api.get('/themes');
    return response.data;
  }

  static async getComponents() {
    const response = await api.get('/components');
    return response.data;
  }

  static async getTemplates() {
    const response = await api.get('/templates');
    return response.data;
  }
}

export default ApiService;
