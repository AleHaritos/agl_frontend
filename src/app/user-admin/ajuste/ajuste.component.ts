import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProdutosService } from 'src/app/produtos.service';
import { Produto } from 'src/app/shared/produto.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ajuste',
  templateUrl: './ajuste.component.html',
  styleUrls: ['./ajuste.component.css']
})
export class AjusteComponent implements OnInit {

  formulario: FormGroup = new FormGroup({
    destaque: new FormControl(false, []),
    promocao: new FormControl(false, []),
    valorpromocao: new FormControl(null, [])
  })

  produto!: Produto

  constructor(
    private pservice: ProdutosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.pservice.getProduto(params.id)
        .subscribe((res: any) => {
          this.produto = res
        })
    })
  }


  salvar(): void {
      if(this.formulario.value.promocao === true && this.formulario.value.valorpromocao === null || this.formulario.value.valorpromocao === '' ) {
        this.pservice.snackBar('Preencha o campo valor promoção', true)
      }

      else {
        this.produto.promocao = this.formulario.value.promocao
        this.produto.valorpromocao = this.formulario.value.valorpromocao
        this.produto.destaque = this.formulario.value.destaque

        this.pservice.ajustes(this.produto)
          .subscribe((res: any) => {
            this.pservice.snackBar('Alterado com sucesso')
            this.router.navigate(['/listagem'])
          })
      }
  }
}
