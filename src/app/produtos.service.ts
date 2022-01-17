import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable, of } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators'
import { Produto } from './shared/produto.model';
import * as firebaseStorage from 'firebase/storage'
import { MatSnackBar } from '@angular/material/snack-bar';
import { tipoProdutos } from './shared/tipoProd.model';
import { urlBackend } from './global';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  imagem!: string
  url: string = urlBackend

  constructor(
    private http: HttpClient,
    private snack: MatSnackBar
  ) { }

  getAll(): Observable<Produto[]> {
    return this.http.get(`${this.url}/produtos`)
      .pipe(
        retry(8),
        map((res:any) => res),
        catchError(e => this.errorHandler(e.error))
      )
  }

  getProduto(id: number): Observable<Produto> {
    return this.http.get(`${this.url}/produtos/${id}`)
        .pipe(
          retry(8),
          map((res: any) =>  res),
          catchError(e => this.errorHandler(e.error))
        )
  }

  getDestaques(): Observable<Produto[]> {
    return this.http.get(`${this.url}/destaques`)
      .pipe(
        retry(8),
        map((res: any) => res),
        catchError(e => this.errorHandler(e.error))
        )
  }

  getPromocoes(): Observable<Produto[]> {
    return this.http.get(`${this.url}/promocoes`)
      .pipe(
        retry(8),
        map((res: any) => res),
        catchError(e => this.errorHandler(e.error))
        )
  }

  cadastrarProduto(produto: Produto): Observable<Produto> {
    return this.http.post(`${this.url}/produtos`, produto)
      .pipe(
        retry(8),
        map((res:any) => res),
        catchError(e => this.errorHandler(e.error))
      )
  }


  getTipoProd(): Observable<any> {
    return this.http.get(`${this.url}/tipo_prod`)
      .pipe(
        retry(8),
        map((res: any) => res ),
        catchError(e => this.errorHandler(e.error))
      )
  }

  uploadImagem(id: number, file: any): any {
    const date = Date.now()

    const storage = firebaseStorage.getStorage()
    const ref = firebaseStorage.ref(storage, `imagens/${id}/${date}`)

    firebaseStorage.uploadBytesResumable(ref, file)
      .on('state_changed', 
         (snapshot: any) => {
          
      },
        (error: any) => {

        },

        () => {
          firebaseStorage.getDownloadURL(ref)
              .then((url: any) => {
                const objImagem = {
                  imagem: url,
                  idProduto: id
                }
                this.imagem = url
                localStorage.setItem('url', url)
                this.addImagem(objImagem)
                  .subscribe((res:any) => res)
                  this.snackBar('Upload realizado com sucesso!')
                  
              })
        })
        
          return of(this.imagem).pipe(
            map((res: string) => res)
          )            
    }

    
    addImagemProduto(id: number, imagem: string): Observable<Produto> {
      return this.http.put(`${this.url}/produtos-imagem/${id}`, { imagem })
        .pipe(
          retry(3),
          map((res: any) => res)
        )
    }

  lastId(): Observable<Produto> {
    return this.http.get(`${this.url}/produtos-last`)
        .pipe(
          retry(8),
          map((res: any) => res)
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

addImagem(obj: any): Observable<any> {
  return  this.http.post(`${this.url}/img_produto`, obj)
  .pipe(
    retry(8),
    map((res:any) => res)
  )
}

getImagemUnica(id: number): Observable<any> {
  return  this.http.get(`${this.url}/img_produto_unico/${id}`)
  .pipe(
    retry(8),
    map((res:any) => res)
  )
}

getImagensProduto(id: number): Observable<any> {
  return this.http.get(`${this.url}/img_produto/${id}`)
      .pipe(
        retry(8),
        map((res: any) => res),
        catchError((e: any) => this.errorHandler(e.error))
      )
}


getByTipoProduto(id: number, page: number): Observable<Produto[]> {
  return this.http.get(`${this.url}/tipo_prod/${id}?page=${page}`)
      .pipe(
        retry(8),
        map((res:any) => res)
      )
}

  getWhereLike(termo: string): Observable<Produto[]> {
    return this.http.put(`${this.url}/produtos`, { termo })
      .pipe(
        retry(2),
        map((res: any) => res)    
      )
  }

  getProdutoByName(nome: string): Observable<Produto> {
    return this.http.put(`${this.url}/produto-by-name`, { nome })
      .pipe(
        retry(8),
        map((res: any) => res),
        catchError((e: any) => this.errorHandler(e.error))
      )
  }

getByDesc(): Observable<Produto[]> {
  return this.http.get(`${this.url}/produtos-desc`)
      .pipe(
        retry(8),
        map((res: any) => res),
        catchError((e: any) => this.errorHandler(e.error))
      )
}

ajustes(produto: Produto): Observable<Produto> {
  return this.http.put(`${this.url}/ajustes`, produto)
      .pipe(
        retry(8),
        map((res: any) => res),
        catchError((e: any) => this.errorHandler(e.error))
      )
}

deletarProduto(id: number): Observable<Produto> {
  return this.http.delete(`${this.url}/produtos/${id}`)
    .pipe(
      retry(8),
      map((res: any) => res),
      catchError((e: any) => this.errorHandler({ error: 'Erro ao deletar'}))
    )
}

whereLikePage(termo: string, page: number): Observable<Produto> {
  return this.http.post(`${this.url}/produtos-wherelike?page=${page}`, { termo })
    .pipe(
      retry(2),
      map((res: any) => res)
    )
}

cadastrarTipoProduto(descricaoTipo: string): Observable<tipoProdutos> {
  return this.http.post(`${this.url}/tipo_prod`, { descricaoTipo })
      .pipe(
        retry(3),
        map((res: any)=> res),
        catchError((e: any) => this.errorHandler(e))
      )
}

}
