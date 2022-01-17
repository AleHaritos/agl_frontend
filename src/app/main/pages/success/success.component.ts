import { Component, OnInit } from '@angular/core';
import { Carrinho } from 'src/app/shared/carrinho.model';
import { Pedido } from 'src/app/shared/pedido.model';
import { PedidosVendasService } from 'src/app/pedidos-vendas.service';
import * as firebase from 'firebase/auth'
import { AutenticacaoService } from 'src/app/autenticacao.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  finalizado: boolean = false
  carrinho!: Carrinho[]
  pedido: Pedido = {
    cep: '',
    numero: '',
    complemento: '',
    valorTotal: 0,
    data: ''
  }

  constructor(
    private pvService: PedidosVendasService,
    private authService: AutenticacaoService
  ) { }

  ngOnInit(): void {
    this.sucesso()
  }


  sucesso(): void {
    const auth = firebase.getAuth()

    const data = new Date()

    const dia  = data.getDate().toString()
    const mes = (data.getMonth()+1).toString()
    const ano = data.getFullYear()

    const date = `${dia}/${mes}/${ano}`

    firebase.onAuthStateChanged(auth, user => {   
        this.authService.getIdByEmail(user?.email)
          .subscribe((res: any) => {
            this.pedido.idUsuario = res?.id
            this.pedido.data = date
            localStorage.removeItem('cartEstoque')

            const cartJSON =  localStorage.getItem('cart')
            if(cartJSON) {
              this.carrinho = JSON.parse(cartJSON)
              localStorage.removeItem('cart')
              
            }
         
            const pedidoJSON =  localStorage.getItem('localEntrega')
         
            if(pedidoJSON) {
             const pedidoOBJ = JSON.parse(pedidoJSON)
             
             if(pedidoOBJ) {
               
               localStorage.removeItem('localEntrega')
         
               this.pedido.cep = pedidoOBJ.cep
               this.pedido.numero = pedidoOBJ.numero
               
             }
           
             
           }
         
           const valorTotal = localStorage.getItem('valorTotal')
         
           if(valorTotal) {
             let valor = valorTotal
             this.pedido.valorTotal = parseFloat(valor)
         
             localStorage.removeItem('valorTotal')
           }
         
         
           // Cadastrar pedidos com returning no Id do pedido e forEach para cadsatrar as Vendas
         
             this.pvService.cadastrarPedidos(this.pedido)
               .subscribe((res: any) => {
                 this.pedido.id = res[0]
         
                 this.carrinho.forEach((cart: any)=> {
                   let vendas = { idProduto: cart.idProduto, 
                                  idPedido: this.pedido.id, 
                                  tamanho: cart.tamanho,
                                  quantidade: cart.quantidade }
                   this.pvService.cadastrarVendas(vendas)
                      .subscribe((res:any) => res)
                 })
         
                 this.finalizado = true
                 console.log('finalizado')
               })
          })
      
    })

  


  }
}
