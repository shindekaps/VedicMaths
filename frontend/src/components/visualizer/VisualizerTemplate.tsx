import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import './Visualizer.css';
import { speechEngine, say, shutUp, loadVoices } from '../../utils/speech';
import type { LessonModel, Frame, LineDef, LineNode, CellDef, WireDef, FlyerDef } from './types';

import { Line } from './Line';
import { WireSVG } from './WireSVG';
import { Flyer } from './Flyer';

// ---------- Main Template Component ----------

interface VisualizerProps {
  model: LessonModel;
}

export function VisualizerTemplate({ model }: VisualizerProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  const [ix, setIx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [voiceList, setVoiceList] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [rate, setRate] = useState(0.95);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    loadVoices();
    setVoiceList(speechEngine.voices);
    if (speechEngine.voices.length > 0) {
      setSelectedVoice(speechEngine.voices.indexOf(speechEngine.voice!));
    }
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoices();
        setVoiceList(speechEngine.voices);
        if (speechEngine.voices.length > 0) {
          setSelectedVoice(speechEngine.voices.indexOf(speechEngine.voice!));
        }
      };
    }
    return () => shutUp();
  }, []);

  useEffect(() => {
    setIx(0);
    setPlaying(false);
    shutUp();
  }, [model]);

  const handleStop = () => {
    setPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    shutUp();
  };

  const advance = (currentIx: number) => {
    if (currentIx >= model.frames.length - 1) {
      setPlaying(false);
      return;
    }
    setIx(currentIx + 1);
  };

  const narrateThenContinue = (currentIx: number) => {
    const gap = 550;
    if (voiceOn && speechEngine.supported) {
      say(model.frames[currentIx].cap, () => {
        timerRef.current = setTimeout(() => advance(currentIx), gap);
      });
    } else {
      const pace = model.frames.length > 14 ? 1500 : 2300;
      timerRef.current = setTimeout(() => advance(currentIx), pace);
    }
  };

  useEffect(() => {
    if (playing) {
      narrateThenContinue(ix);
    }
  }, [ix, playing]);

  const handlePlay = () => {
    if (playing) {
      handleStop();
    } else {
      setPlaying(true);
      if (ix >= model.frames.length - 1) {
        setIx(0);
      }
    }
  };

  const handleNext = () => {
    handleStop();
    if (ix < model.frames.length - 1) {
      setIx(ix + 1);
      if (voiceOn) say(model.frames[ix + 1].cap);
    }
  };

  const handlePrev = () => {
    handleStop();
    if (ix > 0) {
      setIx(ix - 1);
      if (voiceOn) say(model.frames[ix - 1].cap);
    }
  };

  const toggleVoice = () => {
    const nextState = !voiceOn;
    setVoiceOn(nextState);
    speechEngine.on = nextState;
    if (!nextState) shutUp();
    else if (model.frames.length > 0) say(model.frames[ix].cap);
  };

  const repeatVoice = () => {
    if (!voiceOn) toggleVoice();
    else say(model.frames[ix].cap);
  };

  if (!model || !model.frames || model.frames.length === 0) return null;
  const safeIx = Math.min(ix, model.frames.length - 1);
  const frame = model.frames[safeIx] || model.frames[0];
  if (!frame) return null;

  return (
    <div className="vvm-wrap text-left">
      <style>{`
        @keyframes drawWire {
          from { stroke-dashoffset: 600; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.9; }
        }
      `}</style>
      
      <div className="card max-w-[1280px] mx-auto bg-[#161b22] border border-[#2b3440] rounded-2xl p-4">
        <div className="vvm-controls mb-4 mt-0">
          <button className="vvm-btn" onClick={handlePrev} disabled={ix === 0}>◀ Back</button>
          <button className="vvm-btn primary" onClick={handlePlay}>
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
          <button className="vvm-btn" onClick={handleNext} disabled={ix >= model.frames.length - 1}>Step ▶</button>
          <button className="vvm-btn" onClick={() => { handleStop(); setIx(0); if (voiceOn) say(model.frames[0].cap); }}>↺ Reset</button>
          
          <div className="vvm-spacer"></div>
          
          <button className={`vvm-btn speak ${voiceOn ? 'on' : ''}`} onClick={toggleVoice} title={voiceOn ? 'Voiceover on' : 'Voiceover off'}>
            <span>{voiceOn ? '🔊' : '🔇'}</span>
          </button>
          <button className="vvm-btn hidden sm:block" onClick={repeatVoice} title="Read this step again">↺ Repeat step</button>
          
          <div className="vgroup hidden md:flex">
            <select 
              value={selectedVoice} 
              onChange={(e) => { 
                setSelectedVoice(Number(e.target.value)); 
                speechEngine.voice = voiceList[Number(e.target.value)];
                if (voiceOn) say(frame.cap);
              }}
              disabled={!speechEngine.supported}
              className="max-w-[140px]"
            >
              {voiceList.map((v, i) => (
                <option key={i} value={i}>{v.name}</option>
              ))}
            </select>
          </div>
          <span className="vvm-pill hidden sm:inline-block">{`step ${ix + 1} / ${model.frames.length}`}</span>
        </div>

        <div className="vvm-split">
          <div>
            <div className="vvm-board" ref={boardRef}>
              <WireSVG wires={frame.wires || []} containerRef={boardRef} />
              
              <div className="vvm-sheet">
                {frame.lines.map((l, i) => (
                  <Line key={l.id} def={l} isNew={true} />
                ))}
              </div>

              {(frame.flyers || []).map((f, i) => (
                <Flyer key={i} def={f} containerRef={boardRef} />
              ))}
            </div>
          </div>

          <div className="vvm-log">
            <h3 className="m-0 mb-3 text-[11px] tracking-widest uppercase text-[#5b6672]">Working out</h3>
            <div className="vvm-logbody">
              {model.frames.slice(0, ix + 1).map((f, i) => 
                f.log.map(([k, html], j) => (
                  <div key={`${i}-${j}`} className={`vvm-lrow in ${k === 'sum' ? 'sum' : ''} ${i === ix ? 'new' : ''}`}>
                    {k && k !== 'sum' && <span className="vvm-lk">{k}.</span>}
                    <span dangerouslySetInnerHTML={{__html: html}}></span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="vvm-progress mt-4">
          <i style={{ width: `${((ix + 1) / model.frames.length) * 100}%` }}></i>
        </div>
      </div>
    </div>
  );
}
