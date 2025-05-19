import axios from "axios";

class ApiService {
  static async getGroups() {
    const response = await axios.get('/groups');
    return response.data;
  }

  static async getThemes() {
    const response = await axios.get('/themes');
    return response.data;
  }

  static async getComponents() {
    const response = await axios.get('/components');
    return response.data;
  }
}

export default ApiService;
