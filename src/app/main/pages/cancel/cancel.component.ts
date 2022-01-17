import { Component, OnInit } from '@angular/core';
import { EstoqueService } from 'src/app/estoque.service';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.css']
})
export class CancelComponent implements OnInit {

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
      localStorage.removeItem('valorTotal')
      localStorage.removeItem('localEntrega')
    }

  }

}
