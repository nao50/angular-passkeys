import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistrationResponseJSON } from '@simplewebauthn/typescript-types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #http = inject(HttpClient);

  constructor() { }

  resister(email: string) {
    return this.#http.get('http://localhost:3000/auth/register/' + `${email}`)
  }

  verify(c: RegistrationResponseJSON) {
    console.log('c', c)
    const headers = { 'content-type': 'application/json'}
    // return this.#http.post('http://localhost:3000/auth/register/verify', JSON.stringify(c), {'headers':headers})
    return this.#http.post('http://localhost:3000/auth/register/verify', c, {'headers':headers})
  }
}
