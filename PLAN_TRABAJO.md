# Plan de Trabajo

## Objetivo

Desarrollar el sitio web de `LicitaSeguro` en React + Vite para cumplir la pauta y maximizar el puntaje de la rubrica del examen, incorporando UI/UX, responsividad, accesibilidad, validaciones y consumo real de la API de Mercado Publico.

## Alcance funcional

- Homepage corporativo con acceso a los modulos principales.
- Listado de licitaciones.
- Filtros por fecha y estado.
- Vista de detalle de licitacion.
- Busqueda de proveedor por RUT.
- Manejo de errores, loaders y paginacion.

## Estado al cierre de esta sesion

- Se implemento una base funcional completa con datos mock.
- La navegacion principal, home, listado, detalle y proveedor ya existen.
- El layout general ya fue ajustado varias veces para acercarse al mockup.
- El filtro de fecha ya usa un calendario custom para evitar problemas del date picker nativo en Safari.
- La app sigue compilando correctamente con `npm run build`.
- Aun no se conecta la API real de Mercado Publico.

## Fase 1: Obtener acceso a la API

1. Ingresar a `https://api.mercadopublico.cl/modules/IniciarSesion.aspx`.
2. Iniciar sesion con `Clave Unica`.
3. Aceptar los terminos y condiciones de uso.
4. Completar la solicitud del ticket con datos reales.
5. Revisar el correo registrado y guardar el `ticket` recibido.
6. Probar manualmente una URL simple de la API con ese ticket.
7. Guardar el `ticket` en un archivo local `.env` y nunca subirlo al repositorio.

## Fase 2: Validar endpoints reales

1. Confirmar endpoint para listado de licitaciones.
2. Confirmar consulta de detalle por `codigo` de licitacion.
3. Confirmar endpoint de proveedor por RUT.
4. Verificar parametros reales: `fecha`, `estado`, `codigo`, `ticket`.
5. Documentar endpoints definitivos a usar en el proyecto.

## Fase 3: Definir arquitectura del proyecto

1. Organizar estructura base de carpetas y componentes. `Completado`
2. Definir vistas principales:
   - `Home`
   - `Licitaciones`
   - `DetalleLicitacion`
   - `Proveedor`
3. Crear capa de servicios para consumo de API. `Pendiente`
4. Crear helpers de validacion y normalizacion de datos. `Base completada, falta expandir segun API real`
5. Definir estrategia de navegacion entre vistas. `Completado con navegacion por estado`

## Fase 4: Base visual y sistema de estilos

1. Adaptar el mockup al proyecto React. `Avanzado`
2. Definir tipografias, colores y espaciados. `Avanzado`
3. Construir `Header` y `Footer` reutilizables. `Completado`
4. Dejar documentadas decisiones UI/UX para el informe.
5. Verificar consistencia visual con la identidad propuesta. `En curso`

## Fase 5: Homepage corporativo

1. Implementar hero principal. `Completado`
2. Mostrar beneficios o propuesta de valor. `Completado`
3. Crear accesos claros a licitaciones y proveedores. `Completado`
4. Asegurar adaptacion a movil, tablet y desktop. `En curso`

## Fase 6: Modulo de licitaciones

1. Construir formulario de filtros por fecha y estado. `Completado`
2. Validar correctamente los campos del formulario. `Completado en base mock`
3. Mostrar mensajes de error detallados. `Base implementada`
4. Implementar loader visible durante la carga. `Completado`
5. Consumir el endpoint real de licitaciones. `Completado`
6. Limpiar y normalizar la respuesta de la API. `Completado`
7. Mostrar estado vacio si no existen resultados. `Completado en base mock`
8. Implementar paginacion si la respuesta supera 10 elementos. `Completado`
9. Deshabilitar botones de paginacion en extremos cuando corresponda. `Completado`

## Fase 7: Detalle de licitacion

1. Navegar al detalle desde el listado. `Completado`
2. Consumir el endpoint de detalle por `codigo`. `Completado`
3. Renderizar informacion clave de forma robusta. `Completado en base mock`
4. Mostrar fallback como `--` en campos nulos o vacios. `Completado`
5. Manejar errores HTTP o de red con mensajes claros. `Pendiente`

## Fase 8: Busqueda de proveedor por RUT

1. Implementar input con formateo de RUT. `Completado`
2. Validar el RUT completo con digito verificador. `Completado`
3. Mostrar mensajes de error segun el caso:
   - campo vacio
   - formato incorrecto
   - RUT invalido
   - proveedor no encontrado
   - error de red o API
4. Consumir el endpoint real de proveedor. `Completado`
5. Mostrar datos normalizados del proveedor si existe resultado. `Completado`
6. **BUG:** Race condition al hacer clic repetido en el mismo RUT. `Pendiente`
   - El guard `isProveedorLoading` usa closure estale, permitiendo multiples requests concurrentes
   - Refactorizar con `AbortController` o bloqueo con ref para cancelar requests anteriores
   - O alternativamente, deshabilitar el boton inmediatamente con una ref en vez de state

## Fase 9: Accesibilidad y usabilidad

1. Asociar `label` a todos los campos.
2. Agregar atributos `aria-*` donde corresponda.
3. Asegurar navegacion por teclado.
4. Mantener foco visible en botones, links y controles.
5. Incorporar textos alternativos en imagenes y elementos graficos.
6. Validar contraste de colores en todo el sitio.
7. Mejorar mensajes de error para lectores de pantalla cuando aplique.

## Fase 10: Responsividad

1. Verificar comportamiento en movil.
2. Verificar comportamiento en tablet.
3. Verificar comportamiento en laptop/desktop.
4. Ajustar layout, espaciados y jerarquia visual por breakpoint.
5. Documentar decisiones responsive en comentarios y en el informe.

## Fase 11: QA contra rubrica

1. Revisar cumplimiento de UI/UX.
2. Revisar cumplimiento responsive.
3. Revisar validaciones y eventos.
4. Revisar accesibilidad.
5. Revisar consumo de endpoints y errores controlados.
6. Revisar orden y claridad del codigo fuente.

## Fase 12: Entregables finales

1. Preparar informe del examen.
2. Incluir mockups y justificacion UI/UX.
3. Documentar estructura del proyecto y pasos de ejecucion.
4. Preparar video explicativo del aplicativo.
5. Comprimir entrega en formato solicitado por la pauta.

## Proxima sesion sugerida

1. **BUG PRIORITARIO:** Arreglar race condition en busqueda de proveedor (`handleProveedorSearch` en `App.jsx:373`).
   - Al hacer clic repetido en el mismo RUT pasan multiples requests porque el guard `isProveedorLoading` depende de state de React que no se actualiza sincronamente.
   - Solucion propuesta: usar una `ref` para bloqueo inmediato + `AbortController` para cancelar requests previas.
2. Hacer QA final de responsive y accesibilidad con datos reales.
3. Verificar comportamiento real en navegador con el ticket local.
4. Ajustar mensajes y campos faltantes segun restricciones de la API.

## Checklist rapido

- [x] Ticket de API generado
- [x] Ticket guardado localmente en `.env`
- [x] Home implementado
- [x] Listado de licitaciones implementado
- [x] Filtros por fecha y estado funcionando
- [x] Paginacion funcionando
- [x] Loader funcionando
- [x] Detalle de licitacion implementado
- [x] Busqueda de proveedor por RUT implementada
- [x] Validaciones completas en base mock
- [ ] **BUG:** Race condition en busqueda de proveedor (muchos clicks al mismo RUT)
- [ ] Accesibilidad revisada
- [ ] Responsive revisado
- [ ] Informe preparado
- [ ] Video preparado
- [ ] ZIP final listo para entrega
