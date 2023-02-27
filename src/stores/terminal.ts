import create from 'zustand';
import { TerminalMessageType, TerminalStore } from '../types/Terminal';
import { usePreferences } from './preferences';

export const terminalMessageType: {
   [key: string]: TerminalMessageType;
} = {
   NORMAL: 1,
   ERROR: 2,
};

export const useTerminal = create<TerminalStore>((set, get) => {
   return {
      set: (state: TerminalStore) => set(state),
      get: () => get(),
      clearTerminal: () => {
         set({
            messages: {
               ...get().messages,
               content: [],
            },
         });
      },
      messages: {
         content: [],
         add: (message) => {
            set({
               messages: {
                  ...get().messages,
                  content: [...get().messages.content, message],
               },
            });
         },
         set: (messages) => {
            set({
               messages: {
                  ...get().messages,
                  content: messages,
               },
            });
         },
      },
      input: {
         content: '',
         isBlocked: false,
         setBlock: (isBlocked: boolean) => {
            set({
               input: {
                  ...get().input,
                  isBlocked,
               },
            });
         },
         set: (input) => {
            set({
               input: {
                  ...get().input,
                  content: input,
               },
            });
         },
         add: (input) => {
            set({
               input: {
                  ...get().input,
                  content: get().input.content + input,
               },
            });
         },
         removeLastChar: () => {
            set({
               input: {
                  ...get().input,
                  content: get().input.content.slice(0, -1),
               },
            });
         },
         clear: () => {
            set({
               input: {
                  ...get().input,
                  content: '',
               },
            });
         },
         history: {
            content: [],
            currentIndex: null,
            clearHistory: () => {
               set({
                  input: {
                     ...get().input,
                     history: {
                        ...get().input.history,
                        content: [],
                     },
                  },
               });
            },
            add: (input) => {
               set({
                  input: {
                     ...get().input,
                     history: {
                        ...get().input.history,
                        content: [input, ...get().input.history.content],
                     },
                  },
               });
            },
            setCurrentIndex: (index) => {
               set({
                  input: {
                     ...get().input,
                     history: {
                        ...get().input.history,
                        currentIndex: index,
                     },
                  },
               });
            },
            hasNext: () => {
               const history = get().input.history;
               const currentIndex = history.currentIndex;

               return currentIndex !== null || history.content.length > 0;
            },
            next: () => {
               const history = get().input.history;
               const currentIndex = history.currentIndex ?? 0;
               const historyCommand = history.content[currentIndex - 1];

               if (!history.hasNext() || !historyCommand) {
                  set({
                     input: {
                        ...get().input,
                        content: '',
                        history: {
                           ...history,
                           currentIndex: null,
                        },
                     },
                  });
                  return;
               }

               set({
                  input: {
                     ...get().input,
                     content: historyCommand,
                     history: {
                        ...history,
                        currentIndex: currentIndex - 1,
                     },
                  },
               });
            },
            hasPrevious: () => {
               const history = get().input.history;
               const currentIndex = history.currentIndex ?? 0;

               return currentIndex < history.content.length;
            },
            previous: () => {
               const history = get().input.history;
               const currentIndex = history.currentIndex ?? -1;
               const historyCommand = history.content[currentIndex + 1];

               if (!history.hasPrevious() || !historyCommand) return;

               set({
                  input: {
                     ...get().input,
                     content: historyCommand,
                     history: {
                        ...history,
                        currentIndex: currentIndex + 1,
                     },
                  },
               });
            },
         },
      },
   };
});
