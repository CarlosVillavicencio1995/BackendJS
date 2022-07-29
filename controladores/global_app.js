'use strict';
//fragamentos
class GlobalApp {
    //config globals
    static link = '';
    static imprimir_logs = true;
    static tiempo_eliminar_archivo = 150000; //milisegundos
    static domain = "api";
    static notificaion_WhatsApp = false;
    //errors
    static mensaje_error_servidor = "Ocurrió un problema, intente más tarde.";  
    static mensaje_success = "Consulta exitosa";
    static mensaje_info = "Mensaje informativo";
    static mensaje_warning = "Mensaje de adventencia";
    static mensaje_error_404 = "Ruta no encontrada";
    static mensaje_credenciales_invalidas = "Credenciales inválidas.";
    static mensaje_usuario_iniciado_sesion = "Bienvenido";
    static mensaje_guardar_ok = "Información guardada con éxito";
    static mensaje_guardar_no = "No se pudo guardar la información";
    static mensaje_actualizar_ok = "Información actalizada con éxito";
    static mensaje_actualizar_no = "No se pudo actalizar la información";
    static mensaje_usuario_registrado = "Este usuario ya esta registrado";
    static mensaje_archivo_no = "No se ha enviado una imagen";
    static mensaje_consulta = "Consulta exitosa";
  

    //tipo de peticion
    static tipo_success = "success";
    static tipo_error = "error";
    static tipo_info = "info";
    static tipo_warning = "warning";

}
module.exports = GlobalApp;