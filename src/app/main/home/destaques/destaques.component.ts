import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ProdutosService } from 'src/app/produtos.service';
import { Produto } from 'src/app/shared/produto.model';

@Component({
  selector: 'app-destaques',
  templateUrl: './destaques.component.html',
  styleUrls: ['./destaques.component.css'],
  animations: [ trigger('cardslide', [
    state('show', style({ opacity: 1 })),
    transition('void => show', [ style({ opacity: 0, transform:'translate(160px, 0px)'}), animate('1.5s', keyframes([
      style({ offset: 0.10, transform: 'translateX(120px)', opacity: 0.5 }),
      style({ offset: 0.30, transform: 'translateX(100px)', opacity: 0.7 }),
      style({ offset: 0.50, transform: 'translateX(80px)', opacity: 0.7 }),
      style({ offset: 0.70, transform: 'translateX(50px)', opacity: 0.8 }),
      style({ offset: 0.80, transform: 'translateX(20px)', opacity: 0.9 }),
      style({ offset: 0.90, transform: 'translateX(0px)', opacity: 1 })
    ]))]),
    transition('void => showback', [ style({ opacity: 0, transform:'translate(-160px, 0px)'}), animate('1.5s', keyframes([
      style({ offset: 0.10, transform: 'translateX(-120px)', opacity: 0.5 }),
      style({ offset: 0.30, transform: 'translateX(-100px)', opacity: 0.7 }),
      style({ offset: 0.50, transform: 'translateX(-80px)', opacity: 0.7 }),
      style({ offset: 0.70, transform: 'translateX(-50px)', opacity: 0.8 }),
      style({ offset: 0.80, transform: 'translateX(-20px)', opacity: 0.9 }),
      style({ offset: 0.90, transform: 'translateX(-0px)', opacity: 1 })
    ]))])
   
  ])]
})
export class DestaquesComponent implements OnInit {

  // color: string = 'rgba(10, 9, 9, 0.616)'
  fim: number = 3
  inicio: number = 0
  sizeScreen!: string
  back!: number

  produtos!: Produto[]
  state: string = 'show'

  constructor(
    private produtosService: ProdutosService
  ) { }


  ngOnInit(): void {
    this.produtosService.getDestaques()
      .subscribe((res: any) => {
        this.produtos = res
        // this.pegarImagens()
        
      })
      //Monitorar tamanho da tela -- Responsividade para o carrosel --
       this.monitorarTela()
      
  }

//Avançar o carrosel de destaques
  slideForward(): void {
    this.state = 'show'
    if(this.sizeScreen === '400') {
      //Caso a tela for min-width 400px limitar para mostrar um item por vez
      if(this.fim < this.produtos.length) {
      this.inicio = this.inicio + 1
      this.fim = this.fim + 1
      }
    }

    if(this.sizeScreen === '700') {
      if(this.fim < this.produtos.length) {

      //Caso o numero de produtos nao seja divisivel pelo quanto o limite vai andando
      //Neste caso de 2 em 2, e sobre 1 produto, ai vai ter que andar de 1 em 1 para mostra-lo
      if(this.produtos.length - this.fim  < 2) {
        this.inicio = this.inicio + 1
        this.fim = this.fim + 1
        this.back = 1
      } else {
        this.inicio = this.inicio + 2
        this.fim = this.fim + 2
        this.back = 0
      }

      }
    }

    if(this.sizeScreen === '1000') {
      if(this.fim < this.produtos.length) {
        if(this.produtos.length - this.fim <= 3) {
          this.back = this.produtos.length - this.fim
          this.fim = this.fim + this.back
          this.inicio = this.inicio + this.back
        } else {
          this.inicio = this.inicio + 3
          this.fim = this.fim + 3
          this.back = 0 
        }    
      }
    }

  }

  //Voltar o carrosel de destaques
  backSlide(): void {
    this.state = 'showback'
    if(this.sizeScreen === '400') {
      if(this.inicio > 0) {
      this.inicio = this.inicio - 1
      this.fim = this.fim - 1
      }
    }

    if(this.sizeScreen === '700') {
      if(this.inicio > 0) {

       if(this.back === 1) {
        this.inicio = this.inicio - 1
        this.fim = this.fim - 1
        this.back = 0

       } else {
        this.inicio = this.inicio - 2
        this.fim = this.fim - 2
        this.back = 0
       }
      }
    }

    if(this.sizeScreen === '1000') {
      if(this.inicio > 0) {
        if(this.back !== 0) {
          this.inicio = this.inicio - this.back
          this.fim = this.fim - this.back
          this.back = 0   
        }
        else {
          this.inicio = this.inicio - 3
          this.fim = this.fim - 3
        }
      } 
    }
  }

  // pegarImagens(): void {
  //   for(let i of this.produtos) {
  //     this.produtosService.getImagemUnica(i.id)
  //       .subscribe((res: any) => {
  //         i.url = res.imagem
  //       })
  //   }
  // }

  monitorarTela(): void {
    this.logicaMonitoracao()
    const body = document.querySelector("body")

    const observer = new ResizeObserver(entries => {
      this.logicaMonitoracao()
    
  })

   if(body) {
    observer.observe(body)
    }
  }

  logicaMonitoracao(): void {
    if (window.matchMedia("(min-width: 0px) and ( max-width: 749px )").matches) {
  
      this.sizeScreen = '400'
  
      if(this.fim - this.inicio !== 1) {
        this.fim = 1
        this.inicio = 0
      }
      
    }
  
    if (window.matchMedia("(min-width: 750px) and (max-width: 1099px)").matches) {
  
      if(this.sizeScreen !== '700') {
        this.fim = 2
        this.inicio = 0
        this.sizeScreen = '700'
      }
      
    }
  
    if (window.matchMedia("(min-width: 1100px)").matches) {
  
      if(this.sizeScreen !== '1000') {
        this.fim = 3
        this.inicio = 0
        this.sizeScreen = '1000'
      }
      
    }
  }
}
