import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Produto } from 'src/app/shared/produto.model';
import { ProdutosService } from 'src/app/produtos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-prod-especifico',
  templateUrl: './prod-especifico.component.html',
  styleUrls: ['./prod-especifico.component.css']
})
export class ProdEspecificoComponent implements OnInit {

  @Output() sub: EventEmitter<boolean> = new EventEmitter<boolean>()

  verMais: boolean = true
  page: number = 1
  length!: number

  color: any = 'blue'
  height: number = 100

  // data: any = {
  //   count: 1,
  //   limite: []
  // }

  id!: number
  produtos!: Produto[]


  constructor(
    private pservice: ProdutosService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
  this.route.params.subscribe((params: any) => {
    this.id = params.id
    this.height = 100
    this.page = 1
    this.verMais = true

    this.sub.emit(false)

    this.pservice.getByTipoProduto(this.id , this.page)
    .subscribe((res: any) => {
      this.produtos = res
      // this.pegarImagens(this.produtos)     
    })   
  })  
}


paginacao(): void {
  this.page +=1
  this.height += 50

  this.pservice.getByTipoProduto(this.id , this.page)
    .subscribe((res: any) => {  
      
      if(res.length === 0) {
        this.verMais = false
        this.height -= 50
      }
      
      if(res.length >= 4) {
        this.height +=100
      }

      for(let i of res) {
        this.produtos.push(i)
      }

    // this.pegarImagens(res)
  })
}

  // pegarImagens(produtos: any): void {
  //   for(let i of produtos) {
  //     this.pservice.getImagemUnica(i.id)
  //       .subscribe((res: any) => {
  //         i.url = res.imagem
  //       })
  //   }
  // }
}
