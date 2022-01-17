import { Component, OnInit } from '@angular/core';
import { OperacoesService } from 'src/app/operacoes.service';
import { Carrinho } from 'src/app/shared/carrinho.model';
import { EstoqueService } from 'src/app/estoque.service';
import { Router } from '@angular/router';

// declare var paypal: { Buttons: () => { (): any; new(): any; render: { (arg0: string): void; new(): any; }; }; };

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit {
  verificou: boolean = true;
  verificado!: boolean
  carrinho!: Carrinho[]
  valorTotal: number = 0
  valueButton: string = 'Finalizar Compra'

  constructor(
    private opservice: OperacoesService,
    private eservice: EstoqueService,
    private router: Router
  ) { }


  ngOnInit(): void {
  this.carrinho = this.opservice.getCart()

  this.carrinho.map((cart: any) => {
    this.valorTotal = this.valorTotal + cart.valor * cart.quantidade
  })

    //  paypal.Buttons().render("app-carrinho");
    this.estoqueBack()
  }


  limparCarrinho(): void {
    this.opservice.limparCarrinho()

    this.carrinho = []

    this.valorTotal = 0

    this.carrinho.map((cart: any) => {
      this.valorTotal = this.valorTotal + cart.valor * cart.quantidade
    })

    this.verificou = true
    this.valueButton = 'Finalizar Compra'
    this.verificado = true
  }

  removerItem(item: any): void {
    this.opservice.removerItem(item)

    this.valorTotal = 0

    this.carrinho.map((cart: any) => {
      this.valorTotal = this.valorTotal + cart.valor * cart.quantidade
    })

    this.verificou = true
    this.valueButton = 'Finalizar Compra'
    this.verificado = true
  }

  adicionar(item: any): void {
    this.opservice.addCarrinho(item)

    this.valorTotal = 0

    this.carrinho.map((cart: any) => {
      this.valorTotal = this.valorTotal + cart.valor * cart.quantidade
    })

    this.verificou = true
    this.valueButton = 'Finalizar Compra'
    this.verificado = true
  }

  diminuir(item: any): void {
    this.opservice.removerCarrinho(item)

    this.valorTotal = 0

    this.carrinho.map((cart: any) => {
      this.valorTotal = this.valorTotal + cart.valor * cart.quantidade
    })

    this.verificou = true
    this.valueButton = 'Finalizar Compra'
    this.verificado = true
  }


  async verificacaoEstoque(): Promise<void> {
    this.verificado = true
    this.valueButton = 'Aguarde...'
    await this.carrinho.forEach((produto: any) => {
      this.opservice.verificacaoEstoque(produto)
          .subscribe((res: any) => {
            console.log(res)
            if(res === 'Verificado' && this.verificado === true) {
              this.verificado = true
            } else {
              this.verificado = false
              this.verificou = false
              this.valueButton = 'Falta de estoque'
              this.opservice.snackBar(`${produto.nome} está sem estoque`, true)
            }
          })
        
    })

    setTimeout(() => {
      if(this.verificou === true) {
        localStorage.setItem('valorTotal', this.valorTotal.toString())
    
        this.router.navigate(['/dados-entrega'])
        }
    }, 1000)
    

  
    
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
        localStorage.removeItem('valorTotal')
      }

    }
  }
}
