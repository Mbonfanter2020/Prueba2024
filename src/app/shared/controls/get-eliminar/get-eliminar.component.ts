import { Component,OnInit,Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef ,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Solicitud } from '@app/models/backend/solicitudes/solicitud';

@Component({
  selector: 'app-get-eliminar',
  templateUrl: './get-eliminar.component.html',
  styleUrls: ['./get-eliminar.component.scss'],
  standalone: true,
  imports: [MatDialogModule,MatButtonModule],
})
export class GetEliminarComponent implements OnInit{

  ComponeteEliminar:string = "Solicitud"
  TituloAccion:string = "Eliminar Solicitud"
  TituloBoton:string = "Eliminar"
  constructor(private dialogoRefencia: MatDialogRef<GetEliminarComponent>
    ,@Inject(MAT_DIALOG_DATA) public dato: any){
      this.ComponeteEliminar = dato.componeteEliminar;
      this.TituloAccion = dato.tituloAccion;
      if(dato.tituloBoton){
        this.TituloBoton = dato.tituloBoton;
      }

  }
  ngOnInit(): void {

  }


  comfirmarEliminar(){
    if(this.dato.datos){
      this.dialogoRefencia.close("Eliminar");
    }
  }


}

