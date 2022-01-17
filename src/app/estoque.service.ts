import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, retry, catchError } from 'rxjs/operators'
import { Estoque } from './shared/estoque.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { urlBackend } from './global';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {

  constructor(
    private http: HttpClient,
    private snack: MatSnackBar
  ) { }

  url: string = urlBackend

  getById(id: number): Observable<Estoque> {
    return this.http.get(`${this.url}/estoque/${id}`)
      .pipe(
          retry(8),
          map((res: any) => res),
          catchError((e: any) => this.errorHandler(e.error))
      )
  }

  atualizarEstoque(estoque: any): Observable<Estoque> {
    return this.http.post(`${this.url}/estoque`, estoque)
        .pipe (
          retry(8),
          map((res:any) => res),
          catchError((e: any) => this.errorHandler(e.error))
        )
  }

  getIdProduto(id: number): Observable<Estoque[]> {
    return this.http.get(`${this.url}/estoque-produto/${id}`)
      .pipe(
        retry(8),
        map((res: any) => res),
        catchError((e: any) => this.errorHandler(e.error))
      )
  }


  reduzirEstoque(estoque: any): Observable<Estoque> {
    return this.http.put(`${this.url}/estoque`, estoque)
        .pipe(
          retry(8),
          map((res: any) => res),
          catchError((e: any) => this.errorHandler(e.error))
        )
  }

  verificarEstoque(id: number): Observable<Estoque> {
    return this.http.put(`${this.url}/verificar-estoque`, { idProduto: id })
        .pipe(
          retry(8),
          map((res: any) => res),
          catchError((e: any) => this.errorHandler(e.error))
        )
  }

  backEstoque(produto: any): Observable<any> {
    return this.http.put(`${this.url}/back-estoque`, produto)
      .pipe(
        retry(5),
        map((res: any) => res),
        catchError((e: any) => this.errorHandler(e.error))
      )
  }

  subtrairEstoque(produto: any): Observable<any> {
    return this.http.put(`${this.url}/subtrair-estoque`, produto)
      .pipe(
        retry(5),
        map((res: any) => res),
        catchError((e: any) => this.errorHandler(e.error))
      )
  }



snackBar(msg: string, error: boolean = false): void {
    this.snack.open(msg, 'x', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: error? [ 'red-msg'] : ['green-msg']
    })
}

errorHandler(e: any): Observable<any> {
  this.snackBar(e.error, true)
  return EMPTY
}

}
