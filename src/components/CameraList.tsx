import React from 'react';
import { Camera } from 'lucide-react';
import { useCameraStore } from '../store/cameraStore';

export const CameraList: React.FC = () => {
  const { cameras, selectedCamera, setSelectedCamera } = useCameraStore();

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Câmeras Disponíveis</h2>
      <div className="space-y-2">
        {cameras.map((camera) => (
          <button
            key={camera.key}
            onClick={() => setSelectedCamera(camera)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              selectedCamera?.key === camera.key
                ? 'bg-blue-500/20 text-blue-400'
                : 'hover:bg-gray-800'
            }`}
          >
            <Camera size={20} />
            <span>Câmera {camera.key}</span>
          </button>
        ))}
      </div>
    </div>
  );
};