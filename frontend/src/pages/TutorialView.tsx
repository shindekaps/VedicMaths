import React, { useState } from 'react';
import { VisualizerTemplate } from '../components/visualizer/VisualizerTemplate';
import { buildLesson1 } from '../components/visualizer/sutra1';

export function TutorialView() {
  const [n, setN] = useState(75);

  return (
    <div className="w-full h-full bg-[#0d1117] overflow-y-auto">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-6">
          <span className="text-[#f0b429] italic">Ekādhikena Pūrveṇa</span> – “By One More Than The Previous One”
        </h1>
        
        <div className="mb-6 flex gap-4 items-center text-dim">
          <label className="font-bold text-ink">Try it with:</label>
          <input 
            type="number" 
            className="bg-[#161b22] border border-[#2b3440] rounded px-3 py-1 text-white"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            min={15} max={995} step={10}
          />
        </div>

        <VisualizerTemplate 
          model={buildLesson1({ n })}
        />
      </div>
    </div>
  );
}
