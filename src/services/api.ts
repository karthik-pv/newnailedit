const API_BASE_URL = "http://localhost:5000";

export interface User {
  id: string;
  full_name: string;
  email: string;
  company_id?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  company_name: string;
  owner_name: string;
  email: string;
  phone: string;
  website?: string;
  description?: string;
  logo_url?: string;
  pricing_document_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  auth: {
    access_token: string;
    refresh_token: string;
  };
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Auth methods
  async register(userData: {
    email: string;
    password: string;
    full_name: string;
  }): Promise<AuthResponse> {
    console.log("Sending registration data:", userData);

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Registration error:", error);
      throw new Error(error.error || "Registration failed");
    }

    const data = await response.json();
    console.log("Registration success:", data);

    // Store tokens
    localStorage.setItem("access_token", data.auth.access_token);
    localStorage.setItem("refresh_token", data.auth.refresh_token);

    return data;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();

    // Store tokens
    localStorage.setItem("access_token", data.auth.access_token);
    localStorage.setItem("refresh_token", data.auth.refresh_token);

    return data;
  }

  // Company methods
  async createCompany(
    companyData: Partial<Company>
  ): Promise<{ company: Company }> {
    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Company creation failed");
    }

    return response.json();
  }

  async getCompanies(): Promise<{ companies: Company[] }> {
    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch companies");
    }

    return response.json();
  }

  // User methods
  async updateUser(
    userId: string,
    userData: Partial<User>
  ): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "User update failed");
    }

    return response.json();
  }

  // Media upload
  async uploadMedia(files: {
    [key: string]: File;
  }): Promise<{ uploaded_files: { [key: string]: string } }> {
    const formData = new FormData();

    Object.entries(files).forEach(([key, file]) => {
      formData.append(key, file);
    });

    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    return response.json();
  }

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}

export const apiService = new ApiService();
