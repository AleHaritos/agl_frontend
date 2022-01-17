import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Estoque } from 'src/app/shared/estoque.model';
import { ProdutosService } from 'src/app/produtos.service';
import { EstoqueService } from 'src/app/estoque.service';

@Component({
  selector: 'app-repor-estoque',
  templateUrl: './repor-estoque.component.html',
  styleUrls: ['./repor-estoque.component.css']
})
export class ReporEstoqueComponent implements OnInit {

  state: boolean = true
  nomeProduto!: string

  totalQtd: number = 0

  estoque: Estoque = {
    idProduto: 0,
    quantidade: 0,
    tamanho: ''
  }
  tamanhos: any[] = ['PP', 'P', 'M', 'G', 'GG']

  formulario: FormGroup = new FormGroup({
    quantidade: new FormControl('', [ ]),
    tamanho: new FormControl('', [ ])
  })

  constructor(
    private route: ActivatedRoute,
    private eService: EstoqueService,
    private pservice: ProdutosService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.estoque.idProduto = params.id
      this.pservice.getProduto(params.id)
        .subscribe((res:any) => {
          this.nomeProduto = res.nome
        })
    })
  }

  atualizarEstoque(): void {
    //atualizar ou adicionar estoque aos produtos
    this.estoque.quantidade = this.formulario.value.quantidade
    this.estoque.tamanho = this.formulario.value.tamanho
    
    this.eService.atualizarEstoque(this.estoque)
        .subscribe((res: any) => {
          this.eService.snackBar('Estoque atualizado com sucesso')
          this.formulario.reset()
        })
  }

  changeState(): void {
    this.state = !this.state
  }

  reduzirEstoque(): void {
    this.estoque.quantidade = this.formulario.value.quantidade
    this.estoque.tamanho = this.formulario.value.tamanho


    this.eService.reduzirEstoque(this.estoque)
      .subscribe((res: any) => {

        this.eService.getIdProduto(this.estoque.idProduto)
            .subscribe((res: any) => {

              for(let i of res) {
                this.totalQtd = this.totalQtd + i.quantidade
              }

              this.formulario.reset()
              this.eService.snackBar('Estoque atualizado com sucesso')

              if(this.totalQtd <= 0 ) {
                this.eService.verificarEstoque(this.estoque.idProduto)
                  .subscribe((res: any) => {
                    this.totalQtd = 0 
                  })
              }

              this.totalQtd = 0
            })
            
      })
  }
}
