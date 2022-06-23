import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from 'src/app/shared/components/interfaces';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup | any
  submitted = false
  message: string | undefined;

  constructor(
    public auth: AuthService,
    private router: Router,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe( (params:Params) => {
      if (params['loginAgain']) {
        this.message = 'Будь-ласка введіть данні'
      }
      else  if (params['authFailed']) {
        this.message = 'Cессія закінчилась повторіть введення паролю'
      }
    })

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),

    })
  }

  submit() {
    if (this.form.invalid) {
      return
    }
    this.submitted = true
        const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    }
    this.auth.login(user).subscribe(() => {
      this.form.reset()
      this.router.navigate(['/admin', 'dashboard'])
      this.submitted = false
    }, () => this.submitted = false)
  }
}
