import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable,of ,forkJoin} from 'rxjs';
import { IMenu } from '@app/models/backend/menu/IMenu';
import { HttpclientService } from '@app/services/menu/HttpClientServices';
import { HttpClient } from '@angular/common/http';
import { UserStateService } from '@app/services/login/user-state.service';
import { map } from 'rxjs/operators';
import { ContentTypeService } from '@app/services/login/content-type.service';
import { PermisosService } from '@app/services/login/permisos.service';
import { Grupos } from '@app/models/backend/login/grupos';
import { GruposService } from '@app/services/login/grupos.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent implements OnInit {

  idUser: Number = 0;
  idGrupo: Number = 0;
   jsonFilePath = '/assets/menu.json';
   jsonData: any[] = [];
   searchListAux = ["Home","Datos Institución","Gestionar","Solicitudes","Productos","Perfiles","Permisos"];
   searchList = [];
   results: any[] = [];
   grupo: Grupos ;
   listaPermiso: Number[] = [];

  menuList: Observable<IMenu[]>;
  constructor(private httpService: HttpclientService
                ,private userStateService: UserStateService
                ,private servicePermisos: PermisosService
                ,private serviceGrupos: GruposService
                ) {

                 }


  ngOnInit() {
    this.IdUser().subscribe(id => {
      this.idUser = id;
      if (this.idUser != 0){
        this.prepararMenu();
      }

    });

  }

  IdUser(): Observable<Number> {
    return this.userStateService.userState$.pipe(
      map(userState => {
        if(userState.id == null){
          this.idGrupo = 0;
          return 0;
        }
        this.idGrupo = userState.idGrupo;
        return userState.id;
      })
    );
  }



  closeMenu() : void {
    //this.menuToggle.emit();
  }


  findPartsByText(data: any[], searchTextList: string[]): void {
    for (const item of data) {
      if (searchTextList.includes(item.model)) {
        if (item.children) {
          const matchingChildren = item.children.filter(child => searchTextList.includes(child.model));
          if (matchingChildren.length > 0) {
            item.children = matchingChildren;
          } else {
            delete item.children;
          }
        }
        if (item.children || !searchTextList.includes(item.model)) {
          this.results.push(item);
        }
        if(item.model == "Home"){
          if (!this.results.includes(item)) {
            this.results.push(item);
          }
        }
      }
      if (item.children) {
        this.findPartsByText(item.children, searchTextList);
      }
     }

  }


 prepararMenu() {
  this.searchList = [];
  this.results = [];
  this.listaPermiso = [];

  this.serviceGrupos.getById(this.idGrupo).subscribe((grupoData) => {
    this.grupo = grupoData;

    for (const idpermiso of this.grupo.permissions) {
      if (!this.listaPermiso.includes(idpermiso)) {
        this.listaPermiso.push(idpermiso);
      }
    }

    for (const permiso of this.searchListAux) {
      if (!this.searchList.includes(permiso)) {
        this.searchList.push(permiso);
      }
    }

    const permisosObservables = this.listaPermiso.map((permiso) =>
      this.servicePermisos.getById(permiso)
    );

    forkJoin(permisosObservables).subscribe((data) => {
      data.forEach((permisoData) => {
        if (!this.searchList.includes(permisoData.codename)) {
          this.searchList.push(permisoData.codename);
        }
      });
      this.httpService.loadJSON(this.jsonFilePath).subscribe((jsonData) => {
        this.jsonData = jsonData;
        this.findPartsByText(this.jsonData, this.searchList);
        this.menuList = of(this.results);
      });
    });
  });
}

}
