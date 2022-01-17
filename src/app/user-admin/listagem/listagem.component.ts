import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Produto } from 'src/app/shared/produto.model';
import { ProdutosService } from 'src/app/produtos.service';
import { Observable, Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import  { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { MatSort, Sort } from '@angular/material/sort';


@Component({
  selector: 'app-listagem',
  templateUrl: './listagem.component.html',
  styleUrls: ['./listagem.component.css']
})
export class ListagemComponent implements OnInit {

  forms: FormGroup = new FormGroup({

    termo: new FormControl(null)

  })


  orderId: boolean = false
  produtos!: Produto[]
  showTable: boolean = false
  showTableAll: boolean = false

  sub: Subject<string> = new Subject<string>()
  filteredOptions!: Observable<Produto[]>

  dataSource!: MatTableDataSource<Produto> 
  
  constructor(
    private pservice: ProdutosService
  ) { }
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id','nome', 'ajuste', 'mais', 'qtd', 'delete'];

  ngOnInit(): void {
    this.filteredOptions = this.sub
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((termo: string) => {
        return this.pservice.getWhereLike(termo)
        })
      )

  }

  whereLike(): void {
    this.sub.next(this.forms.value.termo)
}

exibirTabelaNome(): void {
  this.pservice.getProdutoByName(this.forms.value.termo)
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res)
        setTimeout(() => this.dataSource.paginator = this.paginator)
        this.showTable = true
      })
}

exibirTabela(): void {
  this.pservice.getAll()
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res)
        setTimeout(() => this.dataSource.paginator = this.paginator)
        this.showTableAll = true
        
      })
}

ordenar(): void {
  if(this.orderId === false) {
  this.pservice.getByDesc()
      .subscribe((res: any) => {
     this.dataSource = new MatTableDataSource(res)
     setTimeout(() => this.dataSource.paginator = this.paginator)
     this.showTableAll = true
     this.orderId = true
    
  })
}
  else {
    this.pservice.getAll()
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res)
        setTimeout(() => this.dataSource.paginator = this.paginator)
        this.showTableAll = true
        this.orderId = false
        
      })
  }
}


back(): void {
  this.showTable = false
  this.showTableAll = false
  this.forms.reset()
}

}


