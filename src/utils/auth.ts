/**
 * Authentication utilities for IndxCloudApi
 * Converts C# Login.cs authentication methods
 */
import axios, { AxiosInstance } from 'axios';

export interface JWT {
  token: string;
}

/**
 * Set bearer token for axios client
 * Equivalent to C# SetBearerToken method
 */
export function setBearerToken(client: AxiosInstance, bearerToken: string, uri: string): void {
  client.defaults.baseURL = uri;
  client.defaults.headers.common['Content-Type'] = 'application/json';
  client.defaults.headers.common['Accept'] = 'application/json';
  client.defaults.headers.common['Authorization'] = `Bearer ${bearerToken}`;
}

/**
 * Login to IndxCloudApi and retrieve JWT token
 * Equivalent to C# Login method
 */
export async function login(client: AxiosInstance, userEmail: string, userPassword: string, uri: string): Promise<string | null> {
  try {
    client.defaults.baseURL = uri;
    client.defaults.headers.common['Content-Type'] = 'application/json';
    client.defaults.headers.common['Accept'] = 'application/json';

    // Create login credentials object
    // Note: Property names must match exactly as the API expects (UserEmail, UserPassWord)
    const loginInfo = {
      UserEmail: userEmail,
      UserPassWord: userPassword
    };

    // Send POST request with login credentials
    const response = await client.post<JWT>('api/login', loginInfo);

    if (response.status >= 200 && response.status < 300) {
      const jwt = response.data;
      if (jwt && jwt.token) {
        // Apply JWT token to client headers
        client.defaults.headers.common['Authorization'] = `Bearer ${jwt.token}`;
        return jwt.token;
      }
    } else {
      console.log(`Error: ${response.status}`);
      console.log(`Response: ${JSON.stringify(response.data)}`);
      throw new Error(`Login failed: ${JSON.stringify(response.data)}`);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log(`Error: ${error.response?.status}`);
      console.log(`Response: ${JSON.stringify(error.response?.data)}`);
      throw new Error(`Login failed: ${error.message}`);
    }
    throw error;
  }

  return null;
}
