import { KeyboardEvent, useEffect, useRef } from 'react';
import { isValidInput } from '../../helpers/terminal';
import useCommands from '../../hooks/useCommands';
import { usePreferences } from '../../stores/preferences';
import { useTerminal } from '../../stores/terminal';
import {
   TerminalContainer,
   TerminalInput,
   TerminalInputHistory,
   TerminalInputWrapper,
   TerminalMessage,
   TerminalMessageContent,
   TerminalMessagesContainer,
   TerminalTextarea,
} from './Components';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function Terminal() {
   const preferences = usePreferences();
   const terminal = useTerminal();
   const commands = useCommands();
   const terminalContainerRef = useRef<HTMLDivElement>(null);
   const terminalInputRef = useRef<HTMLInputElement>(null);
   const terminalTextareaRef = useRef<HTMLTextAreaElement>(null);

   useEffect(() => {
      preferences.loadPreferences();
      const timeout1 = setTimeout(() => {
         if (terminalTextareaRef.current) {
            terminalTextareaRef.current.focus();
         }
      }, 100);

      const executeBannerCmd = async () => {
         const letters = ['b', 'a', 'n', 'n', 'e', 'r'];
         terminal.input.setBlock(true);

         for (const letter of letters) {
            terminal.input.add(letter);
            await delay(Math.random() * 150);
         }

         await delay(Math.random() * 200);

         await executeCommand(letters.join(''));
         terminal.input.setBlock(false);
      };

      executeBannerCmd();

      return () => {
         clearTimeout(timeout1);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      const interval = setInterval(() => {
         if (terminalTextareaRef.current) {
            terminalTextareaRef.current.focus();
         }
      }, 5000);

      return () => clearInterval(interval);
   }, []);

   async function executeCommand(cmd?: string) {
      const input = cmd || terminal.input.content;
      terminal.input.clear();
      const output = await commands.executeCommand(input);

      terminal.input.history.add(terminal.input.content);
      terminal.input.history.setCurrentIndex(null);

      if (output) {
         terminal.messages.add({
            message: (
               <>
                  <TerminalInputHistory
                     input={input}
                     currentUser={preferences.user.currentUser}
                  />
                  <TerminalMessageContent type={output.type}>
                     {output.message}
                  </TerminalMessageContent>
               </>
            ),
            type: output.type,
            currentUser: preferences.user.currentUser,
         });
      }

      setTimeout(() => {
         if (terminalInputRef.current) {
            terminalInputRef.current.scrollIntoView({
               behavior: 'smooth',
               block: 'center',
            });
         }
      }, 100);
   }

   function handleKeyDown(
      e: KeyboardEvent<HTMLDivElement | HTMLTextAreaElement>,
   ) {
      const isCtrl = e.ctrlKey;
      const isAlt = e.altKey;
      const isShift = e.shiftKey;
      const key = e.key.toLowerCase();

      if (key === 'backspace') {
         e.preventDefault();
         terminal.input.removeLastChar();
      } else if (key === 'enter') {
         e.preventDefault();
         executeCommand();
      } else if (key === 'tab') {
         e.preventDefault();
         const autoComplete = commands.autocompleteCommand(
            terminal.input.content,
         );

         if (autoComplete) {
            terminal.input.set(autoComplete.raw[0]);
         }
      } else if (key === 'arrowup') {
         e.preventDefault();
         terminal.input.history.previous();
      } else if (key === 'arrowdown') {
         e.preventDefault();
         terminal.input.history.next();
      } else if (key === 'c' && isCtrl) {
         e.preventDefault();
         terminal.input.clear();
      } else if (key === 'l' && isCtrl) {
         e.preventDefault();
         terminal.clearTerminal();
      } else if (!isCtrl) {
         if (terminal.input.isBlocked) return;
         if (isValidInput(e.key)) {
            const formattedInput = e.key;
            terminal.input.add(formattedInput);
         }
      }
   }

   return (
      <>
         <TerminalContainer
            ref={terminalContainerRef}
            onKeyDown={(e) => {
               if (document.activeElement === terminalTextareaRef.current)
                  return;
               else handleKeyDown(e);
            }}
            onClick={() => {
               if (terminalTextareaRef.current) {
                  terminalTextareaRef.current.focus();
               }
            }}
            tabIndex={0}
         >
            <TerminalMessagesContainer>
               {terminal.messages.content.map((message, index) => {
                  return (
                     <TerminalMessage key={index} type={message.type}>
                        {message.message}
                     </TerminalMessage>
                  );
               })}
            </TerminalMessagesContainer>
            <TerminalInputWrapper
               isActive
               ref={terminalInputRef}
               onClick={() => terminalTextareaRef.current?.focus()}
            >
               <TerminalTextarea
                  onKeyDown={handleKeyDown}
                  ref={terminalTextareaRef}
               />
               <TerminalInput />
            </TerminalInputWrapper>
         </TerminalContainer>
      </>
   );
}

export default Terminal;
