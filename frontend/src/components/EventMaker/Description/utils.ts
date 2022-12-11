import { ReactNode } from "react";

export interface ActionResult {
  value: string;
  start: number;
  end: number;
}

export type Modifier = (selection: string, cursor: string) => string;

const CURSOR_CHAR = "\u200B";
const ALL_CURSORS = new RegExp(CURSOR_CHAR, "gm");
const EMPTY_MODIFIER: Modifier = (selection) => selection;

export class Action {
  constructor(
    public content: ReactNode,
    private modifier: Modifier = EMPTY_MODIFIER,
    private saveRange = false,
  ) {}

  public run(selection: string): ActionResult {
    const modified = this.modifier(selection, CURSOR_CHAR);
    const cursorPosition = modified.indexOf(CURSOR_CHAR);
    const value = modified.replace(ALL_CURSORS, "");
    const selectionLength = selection.length;
    const valueLength = value.length;

    if (this.saveRange && selectionLength > 0) {
      const valuePosition = value.indexOf(selection);
      const start = Math.max(0, valuePosition);
      const length = valuePosition < 0 ? valueLength : selectionLength;

      return {
        value,
        start: start,
        end: start + length,
      };
    } else {
      const position = cursorPosition < 0 ? valueLength : cursorPosition;

      return {
        value,
        start: position,
        end: position,
      };
    }
  }
}
