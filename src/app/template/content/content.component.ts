import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProdutosService } from 'src/app/produtos.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  @Input() openSideNav!: boolean

  tiposProd!: any
 @Output() sub: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(
    private pservice: ProdutosService
  ) { }

  ngOnInit(): void {
    this.pservice.getTipoProd()
      .subscribe((res: any) => {
          this.tiposProd = res
      })
  }

  closeSideNav(): void {
    this.sub.emit(false)
  }

}
