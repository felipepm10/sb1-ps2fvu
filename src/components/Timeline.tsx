import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Recording } from '../types/camera';

interface TimelineProps {
  recordings: Recording[];
  onTimeSelect: (time: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ recordings, onTimeSelect }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Linha do Tempo</h3>
      <div className="space-y-2">
        {recordings.map((recording, index) => (
          <div
            key={index}
            className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => onTimeSelect(recording.startTime)}
          >
            <div className="flex justify-between text-sm">
              <span>
                {format(new Date(recording.startTime), "dd 'de' MMMM', às' HH:mm", {
                  locale: ptBR,
                })}
              </span>
              <span className="text-gray-400">
                {format(new Date(recording.endTime), 'HH:mm')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};