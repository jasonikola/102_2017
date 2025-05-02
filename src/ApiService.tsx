import axios from "axios";

class ApiService {
  static async getGroups() {
    const response = await axios.get('/groups/get');
    return response.data;
  }

  static async getThemes() {
    const response = await axios.get('/themes/get');
    return response.data;
  }
}

export default ApiService;
