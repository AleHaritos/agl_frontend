import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Pedido } from 'src/app/shared/pedido.model';
import { PedidosVendasService } from 'src/app/pedidos-vendas.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-historico-pedidos',
  templateUrl: './historico-pedidos.component.html',
  styleUrls: ['./historico-pedidos.component.css']
})
export class HistoricoPedidosComponent implements OnInit {

  showTable: boolean = false
  // pedidos!: Pedido[]
  
  maxPage: number = 0
  dataSource!: MatTableDataSource<Pedido> 
  
  constructor(
    private pvService: PedidosVendasService
  ) { }


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id','cep', 'numero', 'valorTotal', 'mais'];

  ngOnInit(): void {
  }

  exibirTabela(): void {
    this.pvService.getPedidosDesc()
        .subscribe((res: any) => {
          this.dataSource = new MatTableDataSource(res)
          setTimeout(() => this.dataSource.paginator = this.paginator)
          this.showTable = true       
        })

  }

}
