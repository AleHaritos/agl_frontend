import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase/auth'
import { urlBackend } from './global'
import { EMPTY, Observable } from 'rxjs';
import { Usuario } from './shared/usuario.model';
import { catchError, map, retry } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService implements CanActivate {

  tokenId: string | null = null
  admin!: boolean

  constructor(
    private http: HttpClient,
    private snack: MatSnackBar,
    private router: Router
  ) { }

    signUpBackend(usuario: Usuario): Observable<Usuario> {
      return this.http.post(`${urlBackend}/usuario`, usuario)
        .pipe(
          retry(8),
          map((res: any) => res),
          catchError((e: any) => this.errorHandler(e))
        )
    }


    signUpFirebase(usuario: Usuario): void {
      const auth = firebase.getAuth()

      //Registrar no firebase o usuario
      firebase.createUserWithEmailAndPassword(auth, usuario.email, usuario.senha)
        .then((res: any) => {

          //Logar após o registro
          firebase.signInWithEmailAndPassword(auth, usuario.email, usuario.senha)
            .then((res: any) => {

              //Pegar TokenID
              firebase.onAuthStateChanged(auth, user => {
                if(user) {
                  user.getIdToken()
                    .then(token => {
                      this.tokenId = token
                      localStorage.setItem('token', token)
                      setTimeout(() => window.location.reload(), 500)
                    })                   
                }
              })
            })
        })     
    }


    signInFirebase(usuario: any): Promise<any> {
      return new Promise((resolve, reject) => {
        const auth = firebase.getAuth()

        firebase.signInWithEmailAndPassword(auth, usuario.email, usuario.senha)
              .then((res: any) => {
  
                firebase.onAuthStateChanged(auth, user => {
                  if(user) {
                    user.getIdToken()
                      .then(token => {
                        this.tokenId = token
                        localStorage.setItem('token', token)
                        resolve(true)
                      })     
                      
                  }
                })
  
              })
      })
     
    }


    signInBackend(usuario: any): Observable<any> {
      return this.http.put(`${urlBackend}/usuario`, usuario)
        .pipe(
          retry(8),
          map((res: any) => res),
          catchError((e: any) => this.errorHandler(e))
        )
    }


    signOut(): void {
      const auth = firebase.getAuth();

      firebase.signOut(auth)
        .then((res: any) => {
          this.tokenId = null
          localStorage.removeItem('token')
          localStorage.removeItem('canActivate')
          window.location.reload()
        })
    }

    verificarAdmin(): Promise<any> {
      return new Promise((resolve, reject) => {
        const auth = firebase.getAuth()
        firebase.onAuthStateChanged(auth, user => {
            if(user) {
              this.http.post(`${urlBackend}/usuario-admin`, { email: user.email })
                .pipe(
                  retry(8),
                  map((res: any) => res)
                )
                .subscribe((res: any) => {
                  this.admin = res.admin
                  localStorage.setItem('canActivate', res.admin)
                  resolve(res)
                })
            }
        })
      })
    }

    getIdByEmail(email: any): Observable<any> {
      return this.http.post(`${urlBackend}/get-usuario`, { email })
        .pipe(
          retry(2),
          map((res: any) => res)
        )
    }

    canActivate(): boolean {
      //CanActivate para ADM
      if(this.tokenId === null && localStorage.getItem('token') !== null) {
        this.tokenId = localStorage.getItem('token')
      }
     
      this.admin = localStorage.getItem('canActivate') === 'true'? this.admin = true : this.admin = false

      if(this.tokenId === null || localStorage.getItem('token') === null || this.admin !== true) {
        this.router.navigate(['/'])
      }

      return this.tokenId !== null && this.admin === true
    }


  snackBar(msg: string, error: boolean = false): void {
      this.snack.open(msg, 'x', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: error? [ 'red-msg'] : ['green-msg']
      })
  }
  
  errorHandler(e: any): Observable<any> {
    this.snackBar(e.error, true)
    return EMPTY
  }
}
