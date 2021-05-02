import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CreateUserService {
  constructor(private http: HttpClient) {}

  postCreateUser(
    username: string,
    password: string,
    fullName: string,
    email: string
  ) {
    const postJson = {
      password: password,
      roles: ['kibana_dashboard_only_user'],
      full_name: fullName,
      email: email,
      metadata: {
        intelligence: 7,
      },
    };
    const header = new HttpHeaders({
    //   'Content-Type': 'application/json',
      'Authorization': 'Basic ZWxhc3RpYzpyZWRoYXQ=',
    });
    return this.http.post(
      'http://localhost:9200/_security/user/' + username,
      postJson,
      { headers: header }
    );
  }
}
