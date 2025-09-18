interface User {
  id: string;
  username: string;
  email?: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

interface CSRFResponse {
  csrfToken: string;
}

class AuthService {
  private baseUrl = "";
  private csrfToken: string | null = null;

  private async getCsrfToken(): Promise<string> {
    if (this.csrfToken) {
      return this.csrfToken;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/csrf-token/`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get CSRF token");
      }

      const data: CSRFResponse = await response.json();
      this.csrfToken = data.csrfToken;
      return this.csrfToken;
    } catch (error) {
      console.error("Error getting CSRF token:", error);
      throw new Error("Failed to get CSRF token");
    }
  }

  async login(email: string, password: string, rememberMe: boolean): Promise<LoginResponse> {
    try {
      const csrfToken = await this.getCsrfToken();

      const response = await fetch(`${this.baseUrl}/api/react-login/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
<<<<<<< HEAD
=======

>>>>>>> b372df01c7caa550dd938935b1dbbd91a333ddea
        },
        body: JSON.stringify({
          username: email,
          password,
          remember_me: rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || "Login failed",
        };
      }

      if (data.success && data.user) {
        return {
          success: true,
          user: {
            id: data.user.id.toString(),
            username: data.user.username,
            email: data.user.email,
          },
        };
      } else {
        return {
          success: false,
          error: data.error || "Invalid credentials",
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
      const csrfToken = await this.getCsrfToken();

      const response = await fetch(`${this.baseUrl}/api/react-logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,

        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear stored CSRF token
      this.csrfToken = null;
    } catch (error) {
      console.error("Logout error:", error);
      // Clear token even on error
      this.csrfToken = null;
      throw error;
    }
  }

  async checkAuth(): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/api/check-auth/`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Not authenticated");
      }

      const data = await response.json();

      if (data.authenticated && data.user) {
        return {
          id: data.user.id.toString(),
          username: data.user.username,
          email: data.user.email,
        };
      } else {
        throw new Error("Not authenticated");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      throw new Error("Not authenticated");
    }
  }
}

export const authService = new AuthService();