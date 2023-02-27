export type TerminalMessageType = 1 | 2;

export interface TerminalMessage {
   type: TerminalMessageType;
   message: string | React.ReactNode;
   currentUser?: string | null;
}

export interface TerminalStore {
   set: (state: TerminalStore) => void;
   get: () => TerminalStore;
   clearTerminal: () => void;
   messages: {
      content: TerminalMessage[];
      set: (messages: TerminalMessage[]) => void;
      add: (message: TerminalMessage) => void;
   };
   input: {
      content: string;
      isBlocked: boolean;
      setBlock: (isBlocked: boolean) => void;
      set: (input: string) => void;
      add: (input: string) => void;
      removeLastChar: () => void;
      clear: () => void;
      history: {
         content: string[];
         currentIndex: number | null;
         clearHistory: () => void;
         setCurrentIndex: (index: number | null) => void;
         add: (input: string) => void;
         hasNext: () => boolean;
         hasPrevious: () => boolean;
         next: () => void;
         previous: () => void;
      };
   };
}
