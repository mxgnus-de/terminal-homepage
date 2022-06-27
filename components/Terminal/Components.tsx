import { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { DEFAULT_USER, HOST, PATHNAME } from '../../config/terminal';
import useCommands from '../../hooks/useCommands';
import { usePreferences } from '../../stores/preferences';
import { terminalMessageType, useTerminal } from '../../stores/terminal';
import { TerminalMessageType } from '../../types/Terminal';

export const TerminalContainer = styled.div`
   display: flex;
   flex-direction: column;
   flex-grow: 1;
   min-width: 700px;
`;

export const TerminalMessagesContainer = styled.div`
   display: flex;
   flex-direction: column;
   gap: 1rem;
`;

interface TerminalMessageProps {
   type: TerminalMessageType;
}

export const TerminalMessage = styled.div<TerminalMessageProps>`
   height: fit-content;
   display: flex;
   flex-direction: column;
`;

interface TerminalMessageContentProps {
   type: TerminalMessageType;
}

export const TerminalMessageContent = styled.div<TerminalMessageContentProps>`
   display: flex;
   gap: 10px;
   color: ${({ type, theme }) =>
      type === terminalMessageType.ERROR
         ? theme.colors.terminal.commands.error
         : theme.colors.terminal.commands.normal};
`;

interface TerminalMessageOptionsProps {
   paddingLeft?: string;
   paddingRight?: string;
   paddingTop?: string;
   paddingBottom?: string;
   marginLeft?: string;
   marginRight?: string;
   marginTop?: string;
   marginBottom?: string;
   gap?: string;
}

const TerminalMessageOptions = styled.div<TerminalMessageOptionsProps>`
   padding-left: ${({ paddingLeft }) => paddingLeft};
   padding-right: ${({ paddingRight }) => paddingRight};
   padding-top: ${({ paddingTop }) => paddingTop};
   padding-bottom: ${({ paddingBottom }) => paddingBottom};
   margin-left: ${({ marginLeft }) => marginLeft};
   margin-right: ${({ marginRight }) => marginRight};
   margin-top: ${({ marginTop }) => marginTop};
   margin-bottom: ${({ marginBottom }) => marginBottom};
   gap: ${({ gap }) => gap};
`;

export const TerminalMessageColumn = styled(TerminalMessageOptions)`
   display: flex;
   flex-direction: column;
`;

export const TerminalMessageRow = styled(TerminalMessageOptions)`
   display: flex;
`;

export const TerminalInputWrapper = styled.div`
   display: flex;
   flex-direction: column;
   gap: 0.5rem;
   margin-top: ${({ isActive }: { isActive: boolean }) =>
      isActive ? '1.5rem' : '0'};
   padding-bottom: 4rem;
   cursor: text;
`;

export const TerminalTextarea = styled.textarea`
   position: absolute;
   left: -10000px;
`;

const TerminalInputPrefixHostWrapper = styled.div`
   display: flex;
   gap: 0.5rem;
   user-select: none;
`;

const TerminalInputPrefixHost = styled.span`
   color: ${({ theme }) => theme.colors.terminal.prefix.host};
   text-shadow: ${({ isActive }: { isActive: boolean }) =>
      isActive ? '0 0 5px #73abad;' : 'none'};
`;

const TerminalInputPrefixPathname = styled.span`
   color: ${({ theme }) => theme.colors.terminal.prefix.pathname};
`;

const blinker = keyframes`
   50% {
    opacity: 0;
  }
`;

const TerminalInputBlinker = styled.span`
   animation: ${blinker} 1s linear infinite;
`;

const TerminalInputContainer = styled.div`
   display: flex;

   &::before {
      content: '$';
      margin-right: 10px;
   }
`;

interface TerminalInputTextProps {
   existingCommand?: boolean;
   isHistory?: true;
}

const TerminalInputText = styled.span<TerminalInputTextProps>`
   color: ${({ theme, existingCommand, isHistory }) =>
      !existingCommand && !isHistory
         ? theme.colors.terminal.commands.error
         : theme.colors.terminal.commands.normal};
`;

const TerminalAutoCompleteText = styled.span`
   color: ${({ theme }) => theme.colors.terminal.autocomplete};
`;

interface TerminalGlowProps {
   pointer?: boolean;
}

export const TerminalGlow = styled(TerminalMessageOptions)<TerminalGlowProps>`
   color: #73abad;
   text-shadow: 0 0 5px #73abad;
   cursor: ${({ pointer }) => (pointer ? 'pointer' : 'default')};
`;

export const TerminalBanner = styled.pre`
   white-space: pre;
   word-wrap: break-word;
   line-height: 1;
   font-weight: bold;
`;

export function TerminalInputPrefix({
   isActive,
   currentUser,
}: {
   isActive: boolean;
   currentUser: string | null;
}) {
   return (
      <TerminalInputPrefixHostWrapper>
         <TerminalInputPrefixHost isActive={isActive}>
            {HOST.replace(DEFAULT_USER, currentUser || DEFAULT_USER)}
         </TerminalInputPrefixHost>
         <TerminalInputPrefixPathname>{PATHNAME}</TerminalInputPrefixPathname>
      </TerminalInputPrefixHostWrapper>
   );
}

export function TerminalInputHistory({
   input,
   currentUser,
}: {
   input: string;
   currentUser: string | null;
}) {
   return (
      <>
         <TerminalInputPrefix isActive={false} currentUser={currentUser} />
         <TerminalInputContainer>
            <TerminalInputText isHistory>{input}</TerminalInputText>
         </TerminalInputContainer>
      </>
   );
}

export function TerminalInput() {
   const terminal = useTerminal();
   const preferences = usePreferences();
   const commands = useCommands();
   const { cmd } = commands.formatInput(terminal.input.content);

   const autocompletedCommand = commands.autocompleteCommand(
      terminal.input.content,
   );
   const existingCommand = commands.existsCommand(cmd);

   return (
      <>
         <TerminalInputPrefix
            isActive
            currentUser={preferences.user.currentUser}
         />
         <TerminalInputContainer>
            <TerminalInputText existingCommand={existingCommand}>
               {terminal.input.content.replace(/\s/g, '\u00A0')}
            </TerminalInputText>
            <TerminalInputBlinker>█</TerminalInputBlinker>
            {autocompletedCommand?.suggestion && (
               <TerminalAutoCompleteText>
                  {autocompletedCommand.suggestion}
               </TerminalAutoCompleteText>
            )}
         </TerminalInputContainer>
      </>
   );
}
