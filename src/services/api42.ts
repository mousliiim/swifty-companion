import { AuthTokenResponse, TokenInfo, User } from '@/types';
import Constants from 'expo-constants';

class Api42Service {
  private baseURL = 'https://api.intra.42.fr/v2';
  private authURL = 'https://api.intra.42.fr/oauth';
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  // Configuration OAuth
  private clientId = Constants.expoConfig?.extra?.CLIENT_ID || '';
  private clientSecret = Constants.expoConfig?.extra?.CLIENT_SECRET || '';

  /**
   * Obtient un token d'accès via le Client Credentials Flow
   * Cette méthode (Client Credentials Flow) est utilisée pour les requêtes qui ne nécessitent pas d'utilisateur connecté spécifique.
   */
  async getAccessToken(): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error(
        'API credentials not configured. Please check your .env file.'
      );
    }

    if (
      this.accessToken &&
      this.tokenExpiresAt &&
      Date.now() < this.tokenExpiresAt
    ) {
      return this.accessToken;
    }

    const requestBody = `grant_type=client_credentials&client_id=${encodeURIComponent(
      this.clientId
    )}&client_secret=${encodeURIComponent(this.clientSecret)}`;

    try {
      const response = await fetch(`${this.authURL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get access token: ${response.status} - ${errorText}`);
      }

      const tokenData: AuthTokenResponse = await response.json();
      this.accessToken = tokenData.access_token;
      this.tokenExpiresAt = Date.now() + tokenData.expires_in * 1000 - 30000; // 30 seconds buffer

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to authenticate with 42 API');
    }
  }

  /**
   * Effectue une requête authentifiée vers l'API
   */
  private async authenticatedRequest<T>(endpoint: string): Promise<T> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      } else if (response.status === 401) {
        throw new Error('Authentication failed');
      } else if (response.status >= 500) {
        throw new Error('Server error, please try again later');
      } else {
        throw new Error(`API request failed: ${response.status}`);
      }
    }

    return response.json();
  }

  /**
   * Recherche des utilisateurs par login
   */
  async searchUser(search: string): Promise<User[]> {
    const token = await this.getAccessToken();

    const response = await fetch(
      `${this.baseURL}/users?search=${encodeURIComponent(search)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Search failed: ${response.status} - ${errorText}`);
    }

    const users: User[] = await response.json();
    return users;
  }

  /**
   * Récupère les détails complets d'un utilisateur
   */
  async getUserDetails(login: string): Promise<User> {
    if (!login.trim()) {
      throw new Error('Login cannot be empty');
    }

    try {
      const user = await this.authenticatedRequest<User>(
        `/users/${encodeURIComponent(login)}`
      );
      return user;
    } catch (error) {
      console.error('Error getting user details:', error);
      throw error;
    }
  }

  /**
   * Récupère les informations du token actuel
   */
  async getTokenInfo(): Promise<TokenInfo> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.authURL}/token/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get token info');
    }

    return response.json();
  }

  /**
   * Vérifie si le service est configuré correctement
   */
  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }

  /**
   * Remet à zéro le token pour forcer une nouvelle authentification
   */
  resetToken(): void {
    this.accessToken = null;
    this.tokenExpiresAt = null;
  }

    /**
   * Force l'expiration du token pour le bonus
   * À utiliser seulement pendant la correction pour prouver le refresh automatique
   */
  forceTokenExpiration(): void {
    console.log('🔧 DEMO: Forcing token expiration...');
    this.tokenExpiresAt = Date.now() - 1000; // Marque le token comme expiré
    console.log('🔧 DEMO: Token marked as expired. Next API call will auto-refresh.');
  }

  /**
   * Obtient des infos debug sur le token actuel
   */
  getTokenDebugInfo(): { hasToken: boolean; isExpired: boolean; expiresIn: number } {
    const hasToken = !!this.accessToken;
    const isExpired = this.tokenExpiresAt ? Date.now() >= this.tokenExpiresAt : true;
    const expiresIn = this.tokenExpiresAt ? Math.max(0, this.tokenExpiresAt - Date.now()) : 0;
    
    return {
      hasToken,
      isExpired,
      expiresIn: Math.round(expiresIn / 1000) // pour afficher en secondes
    };
  }
}

export const api42 = new Api42Service();
