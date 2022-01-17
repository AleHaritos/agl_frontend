import { Component, OnInit } from '@angular/core';
import { EstoqueService } from 'src/app/estoque.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private eservice: EstoqueService
  ) { }

  ngOnInit(): void {
    const cartEstoqueJSON = localStorage.getItem('cartEstoque')

    if(cartEstoqueJSON) {
      const cartEstoque = JSON.parse(cartEstoqueJSON)

      cartEstoque.forEach((cart: any) => {
        this.eservice.backEstoque(cart)
          .subscribe((res: any) => res)
      })

      localStorage.removeItem('cartEstoque')
      
    }
    localStorage.removeItem('valorTotal')
  }

}
