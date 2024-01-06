import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { startRegistration, browserSupportsWebAuthn } from '@simplewebauthn/browser'
import { AuthService } from '../service/auth.service';
import { of, mergeMap, switchMap, interval, map } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email = signal('email@test.com');
  authService = inject(AuthService);
  attestationResponse: any = {};

  ngOninit() {
  }

  async register(value: { email: string }) {
    if (!browserSupportsWebAuthn()) {
      alert('WebAuthn is not supported on this browser')
      return
    }
    await this.generateRegistrationOptions(value.email);
    await this.verifyRegistration();
  }

  async generateRegistrationOptions(email: string) {
    const option = await fetch('http://localhost:3000/attestation/options', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email}),
    }).then((res) => res.json());
    console.log('Attestation Option:::', option);
    try {
      this.attestationResponse = await startRegistration(option);
      this.attestationResponse['email'] = email;
      this.attestationResponse['challenge'] = option.challenge;
      console.log('attestationResponse:', this.attestationResponse);
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  async verifyRegistration() {
    try {
      const option2 = await fetch('http://localhost:3000/attestation/result', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(this.attestationResponse),
      }).then((res) => res)
      console.log('Attestation Result:::', option2);
      alert('register success')
    } catch (error) {
      console.log('verifyRegistration Error', error );
    }
  }
}
