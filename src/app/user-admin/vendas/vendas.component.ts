import { Component, OnInit, ViewChild } from '@angular/core';
import { PedidosVendasService } from 'src/app/pedidos-vendas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.css']
})
export class VendasComponent implements OnInit {

  vendas!: any
  dataSource: any;

  constructor(
   private pvService: PedidosVendasService,
   private route: ActivatedRoute,
   private router: Router
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['nome','qtd', 'tamanho', 'detalhe'];
  
  ngOnInit(): void {
    this.route.params.subscribe((res: any) => {
      this.pvService.getVendasByIdPedido(res.id)
        .subscribe((res: any) => {
          this.dataSource = new MatTableDataSource(res)
          setTimeout(() => this.dataSource.paginator = this.paginator)
        })
      })
  }


  back(): void{
    this.router.navigate(['/pedidos-historico'])
  }
}
