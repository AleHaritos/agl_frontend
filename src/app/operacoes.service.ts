import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable, pipe } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators'
import { Carrinho } from './shared/carrinho.model';
import { urlBackend } from './global';

@Injectable({
  providedIn: 'root'
})
export class OperacoesService {

  carrinhoArray: Carrinho[] = []
  url: string = urlBackend

  constructor(
    private http: HttpClient,
    private snack: MatSnackBar
  ) {
    
    let cart = localStorage.getItem('cart')

    if(cart) {
    this.carrinhoArray = JSON.parse(cart)
    }

  }


  calcularFrete(cep: string): Observable<any> {
    return this.http.put(`${this.url}/frete`, { cep })
      .pipe(
        retry(8),
        map((res: any) => res),
        catchError((e: any) => this.errorHandler('Cep inválido'))
      )
  }


  consultarCEP(cep: string): Observable<any> {
    return this.http.put(`${this.url}/cep`, { cep })
      .pipe(
        retry(8),
        map((res: any) => res),
        catchError((e: any) => this.errorHandler('Cep inválido'))
      )
  }

  getCart(): Carrinho[] {
    return this.carrinhoArray
  }

  addCarrinho(produto: any): void {
   let found: any

    this.carrinhoArray.forEach((carrinho: any) => {

      if(produto.idProduto === carrinho.idProduto) {
        if(produto.tamanho === carrinho.tamanho){
          found = carrinho
        }

      } 
    })
    
    if(found) {
      found.quantidade +=1

      let jsonCart = JSON.stringify(this.carrinhoArray)
      localStorage.setItem('cart', jsonCart)

      this.snackBar('Produto adicionado no carrinho')
    }
    else {
      produto.quantidade = 1
      this.carrinhoArray.push(produto)

      let jsonCart = JSON.stringify(this.carrinhoArray)
      localStorage.setItem('cart', jsonCart)

      this.snackBar('Produto adicionado no carrinho')
    }


  }

  removerCarrinho(produto: Carrinho): void {
    const found = this.carrinhoArray.find(cart => cart.idProduto === produto.idProduto && cart.tamanho === produto.tamanho)

    if(found) {
      found.quantidade = found.quantidade - 1
      let jsonCart = JSON.stringify(this.carrinhoArray)
      localStorage.setItem('cart', jsonCart)

      if(found.quantidade === 0) {

        const index =  this.carrinhoArray.findIndex(cart => found.idProduto === cart.idProduto && cart.tamanho === found.tamanho)

        this.carrinhoArray.splice(index, 1)

        let jsonCart = JSON.stringify(this.carrinhoArray)
        localStorage.setItem('cart', jsonCart)
      }
    }
      
  }

  removerItem(produto: any): void {
        const foundIndex = this.carrinhoArray.findIndex(cart => produto.idProduto === cart.idProduto && cart.tamanho === produto.tamanho)

        this.carrinhoArray.splice(foundIndex, 1)

        let jsonCart = JSON.stringify(this.carrinhoArray)
        localStorage.setItem('cart', jsonCart)
  }


  limparCarrinho(): void {
    this.carrinhoArray = []
    localStorage.removeItem('cart')
  }

  snackBar(msg: string, error: boolean = false): void {
    this.snack.open(msg, 'x', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: error? ['red-msg'] : ['green-msg']
    })
  }

  errorHandler(msg: any): Observable<any> {
    this.snackBar(msg, true)
    return EMPTY
  }


  verificacaoEstoque(produto: Carrinho): Observable<any> {
    return this.http.put(`${this.url}/verificacao`, produto)
        .pipe(
          retry(8),
          map((res: any) => res),
          catchError((e: any) => this.errorHandler(e.error))
        )
  }

  pagamentoPaypal(carrinho: any, valorTotal: number): Observable<any> {
    return this.http.post(`${this.url}/pagamento`, { carrinho, valorTotal })
      .pipe(
        retry(8),
        map((res: any) => res),
        catchError((e: any) => this.errorHandler('Erro no pagamento'))
      )
  }

  }
