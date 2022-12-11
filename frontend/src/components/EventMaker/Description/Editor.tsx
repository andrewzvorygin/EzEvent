import React, { useRef } from "react";
import clsx from "clsx";

import classes from "./Editor.module.scss";
import { Action } from "./utils";

interface EditorProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const formatLines = (
  string: string,
  formatter: (value: string, index: number, array: string[]) => string
) => string.split(/\n/g).map(formatter).join("\n");

const noop = () => {};

const groupActions: Action[][] = [
  [
    new Action("H1", (selection) => `# ${selection}`),
    new Action("H2", (selection) => `## ${selection}`),
    new Action("H3", (selection) => `### ${selection}`),
    new Action("H4", (selection) => `#### ${selection}`),
    new Action("H5", (selection) => `##### ${selection}`),
    new Action("H6", (selection) => `###### ${selection}`),
  ],
  [
    new Action("I", (selection, cursor) => `*${selection}${cursor}*`, true),
    new Action("B", (selection, cursor) => `**${selection}${cursor}**`, true),
    new Action("S", (selection, cursor) => `~~${selection}${cursor}~~`, true),
  ],
  [
    new Action("Quote", (selection, cursor) => `> ${selection}${cursor}`),
    new Action("URL", (selection, cursor) => `[${selection}](${cursor})`),
    new Action("Image", (selection, cursor) => `![${selection}](${cursor})`),
  ],
  [
    new Action("UL", (selection) =>
      formatLines(selection, (value) => `- ${value}`)
    ),
    new Action("OL", (selection) =>
      formatLines(selection, (value, index) => `${index + 1}. ${value}`)
    ),
  ],
];

const Editor: React.FC<EditorProps> = ({
  className,
  value = "",
  onChange = noop,
}) => {
  const textarea = useRef<HTMLTextAreaElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const handleClick = (action: Action) => {
    const { current: element } = textarea;
    if (element !== null) {
      const start = element.selectionStart;
      const end = element.selectionEnd;
      const result = action.run(element.value.slice(start, end));

      element.setRangeText(result.value, start, end);
      element.dispatchEvent(new Event("change", { bubbles: true }));
      element.focus();
      element.setSelectionRange(start + result.start, start + result.end);
    }
  };

  return (
    <div className={clsx(classes.root, className)}>
      {groupActions.length > 0 && (
        <div className={classes.toolbar}>
          {groupActions.map((actions, index) => (
            <div className={classes.group} key={index}>
              {actions.map((action, index) => (
                <button
                  className={classes.button}
                  type="button"
                  onClick={() => handleClick(action)}
                  key={index}
                >
                  {action.content}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
      <div className={classes.wrapper}>
        <textarea
          className={classes.textarea}
          value={value}
          onChange={handleChange}
          ref={textarea}
        ></textarea>
      </div>
    </div>
  );
};

export default Editor;
