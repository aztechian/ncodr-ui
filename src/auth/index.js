export default {
  isAuthenticated: false,

  checkAuth() {
    const jwt = localStorage.getItem('id_token');
    this.isAuthenticated = !!jwt;
  },

  getAuthHeader() {
    return `JWT ${localStorage.getItem('id_token')}`;
  },

  logout() {
    localStorage.removeItem('id_token');
    this.isAuthenticated = false;
  },
};
