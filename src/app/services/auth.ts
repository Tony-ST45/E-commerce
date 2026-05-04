import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = "http://localhost:3000/api/auth";

  constructor(private http: HttpClient) {}

  /* ================= REGISTER ================= */

  register(data: any) {
    return this.http.post(`${this.api}/register`, data).pipe(
      catchError(this.handleError)
    );
  }

  /* ================= LOGIN ================= */

  login(data: any) {
    return this.http.post<any>(`${this.api}/login`, data).pipe(
      tap((res) => {
        console.log("LOGIN RESPONSE:", res); // 🔍 debug

        if (res?.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      }),
      catchError(this.handleError)
    );
  }

  /* ================= LOGOUT ================= */

  logout() {
    localStorage.clear(); // 🔥 cleaner
  }

  /* ================= TOKEN ================= */

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /* ================= LOGIN CHECK ================= */

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /* ================= USER ================= */

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /* ================= AUTH HEADER ================= */

  getAuthHeaders() {
    const token = this.getToken();

    // ❗ Avoid sending null token
    if (!token) return {};

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  /* ================= PROFILE ================= */

  getProfile() {
    return this.http.get(`${this.api}/me`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  /* ================= ERROR HANDLER ================= */

  private handleError(error: any) {
    console.error("API ERROR:", error);

    return throwError(() => error.error?.message || "Something went wrong");
  }
}