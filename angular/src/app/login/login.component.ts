import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateService } from '../shared/auth-state.service';
import { AuthService } from '../shared/auth.service';
import { TokenService } from '../shared/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errors: any = null;
  constructor(
    public router: Router,
    public fb: FormBuilder,
    public httpClient: HttpClient,
    public authService: AuthService,
    private token: TokenService,
    private authState: AuthStateService
  ) {
    this.loginForm = this.fb.group({
      email: [],
      password: [],
    });
  }

  ngOnInit(): void {
    this.authService.profileUser().subscribe(
      (user) => {
        this.router.navigate([user.type]);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  onSubmit() {
    this.authService.signin(this.loginForm.value).subscribe({
      error: (error) => {
        console.error(error);
        this.errors = error.error;
      },
      complete: () => {
        this.authState.setAuthState(true);
        this.loginForm.reset();
        this.authService.profileUser().subscribe((user) => {
          this.router.navigate([user.type]);
        });
      },
      next: (result) => {
        this.token.handleData(result.access_token);
      },
    });
  }
}
