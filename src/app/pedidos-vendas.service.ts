import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as global from './global'
import { Pedido } from './shared/pedido.model';
import { EMPTY, Observable } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class PedidosVendasService {

  constructor(
    private http: HttpClient,
    private snack: MatSnackBar
  ) { }


  cadastrarPedidos(pedido: Pedido): Observable<Pedido> {
    return this.http.post(`${global.urlBackend}/pedidos`, pedido)
      .pipe(
        retry(8),
        map((res: any) => res)      
      )
  }

  cadastrarVendas(venda: any): Observable<any> {
    return this.http.post(`${global.urlBackend}/vendas`, venda)
      .pipe(
        retry(8),
        map((res: any) => res)      
      )
  }


  getPedidos(): Observable<Pedido> {
    return this.http.get(`${global.urlBackend}/pedidos`)
    .pipe(
      retry(8),
      map((res: any) => res)
    )
  }

  getPedidosDesc(): Observable<Pedido> {
    return this.http.get(`${global.urlBackend}/pedidos-desc`)
    .pipe(
      retry(8),
      map((res: any) => res)    
    )
  }

  getVendas(): Observable<any> {
    return this.http.get(`${global.urlBackend}/vendas`)
    .pipe(
      retry(8),
      map((res: any) => res),
      catchError((e: any) => this.errorHandler(e))
    )
  }

  getVendasByIdPedido(id: number): Observable<any> {
    return this.http.get(`${global.urlBackend}/vendas/${id}`)
      .pipe(
        retry(3),
        map((res: any) => res),
        catchError((e: any) => this.errorHandler(e))
      )
  }

  getVendasByIdUsuario(id: number): Observable<any> {
    return this.http.get(`${global.urlBackend}/vendas-usuario/${id}`)
      .pipe(
        retry(3),
        map((res: any) => res),
        catchError((e: any) => this.errorHandler(e))
      )
  }



 openSnackBar(msg: string, error: boolean = false): void {
    this.snack.open(msg, 'x', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: error? ['red-msg'] : ['green-msg']
    } )
 } 

errorHandler(e: any): Observable<any> {
  this.openSnackBar(e, true)
  return EMPTY
}
}
