import { Component, OnInit, ViewChild } from '@angular/core';
import { ProdutosService } from 'src/app/produtos.service';
import { Produto } from 'src/app/shared/produto.model';
import { ActivatedRoute } from '@angular/router';
import { EstoqueService } from 'src/app/estoque.service';
import { Estoque } from 'src/app/shared/estoque.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.css']
})
export class DetalhesComponent implements OnInit {

  dataSource!: MatTableDataSource<Estoque> 
  estoque!: Estoque[]
  produto!: Produto

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['id','qtd', 'tamanho'];

  constructor(
    private route: ActivatedRoute,
    private pservice: ProdutosService,
    private eservice: EstoqueService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.eservice.getIdProduto(params.id)
        .subscribe((res: any) => {
         
          this.dataSource = new MatTableDataSource(res)
          setTimeout(() => this.dataSource.paginator = this.paginator)
        })

        this.pservice.getProduto(params.id)
          .subscribe((res: any) => {
            this.produto = res
          })
    })
  }

  


}
