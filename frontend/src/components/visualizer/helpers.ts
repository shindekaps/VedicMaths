import type { LineNode } from '../types';

export function cell(text: string, cls?: string, opts: any = {}): LineNode {
  return {
    type: 'cell',
    def: {
      text,
      cls,
      sm: opts.sm,
      pop: opts.pop,
      tag: opts.tag,
      carry: opts.carry,
      id: opts.id
    }
  };
}

export function sym(text: string, big?: boolean): LineNode {
  return { type: 'sym', text, big };
}

export function divider(): LineNode {
  return { type: 'divider' };
}
