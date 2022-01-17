import { Component, OnInit } from '@angular/core';
import { ProdutosService } from 'src/app/produtos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from 'src/app/shared/produto.model';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  id!: number
  produto!: Produto

  constructor(
    private pservice: ProdutosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.id = params.id
      this.pservice.getProduto(params.id)
        .subscribe((res: any) => {
          this.produto = res
        })
    })
  }


  excluir(): void {
    this.pservice.deletarProduto(this.id)
      .subscribe((res: any) => {
        this.pservice.snackBar('Deletado com Sucesso!')
        this.router.navigate(['/listagem'])
      })
  }
}
