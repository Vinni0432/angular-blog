import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { FbAuthResponse, User } from "src/app/shared/components/interfaces";
import { Observable, Subject, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { catchError, tap } from "rxjs/operators"

@Injectable({ providedIn: 'root' })

export class AuthService {

  public error$: Subject<string> = new Subject<string>()

  constructor(private http: HttpClient) { }

  get token(): string | null | any {
    const exDate: any = localStorage.getItem('fb-token-exp')
    const expDate = new Date(exDate)
    if (new Date() > expDate) {
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token')
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      )
  }

  logout() {
    this.setToken(null)
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  private handleError(error: HttpErrorResponse) {
    const { message } = error.error.error

    switch (message) {
      case 'INVALID_EMAIL': this.error$.next('Невірний Email')
        break
      case 'INVALID_PASSWORD': this.error$.next('Невірний Password')
        break
      case 'EMAIL_NOT_FOUND': this.error$.next('Email не існує')
        break
    }
    return throwError(error)
  }

  private setToken(response: FbAuthResponse | any) {
    console.log(response)

    if (response) {
      const exDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-exp', exDate.toString())
    }
    else {
      localStorage.clear()
    }
  }
}

