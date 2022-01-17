import { Component, OnInit } from '@angular/core';
import { ProdutosService } from 'src/app/produtos.service';
import { Produto } from 'src/app/shared/produto.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-upload-imagens',
  templateUrl: './upload-imagens.component.html',
  styleUrls: ['./upload-imagens.component.css']
})
export class UploadImagensComponent implements OnInit {

  continuar: boolean = false
  produto!: Produto
  image: any

  constructor(
    private pService: ProdutosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.pService.getProduto(params.id)
        .subscribe((res: any) => {
          this.produto = res
        })
    })
  }

  imagem1(event: any): void {
    this.image = event.target.files[0]
     this.pService.uploadImagem(this.produto.id, this.image)
      .subscribe((res: any) => {
        let imagem: any = ''
           
          setTimeout(() => {
            imagem =  localStorage.getItem('url')
            console.log(imagem)
            this.pService.addImagemProduto(this.produto.id, imagem)
            .subscribe((res: any) => res)
            localStorage.removeItem('url') 
            this.continuar = true
            }, 5000) 
       
      })
          
  }


  imagem(event: any): void {
    this.image = event.target.files[0]
    this.pService.uploadImagem(this.produto.id, this.image)
  }

  salvar(): void {
    if(this.continuar === true) {
      this.router.navigate([`/repor-estoque/${this.produto.id}`])
    }
  }
}
