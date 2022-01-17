import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as firebase from 'firebase/auth'
import { AutenticacaoService } from '../autenticacao.service';
import { PedidosVendasService } from '../pedidos-vendas.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  value: number = 0
  parts!: number
  show: boolean = false
  dataSource: MatTableDataSource<any> = new MatTableDataSource()
  constructor(
    private authService: AutenticacaoService,
    private pvService: PedidosVendasService
  ) { }

  ngOnInit(): void {
    this.historico()
  }
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['nome','qtd', 'tamanho', 'data'];

  historico(): void {
    const auth = firebase.getAuth()

    firebase.onAuthStateChanged(auth, user => {
      if(user) {
        this.authService.getIdByEmail(user.email)
          .subscribe((res: any) => {
            this.pvService.getVendasByIdUsuario(res.id)
              .subscribe((res: any) => {
                this.parts = 100/res.length
                res.forEach((pedido: any) => {
                  this.value += this.parts
                  this.pvService.getVendasByIdPedido(pedido.id)
                    .subscribe((res: any) => {
                      res.forEach((venda: any) => {
                        this.dataSource.data.push(venda)                  
                      })
                    })               
                })
                if(this.show === false) {
                  setTimeout(()=> this.value >= 99.9 ? this.show = true : this.show = false,500)
                }
              })
          })
      }
    })
  }
}
