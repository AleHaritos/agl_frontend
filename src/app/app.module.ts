import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { ReactiveFormsModule } from '@angular/forms';
import localePT from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http' 

import { ProdutosService } from './produtos.service';
import { EstoqueService } from './estoque.service';
import { OperacoesService } from './operacoes.service';
import { PedidosVendasService } from './pedidos-vendas.service';
import { AutenticacaoService } from './autenticacao.service';
import { AuthUserService } from './auth-user.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './template/header/header.component';
import { ContentComponent } from './template/content/content.component';
import { FooterComponent } from './template/footer/footer.component';
import { DestaquesComponent } from './main/home/destaques/destaques.component';
import { PromocoesComponent } from './main/home/promocoes/promocoes.component'
import { HomeComponent } from './main/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserAdminComponent } from './user-admin/user-admin.component'
import { ReporEstoqueComponent } from './user-admin/repor-estoque/repor-estoque.component'
import { DeleteComponent } from './user-admin/delete/delete.component';
import { AjusteComponent } from './user-admin/ajuste/ajuste.component';
import { DetalhesComponent } from './user-admin/detalhes/detalhes.component'
import { UploadImagensComponent } from './user-admin/upload-imagens/upload-imagens.component';
import { ProdEspecificoComponent } from './main/pages/prod-especifico/prod-especifico.component';
import { ListagemComponent } from './user-admin/listagem/listagem.component'
import { OfertasComponent } from './main/pages/ofertas/ofertas.component'
import { CarrinhoComponent } from './main/pages/carrinho/carrinho.component';
import { SuccessComponent } from './main/pages/success/success.component';
import { CancelComponent } from './main/pages/cancel/cancel.component';
import { DadosPedidoComponent } from './main/pages/dados-pedido/dados-pedido.component'
import { AuthComponent } from './main/pages/auth/auth.component';
import { SearchComponent } from './main/pages/search/search.component';
import { UserComponent } from './user/user.component';
import { HistoricoPedidosComponent } from './user-admin/historico-pedidos/historico-pedidos.component';
import { VendasComponent } from './user-admin/vendas/vendas.component';


import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatButtonModule } from '@angular/material/button'
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card'
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSelectModule } from '@angular/material/select'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatSortModule } from '@angular/material/sort'
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar'


registerLocaleData(localePT, 'pt-BR')

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    HomeComponent,
    DestaquesComponent,
    PromocoesComponent,
    UserAdminComponent,
    ReporEstoqueComponent,
    UploadImagensComponent,
    ProdEspecificoComponent,
    ListagemComponent,
    DeleteComponent,
    AjusteComponent,
    DetalhesComponent,
    OfertasComponent,
    CarrinhoComponent,
    SuccessComponent,
    CancelComponent,
    DadosPedidoComponent,
    AuthComponent,
    SearchComponent,
    UserComponent,
    HistoricoPedidosComponent,
    VendasComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MatRippleModule,
    MatDividerModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    FormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatMenuModule,
    MatTableModule,
    MatAutocompleteModule,
    MatSortModule,
    MatTooltipModule,
    MatGridListModule,
    MatRadioModule,
    MatProgressBarModule
    
  ],
  providers: [AutenticacaoService, PedidosVendasService, EstoqueService, ProdutosService, OperacoesService, AuthUserService,
            { provide: LOCALE_ID, useValue: 'pt-BR'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
