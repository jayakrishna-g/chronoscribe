import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface LoginForm {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  status: boolean;
  message: string;
  token?: string;
}

export interface SignUpForm {
  full_name: string;
  email: string;
  password: string;
  username: string;
}

export interface TokenData {
  full_name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  jwtHelper = new JwtHelperService();

  constructor(@Inject(HttpClient) private http: HttpClient) {}

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.jwtHelper.isTokenExpired(token);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | undefined {
    const token = localStorage.getItem('token');
    if (token) {
      return token;
    }
    return undefined;
  }

  login(loginValues: LoginForm) {
    return this.http.post<AuthenticationResponse>('/api/login', loginValues);
  }

  signUp(signUpValues: SignUpForm) {
    return this.http.post<AuthenticationResponse>('/api/signup', signUpValues);
  }
  passReset(ResetValues: LoginForm) {
    return this.http.post<AuthenticationResponse>('/api/resetpass', ResetValues);
  }

  verifyKeycloakToken(token: string) {
    return this.http.post<AuthenticationResponse>('/api/verify', token);
  }

  storeTokenData(token?: string) {
    let tokenData;
    if (token) {
      tokenData = this.jwtHelper.decodeToken(token);
    } else {
      tokenData = this.jwtHelper.decodeToken(this.getToken());
    }
    if (tokenData) {
      localStorage.setItem('tokenData', JSON.stringify(tokenData));
    }
  }

  getTokenData(): TokenData {
    const tokenData: string | null = localStorage.getItem('tokenData');
    if (!tokenData) {
      return { full_name: 'Broke', email: 'Broke' };
    }
    const data = JSON.parse(tokenData);
    return { full_name: data.name, email: data.email };
  }
}
