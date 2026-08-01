export type CellDef = {
  id?: string;
  text: string;
  cls?: string;
  sm?: boolean;
  pop?: boolean;
  tag?: string;
  carry?: string;
};

export type LineNode = 
  | { type: 'cell', def: CellDef }
  | { type: 'sym', text: string, big?: boolean }
  | { type: 'flow', html: string }
  | { type: 'divider' }
  | { type: 'strip', shown: number, activeRtl: number, digits: number[], carriesAt: number[], period: number }
  | { type: 'chain', vals: string[], upto: number, badLast: boolean };

export type LineDef = {
  id: string;
  label: string | null;
  nodes: LineNode[];
  muted?: boolean;
};

export type WireDef = {
  fromKey: string;
  toKey: string;
  color?: string;
};

export type FlyerDef = {
  fromKey: string;
  toKey: string;
  text: string;
};

export type Frame = {
  cap: string;
  log: [string, string][];
  lines: LineDef[];
  wires: WireDef[];
  flyers: FlyerDef[];
};

export type LessonModel = {
  title: string;
  ruleHTML: string;
  frames: Frame[];
  note?: string;
};
