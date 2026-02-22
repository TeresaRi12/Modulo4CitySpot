## María Teresa Rivera López
## 24000579

Lab0 Parte1-Parte2
## Parte 1 – Creación de Spots con Cámara y GPS
- Captura de foto con CameraX:
  Uso de ImageCapture para tomar fotografías.
  Almacenamiento de la imagen en almacenamiento interno.
  Manejo granular de errores de cámara (CameraClosed, HardwareIssue, etc.).

- Obtención de ubicación GPS:
  Uso de Location Services.
  Fallback a última ubicación conocida si no hay ubicación fresca.
  Validación de coordenadas antes de guardar.

- Manejo granular de errores:
  Uso de sealed classes para representar errores controlados.
  Conversión de excepciones en resultados de negocio (CreateSpotResult).
  Limpieza automática de archivos si ocurre un error.

- Persistencia con Room:
  Almacenamiento local de Spots.


## Parte 2 – liminación de Spots con Limpieza
- Eliminación coordinada :
  Borrado del registro en Room.
  Eliminación del archivo de imagen asociado en almacenamiento interno.
  Prevención de archivos huérfanos.

- Reactividad automática:
  Uso de Flow<List<SpotEntity>>.
  El mapa se actualiza automáticamente al eliminar un Spot.
  No se requiere refrescar manualmente.

- Manejo de casos límite:
  Eliminación segura si el archivo no existe.
  Prevención de inconsistencias entre base de datos y almacenamiento.

Link del video: https://youtu.be/kzzh1HhMgig


Con ayuda de IA pude agilizar parte del proyecto y la documentacion, asi como comprender mejor el funcionamiento de Android, 
al igual que su estructura al hacer una app y en que carpetas colocarlas.
