import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { startAuthentication, browserSupportsWebAuthn, browserSupportsWebAuthnAutofill } from '@simplewebauthn/browser'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  // email = signal('email@test.com');
  email = signal('');
  assertionResponse: any = {};

  async ngOnInit() {
    await this.generateAuthenticationOptions('');
  }

  async login(value: { email: string }) {
    if (!browserSupportsWebAuthn() && await browserSupportsWebAuthnAutofill()) {
      alert('WebAuthn is not supported on this browser')
      return
    }
    // await this.generateAuthenticationOptions(value.email);
    await this.verifyAuthentication();
  }

  async generateAuthenticationOptions(email: string) {
    const option = await fetch('http://localhost:3000/assertion/options', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email}),
    }).then((res) => res.json());
    console.log('Assertion Option:::', option);
    try {
      startAuthentication(option, true).then((assertres) => {
        this.assertionResponse = assertres;
        this.assertionResponse['email'] = email;
        this.assertionResponse['challenge'] = option.challenge;
        console.log('assertionResponse:', this.assertionResponse);
      })
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  // async generateAuthenticationOptions(email: string) {
  //   const option = await fetch('http://localhost:3000/assertion/options', {
  //     method: 'POST',
  //     headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify({email}),
  //   }).then((res) => res.json());
  //   console.log('Assertion Option:::', option);
  //   try {
  //     this.assertionResponse = await startAuthentication(option);
  //     this.assertionResponse['email'] = email;
  //     this.assertionResponse['challenge'] = option.challenge;
  //     console.log('assertionResponse:', this.assertionResponse);
  //   } catch (error) {
  //     console.log({ error });
  //     throw error;
  //   }
  // }

  async verifyAuthentication() {
    try {
      const option2 = await fetch('http://localhost:3000/assertion/result', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(this.assertionResponse),
      // }).then((res) => res.json())
    }).then((res) => res)
      console.log('Assertion Result:::', option2);
      alert('login success')
    } catch (error) {
      console.log('verifyRegistration Error', error );
    }
  }

}

