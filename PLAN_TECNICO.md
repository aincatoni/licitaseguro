# Plan Tecnico de Implementacion

## Objetivo tecnico
Construir el proyecto `Licitaseguro` sobre la base actual de React + Vite, dejando una arquitectura clara, mantenible y alineada con la rubrica del examen.

## Estado actual del repo
- El proyecto ya no esta vacio: existe una base funcional en React + Vite.
- La navegacion principal sigue resuelta por estado en `App.jsx`.
- Ya existen componentes de layout, licitaciones, proveedores, mocks, hooks y utilidades base.
- El mockup externo sigue siendo la referencia visual principal para afinar UI/UX.

## Estado de avance actual
- `Header` y `Footer` ya fueron implementados y ajustados varias veces para acercarlos al mockup.
- La home ya existe con hero, tarjetas de beneficios y CTAs.
- El modulo de licitaciones ya tiene listado mock, paginacion, detalle y filtros.
- La busqueda de proveedor por RUT ya tiene validacion y resultados mock.
- El filtro de fecha ya no usa `input[type="date"]` nativo: ahora usa un calendario custom para evitar problemas de Safari.
- La vista del calendario ya permite cambiar mes y año, incluyendo una vista interna de seleccion de años.
- `npm run build` compila correctamente con la base actual.

## Arquitectura propuesta

### Estructura sugerida
```text
src/
  assets/
  components/
    layout/
      Header.jsx
      Footer.jsx
      PageContainer.jsx
    common/
      Loader.jsx
      EmptyState.jsx
      ErrorState.jsx
      Pagination.jsx
      StatusBadge.jsx
    licitaciones/
      LicitacionFilters.jsx
      LicitacionCard.jsx
      LicitacionList.jsx
      LicitacionDetail.jsx
    proveedores/
      ProveedorSearchForm.jsx
      ProveedorResultCard.jsx
  data/
    mockData.js
  hooks/
    usePagination.js
  services/
    mercadoPublicoApi.js
  utils/
    date.js
    rut.js
    text.js
    licitaciones.js
  App.jsx
  App.css
  index.css
  main.jsx
```

## Estrategia de navegacion
- Si no se instala `react-router-dom`, se puede partir con navegacion controlada por estado en `App.jsx`.
- Si el tiempo lo permite, conviene migrar a rutas reales para separar mejor las vistas.

### Opcion minima
- `home`
- `licitaciones`
- `detalle`
- `proveedor`

### Estado minimo en `App.jsx`
- `currentView`
- `selectedLicitacionCode`

## Archivos base a intervenir

### `src/App.jsx`
Responsabilidades:
- Orquestar la navegacion entre vistas.
- Mantener estado global minimo de navegacion.
- Pasar callbacks hacia los modulos.

Cambios esperados:
- Reemplazar el `h1` inicial por el shell principal de la app.
- Integrar `Header`, `Footer` y el contenedor de vistas.

### `src/index.css`
Responsabilidades:
- Reset base.
- Variables de color.
- Tipografia global.
- Estilos de accesibilidad:
  - foco visible
  - helpers para lectores de pantalla
  - contraste minimo

### `src/App.css`
Responsabilidades:
- Estilos de layout general.
- Secciones visuales del homepage.
- Tarjetas, formularios, badges, paginacion y vistas de detalle.
- Breakpoints responsive comentados.

## Componentes a construir

### Layout

#### `components/layout/Header.jsx`
Debe incluir:
- Logo o nombre `LicitaSeguro`.
- Navegacion principal.
- Botones para ir a `Inicio`, `Licitaciones`, `Buscar proveedor`.
- Estado visual de vista activa.

Accesibilidad:
- `nav` con `aria-label`.
- Botones o links con foco visible.

#### `components/layout/Footer.jsx`
Debe incluir:
- Texto institucional breve.
- Referencia a fuente de datos: Mercado Publico / ChileCompra.

### Comunes

#### `components/common/Loader.jsx`
Debe resolver:
- Spinner reutilizable.
- Mensaje opcional.
- `aria-live="polite"` o `role="status"`.

#### `components/common/EmptyState.jsx`
Debe mostrar:
- Sin resultados.
- Respuesta vacia.
- Texto contextual segun modulo.

#### `components/common/ErrorState.jsx`
Debe mostrar:
- Error de red.
- Error del servidor.
- Error por respuesta invalida.

#### `components/common/Pagination.jsx`
Debe resolver:
- Paginas de 10 elementos.
- Botones `anterior` y `siguiente`.
- Deshabilitar extremos.
- Navegacion por teclado.

#### `components/common/StatusBadge.jsx`
Debe mapear:
- Estados de licitacion a color + texto.
- Fallback para estado desconocido.

## Modulo Home

### Vista objetivo
- Presentacion corporativa.
- Hero principal.
- Tarjetas de beneficios.
- CTAs a los modulos evaluados.

### Implementacion sugerida
- Puede quedar directamente como componente `HomeView` dentro de `App.jsx` o en un archivo dedicado si crece mucho.
- Debe ser la vista mas simple y reutilizar el layout general.

## Modulo de Licitaciones

### Componentes

#### `components/licitaciones/LicitacionFilters.jsx`
Responsabilidades:
- Input de fecha.
- Select de estado.
- Boton buscar.
- Boton limpiar.
- Validaciones visibles.

Validaciones requeridas:
- Fecha obligatoria si se decide exigirla.
- Estado valido si viene informado.
- Mensajes debajo del campo.

Accesibilidad:
- `label` asociado.
- `aria-invalid` cuando aplique.
- `aria-describedby` enlazando errores.

#### `components/licitaciones/LicitacionCard.jsx`
Responsabilidades:
- Mostrar resumen de licitacion.
- Boton `Ver detalle`.
- Mostrar codigo, organismo, fecha y estado.

#### `components/licitaciones/LicitacionList.jsx`
Responsabilidades:
- Renderizar resultados paginados.
- Delegar cada item a `LicitacionCard`.

#### `components/licitaciones/LicitacionDetail.jsx`
Responsabilidades:
- Mostrar detalle completo.
- Fallbacks para campos vacios.
- Boton para volver al listado.

### Flujo tecnico del listado
1. Usuario completa filtros.
2. Se valida el formulario.
3. Se activa loader.
4. Se llama al servicio API.
5. Se limpia la respuesta.
6. Se actualiza lista total.
7. Se calcula paginacion.
8. Se renderiza error o estado vacio si corresponde.

## Modulo de Proveedores

### Componentes

#### `components/proveedores/ProveedorSearchForm.jsx`
Responsabilidades:
- Input de RUT.
- Formateo en tiempo real.
- Validacion de digito verificador.
- Boton buscar.

Casos de error a manejar:
- Campo vacio.
- RUT con formato incompleto.
- RUT invalido.
- Error de red.
- Proveedor no encontrado.

#### `components/proveedores/ProveedorResultCard.jsx`
Responsabilidades:
- Mostrar razon social y datos del proveedor.
- Fallback seguro si faltan campos.

## Servicios y helpers

### `services/mercadoPublicoApi.js`
Debe contener funciones puras para consumo de API:

```js
getLicitaciones({ fecha, estado, ticket })
getLicitacionByCodigo({ codigo, ticket })
getProveedorByRut({ rut, ticket })
```

Responsabilidades:
- Armar URL.
- Ejecutar `fetch`.
- Controlar `response.ok`.
- Parsear JSON.
- Lanzar errores semanticos.

Manejo de errores esperado:
- `400`: parametros invalidos.
- `401/403`: ticket invalido o sin permisos.
- `404`: recurso no encontrado.
- `500+`: servidor no disponible.
- Error de red.

### `utils/rut.js`
Funciones sugeridas:
```js
formatRut(value)
cleanRut(value)
isValidRut(value)
normalizeRutForQuery(value)
```

### `utils/date.js`
Funciones sugeridas:
```js
formatDateToApi(dateInput)
formatDateForDisplay(dateValue)
```

### `utils/text.js`
Funciones sugeridas:
```js
sanitizeText(value)
fallbackText(value, emptyValue = '--')
```

### `utils/licitaciones.js`
Funciones sugeridas:
```js
mapLicitacionSummary(item)
mapLicitacionDetail(item)
mapEstadoLabel(estado)
mapEstadoColor(estado)
```

## Datos mock temporales

### `data/mockData.js`
Uso recomendado:
- Permitir avanzar visualmente aunque el ticket todavia no exista.
- Desactivar cuando el consumo real quede funcionando.

## Paginacion

### `hooks/usePagination.js`
Responsabilidades:
- Calcular paginas.
- Entregar subset actual.
- Permitir moverse entre paginas.

API sugerida:
```js
const {
  currentPage,
  totalPages,
  paginatedItems,
  goToPage,
  nextPage,
  prevPage,
  canNext,
  canPrev,
} = usePagination(items, 10)
```

## Accesibilidad: requisitos tecnicos concretos
- Todos los `input`, `select` y botones deben ser alcanzables por teclado.
- Los errores de formularios deben anunciarse con `aria-live` cuando sea necesario.
- Los loaders deben usar `role="status"`.
- Las tarjetas clickeables deben evitar patrones ambiguos: mejor boton explicito.
- Los colores de estado deben acompañarse de texto, no solo color.
- Las secciones principales deben usar jerarquia semantica: `header`, `main`, `section`, `footer`.

## Responsividad: estrategia tecnica

### Breakpoints sugeridos
- `mobile`: base
- `tablet`: `min-width: 768px`
- `desktop`: `min-width: 1024px`
- `wide`: `min-width: 1280px`

### Ajustes esperados
- Header apilado o compacto en movil.
- Formularios en una columna en movil, dos columnas en tablet/desktop.
- Tarjetas del home en grid adaptable.
- Detalle de licitacion en bloques verticales en movil.

## Variables de entorno

### Archivo esperado
`.env`

### Variable sugerida
```env
VITE_MERCADO_PUBLICO_TICKET=tu_ticket_aqui
```

### Consumo esperado
```js
const ticket = import.meta.env.VITE_MERCADO_PUBLICO_TICKET
```

## Orden de implementacion recomendado
1. Ajustar la experiencia final del calendario custom y rematar detalles finos de UI.
2. Implementar `services/mercadoPublicoApi.js`.
3. Conectar listado de licitaciones al endpoint real.
4. Conectar detalle por `codigo` al endpoint real.
5. Conectar busqueda de proveedor por RUT al endpoint real.
6. Incorporar `Loader`, `ErrorState` y manejo de respuestas vacias con datos reales.
7. Revisar accesibilidad completa del flujo real.
8. Revisar responsive final en movil, tablet y desktop.
9. Documentar decisiones tecnicas y visuales para informe y video.

## Proxima sesion recomendada
1. Revisar si el calendario custom ya esta suficientemente solido en mobile y desktop.
2. Crear `src/services/mercadoPublicoApi.js` con funciones base:
   - `getLicitaciones`
   - `getLicitacionByCodigo`
   - `getProveedorByRut`
3. Crear estrategia de fallback entre datos mock y API real segun disponibilidad del `ticket`.
4. Integrar primero el listado real de licitaciones y luego detalle/proveedor.

## Criterios de termino tecnico
- La app compila con `npm run build`.
- No hay errores de ESLint bloqueantes.
- Home, listado, detalle y proveedor funcionan.
- Se manejan errores y respuestas vacias.
- Hay paginacion real con mas de 10 elementos.
- El RUT se valida correctamente.
- La interfaz responde bien en movil, tablet y desktop.
- La base del codigo queda lista para documentar en informe y video.
