export const speechEngine = {
  supported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  on: true,
  voices: [] as SpeechSynthesisVoice[],
  voice: null as SpeechSynthesisVoice | null,
  rate: 0.95,
  utter: null as SpeechSynthesisUtterance | null,
  token: 0
};

export function speakableText(html: string) {
  let t = html;
  t = t.replace(/<[^>]+>/g, '');
  t = t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, 'and')
    .replace(/&lt;/g, 'less than').replace(/&gt;/g, 'greater than');
  t = t.replace(/²/g, ' squared ');
  t = t.replace(/×/g, ' times ')
    .replace(/÷/g, ' divided by ')
    .replace(/\s+-\s+/g, ' minus ')
    .replace(/(\d)\s*[\/\\]\s*(\d)/g, '$1 over $2')
    .replace(/→\s*write/g, ', so write')
    .replace(/→/g, ' gives ')
    .replace(/✓/g, ' yes ')
    .replace(/✗/g, ' no ')
    .replace(/△/g, ' ')
    .replace(/…/g, ' and so on ')
    .replace(/\/\\/g, ' next to ')
    .replace(/=/g, ' equals ')
    .replace(/\+/g, ' plus ');
  t = t.replace(/\s*[—]\s*/g, ', ');
  t = t.replace(/ekādhika/gi, 'eka-dhika')
    .replace(/Ekādhikena Pūrveṇa/gi, 'Eka-dhikena Poor-vena')
    .replace(/Vestanam/gi, 'Ves-tanam');
  return t.replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.:!?])/g, '$1')
    .trim();
}

export function loadVoices() {
  if (!speechEngine.supported) return;
  const all = speechSynthesis.getVoices();
  if (!all.length) return;
  const rank = (v: SpeechSynthesisVoice) => {
    let s = 0;
    if (/^en/i.test(v.lang)) s += 10;
    if (/^en-(GB|IN|US)/i.test(v.lang)) s += 3;
    if (/samantha|daniel|karen|moira|rishi|veena|serena|google/i.test(v.name)) s += 5;
    if (/premium|enhanced|natural/i.test(v.name)) s += 4;
    if (v.localService) s += 1;
    return s;
  };
  speechEngine.voices = all.filter(v => /^en/i.test(v.lang)).sort((a, b) => rank(b) - rank(a));
  if (!speechEngine.voices.length) speechEngine.voices = [...all];
  if (!speechEngine.voice) speechEngine.voice = speechEngine.voices[0] || null;
}

export function say(html: string, onEnd?: () => void) {
  if (!speechEngine.supported || !speechEngine.on) { if (onEnd) onEnd(); return; }
  speechSynthesis.cancel();
  
  const text = speakableText(html);
  if (!text) { if (onEnd) onEnd(); return; }

  const myToken = ++speechEngine.token;
  const u = new SpeechSynthesisUtterance(text);
  if (speechEngine.voice) u.voice = speechEngine.voice;
  u.rate = speechEngine.rate;
  u.pitch = 1;
  u.lang = speechEngine.voice ? speechEngine.voice.lang : 'en-US';

  u.onend = () => { if (myToken === speechEngine.token && onEnd) onEnd(); };
  u.onerror = e => {
    if (e.error && !/interrupted|cancel/i.test(e.error)) console.warn('speech:', e.error);
    if (myToken === speechEngine.token && onEnd) onEnd();
  };

  speechEngine.utter = u;
  speechSynthesis.speak(u);
}

export function shutUp() {
  speechEngine.token++;
  if (speechEngine.supported) speechSynthesis.cancel();
}
