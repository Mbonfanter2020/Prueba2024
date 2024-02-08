import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { NgFor } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SolicitudCausaGeneral } from '@app/models/backend/solicitudes/solicitud-causa-general';
import { SolicitudCausaEspecifica } from '@app/models/backend/solicitudes/solicitud-causa-especifica';
import { SolicitudCausaGeneralService } from '@app/services/solicitudes/solicitud-causa-general.service';
import { SolicitudCausaEspecificaService } from '@app/services/solicitudes/solicitud-causa-especifica.service';
import { SolicitudEfectoGeneral } from '@app/models/backend/solicitudes/solicitud-efecto-general';
import { SolicitudEfectoGeneralService } from '@app/services/solicitudes/solicitud-efecto-general.service';
import { SolicitudEfectoEspecificoService } from '@app/services/solicitudes/solicitud-efecto-especifico.service';
import { SolicitudEfectoEspecifico } from '@app/models/backend/solicitudes/solicitud-efecto-especifico';

@Component({
  selector: 'app-get-causa-efecto',
  templateUrl: './get-causa-efecto.component.html',
  styleUrls: ['./get-causa-efecto.component.scss'],
  standalone: true,
  imports: [MatGridListModule,MatFormFieldModule
    ,MatDialogModule,MatButtonModule,ReactiveFormsModule
    ,MatInputModule,FormsModule
    ,NgFor],
})
export class GetCausaEfectoComponent implements OnInit{
  frmGetCausaEfecto: FormGroup;
   Modo: String = "N";
  Tipo: String = "CG";
  TituloFormulario: String = "";
  TituloLabel: String = "";
  botonAccion: String = "Guardar";
  nombreLabel: String = "";
  Id:Number = 0;

  constructor(private dialogoRefencia: MatDialogRef<GetCausaEfectoComponent>
    ,private fb: FormBuilder
    ,private _snackBar: MatSnackBar
    ,@Inject(MAT_DIALOG_DATA) public datos: any
    ,private _causasGeneralSer: SolicitudCausaGeneralService
    ,private _causasEspecificaSer: SolicitudCausaEspecificaService
    ,private _efectoGeneralSer: SolicitudEfectoGeneralService
    ,private _efectoEspecificoSer: SolicitudEfectoEspecificoService
  ){
    this.Tipo = datos.tipo;
    this.TituloFormulario = datos.tiulo;
    this.TituloLabel = datos.titLabel;
    this.nombreLabel = datos.nomLabel;
    this.Id = datos.id;
    this.Modo = datos.modo;

    if(this.Tipo  == "CG" ||this.Tipo  == "CE" ){
      this.frmGetCausaEfecto = this.fb.group({
        descripcionCausa:['',Validators.required]
      });
    }else{
      this.frmGetCausaEfecto = this.fb.group({
        descripcionEfecto:['',Validators.required]
      });
    }

  }

  ngOnInit(): void {
    if(this.Modo =="E"){

      switch(this.Tipo){
      case "CG":
        this.frmGetCausaEfecto.patchValue({
          descripcionCausa:this.datos.formulario.descripcionCausa,
         })
        break;

        case "CE":
        this.frmGetCausaEfecto.patchValue({
          descripcionCausa:this.datos.formulario.descripcionCausa,
         })
        break;

        case "EG":
        this.frmGetCausaEfecto.patchValue({
          descripcionEfecto:this.datos.formulario.descripcionEfecto,
         })
        break;

        case "EE":
        this.frmGetCausaEfecto.patchValue({
          descripcionEfecto:this.datos.formulario.descripcionEfecto,
         })
        break;
      }
      this.botonAccion = "Actualizar";
    }
  }


  MostrarAlertar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:4000
    });
  }

  GuardarCG(){

    const modelo : SolicitudCausaGeneral = {
          id:0,
          descripcionCausa:this.frmGetCausaEfecto.value.descripcionCausa,
          idSolicitud:this.Id
        }

        if(this.datos.formulario == null){
          this._causasGeneralSer.add(modelo).subscribe({
            next: (data) => {
              this.MostrarAlertar("Causa general registrada con éxito","Listo");
              this.dialogoRefencia.close("Creado");
            },error: (e) => {
              this.MostrarAlertar("No se pudo registrar la solicitud","Error");
            }
          })
        }else{
          this._causasGeneralSer.update(this.datos.formulario.id,modelo).subscribe({
            next: (data) => {
              this.MostrarAlertar("Solicitud editada con éxito","Listo");
              this.dialogoRefencia.close("Editado");
            },error: (e) => {
              this.MostrarAlertar("No se pudo editar la solicitud","Error");
            }
          })
        }
  }

  GuardarCE(){
    console.log(this.datos)
    const modelo : SolicitudCausaEspecifica = {
          id:0,
          descripcionCausa:this.frmGetCausaEfecto.value.descripcionCausa,
          idCausa:this.Id
        }

        if(this.datos.formulario == null){
          this._causasEspecificaSer.add(modelo).subscribe({
            next: (data) => {
              this.MostrarAlertar("Causa general registrada con éxito","Listo");
              this.dialogoRefencia.close("Creado");
            },error: (e) => {
              this.MostrarAlertar("No se pudo registrar la solicitud","Error");
            }
          })
        }else{
          this._causasEspecificaSer.update(this.datos.formulario.id,modelo).subscribe({
            next: (data) => {
              this.MostrarAlertar("Solicitud editada con éxito","Listo");
              this.dialogoRefencia.close("Editado");
            },error: (e) => {
              this.MostrarAlertar("No se pudo editar la solicitud","Error");
            }
          })
        }
  }


  GuardarEG(){

    const modelo : SolicitudEfectoGeneral = {
          id:0,
          descripcionEfecto:this.frmGetCausaEfecto.value.descripcionEfecto,
          idSolicitud:this.Id
        }

        if(this.datos.formulario == null){
          this._efectoGeneralSer.add(modelo).subscribe({
            next: (data) => {
              this.MostrarAlertar("Causa general registrada con éxito","Listo");
              this.dialogoRefencia.close("Creado");
            },error: (e) => {
              this.MostrarAlertar("No se pudo registrar la solicitud","Error");
            }
          })
        }else{
          this._efectoGeneralSer.update(this.datos.formulario.id,modelo).subscribe({
            next: (data) => {
              this.MostrarAlertar("Solicitud editada con éxito","Listo");
              this.dialogoRefencia.close("Editado");
            },error: (e) => {
              this.MostrarAlertar("No se pudo editar la solicitud","Error");
            }
          })
        }
  }

  GuardarEE(){
    console.log(this.datos)
    const modelo : SolicitudEfectoEspecifico = {
          id:0,
          descripcionEfecto:this.frmGetCausaEfecto.value.descripcionEfecto,
          idEfecto:this.Id
        }

        if(this.datos.formulario == null){
          this._efectoEspecificoSer.add(modelo).subscribe({
            next: (data) => {
              this.MostrarAlertar("Causa general registrada con éxito","Listo");
              this.dialogoRefencia.close("Creado");
            },error: (e) => {
              this.MostrarAlertar("No se pudo registrar la solicitud","Error");
            }
          })
        }else{
          this._efectoEspecificoSer.update(this.datos.formulario.id,modelo).subscribe({
            next: (data) => {
              this.MostrarAlertar("Solicitud editada con éxito","Listo");
              this.dialogoRefencia.close("Editado");
            },error: (e) => {
              this.MostrarAlertar("No se pudo editar la solicitud","Error");
            }
          })
        }
  }

  GuardarEditar(){
    switch(this.Tipo){
      case "CG":
        this.GuardarCG();
        break;
        case "CE":
        this.GuardarCE();
        break;
        case "EG":
        this.GuardarEG();
        break;
        case "EE":
        this.GuardarEE();
        break;
        default:
          break;
    }



  }

}
