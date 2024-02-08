export interface SolicitudTarea {
  id:Number,
  nombreMetodogia : String,
  codigoSolicitud: String,
  idSolicitud:Number
  tipoProducto: String,
  producto: String,
  estudiante: String,
  programa: String,
  fechaAsignacion : string,
  fechaEntrega : string,
  porcentaje:number,
  descripcion : String,
  cumplido:Boolean,
  idSolicitudMetodologiaTipoProducto:Number
  idEstudiante:Number
  idProgramaEst:Number
  idProducto:Number
  usuario:Number
}
