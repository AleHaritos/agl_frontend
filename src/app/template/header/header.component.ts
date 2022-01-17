import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProdutosService } from 'src/app/produtos.service';
import { Produto } from 'src/app/shared/produto.model';
import { tipoProdutos } from 'src/app/shared/tipoProd.model';
import { AutenticacaoService } from 'src/app/autenticacao.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('iconRotate', [
      state('padrao', style({ opacity: 1})),
      state('clicado', style({ opacity: 1})),
      transition('padrao <=> clicado', animate('1.5s 0ms ease-in-out', keyframes([

        style({ offset: 0.15, transform: 'rotate(45deg)'}),
        style({ offset: 0.30, transform: 'rotate(90deg)'}),
        style({ offset: 0.45, transform: 'rotate(135deg)'}),
        style({ offset: 0.60, transform: 'rotate(180deg)'}),
        style({ offset: 0.75, transform: 'rotate(225deg)'}),
        style({ offset: 0.85, transform: 'rotate(285deg)'}),
        style({ offset: 0.92, transform: 'rotate(320deg)'}),
        style({ offset: 0.99, transform: 'rotate(360deg)'}),

      ])
      ))
    ])
  ]
})
export class HeaderComponent implements OnInit {

  forms: FormGroup = new FormGroup({

    termo: new FormControl(null)

  })

  sub: Subject<string> = new Subject<string>()

  responsive: boolean = false
  filteredOptions: any
  tiposProd!: tipoProdutos[]
  produtos!: Produto[]

  admin!: boolean

  openSideNav: boolean = false
  estado: string = 'padrao'
  color: string = 'rgba(153, 58, 58, 0.616)'
  constructor(
    private pservice: ProdutosService,
    private authService: AutenticacaoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  setInterval(() => this.homeResponsivo(), 1000)  

    this.authService.verificarAdmin()
      .then((res: any) => {
        this.admin = res.admin
      })

    this.pservice.getTipoProd()
      .subscribe((res: any) => {
          this.tiposProd = res
      })

      this.filteredOptions = this.sub
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap( (termo: string) => { 
            return this.pservice.getWhereLike(termo)
          })
        )


  }

  whereLike(): void {
    this.sub.next(this.forms.value.termo)
  }

  toggleSideNav(): void {
    this.openSideNav = !this.openSideNav
    this.estado = this.estado === 'padrao' ? 'clicado' : 'padrao'
  }

  pegarImagens(): void {
    for(let i of this.produtos) {
      this.pservice.getImagemUnica(i.id)
        .subscribe((res: any) => {
          i.url = res.imagem
        })
    }
  }

  homeResponsivo(): void {

    if (window.matchMedia("(min-width: 0px) and (max-width: 1060px)").matches) {
      this.responsive = true
    }
    
    if (window.matchMedia("(min-width: 1061px)").matches) {
      this.responsive = false
      this.openSideNav = false
    }
  }

signOut(): void {
  this.authService.signOut()
}

search(): void {
  this.router.navigate(['/search'], {
    relativeTo: this.route,
    queryParams: { termo: this.forms.value.termo },
    queryParamsHandling: 'merge'
  })

  this.forms.reset()
}


}
