import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Produto } from 'src/app/shared/produto.model';
import { ProdutosService } from 'src/app/produtos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-prod-especifico',
  templateUrl: './prod-especifico.component.html',
  styleUrls: ['./prod-especifico.component.css']
})
export class ProdEspecificoComponent implements OnInit {

  verMais: boolean = true
  page: number = 1
  length!: number

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
    
    this.page = 1
    this.verMais = true

    this.pservice.getByTipoProduto(this.id , this.page)
    .subscribe((res: any) => {
      this.produtos = res
      // this.pegarImagens(this.produtos)     
    })   
  })  
}


paginacao(): void {
  this.page +=1

  this.pservice.getByTipoProduto(this.id , this.page)
    .subscribe((res: any) => {  
      
      if(res.length === 0) {
        this.verMais = false
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
