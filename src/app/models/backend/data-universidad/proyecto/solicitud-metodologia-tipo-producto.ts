export interface SolicitudMetodologiaTipoProducto {
  id:Number,
  nombreMetodogia : String,
  codigoSolicitud: String,
  nombreSolicitud: String,
  tipoProducto: String,
  idSolicitud:Number,
  docente: String,
  programa: String,
  fechaAsignacion : string,
  fechaEntrega : string,
  descripcion : String,
  porcentaje:number,
  cumplido:Boolean,
  fechaServidor:String,
  idSolicitudMetodologia:Number
  idTipoProducto:Number
  usuario:Number
}
