import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AutenticacaoService } from 'src/app/autenticacao.service';
import { Usuario } from 'src/app/shared/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loginComponent: boolean = true

  typeInput: string = 'password'
  iconPassword: string = 'visibility_off'

  usuario!: Usuario

  formLogin: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email ]),
    senha: new FormControl('', [ Validators.required, Validators.minLength(6)])
  })

  formRegister: FormGroup = new FormGroup({
    nome: new FormControl('', [ Validators.required ]),
    email: new FormControl('', [ Validators.required, Validators.email ]),
    senha: new FormControl('', [ Validators.required, Validators.minLength(6)]),
    confirmacaoSenha: new FormControl('', [ Validators.required, Validators.minLength(6)]),
    telefone: new FormControl('')
  })

  constructor(
    private authService: AutenticacaoService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }


  togglePassword(): void {
    this.typeInput === 'password' ? this.typeInput = 'text' : this.typeInput = 'password'
    this.iconPassword === 'visibility_off' ? this.iconPassword ='visibility' : this.iconPassword = 'visibility_off'
  }


  login(): void {
    if(this.formLogin.valid) {
      let usuario = {
        email: this.formLogin.value.email,
        senha: this.formLogin.value.senha,
      }
      
      this.authService.signInBackend(usuario)
        .subscribe((res: any) => {
          this.authService.signInFirebase(usuario)
            .then((res: any) => {
              if(res === true) {
                this.authService.snackBar('Login efetuado com sucesso!')
                // setTimeout(() => window.location.reload(), 1000)
                localStorage.removeItem('cart')
                this.router.navigate(['/'])
              }
            })
        })
    }
  }

  register(): void {
    if(this.formRegister.valid) {
      this.usuario = {
        admin: false,
        email: this.formRegister.value.email,
        senha: this.formRegister.value.senha,
        senha2: this.formRegister.value.confirmacaoSenha,
        nome: this.formRegister.value.nome,
        telefone: this.formRegister.value.telefone
      }

      this.authService.signUpBackend(this.usuario)
        .subscribe((res: any) => {
          this.authService.signUpFirebase(this.usuario)
          this.authService.snackBar('Registrado com Sucesso!')
          localStorage.removeItem('cart')
          this.router.navigate(['/'])
        })
    }
  }

}
