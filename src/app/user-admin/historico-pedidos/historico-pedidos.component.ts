import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Pedido } from 'src/app/shared/pedido.model';
import { PedidosVendasService } from 'src/app/pedidos-vendas.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BarController, ChartType, ChartConfiguration,BarElement, CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-historico-pedidos',
  templateUrl: './historico-pedidos.component.html',
  styleUrls: ['./historico-pedidos.component.css']
})
export class HistoricoPedidosComponent implements OnInit {

  showTable: boolean = false
  // pedidos!: Pedido[]
  
  year: number[] = [ 22, 23, 24, 25, 26, 27 ]
  // yearSelected: any
  visible: string = 'notVisible'
  chart: any
  showGraph: boolean = false
  types: any[] = [
    { label: 'Em Linhas' , value: 'line'},
    { label: 'Em Barras' , value: 'bar'}
  ]

  forms: FormGroup = new FormGroup({
    yearSelected: new FormControl(null, [Validators.required]),
    typeGraph: new FormControl(null, [Validators.required])
  })

  maxPage: number = 0
  dataSource!: MatTableDataSource<Pedido> 
  
  constructor(
    private pvService: PedidosVendasService
  ) { }


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = ['id','cep', 'numero', 'valorTotal', 'mais'];

  ngOnInit(): void {
  }

  exibirTabela(): void {
    this.pvService.getPedidosDesc()
        .subscribe((res: any) => {
          this.dataSource = new MatTableDataSource(res)
          setTimeout(() => this.dataSource.paginator = this.paginator)
          this.showTable = true       
        })

  }

  voltar(): void {
    this.showTable = false
  }


  gerarGrafico(): void {

   this.pvService.getPedidosWhereLikeYear(this.forms.value.yearSelected)
      .subscribe((res: Pedido[]) => {
        this.organazeMonths(res)
          .then((dataMonths: number[]) => {
            
            const ctx = "myChart"

            const config: ChartConfiguration = {
              type: this.forms.value.typeGraph,
              data: {
                labels: ['1° mês', '2° mês', '3° mês', '4° mês', '5° mês', '6° mês', '7° mês', '8° mês', '9° mês', '10° mês', '11° mês', '12° mês'],
                datasets: [
                  {
                    label: 'Pedidos p/mês',
                    data: dataMonths,
                    fill: false,
                    borderColor: '#c2185b',
                    backgroundColor: '#c2185b',
                    pointStyle: 'triangle',
                    pointRadius: 6,
                  }
                 ]
              },
              options: {  
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  intersect: true,
                  mode: 'index',
                },
                plugins: {
                  title: {
                    display: true,
                    text: 'Gráfico de Pedidos', 
                  }
                }      
            }
          }
        
          this.showGraph = true
          this.visible = 'visible'
          Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, BarController, BarElement, Tooltip)
          this.chart =  new Chart(ctx, config)

          })
          
      })

}

    async organazeMonths(pedidos: Pedido[]): Promise<number[]> {
    
      return new Promise(async (resolve, reject) => {
       const dataMonths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        const datas = pedidos.map(x => x.data)
        await datas.forEach(data => {
           const month = parseInt(data.split('/')[1])
   
           switch(month) {
             case 1:
               dataMonths[0]+=1
               break;
             case 2:
               dataMonths[1]+=1
               break;
             case 3:
               dataMonths[2]+=1
               break;
             case 4:
               dataMonths[3]+=1
               break;
             case 5:
               dataMonths[4]+=1
               break;
             case 6:
               dataMonths[5]+=1
               break;
             case 7:
               dataMonths[6]+=1
               break;
             case 8:
               dataMonths[7]+=1
               break;
             case 9:
               dataMonths[8]+=1
               break;
             case 10:
               dataMonths[9]+=1
               break;
             case 11:
               dataMonths[10]+=1
               break;
             case 12:
               dataMonths[11]+=1
               break;
             default:
   
           }
         })

         resolve(dataMonths)
      })
    }


    destroyGraph(): void {
      this.chart.destroy()
      this.visible = 'notVisible'
      this.showGraph = false
      this.forms.reset()
    }

}
