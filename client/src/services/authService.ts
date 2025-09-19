interface User {
  id: string;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  job_title?: string;
  company_name?: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  access_token?: string;
  refresh_token?: string;
  error?: string;
  message?: string;
}

interface RefreshResponse {
  success: boolean;
  access_token?: string;
  error?: string;
  message?: string;
}

class AuthService {
  private baseUrl = "http://155.117.40.181:8000";
//   private baseUrl = "http://localhost:8000";
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  private saveTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/refresh-token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: this.refreshToken,
        }),
      });

      const data: RefreshResponse = await response.json();

      if (data.success && data.access_token) {
        this.accessToken = data.access_token;
        localStorage.setItem('access_token', data.access_token);
        return true;
      } else {
        this.clearTokens();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      this.clearTokens();
      return false;
    }
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    // First try with current access token
    let headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (this.accessToken) {
      headers = {
        ...headers,
        "Authorization": `Bearer ${this.accessToken}`,
      };
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // If unauthorized and we have a refresh token, try to refresh
    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry the request with new access token
        headers = {
          ...headers,
          "Authorization": `Bearer ${this.accessToken}`,
        };
        response = await fetch(url, {
          ...options,
          headers,
        });
      }
    }

    return response;
  }

  async login(email: string, password: string, rememberMe: boolean): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/react-login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
          remember_me: rememberMe,
        }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || "Login failed",
        };
      }

      if (data.success && data.access_token && data.refresh_token && data.user) {
        this.saveTokens(data.access_token, data.refresh_token);
        return {
          success: true,
          user: {
            id: data.user.id.toString(),
            username: data.user.username,
            email: data.user.email,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            is_staff: data.user.is_staff,
            is_superuser: data.user.is_superuser,
            job_title: data.user.job_title,
            company_name: data.user.company_name,
          },
        };
      } else {
        return {
          success: false,
          error: data.message || "Invalid credentials",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.refreshToken) {
        // Send refresh token to backend for blacklisting
        await fetch(`${this.baseUrl}/api/react-logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            refresh_token: this.refreshToken,
          }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear tokens locally
      this.clearTokens();
    }
  }

  async checkAuth(): Promise<User> {
    try {
      const response = await this.makeAuthenticatedRequest(`${this.baseUrl}/api/check-auth/`, {
        method: "GET",
      });

      console.log("Check auth response) status:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error("Not authenticated");
      }

      const data = await response.json();

      if (data.authenticated && data.user) {
        return {
          id: data.user.id.toString(),
          username: data.user.username,
          email: data.user.email,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          is_staff: data.user.is_staff,
          is_superuser: data.user.is_superuser,
          job_title: data.user.job_title,
          company_name: data.user.company_name,
        };
      } else {
        throw new Error("Not authenticated");
      }
    } catch (error) {

      console.error("Auth check error:", error);
      this.clearTokens();
      throw new Error("Not authenticated");
    }
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

export const authService = new AuthService();