import { create } from 'zustand';
import { Camera } from '../types/camera';

interface CameraState {
  cameras: Camera[];
  selectedCamera: Camera | null;
  isLoading: boolean;
  error: string | null;
  setCameras: (cameras: Camera[]) => void;
  setSelectedCamera: (camera: Camera | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  cameras: [],
  selectedCamera: null,
  isLoading: false,
  error: null,
  setCameras: (cameras) => set({ cameras }),
  setSelectedCamera: (camera) => set({ selectedCamera: camera }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));