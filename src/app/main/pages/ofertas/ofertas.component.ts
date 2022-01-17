import { Component, OnInit } from '@angular/core';
import { ProdutosService } from 'src/app/produtos.service';
import { ActivatedRoute } from '@angular/router';
import { Produto } from 'src/app/shared/produto.model';
import { EstoqueService } from 'src/app/estoque.service';
import { Estoque } from 'src/app/shared/estoque.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OperacoesService } from 'src/app/operacoes.service';
import { Carrinho } from 'src/app/shared/carrinho.model';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit {

  forms: FormGroup = new FormGroup({
    tamanho: new FormControl(null),
    cep: new FormControl(null, [
      Validators.maxLength(8),
      Validators.minLength(8),
    ])
  })


  estoque!: Estoque[]
  imagens!: any
  produto!: Produto
  indexImg: number = 0
  frete: any

  constructor(
    private pservice: ProdutosService,
    private route: ActivatedRoute,
    private eservice: EstoqueService,
    private opservice: OperacoesService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.pservice.getImagensProduto(params.id)
        .subscribe((res: any) => {
          this.imagens = res
          this.imagens[0].active = 'active'
        })
      
      this.pservice.getProduto(params.id)
        .subscribe((res: any) => {
          this.produto = res
        })  


      this.eservice.getIdProduto(params.id)
        .subscribe((res: any) => {
          this.estoque = res
        })

       
    })

  }

  forward(): void {
    if(this.indexImg + 1 < this.imagens.length) {
      this.indexImg = this.indexImg + 1
    }
    else {
      this.indexImg = 0
    }

    //Zerar o active de todos objetos
    for(let imagem of this.imagens) {
      imagem.active = ''
    }
   //Colocar active no objeto selecionado
     this.imagens[this.indexImg].active = 'active'
     

  }

  back(): void {
    if(this.indexImg === 0) {
      this.indexImg = this.imagens.length - 1
    }
    else {
      this.indexImg = this.indexImg - 1
    }

    for(let imagem of this.imagens) {
      imagem.active = ''
    }

    this.imagens[this.indexImg].active = 'active'
  }

  find(img: any): void {
   const indexImagem =  this.imagens.indexOf(img)
   this.indexImg = indexImagem


  for(let imagem of this.imagens) {
    imagem.active = ''
  }

   const found = this.imagens.find((imagem: any) => imagem.id === img.id)
   found.active = 'active'
   
  }


  calcularFrete(): void {

    if(this.forms.value.cep.length === 8) {
      console.log(this.forms.value.cep)
      this.opservice.calcularFrete(this.forms.value.cep)
        .subscribe((res: any) => {
        this.frete = res
      })
      }
    }

   
  adicionarCarrinho(): void {
    if(this.forms.value.tamanho !== null) {

      //Caso promocão esteja indisponível
      if(this.produto.promocao === false) {

        //Caso a descrição seja grande demais
        if(this.produto.descricao) {

          if(this.produto.descricao.length > 26) {
            const desc = this.produto.descricao.slice(0, 24)
    
            this.produto.descricao = desc + '...'
          }
        }
        
    //Atribuir valores ao carrinho que sera enviado para o serviço
     let carrinho = {
        idProduto: this.produto.id,
        tamanho: '',
        imagem: this.imagens[0].imagem,
        nome: this.produto.nome,
        descricao: this.produto.descricao,
        valor: this.produto.valor
      }


      carrinho.tamanho = this.forms.value.tamanho

      this.opservice.addCarrinho(carrinho)
    }

    if(this.produto.promocao === true) {

      if(this.produto.descricao) {

        if(this.produto.descricao.length > 26) {
         const desc = this.produto.descricao.slice(0, 24)
    
          this.produto.descricao = desc + '...'
        }
      }
    
      let carrinho = {
        idProduto: this.produto.id,
        tamanho: '',
        imagem: this.imagens[0].imagem,
        nome: this.produto.nome,
        descricao: this.produto.descricao,
        valor: this.produto.valorpromocao
      }

      carrinho.tamanho = this.forms.value.tamanho

      this.opservice.addCarrinho(carrinho)
    }

    }
   
 }

  
}
