import { Component, OnInit } from '@angular/core';
import { MatLegacyCard as MatCard } from '@angular/material/legacy-card';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../authentication/authentication.service';
import { RouteConfigLoadStart, Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit {
  PassResetForm!: UntypedFormGroup;
  constructor(
    private formBuilder: UntypedFormBuilder,
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
