import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProdutosService } from '../produtos.service';
import { Router } from '@angular/router';
import { Produto } from '../shared/produto.model';
import { tipoProdutos } from '../shared/tipoProd.model';
import { Usuario } from '../shared/usuario.model';
import { AutenticacaoService } from '../autenticacao.service';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit {

  tiposProd!: tipoProdutos[]
  produto!: Produto

  typeInput: string = 'password'
  iconPassword: string = 'visibility_off'
  usuario!: Usuario

  formulario: FormGroup = new FormGroup({
    valor: new FormControl('', [ Validators.required ]),
    nome: new FormControl('',[ Validators.required, Validators.maxLength(18) ]),
    descricao: new FormControl('',[ Validators.maxLength(35)]),
    destaque: new FormControl(false, []),
    promocao: new FormControl(false, []),
    valorpromocao: new FormControl('',[]),
    idTipo: new FormControl('', [ Validators.required ])
  })

  formsTipoProd: FormGroup = new FormGroup({
    descricaoTipo: new FormControl(null, [ Validators.required ])
  })


  formRegister: FormGroup = new FormGroup({
    nome: new FormControl('', [ Validators.required ]),
    email: new FormControl('', [ Validators.required, Validators.email ]),
    senha: new FormControl('', [ Validators.required, Validators.minLength(6)]),
    confirmacaoSenha: new FormControl('', [ Validators.required, Validators.minLength(6)]),
    telefone: new FormControl('')
  })

  constructor(
    private pservice: ProdutosService,
    private router: Router,
    private authService: AutenticacaoService
  ) { }

  ngOnInit(): void {
    this.pservice.getTipoProd()
      .subscribe((res: any) => {
        this.tiposProd = res
      })
  }

  salvar(): void {
    if(this.formulario.value.nome !== '' && this.formulario.value.valor !== '' && this.formulario.value.idTipo !== '') {

      this.formulario.value.valor = this.formulario.value.valor.replace(',', '.')
      if(this.formulario.value.promocao === true) {
        this.formulario.value.valorpromocao = this.formulario.value.valorpromocao.replace(',', '.')
      }

      this.produto = this.formulario.value
      console.log(this.formulario.value)
      
      this.pservice.cadastrarProduto(this.produto)
        .subscribe((res:any) => {
        this.router.navigate([`/add-imagens/${res}`])
          
        })
    }

  }

  cadastrarTipoProd(): void {
    if(this.formsTipoProd.valid) {
      this.pservice.cadastrarTipoProduto(this.formsTipoProd.value.descricaoTipo)
        .subscribe((res: any) => {
          this.pservice.snackBar('Cadastrado com sucesso')
          this.router.navigate(['/'])
        })
        
    }
  }

  togglePassword(): void {
    this.typeInput === 'password' ? this.typeInput = 'text' : this.typeInput = 'password'
    this.iconPassword === 'visibility_off' ? this.iconPassword ='visibility' : this.iconPassword = 'visibility_off'
  }

  register(): void {
    if(this.formRegister.valid) {
      this.usuario = {
        admin: true,
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
          setTimeout(() => window.location.reload(), 1000)
          localStorage.removeItem('cart')
          this.router.navigate(['/'])
        })
    }
  }
}
