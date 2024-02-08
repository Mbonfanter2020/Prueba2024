import { Component,OnInit,Inject, inject, NgZone, ViewChild,ElementRef } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, Validators ,FormControl} from '@angular/forms';

import { FormBuilder,FormGroup,Validator } from '@angular/forms';
import { MatDialogModule, MatDialogRef ,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import {NgClass, NgFor,AsyncPipe} from '@angular/common';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';

import { Ciudad } from '@app/models/backend/datos-principales/ciudad';
import { Departamento } from '@app/models/backend/datos-principales/departamento';
import { CiudadService } from '@app/services/datos-principales/ciudad.service';
import { DepartamentoService } from '@app/services/datos-principales/departamento.service';
import { Solicitud } from '@app/models/backend/solicitudes/solicitud';
import { SolicitudService } from '@app/services/solicitudes/solicitud.service';
import { MAT_DATE_FORMATS, MatDateFormats, MatOptionModule } from '@angular/material/core';
import { DialogRef } from '@angular/cdk/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {map, startWith} from 'rxjs/operators';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { PalabraClave } from '@app/models/backend/solicitudes/palabra-clave';
import { PalabraClaveService } from '@app/services/solicitudes/palabra-clave.service';
import { UserStateService } from '@app/services/login/user-state.service';


const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'YYYY-MM-DD', // Formato de fecha de entrada (opcional)
  },
  display: {
    dateInput: 'DD/MM/YYYY', // Formato de fecha de salida
    monthYearLabel: 'MMM YYYY', // Formato para etiquetas de mes y año
    dateA11yLabel: 'LL', // Formato accesible para la fecha
    monthYearA11yLabel: 'MMMM YYYY', // Formato accesible para etiquetas de mes y año
  },
};
@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss'],
  providers : [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  standalone: true,
  imports: [MatGridListModule,MatFormFieldModule
    ,MatDialogModule,MatButtonModule,ReactiveFormsModule
    ,MatInputModule,MatSelectModule,MatOptionModule,FormsModule
    ,NgFor,NgClass,MatIconModule,MatChipsModule,MatAutocompleteModule,AsyncPipe
    ],
})
export class SolicitudesComponent implements OnInit{

  frmGetSolicitud: FormGroup;
  Modo: string = "N";
  botonAccion: string = "Guardar";
  tituloAccion: string = "Nueva Solicitud";
  listaDepartamentos: Departamento [] = [];
  listaCiudad: Ciudad[] = [];

  textContent: string = '';
  textareaHeight: number = 40; // Altura inicial del textarea (en píxeles)

  separatorKeysCodes: number[] = [ENTER, COMMA];
  palabraCtrl = new FormControl('');
  filtroPalabras: Observable<string[]>;
  palabras: string[] = ['Proyecto Grado'];
  allPalabras: string[] = ['Proyecto Grado', 'Software', 'Proyecto de investigación', 'Proyecto Docente',];
  palabrasClaves: PalabraClave[] = [];
  idUser : Number = 0;
  @ViewChild('palabraInput') palabraInput: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  IdUser(): Observable<Number> {
    return this.userStateService.userState$.pipe(
      map(userState => {
        if(userState.id == null){
          return 0;
        }
        return userState.id;
      })
    );
  }

  constructor(private dialogoRefencia: MatDialogRef<SolicitudesComponent>
              ,private fb: FormBuilder
              ,private _snackBar: MatSnackBar
              ,private _departamentoServicio: DepartamentoService
              ,private _ciudadServicio: CiudadService
              ,private _solicitudServicio: SolicitudService
              ,@Inject(MAT_DIALOG_DATA) public datosSolicitud: Solicitud
              ,private _ngZone: NgZone
              ,private _servicePalabra: PalabraClaveService
              ,private userStateService: UserStateService
            ){
              this.IdUser().subscribe(id => {
                this.idUser = id;
              });

              this.consecutivo = datosSolicitud.codigo;
              this.frmGetSolicitud = this.fb.group({
                codigo:[this.consecutivo,Validators.required],
                titulo:['',Validators.required],
                fecha:[new Date(),Validators.required],
                problema:['',Validators.required],
                tipoApoyo:['',Validators.required],
                nivelProblama:['',Validators.required],
                ubicacionGoogle:['Por Defecto',Validators.required],
                usuario:[this.idUser,Validators.required],
                codDepartamento:['',Validators.required],
                codCiudad:['',Validators.required],

              })

              this._ciudadServicio.getCiudades().subscribe({
                next: (data) => {
                  this.listaCiudad = data;
                },error: (e) => {}
              })

              this._departamentoServicio.getDepartamentos().subscribe({
                next: (data) => {
                  this.listaDepartamentos = data;
                },error: (e) => {}
              })

              this.filtroPalabras = this.palabraCtrl.valueChanges.pipe(
                startWith(null),
                map((fruit: string | null) => (fruit ? this._filterPalabras(fruit) : this.allPalabras.slice())),
              );
            }



  ngOnInit(): void {
    if(this.datosSolicitud && this.datosSolicitud.titulo != '' ){
      this.frmGetSolicitud.patchValue({
          id:this.datosSolicitud.id,
          codigo:this.datosSolicitud.codigo,
          titulo:this.datosSolicitud.titulo,
          fecha:this.datosSolicitud.fecha,
          problema:this.datosSolicitud.problema,
          tipoApoyo:this.datosSolicitud.tipoApoyo,
          nivelProblama:this.datosSolicitud.nivel,
          ubicacionGoogle:this.datosSolicitud.ubicacionGoogle,
          usuario:this.datosSolicitud.usuario,
          codDepartamento:this.datosSolicitud.codDepartamento,
          codCiudad:this.datosSolicitud.codCiudad,
      })

      this.botonAccion = "Actualizar";
      this.tituloAccion = "Actualizar Solicitud";
      this.Modo = "E";
      console.log(this.datosSolicitud.id);
      this.CargarPalabrasClaves(this.datosSolicitud.id);
    }
  }

  consecutivo: String = "";

  ObtenerConsecutivo(numero: number) {
    this.consecutivo = numero.toString().padStart(numero, '0');
  }

  CargarPalabrasClaves(idSolicitudPal: Number){
    this._servicePalabra.getByIdSolicitud(idSolicitudPal).subscribe({
      next: (data) => {
        this.palabrasClaves = data;
        this.palabras = [];
          for (const palabrai of this.palabrasClaves){
         this.palabras.push(palabrai.palabra.toString());
          console.log('Hola');
    }
      },
      error: (e) => {},
    });



  }

  MostrarAlertar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:4000
    });
  }



  GuardarEditarSolicitud(){
    const modelo: Solicitud = {
      id:0,
      nombreDepartamento:"",
      nombreCiudad:"",
      codigo:this.frmGetSolicitud.value.codigo,
      titulo:this.frmGetSolicitud.value.titulo,
      fecha: new Date(),
      problema:this.frmGetSolicitud.value.problema,
      tipoApoyo:this.frmGetSolicitud.value.tipoApoyo,
      ubicacionGoogle:this.frmGetSolicitud.value.ubicacionGoogle,
      nivel:this.frmGetSolicitud.value.nivelProblama,
      estado:'Pendiente',
      usuario:this.frmGetSolicitud.value.usuario,
      codDepartamento:this.frmGetSolicitud.value.codDepartamento,
      codCiudad: this.frmGetSolicitud.value.codCiudad,
    }

    if(this.datosSolicitud.titulo == '' ){
      this._solicitudServicio.add(modelo).subscribe({
        next: (data) => {
          if(this.RegistrarPalabrasClaves(data.id)){
            this.MostrarAlertar("Solicitud registrada con éxito","Listo");
            this.dialogoRefencia.close("Creado");
          }

        },error: (e) => {
          this.MostrarAlertar("No se pudo registrar la solicitud","Error");
        }
      })


    }else{

      if(this.RegistrarPalabrasClaves(this.datosSolicitud.id)){
        this._solicitudServicio.update(this.datosSolicitud.id,modelo).subscribe({
          next: (data) => {
            this.MostrarAlertar("Solicitud editada con éxito","Listo");
            this.dialogoRefencia.close("Editado");
          },error: (e) => {
            this.MostrarAlertar("No se pudo editar la solicitud","Error");
          }
        })
      }

    }

  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  EliminarPalabras(id: Number){
    this._servicePalabra.getByIdSolicitud(id).subscribe({
      next: (data) => {
        this.palabrasClaves = data;
          for (const palabrai of this.palabrasClaves){
            this._servicePalabra.delete(palabrai.id).subscribe({
              next: (data) => {
              },
              error: (e) => {},
            });
          }
      },
      error: (e) => {},
    });
  }

  RegistrarPalabrasClaves(idSolicitudSave: Number):boolean{
    this.EliminarPalabras(idSolicitudSave);

    for (const palabraItem of this.palabras){
      const modeloPal: PalabraClave = {
        id:0,
        idSolicitud: idSolicitudSave,
        palabra:palabraItem
      }

      this._servicePalabra.add(modeloPal).subscribe({
        next: (data) => {
          return true;
        },error: (e) => {
          this.MostrarAlertar("No se pudo registrar las palabras claves de la solicitud","Error");
          return false;
        }
      })
    }

    return true;
  }


  addPalabra(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.palabras.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.palabraCtrl.setValue(null);
  }

  removePalabra(fruit: string): void {
    const index = this.palabras.indexOf(fruit);

    if (index >= 0) {
      this.palabras.splice(index, 1);

      this.announcer.announce(`Removed ${fruit}`);
    }
  }

  selectedPalabra(event: MatAutocompleteSelectedEvent): void {
    this.palabras.push(event.option.viewValue);
    this.palabraInput.nativeElement.value = '';
    this.palabraCtrl.setValue(null);
  }

  private _filterPalabras(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allPalabras.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }
}
