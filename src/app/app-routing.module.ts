import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { ReporEstoqueComponent } from './user-admin/repor-estoque/repor-estoque.component';
import { UploadImagensComponent } from './user-admin/upload-imagens/upload-imagens.component';
import { ProdEspecificoComponent } from './main/pages/prod-especifico/prod-especifico.component';
import { ListagemComponent } from './user-admin/listagem/listagem.component';
import { DeleteComponent } from './user-admin/delete/delete.component';
import { DetalhesComponent } from './user-admin/detalhes/detalhes.component';
import { AjusteComponent } from './user-admin/ajuste/ajuste.component';
import { OfertasComponent } from './main/pages/ofertas/ofertas.component';
import { CarrinhoComponent } from './main/pages/carrinho/carrinho.component';
import { SuccessComponent } from './main/pages/success/success.component';
import { CancelComponent } from './main/pages/cancel/cancel.component';
import { DadosPedidoComponent } from './main/pages/dados-pedido/dados-pedido.component';
import { AuthComponent } from './main/pages/auth/auth.component';
import { AutenticacaoService } from './autenticacao.service';
import { AuthUserService } from './auth-user.service';
import { SearchComponent } from './main/pages/search/search.component';
import { UserComponent } from './user/user.component';
import { HistoricoPedidosComponent } from './user-admin/historico-pedidos/historico-pedidos.component';
import { VendasComponent } from './user-admin/vendas/vendas.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user-admin', component: UserAdminComponent, canActivate: [ AutenticacaoService ]},
  { path: 'repor-estoque/:id', component: ReporEstoqueComponent, canActivate: [ AutenticacaoService ] },
  { path: 'add-imagens/:id', component: UploadImagensComponent, canActivate: [ AutenticacaoService ] },
  { path: 'produtos/:id', component: ProdEspecificoComponent },
  { path: 'listagem', component: ListagemComponent, canActivate: [ AutenticacaoService ] },
  { path: 'delete/:id', component: DeleteComponent, canActivate: [ AutenticacaoService ] },
  { path: 'detalhes/:id', component: DetalhesComponent, canActivate: [ AutenticacaoService ] },
  { path: 'ajuste/:id', component: AjusteComponent, canActivate: [ AutenticacaoService ] },
  { path: 'ofertas/:id', component: OfertasComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'cancel', component: CancelComponent },
  { path: 'dados-entrega', component: DadosPedidoComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'search', component: SearchComponent },
  { path: 'user', component: UserComponent, canActivate: [ AuthUserService ] },
  { path: 'pedidos-historico', component: HistoricoPedidosComponent, canActivate: [ AutenticacaoService ]},
  { path: 'vendas/:id', component: VendasComponent, canActivate: [ AutenticacaoService ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
