import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../authentication/authentication.service';
import { RouteConfigLoadStart, Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit {
  PassResetForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}
  ngOnInit() {
    this.createResetForm();
  }

  passwordReset() {
    this.authenticationService.passReset(this.PassResetForm.value).subscribe((res) => {
      if (res.status) this.router.navigate(['/login']);
    });
  }
  private createResetForm() {
    this.PassResetForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
    });
  }
}
