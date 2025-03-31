export interface AdminData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

class AuthService {
  private static readonly TOKEN_COOKIE_NAME = "adminToken";
  private static readonly ADMIN_DATA_KEY = "adminData";
  private static readonly SESSION_EXPIRY = 7200; // 2 hours in seconds


  // Set authentication data
  static setAuth(token: string, adminData: AdminData): void {
    // Set cookie with secure options
    document.cookie = `${this.TOKEN_COOKIE_NAME}=${token}; path=/; max-age=${this.SESSION_EXPIRY}; secure; samesite=strict`;

    // Store admin data in localStorage
    localStorage.setItem(this.ADMIN_DATA_KEY, JSON.stringify(adminData));
  }

  // Clear authentication data
  static clearAuth(): void {
    // Clear cookie with proper expiration
    document.cookie = `${this.TOKEN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`;

    // Clear localStorage
    localStorage.removeItem(this.ADMIN_DATA_KEY);
  }

  // Get authentication token
  static getToken(): string | null {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${this.TOKEN_COOKIE_NAME}=`)
    );
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }

  // Get admin data
  static getAdminData(): AdminData | null {
    const data = localStorage.getItem(this.ADMIN_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  // Update admin data
  static setAdminData(adminData: AdminData): void {
    localStorage.setItem(this.ADMIN_DATA_KEY, JSON.stringify(adminData));
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Handle logout
  static async logout(): Promise<void> {
    try {
      // Call logout endpoint
      await fetch('http://localhost:5000/api/admin/logout', { 
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      });

      // Clear all auth data
      this.clearAuth();

      // Redirect to login page
      window.location.href = "/secure-access/portal";
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear auth data even if API call fails
      this.clearAuth();
      window.location.href = "/secure-access/portal";
    }
  }
}

export default AuthService;
