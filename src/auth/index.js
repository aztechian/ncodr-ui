export default {
  isAuthenticated: false,
  googleUser: null,
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
  login(jwt) {
    localStorage.setItem('id_token', jwt);
    this.isAuthenticated = true;
  },
  getAvatar() {
    this.checkAuth();
    if (this.isAuthenticated) {
      const jwt = localStorage.getItem('id_token');
      const [, payload] = jwt.split('.');
      return JSON.parse(atob(payload)).picture;
    }
    return '';
  },
  refresh() {
    return this.googleUser.reloadAuthResponse()
      .then(authResponse => this.login(authResponse.id_token));
  },
};
