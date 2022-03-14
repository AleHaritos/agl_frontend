import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProdutosService } from 'src/app/produtos.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  topGap: string = '173'

  @Input() openSideNav!: boolean

  tiposProd!: any
  @Output() sub: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(
    private pservice: ProdutosService
  ) { }

  ngOnInit(): void {
    this.resizeTopGap()
    this.pservice.getTipoProd()
      .subscribe((res: any) => {
        this.tiposProd = res
      })
  }

  closeSideNav(): void {
    this.sub.emit(false)
  }

  resizeTopGap(): void {
    const body = document.querySelector("body")

    const observer = new ResizeObserver(entries => {

      if (window.matchMedia("(min-height: 1001px) and ( max-height: 1200px )").matches) {
        this.topGap = '203'
      }
      if (window.matchMedia("(min-height: 801px) and ( max-height: 1000px )").matches) {
        this.topGap = '183'
      }
      if (window.matchMedia("(min-height: 821px) and ( max-height: 999px )").matches) {
        this.topGap = '193'
      }
      if (window.matchMedia("(min-height: 705px) and ( max-height: 820px )").matches) {
        this.topGap = '158'
      }
      if (window.matchMedia("(min-height: 600px) and ( max-height: 704px )").matches) {
        this.topGap = '133'
      }
      if (window.matchMedia("(min-height: 480px) and ( max-height: 599px )").matches) {
        this.topGap = '113'
      }
      if (window.matchMedia("(min-height: 0px) and ( max-height: 479px )").matches) {
        this.topGap = '93'
      }

    })

    if (body) {
      observer.observe(body)
    }

  }

}
