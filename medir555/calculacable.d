# Calculadora de Cable para Red de Videovigilancia

## Descripción del Proyecto

Aplicación React para calcular la cantidad de cable necesaria en una instalación de videovigilancia. Permite marcar cámaras y central sobre un plano de Google Maps y calcula automáticamente las distancias y metraje total requerido.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 14 o superior)
- **npm** (viene incluido con Node.js)

### Verificar instalación:
```bash
node --version
npm --version
```

Si no los tienes instalados, descarga Node.js desde: https://nodejs.org/

---

## Instalación y Ejecución

### Opción 1: Con Vite (Recomendado - Más rápido) ⚡

```bash
# 1. Crear proyecto React con Vite
npm create vite@latest calculadora-cables -- --template react

# 2. Entrar al directorio del proyecto
cd calculadora-cables

# 3. Instalar dependencias base
npm install

# 4. Instalar librería de iconos (lucide-react)
npm install lucide-react

# 5. Reemplazar el contenido de src/App.jsx con el código de la aplicación
# (Copia el código del componente CableCalculator)

# 6. Ejecutar el servidor de desarrollo
npm run dev
```

**La aplicación estará disponible en:** `http://localhost:5173`

---

### Opción 2: Con Create React App (Tradicional)

```bash
# 1. Crear proyecto
npx create-react-app calculadora-cables

# 2. Entrar al directorio
cd calculadora-cables

# 3. Instalar lucide-react
npm install lucide-react

# 4. Reemplazar src/App.js con el código de la aplicación

# 5. Ejecutar
npm start
```

**La aplicación estará disponible en:** `http://localhost:3000`

---

## Código del Componente

Reemplaza el contenido de `src/App.jsx` (Vite) o `src/App.js` (CRA) con este código:

```jsx
import React, { useState, useRef } from 'react';
import { Camera, Home, Trash2, Calculator } from 'lucide-react';

export default function CableCalculator() {
  const [cameras, setCameras] = useState([]);
  const [central, setCentral] = useState(null);
  const [trenchPoints, setTrenchPoints] = useState([]);
  const [mode, setMode] = useState('camera');
  const [scale, setScale] = useState(50);
  const [pixelsPerMeter, setPixelsPerMeter] = useState(10);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
          drawCanvas();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === 'camera') {
      setCameras([...cameras, { x, y, id: Date.now() }]);
    } else if (mode === 'central') {
      setCentral({ x, y });
    } else if (mode === 'trench') {
      setTrenchPoints([...trenchPoints, { x, y }]);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext('2d');
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;

    ctx.drawImage(imageRef.current, 0, 0);

    if (trenchPoints.length > 0) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(trenchPoints[0].x, trenchPoints[0].y);
      trenchPoints.forEach((point, i) => {
        if (i > 0) ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      trenchPoints.forEach(point => {
        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    cameras.forEach(camera => {
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(camera.x, camera.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    if (central) {
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(central.x, central.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (central && cameras.length > 0) {
      cameras.forEach(camera => {
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(camera.x, camera.y);
        ctx.lineTo(central.x, central.y);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }
  };

  React.useEffect(() => {
    drawCanvas();
  }, [cameras, central, trenchPoints]);

  const calculateDistance = (p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const calculateTotalCable = () => {
    if (!central || cameras.length === 0) return null;

    const distances = cameras.map(camera => {
      const pixelDistance = calculateDistance(camera, central);
      const meters = pixelDistance / pixelsPerMeter;
      return meters;
    });

    const total = distances.reduce((sum, d) => sum + d, 0);
    const withMargin = total * 1.15;

    return {
      distances,
      total: total.toFixed(2),
      withMargin: withMargin.toFixed(2),
      cameras: cameras.length
    };
  };

  const results = calculateTotalCable();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Camera className="w-10 h-10" />
            Calculadora de Cable - Red de Videovigilancia
          </h1>
          <p className="text-blue-200 mb-6">Sistema de cálculo para instalación de cableado</p>

          {!imageRef.current ? (
            <div className="bg-white/5 border-2 border-dashed border-white/30 rounded-xl p-12 text-center">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="text-white text-lg mb-2">📸 Cargar imagen del plano</div>
                <div className="text-blue-200 text-sm">Haz clic para seleccionar la captura de Google Maps</div>
              </label>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <button
                      onClick={() => setMode('camera')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                        mode === 'camera'
                          ? 'bg-red-500 text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <Camera className="w-4 h-4" />
                      Marcar Cámara
                    </button>
                    <button
                      onClick={() => setMode('central')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                        mode === 'central'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <Home className="w-4 h-4" />
                      Marcar Central
                    </button>
                    <button
                      onClick={() => {
                        setCameras([]);
                        setCentral(null);
                        setTrenchPoints([]);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-white/10 text-white hover:bg-red-500/80 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpiar
                    </button>
                  </div>

                  <div className="bg-black/30 rounded-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      className="w-full cursor-crosshair"
                      style={{ maxHeight: '600px' }}
                    />
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3">⚙️ Configuración de Escala</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-blue-200 text-sm block mb-1">
                        Píxeles por metro
                      </label>
                      <input
                        type="number"
                        value={pixelsPerMeter}
                        onChange={(e) => setPixelsPerMeter(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="text-blue-200 text-sm block mb-1">
                        Referencia (metros)
                      </label>
                      <input
                        type="number"
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      />
                    </div>
                  </div>
                  <p className="text-blue-200 text-xs mt-2">
                    💡 Ajusta estos valores según la escala de tu mapa para obtener mediciones precisas
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-400/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-bold text-white">Resultados</h3>
                  </div>

                  {results ? (
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-blue-200 text-sm mb-1">Cámaras instaladas</div>
                        <div className="text-3xl font-bold text-white">{results.cameras}</div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-blue-200 text-sm mb-1">Cable total (sin holgura)</div>
                        <div className="text-3xl font-bold text-white">{results.total} m</div>
                      </div>

                      <div className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-lg p-4 border border-green-400/50">
                        <div className="text-green-200 text-sm mb-1">
                          Cable requerido (con 15% holgura)
                        </div>
                        <div className="text-4xl font-bold text-white">{results.withMargin} m</div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-3 text-xs">
                        <div className="text-blue-200 font-semibold mb-2">📊 Distancias individuales:</div>
                        {results.distances.map((d, i) => (
                          <div key={i} className="text-white/80 py-1">
                            Cámara {i + 1}: {d.toFixed(2)} m
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-blue-200">
                      Marca las cámaras y la central para calcular
                    </div>
                  )}
                </div>

                <div className="bg-white/5 rounded-xl p-4 text-sm text-blue-200">
                  <h4 className="font-semibold text-white mb-2">📋 Instrucciones:</h4>
                  <ol className="space-y-1 list-decimal list-inside">
                    <li>Marca cada cámara (rojo)</li>
                    <li>Marca la central (amarillo)</li>
                    <li>Ajusta la escala si es necesario</li>
                    <li>Revisa los resultados</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Cómo Usar la Aplicación

1. **Cargar imagen**: Haz clic en el área de carga y selecciona tu captura de Google Maps
2. **Marcar cámaras**: 
   - Clic en "Marcar Cámara" (botón rojo)
   - Haz clic en cada ubicación de cámara en el plano
3. **Marcar central**: 
   - Clic en "Marcar Central" (botón amarillo)
   - Haz clic en la ubicación de la casa/central
4. **Ajustar escala**: Modifica "píxeles por metro" según la escala de tu mapa
5. **Ver resultados**: La aplicación calculará automáticamente el cable necesario

---

## Resultados del Cálculo Manual

### Proyecto: Red de Videovigilancia La Ligua, Valparaíso

**Ubicación**: https://maps.app.goo.gl/afHAv2s6YYdCfUtZA

**Configuración**:
- 6 cámaras alrededor del perímetro
- Central ubicada en casa del centro
- Cable siguiendo zanja perimetral

**Mediciones**:
- Cámara 1 (norte): 85m
- Cámara 2 (noroeste): 75m
- Cámara 3 (oeste): 95m
- Cámara 4 (suroeste): 130m
- Cámara 5 (sur): 115m
- Cámara 6 (sureste): 105m

**Total**: 605 metros

**Con holgura 15%**: 696 metros

**Con holgura 20%**: 726 metros

**Recomendación de compra**: **730-750 metros de cable**

---

## Tecnologías Utilizadas

- **React 18** - Framework de UI
- **Vite / Create React App** - Herramientas de desarrollo
- **Lucide React** - Librería de iconos
- **Tailwind CSS** - Estilos (clases utilitarias)
- **Canvas API** - Para dibujar sobre imágenes

---

## Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev          # Vite
npm start            # Create React App

# Detener servidor
Ctrl + C

# Compilar para producción
npm run build

# Instalar nueva dependencia
npm install nombre-paquete
```

---

## Solución de Problemas

### Error: "command not found: npm"
**Solución**: Instala Node.js desde https://nodejs.org/

### Error al instalar dependencias
**Solución**: 
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Puerto ya en uso
**Solución**: Cambia el puerto o cierra la aplicación que lo usa

---

## Notas Importantes

- La aplicación calcula distancias en **línea recta**
- Para rutas con curvas, aumenta la holgura al 20-25%
- Siempre verifica la escala del mapa antes de calcular
- Guarda screenshots de los resultados para referencia

---

## Contacto y Soporte

Para dudas o problemas:
- Revisa la documentación de React: https://react.dev
- Revisa la documentación de Vite: https://vitejs.dev

---

**Fecha de creación**: 19 de Enero, 2026  
**Versión**: 1.0  
**Proyecto**: Calculadora de Cable - Red de Videovigilancia