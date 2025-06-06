// services/UserAuthService.ts

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
}

class UserAuthService {
  private static readonly TOKEN_COOKIE = "visitorToken";
  private static readonly DATA_KEY = "visitorData";
  private static readonly SESSION_EXPIRY = 7200;

  static setAuth(token: string, data: UserData): void {
    document.cookie = `${this.TOKEN_COOKIE}=${token}; path=/; max-age=${this.SESSION_EXPIRY}; secure; samesite=strict`;
    localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
  }

  static saveUserData(data: Partial<UserData>): void {
    const existingData = this.getUserData();
    const updatedData = { ...existingData, ...data };
    localStorage.setItem(this.DATA_KEY, JSON.stringify(updatedData));
  }

  static clearAuth(): void {
    document.cookie = `${this.TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict`;
    localStorage.removeItem(this.DATA_KEY);
  }

  static getToken(): string | null {
    return this.getCookie(this.TOKEN_COOKIE);
  }

  static getUserData(): UserData | null {
    const data = localStorage.getItem(this.DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static async logout(): Promise<void> {
    try {
      await fetch('http://localhost:5000/api/visitor-accounts/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });
    } catch (err) {
      console.error("Visitor logout error:", err);
    } finally {
      this.clearAuth();
      window.location.href = "/pages/auth/login";
    }
  }

  private static getCookie(name: string): string | null {
    const cookies = document.cookie.split(";");
    const match = cookies.find(c => c.trim().startsWith(`${name}=`));
    return match ? match.split("=")[1] : null;
  }
}

export default UserAuthService;
