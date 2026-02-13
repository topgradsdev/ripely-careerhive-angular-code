import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CronofyService {
  private baseUrl = 'http://localhost:3000/api/cronofy';

  constructor(private http: HttpClient) {}

  getAuthUrl(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.baseUrl}/auth-url`);
  }

  createElementToken(ruleId: string): Observable<{ element_token: string }> {
    return this.http.post<{ element_token: string }>(`${this.baseUrl}/element-token`, {
      availability_rule_id: ruleId
    });
  }

  scheduleMeeting(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/schedule`, payload);
  }
}
