import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  ContactShadows,
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import { useDadosSaude } from '@/hooks/useDadosSaude';

/**
 * Componente do modelo glTF da silhueta
 * Carrega o modelo de /public/models/silhueta.glb e aplica materiais dinâmicos
 */
interface SilhuetaGLTFProps {
  color: string;
  autoRotate: boolean;
  position: [number, number, number];
  scale: number;
}

const SilhuetaGLTF: React.FC<SilhuetaGLTFProps> = ({ color, autoRotate, position, scale }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Carregar o modelo glTF - certifique-se que o arquivo está em public/models/
  const { scene } = useGLTF('/models/silhueta.glb');
  
  // Clone da cena para evitar conflitos de materiais
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  // Aplicar cor dinâmica ao material
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // Criar uma cópia do material para evitar afetar outras instâncias
        const material = child.material.clone();
        
        if (Array.isArray(child.material)) {
          // Material múltiplo
          child.material = child.material.map(mat => {
            const clonedMat = mat.clone();
            if (clonedMat instanceof THREE.MeshStandardMaterial) {
              clonedMat.color.set(color);
              clonedMat.roughness = 0.4;
              clonedMat.metalness = 0.2;
              clonedMat.emissive.set(color);
              clonedMat.emissiveIntensity = 0.1;
            }
            return clonedMat;
          });
        } else if (material instanceof THREE.MeshStandardMaterial) {
          // Material único
          material.color.set(color);
          material.roughness = 0.4;
          material.metalness = 0.2;
          material.emissive.set(color);
          material.emissiveIntensity = 0.1;
          child.material = material;
        }
      }
    });
  }, [color, clonedScene]);

  // Animação de rotação automática contínua
  useFrame((state) => {
    if (meshRef.current && autoRotate) {
      // Rotação suave em torno do eixo Y
      meshRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <primitive object={clonedScene} scale={scale} />
    </group>
  );
};

/**
 * Componente de Loading personalizado
 */
const LoadingComponent: React.FC = () => (
  <Html center>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #f97316',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '10px'
      }} />
      <p style={{ margin: 0, color: '#666' }}>Carregando modelo 3D...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </Html>
);

/**
 * Componente principal App
 * Demonstra o uso completo da silhueta 3D com controles
 */
const SilhuetaDemo: React.FC = () => {
  const { dadosSaude } = useDadosSaude();
  const [materialColor, setMaterialColor] = useState('#f97316');
  const [autoRotate, setAutoRotate] = useState(true);
  
  // Controles de posicionamento
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([0, -1, 0]);
  const [modelScale, setModelScale] = useState(0.5);
  const [cameraDistance, setCameraDistance] = useState(8);

  // Calcular cor baseada no IMC se dados disponíveis
  useEffect(() => {
    if (dadosSaude?.imc) {
      const imc = dadosSaude.imc;
      if (imc < 18.5) setMaterialColor('#3b82f6'); // Azul - Abaixo do peso
      else if (imc < 25) setMaterialColor('#10b981'); // Verde - Normal
      else if (imc < 30) setMaterialColor('#f97316'); // Laranja - Sobrepeso
      else setMaterialColor('#ef4444'); // Vermelho - Obesidade
    }
  }, [dadosSaude?.imc]);

  const colorPalette = [
    { name: 'Laranja', value: '#f97316' },
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Verde', value: '#10b981' },
    { name: 'Roxo', value: '#8b5cf6' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Vermelho', value: '#ef4444' }
  ];

  const adjustPosition = (axis: number, value: number) => {
    const newPos: [number, number, number] = [...modelPosition];
    newPos[axis] += value;
    setModelPosition(newPos);
  };

  return (
    <div className="flex w-full h-full">
      <div className="w-64 p-4 bg-card border-r space-y-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-card-foreground">Silhueta 3D</h2>
        
        {/* Dados da Balança */}
        {dadosSaude && (
          <div className="bg-muted p-3 rounded-lg">
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Dados da Balança</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Peso:</span>
                <span className="font-bold">{dadosSaude.peso_atual_kg}kg</span>
              </div>
              <div className="flex justify-between">
                <span>Altura:</span>
                <span className="font-bold">{dadosSaude.altura_cm}cm</span>
              </div>
              <div className="flex justify-between">
                <span>IMC:</span>
                <span className="font-bold">{dadosSaude.imc?.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Controles de Posicionamento */}
        <div className="bg-muted p-3 rounded-lg">
          <h3 className="text-sm font-semibold text-card-foreground mb-2">Posição do Modelo</h3>
          
          {/* Controles X (Esquerda/Direita) */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs">Horizontal:</span>
            <div className="flex gap-1">
              <button 
                onClick={() => adjustPosition(0, -0.1)}
                className="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs"
              >
                ←
              </button>
              <span className="px-2 py-1 text-xs min-w-[3rem] text-center">
                {modelPosition[0].toFixed(1)}
              </span>
              <button 
                onClick={() => adjustPosition(0, 0.1)}
                className="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs"
              >
                →
              </button>
            </div>
          </div>

          {/* Controles Y (Cima/Baixo) */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs">Vertical:</span>
            <div className="flex gap-1">
              <button 
                onClick={() => adjustPosition(1, -0.1)}
                className="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs"
              >
                ↓
              </button>
              <span className="px-2 py-1 text-xs min-w-[3rem] text-center">
                {modelPosition[1].toFixed(1)}
              </span>
              <button 
                onClick={() => adjustPosition(1, 0.1)}
                className="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs"
              >
                ↑
              </button>
            </div>
          </div>

          {/* Controles Z (Frente/Trás) */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs">Profundidade:</span>
            <div className="flex gap-1">
              <button 
                onClick={() => adjustPosition(2, -0.1)}
                className="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs"
              >
                ↙
              </button>
              <span className="px-2 py-1 text-xs min-w-[3rem] text-center">
                {modelPosition[2].toFixed(1)}
              </span>
              <button 
                onClick={() => adjustPosition(2, 0.1)}
                className="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs"
              >
                ↗
              </button>
            </div>
          </div>

          {/* Escala */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs">Tamanho:</span>
            <div className="flex gap-1">
              <button 
                onClick={() => setModelScale(Math.max(0.1, modelScale - 0.1))}
                className="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs"
              >
                -
              </button>
              <span className="px-2 py-1 text-xs min-w-[3rem] text-center">
                {modelScale.toFixed(1)}
              </span>
              <button 
                onClick={() => setModelScale(Math.min(2, modelScale + 0.1))}
                className="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs"
              >
                +
              </button>
            </div>
          </div>

          {/* Câmera */}
          <div className="flex items-center justify-between">
            <span className="text-xs">Distância:</span>
            <div className="flex gap-1">
              <button 
                onClick={() => setCameraDistance(Math.max(3, cameraDistance - 1))}
                className="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs"
              >
                -
              </button>
              <span className="px-2 py-1 text-xs min-w-[3rem] text-center">
                {cameraDistance}
              </span>
              <button 
                onClick={() => setCameraDistance(Math.min(15, cameraDistance + 1))}
                className="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs"
              >
                +
              </button>
            </div>
          </div>

          {/* Botão Reset */}
          <button 
            onClick={() => {
              setModelPosition([0, -1, 0]);
              setModelScale(0.5);
              setCameraDistance(8);
            }}
            className="w-full mt-2 py-1 px-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs"
          >
            Resetar Posição
          </button>
        </div>
        
        <div>
          <button 
            onClick={() => setAutoRotate(!autoRotate)}
            className="w-full py-2 px-4 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {autoRotate ? 'Pausar Rotação' : 'Iniciar Rotação'}
          </button>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 text-card-foreground">Cor do Material</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {colorPalette.map((color) => (
              <button
                key={color.value}
                onClick={() => setMaterialColor(color.value)}
                className={`p-2 rounded text-sm transition-colors ${
                  materialColor === color.value 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 h-full relative">
        <Canvas 
          camera={{ position: [0, 0, cameraDistance], fov: 45 }} 
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true }}
          shadows
        >
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1} 
            castShadow
          />
          <directionalLight
            position={[-5, 5, -5]}
            intensity={0.4}
          />
          
          <Suspense fallback={<LoadingComponent />}>
            <SilhuetaGLTF 
              color={materialColor}
              autoRotate={autoRotate}
              position={modelPosition}
              scale={modelScale}
            />
          </Suspense>

          <OrbitControls
            enableZoom
            enablePan={false}
            maxDistance={12}
            minDistance={4}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
            target={[0, 0, 0]}
            makeDefault
          />
          
          <Environment preset="studio" />
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.5} 
            scale={6} 
            blur={2.5} 
            far={4}
            resolution={512}
          />
        </Canvas>
      </div>
    </div>
  );
};

// Função para preload do modelo - deve ser chamada em outro lugar, não aqui
export const preloadSilhuetaModel = () => {
  useGLTF.preload('/models/silhueta.glb');
};

export default SilhuetaDemo;