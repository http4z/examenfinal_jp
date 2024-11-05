class Proyecto {
    constructor(titulo, descripcion, completada = false, fecha_creacion = new Date(), fecha_vencimiento, prioridad = 'media', asignado_a, categoria, costo_proyecto, pagado = false) {
      this.titulo = titulo;
      this.descripcion = descripcion;
      this.completada = completada;
      this.fecha_creacion = fecha_creacion;
      this.fecha_vencimiento = fecha_vencimiento;
      this.prioridad = prioridad;
      this.asignado_a = asignado_a;
      this.categoria = categoria;
      this.costo_proyecto = costo_proyecto;
      this.pagado = pagado;
    }
  }
  
  module.exports = Proyecto;
  