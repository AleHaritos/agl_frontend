import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OperacoesService } from 'src/app/operacoes.service';
import { Carrinho } from 'src/app/shared/carrinho.model';
import { EstoqueService } from 'src/app/estoque.service';

@Component({
  selector: 'app-dados-pedido',
  templateUrl: './dados-pedido.component.html',
  styleUrls: ['./dados-pedido.component.css']
})
export class DadosPedidoComponent implements OnInit {
  carrinho!: Carrinho[]
  valorTotal: any = 0
  verificado!: boolean
  valorFrete: any = ''

  rua: string = ''
  cidade: string = ''
  bairro: string = ''

  forms: FormGroup = new FormGroup({
    cep: new FormControl('',  [Validators.maxLength(8), Validators.minLength(8) ]),
    numero: new FormControl('')
  })

  constructor(
    private opservice: OperacoesService,
    private eservice: EstoqueService
  ) { }

  ngOnInit(): void {
    this.carrinho = this.opservice.getCart()

    this.valorTotal = localStorage.getItem('valorTotal')
    
    this.valorTotal = parseFloat(this.valorTotal)
    this.estoqueBack()
  }


  consultarCep(): void {

    if(this.forms.value.cep.length === 8) {
      this.opservice.consultarCEP(this.forms.value.cep)
        .subscribe((res: any) => {
          this.rua = res.logradouro
          this.bairro = res.bairro
          this.cidade = res.localidade
        })

        this.opservice.calcularFrete(this.forms.value.cep)
          .subscribe((res: any) => {
            this.valorFrete = res[1].Valor
            this.valorFrete = this.valorFrete.replace(',', '.')
            this.valorFrete = parseFloat(this.valorFrete)
            if(this.valorFrete === undefined) {
              this.valorFrete = 10
            }
          })
    }

  }

  async finalizarPedido(): Promise<void> {

    if(this.forms.value.cep.length === 8 && this.forms.value.numero !== '') {
      
      localStorage.setItem('localEntrega',JSON.stringify({ cep: this.forms.value.cep, numero: this.forms.value.numero }))
      localStorage.setItem('intro', 'false')

      this.verificado = true

     await this.carrinho.forEach((produto: any) => {
        this.opservice.verificacaoEstoque(produto)
            .subscribe((res: any) => {
              console.log(res)
              if(res === 'Verificado' && this.verificado === true) {
                this.verificado = true
              } else {
                this.verificado = false
                this.opservice.snackBar(`${produto.nome} está sem estoque`, true)
              }
            })
          
      })
  
      if(this.verificado === true) {

      localStorage.removeItem('verificado')
      let carrinhoPaypal: { name: string; sku: number; price: number; currency: string; quantity: number; }[] = []
  
        this.carrinho.map((cart: Carrinho) => {
        let car = { 
                   name : `${cart.nome} ${cart.tamanho}`,
                   sku: cart.idProduto,
                   price: cart.valor,
                   currency: "BRL",
                   quantity: cart.quantidade
                 }
       
          carrinhoPaypal.push(car)       
      })
  
    
      let carFrete = { name: 'frete', sku: 0, price: this.valorFrete, currency: "BRL", quantity: 1 }

      carrinhoPaypal.push(carFrete)

      this.valorTotal = parseFloat((this.valorTotal + parseFloat(carFrete.price)).toFixed(2))
      localStorage.setItem('valorTotal', this.valorTotal)

      this.opservice.pagamentoPaypal(carrinhoPaypal, this.valorTotal)
        .subscribe((res: any) => {
          
          this.carrinho.forEach((cart: any) => {
  
            this.eservice.subtrairEstoque(cart)
              .subscribe((res: any) => res)
          })
  
          localStorage.setItem('cartEstoque', JSON.stringify(this.carrinho))
          this.forms.reset()
          window.location.href = res
        })
    }

  }
  }

  

  estoqueBack(): void {
    //Função para adicionar o produto no estoque caso o usuário nao confirme a compra

    if(localStorage.getItem('cartEstoque')) {
      
      const cartEstoqueJSON = localStorage.getItem('cartEstoque')

      if(cartEstoqueJSON) {
        const cartEstoque = JSON.parse(cartEstoqueJSON)
        
        cartEstoque.forEach((cart: any) => {
          this.eservice.backEstoque(cart)
            .subscribe((res: any) => res)
        })

        localStorage.removeItem('cartEstoque')

      }

    }
  }
}
