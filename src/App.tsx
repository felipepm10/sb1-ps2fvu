import React, { useEffect } from 'react';
import axios from 'axios';
import { Layout, Loader, AlertCircle } from 'lucide-react';
import { VideoPlayer } from './components/VideoPlayer';
import { Timeline } from './components/Timeline';
import { CameraList } from './components/CameraList';
import { useCameraStore } from './store/cameraStore';
import { Camera } from './types/camera';

const DEMO_CAMERAS: Camera[] = [
  {
    url: 'http://192.168.100.101:3000/live/camera1/index.m3u8',
    key: 'camera1',
    retentionDays: 7,
  },
  {
    url: 'http://192.168.100.101:3000/live/camera2/index.m3u8',
    key: 'camera2',
    retentionDays: 10,
  },
];

function App() {
  const { selectedCamera, isLoading, error, setCameras, setLoading, setError } =
    useCameraStore();

  useEffect(() => {
    const loadCameras = async () => {
      setLoading(true);
      try {
        // Comentado temporariamente para usar as câmeras de demo
        // const response = await axios.get('http://192.168.100.101:3000/api/cameras');
        // setCameras(response.data);
        setCameras(DEMO_CAMERAS);
      } catch (err) {
        console.warn('Usando câmeras de demonstração');
        setCameras(DEMO_CAMERAS);
      } finally {
        setLoading(false);
      }
    };

    loadCameras();
  }, []);

  const mockRecordings = [
    { startTime: '2024-03-14T10:00:00', endTime: '2024-03-14T11:30:00' },
    { startTime: '2024-03-14T13:00:00', endTime: '2024-03-14T14:45:00' },
    { startTime: '2024-03-14T16:00:00', endTime: '2024-03-14T17:30:00' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="container mx-auto flex items-center gap-3">
          <Layout className="text-blue-400" size={24} />
          <h1 className="text-xl font-bold">Sistema de Monitoramento</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4 flex items-center gap-3">
            <AlertCircle className="text-red-500" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <CameraList />
          </div>

          <div className="col-span-9 space-y-4">
            {isLoading ? (
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Loader className="mx-auto mb-3 animate-spin" size={32} />
                  <p>Carregando câmeras...</p>
                </div>
              </div>
            ) : selectedCamera ? (
              <>
                <div className="bg-gray-900 rounded-lg aspect-video overflow-hidden">
                  <VideoPlayer src={selectedCamera.url} />
                </div>
                <Timeline
                  recordings={mockRecordings}
                  onTimeSelect={(time) =>
                    console.log('Tempo selecionado:', time)
                  }
                />
              </>
            ) : (
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <p>Selecione uma câmera para iniciar a visualização</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
