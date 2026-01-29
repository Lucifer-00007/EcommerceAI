import { ApiResponse, User, LoginRequest, RegisterRequest, AuthResponse } from '@/types';
import { AUTH_STORAGE_KEY } from '@/lib/constants';
import { sleep } from '@/lib/utils';

class AuthService {
  private getStorageAuth(): AuthResponse | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  private setStorageAuth(auth: AuthResponse | null): void {
    if (typeof window === 'undefined') return;
    
    if (auth) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await sleep(800); // Simulate network delay
    
    // Mock authentication - in real app, this would call an API
    if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
      const mockUser: User = {
        id: 'user-1',
        email: credentials.email,
        firstName: 'Demo',
        lastName: 'User',
        phone: '+1234567890',
        createdAt: new Date().toISOString(),
      };
      
      const authResponse: AuthResponse = {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      };
      
      this.setStorageAuth(authResponse);
      return authResponse;
    }
    
    throw new Error('Invalid email or password');
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    await sleep(1000);
    
    // Mock registration - in real app, this would call an API
    const mockUser: User = {
      id: 'user-' + Date.now(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      createdAt: new Date().toISOString(),
    };
    
    const authResponse: AuthResponse = {
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
    
    this.setStorageAuth(authResponse);
    return authResponse;
  }

  async logout(): Promise<void> {
    await sleep(300);
    this.setStorageAuth(null);
  }

  async getCurrentUser(): Promise<User | null> {
    await sleep(200);
    const auth = this.getStorageAuth();
    return auth?.user || null;
  }

  async refreshToken(): Promise<AuthResponse> {
    await sleep(500);
    
    const auth = this.getStorageAuth();
    if (!auth) {
      throw new Error('No refresh token available');
    }
    
    // Mock token refresh - in real app, this would call an API
    const refreshedAuth: AuthResponse = {
      ...auth,
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
    
    this.setStorageAuth(refreshedAuth);
    return refreshedAuth;
  }

  isAuthenticated(): boolean {
    const auth = this.getStorageAuth();
    return !!auth?.token;
  }

  getAuthToken(): string | null {
    const auth = this.getStorageAuth();
    return auth?.token || null;
  }
}

export const authService = new AuthService();