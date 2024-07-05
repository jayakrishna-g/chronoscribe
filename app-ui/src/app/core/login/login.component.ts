import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthenticationService } from '../authentication/authentication.service';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatRadioModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: UntypedFormGroup;

  signUpForm!: UntypedFormGroup;

  formChoice = 'login';

  constructor(
    @Inject(UntypedFormBuilder)
    private formBuilder: UntypedFormBuilder,
    private authService: AuthenticationService,
    @Inject(Router)
    private router: Router,
    @Inject(ActivatedRoute)
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['home']);
    }
    this.formChoice = this.route.snapshot.url[0].path;
    this.createLoginForm();
    this.createSignUpForm();
  }

  login() {
    this.authService
      .login(this.loginForm.value)
      .pipe(untilDestroyed(this))
      .subscribe((loginStatus) => {
        if (loginStatus.status && loginStatus.token) {
          this.authService.setToken(loginStatus.token);
          this.authService.storeTokenData(loginStatus.token);
        }
        this.router.navigate(['home']);
      });
  }

  signup() {
    this.authService
      .signUp({
        full_name: this.signUpForm.controls['full_name'].value,
        email: this.signUpForm.controls['email'].value,
        password: this.signUpForm.controls['password'].value,
        username: this.signUpForm.controls['username'].value,
      })
      .pipe(untilDestroyed(this))
      .subscribe((signUpStatus) => {
        console.log(signUpStatus);
        if (signUpStatus) {
          this.router.navigate(['login']);
        }
      });
  }

  onPasswordchange() {
    if (this.signUpForm.controls['password'].value == this.passwordAgain.value) {
      this.passwordAgain.setErrors(null);
    } else this.passwordAgain.setErrors({ mismatch: true });
  }

  get passwordAgain(): AbstractControl {
    return this.signUpForm.controls['passwordAgain'];
  }

  private createLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required],
    });
  }

  private createSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      full_name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordAgain: ['', Validators.required],
    });
  }
}
