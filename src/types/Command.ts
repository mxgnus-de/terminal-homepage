import { TerminalMessage } from './Terminal';

export interface CommandArgument {
   name: string;
   description: string;
   required: boolean;
}

export interface CommandOptions {
   args?: {
      autoComplete?: false;
   };
}

export interface Command {
   name: string;
   description: string;
   args?: CommandArgument[];
   options?: CommandOptions;
   execute: (args: string[]) => Promise<TerminalMessage | null> | Promise<null> | null | TerminalMessage;
}

export interface Commands {
   [key: string]: Command;
}

export interface ShortCut {
   key: string;
   description: string;
}

export interface ShortCuts {
   [key: string]: ShortCut;
}
