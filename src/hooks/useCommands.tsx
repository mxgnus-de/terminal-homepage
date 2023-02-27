import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Children } from 'react';
import {
   TerminalBanner,
   TerminalGlow,
   TerminalMessageColumn,
   TerminalMessageRow,
} from '../components/Terminal/Components';
import {
   BANNER,
   DEFAULT_USER,
   DISCORD_PROFILE,
   EMAIL,
   GITHUB_PAGE,
   GITHUB_USERNAME,
} from '../config/terminal';
import { usePreferences } from '../stores/preferences';
import { useTerminal, terminalMessageType } from '../stores/terminal';
import { Commands, ShortCuts } from '../types/Command';
import { TerminalMessage, TerminalStore } from '../types/Terminal';
import useGithub from './useGithub';

function useCommands() {
   const terminal = useTerminal();
   const preferences = usePreferences();
   const github = useGithub();
   const router = useRouter();

   const shortCuts: ShortCuts = {
      clearTerminal: {
         key: 'ctrl+l',
         description: 'Clear the terminal',
      },
      clearInput: {
         key: 'ctrl+c',
         description: 'Clear the input',
      },
      autocomplete: {
         key: 'tab',
         description: 'Trigger autocompletion',
      },
      historyPrevious: {
         key: 'arrowUp',
         description: 'Go to previous command',
      },
      historyNext: {
         key: 'arrowDown',
         description: 'Go to next command',
      },
   };

   const registeredCommands: Commands = {
      help: {
         name: 'help',
         description: 'Show this help message',
         execute: async (args: string[]) => {
            return {
               type: terminalMessageType.NORMAL,
               message: (
                  <TerminalMessageColumn
                     marginLeft='20px'
                     marginTop='10px'
                     gap='2.5px'
                  >
                     <TerminalMessageRow>Available commands</TerminalMessageRow>
                     {Children.toArray(
                        Object.keys(registeredCommands)
                           .sort()
                           .map((cmd) => {
                              const command = getCommand(cmd);
                              return (
                                 <>
                                    <TerminalMessageColumn>
                                       <TerminalMessageRow>
                                          <TerminalGlow
                                             pointer
                                             onClick={() =>
                                                terminal.input.set(cmd)
                                             }
                                          >
                                             {cmd}
                                          </TerminalGlow>
                                          : {command.description}
                                       </TerminalMessageRow>
                                       {command.args && (
                                          <TerminalMessageColumn>
                                             {Children.toArray(
                                                command.args.map((arg) => {
                                                   return (
                                                      <>
                                                         <TerminalMessageRow
                                                            marginLeft='20px'
                                                            marginTop='5px'
                                                         >
                                                            <TerminalGlow
                                                               pointer
                                                               onClick={() => {
                                                                  terminal.input.set(
                                                                     `${cmd} ${arg.name}`,
                                                                  );
                                                               }}
                                                            >
                                                               - {arg.name} (
                                                               {arg.required
                                                                  ? 'required'
                                                                  : 'optional'}
                                                               )
                                                            </TerminalGlow>
                                                            : {arg.description}
                                                         </TerminalMessageRow>
                                                      </>
                                                   );
                                                }),
                                             )}
                                          </TerminalMessageColumn>
                                       )}
                                    </TerminalMessageColumn>
                                 </>
                              );
                           }),
                     )}

                     <TerminalMessageColumn marginTop='30px' gap='2.5px'>
                        <TerminalMessageRow marginBottom='5px'>
                           Shortcuts
                        </TerminalMessageRow>
                        {Children.toArray(
                           Object.keys(shortCuts)
                              .sort()
                              .map((shortcut) => {
                                 return (
                                    <>
                                       <TerminalMessageRow>
                                          <TerminalGlow>
                                             {shortCuts[shortcut].key}
                                          </TerminalGlow>
                                          : {shortCuts[shortcut].description}
                                       </TerminalMessageRow>
                                    </>
                                 );
                              }),
                        )}
                     </TerminalMessageColumn>
                  </TerminalMessageColumn>
               ),
            };
         },
      },
      clear: {
         name: 'clear',
         description: 'Clear the terminal',
         execute: async (args: string[]) => {
            terminal.clearTerminal();

            return null;
         },
      },
      github: {
         name: 'github',
         description: 'Open my GitHub profile page',
         args: [
            {
               name: 'repos',
               description: 'Shows all my public repos',
               required: false,
            },
         ],
         execute: async (args: string[]) => {
            if (!args.length) {
               window.open(GITHUB_PAGE, '_blank');

               return {
                  type: terminalMessageType.NORMAL,
                  message: (
                     <TerminalMessageColumn>
                        <span>
                           Opening GitHub profile page...{' '}
                           <FontAwesomeIcon icon={faGithub as IconProp} />
                        </span>
                        <span>
                           Doesn&apos;t work? Try{' '}
                           <Link href={GITHUB_PAGE} passHref>
                              <TerminalGlow pointer>this link</TerminalGlow>
                           </Link>
                        </span>
                     </TerminalMessageColumn>
                  ),
               };
            }

            if (args[0] === 'repos') {
               return {
                  type: terminalMessageType.NORMAL,
                  message: (
                     <TerminalMessageColumn gap='5px' marginTop='5px'>
                        {Children.toArray(
                           github.repositories.map((repo) => {
                              const isFork = repo.fork;
                              const originalRepo = isFork
                                 ? github.forkedRepositories.find(
                                      (r) => r.id === repo.id,
                                   )?.parent || null
                                 : null;

                              return (
                                 <>
                                    <TerminalMessageRow marginLeft='20px'>
                                       <TerminalGlow
                                          pointer
                                          onClick={() =>
                                             window.open(
                                                repo.html_url,
                                                '_blank',
                                             )
                                          }
                                       >
                                          - {repo.name}{' '}
                                       </TerminalGlow>
                                       {isFork && (
                                          <TerminalMessageRow marginLeft='5px'>
                                             (forked from
                                             <TerminalGlow
                                                marginLeft='5px'
                                                pointer
                                                onClick={() => {
                                                   originalRepo?.html_url &&
                                                      window.open(
                                                         originalRepo.html_url,
                                                         '_blank',
                                                      );
                                                }}
                                             >
                                                {originalRepo?.full_name ||
                                                   'unknown'}
                                             </TerminalGlow>
                                             )
                                          </TerminalMessageRow>
                                       )}
                                       :{' '}
                                       {repo.description || 'No description 😢'}
                                    </TerminalMessageRow>
                                 </>
                              );
                           }),
                        )}
                     </TerminalMessageColumn>
                  ),
               };
            } else {
               return unknownArgumentError('github', args[0], terminal);
            }
         },
      },
      sudo: {
         name: 'sudo',
         description: 'Execute a command as root',
         args: [
            {
               name: 'command',
               description: 'The command to execute',
               required: true,
            },
         ],
         options: {
            args: {
               autoComplete: false,
            },
         },
         execute: async (args: string[]) => {
            const [command, ...commandArgs] = args;
            if (preferences.user.currentUser !== 'root') {
               return {
                  type: terminalMessageType.ERROR,
                  message: (
                     <>
                        Permission denied:{' '}
                        {preferences.user.currentUser || DEFAULT_USER} is not in
                        the sudoers file
                     </>
                  ),
               };
            } else if (!args.length || !command) {
               return noArgumentError('sudo', terminal);
            }

            if (!existsCommand(command)) {
               return unknownCommandError(command, terminal);
            }

            const result = await executeCommand(
               `${command} ${commandArgs.join(' ')}`,
            );

            if (!result) {
               return null;
            }

            return {
               type: result.type,
               message: result.message,
            };
         },
      },
      adduser: {
         name: 'adduser',
         description: 'Add a new user',
         args: [
            {
               name: 'username',
               description: 'The username of the new user',
               required: true,
            },
         ],
         options: {
            args: {
               autoComplete: false,
            },
         },
         execute: async (args: string[]) => {
            const username = args[0];

            if (!args.length || !username) {
               return noArgumentError('adduser', terminal);
            }

            const user = preferences.addUser(username);

            if (user !== null) {
               return {
                  type: terminalMessageType.ERROR,
                  message: user,
               };
            }

            return {
               type: terminalMessageType.NORMAL,
               message: (
                  <>
                     User <TerminalGlow>&apos;{username}&apos;</TerminalGlow>{' '}
                     added successfully.
                  </>
               ),
            };
         },
      },
      deluser: {
         name: 'deluser',
         description: 'Delete a user',
         args: [
            {
               name: 'username',
               description: 'The username of the user to delete',
               required: true,
            },
         ],
         options: {
            args: {
               autoComplete: false,
            },
         },
         execute: async (args: string[]) => {
            const username = args[0];

            if (!args.length || !username) {
               return noArgumentError('deluser', terminal);
            }

            const user = preferences.removeUser(username);

            if (user !== null) {
               return {
                  type: terminalMessageType.ERROR,
                  message: user,
               };
            }

            return {
               type: terminalMessageType.NORMAL,
               message: (
                  <>
                     User <TerminalGlow>&apos;{username}&apos;</TerminalGlow>{' '}
                     deleted successfully.
                  </>
               ),
            };
         },
      },
      su: {
         name: 'su',
         description: 'Switch to a different user',
         args: [
            {
               name: 'username',
               description: 'The username of the user to switch to',
               required: true,
            },
         ],
         options: {
            args: {
               autoComplete: false,
            },
         },
         execute: async (args: string[]) => {
            const username = args[0];

            if (!args.length || !username) {
               return noArgumentError('su', terminal);
            }

            const user = preferences.switchUser(username);

            if (user !== null) {
               return {
                  type: terminalMessageType.ERROR,
                  message: user,
               };
            }

            setTimeout(() => {
               terminal.input.history.clearHistory();
            }, 100);

            return {
               type: terminalMessageType.NORMAL,
               message: (
                  <>
                     You are now logged in as{' '}
                     <TerminalGlow>&apos;{username}&apos;</TerminalGlow>
                  </>
               ),
            };
         },
      },
      whoami: {
         name: 'whoami',
         description: 'Show the current user',
         execute: async () => {
            return {
               type: terminalMessageType.NORMAL,
               message: preferences.user.currentUser || DEFAULT_USER,
            };
         },
      },
      lsuser: {
         name: 'lsuser',
         description: 'List all users',
         execute: async () => {
            return {
               type: terminalMessageType.NORMAL,
               message: (
                  <TerminalMessageColumn>
                     {Children.toArray(
                        Object.keys(preferences.user.users)
                           .sort()
                           .map((user) => {
                              return (
                                 <>
                                    <TerminalMessageRow marginLeft='20px'>
                                       <TerminalGlow
                                          pointer
                                          onClick={() =>
                                             terminal.input.set(`su ${user}`)
                                          }
                                       >
                                          - {user}
                                       </TerminalGlow>
                                    </TerminalMessageRow>
                                 </>
                              );
                           }),
                     )}
                  </TerminalMessageColumn>
               ),
            };
         },
      },
      echo: {
         name: 'echo',
         description: 'Print a message',
         args: [
            {
               name: '...message',
               description: 'The message to print',
               required: true,
            },
         ],
         options: {
            args: {
               autoComplete: false,
            },
         },
         execute: async (args: string[]) => {
            if (!args.length) {
               return noArgumentError('echo', terminal);
            }

            const message = args.join(' ');

            return {
               type: terminalMessageType.NORMAL,
               message,
            };
         },
      },
      email: {
         name: 'email',
         description: 'My email address',
         execute: async () => {
            router.push(`mailto:${EMAIL}`);

            return {
               type: terminalMessageType.NORMAL,
               message: (
                  <TerminalMessageColumn gap='5px'>
                     <span>
                        Opening email client...{' '}
                        <FontAwesomeIcon icon={faEnvelope as IconProp} />
                     </span>
                     <span>
                        Doesn&apos;t work? Try{' '}
                        <Link href={`mailto:${EMAIL}`} passHref>
                           <TerminalGlow pointer>this link</TerminalGlow>
                        </Link>
                     </span>
                  </TerminalMessageColumn>
               ),
            };
         },
      },
      reboot: {
         name: 'reboot',
         description: 'Reboot the terminal',
         execute: async () => {
            if (preferences.user.currentUser !== 'root') {
               return {
                  type: terminalMessageType.ERROR,
                  message: 'Permission denied',
               };
            }

            setTimeout(() => {
               router.reload();
            }, 200);

            return {
               type: terminalMessageType.NORMAL,
               message: 'Rebooting...',
            };
         },
      },
      discord: {
         name: 'discord',
         description: 'Open my Discord profile',
         execute: async () => {
            window.open(DISCORD_PROFILE, '_blank');

            return {
               type: terminalMessageType.NORMAL,
               message: (
                  <TerminalMessageColumn gap='5px'>
                     <span>
                        Opening Discord profile...{' '}
                        <FontAwesomeIcon icon={faDiscord as IconProp} />
                     </span>
                     <span>
                        Doesn&apos;t work? Try{' '}
                        <Link href={DISCORD_PROFILE} passHref>
                           <TerminalGlow pointer>this link</TerminalGlow>
                        </Link>
                     </span>
                  </TerminalMessageColumn>
               ),
            };
         },
      },
      about: {
         name: 'about',
         description: 'About me',
         execute: async () => {
            return {
               type: terminalMessageType.NORMAL,
               message: (
                  <>
                     <TerminalMessageColumn gap='5px'>
                        <span>Hey, I&apos;m Magnus from Germany 👋</span>
                        <span>
                           I&apos;m a full-stack developer and student with a
                           passion for programming.
                        </span>
                        <span>
                           I love building things and also learning new things.
                        </span>
                        <Image
                           src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&title_color=ffffff&icon_color=006ab0&text_color=daf7dc&bg_color=101010`}
                           alt='GitHub stats'
                           width={495}
                           height={195}
                        />
                     </TerminalMessageColumn>
                  </>
               ),
            };
         },
      },
      banner: {
         name: 'banner',
         description: 'Banner',
         execute: async () => {
            return {
               type: terminalMessageType.NORMAL,
               message: (
                  <TerminalMessageColumn>
                     <TerminalBanner>{BANNER}</TerminalBanner>
                     <TerminalMessageRow gap='5px' marginTop='30px'>
                        Type{' '}
                        <TerminalGlow
                           pointer
                           onClick={() => {
                              terminal.input.set('help');
                           }}
                        >
                           &apos;help&apos;
                        </TerminalGlow>{' '}
                        to see all available commands.
                     </TerminalMessageRow>
                  </TerminalMessageColumn>
               ),
            };
         },
      },
   };

   async function executeCommand(input: string) {
      const { cmd, args } = formatInput(input);
      const command = getCommand(cmd);

      if (!existsCommand(cmd)) {
         return unknownCommandError(cmd, terminal);
      }

      const output = await command.execute(args);
      return output;
   }

   function existsCommand(cmd: string) {
      return !!getCommand(cmd);
   }

   function formatInput(input: string) {
      const [cmd, ...args] = input.split(' ');

      return {
         cmd,
         args,
      };
   }

   function getCommand(cmd: string) {
      return registeredCommands[cmd] || null;
   }

   function getCommandArgs(cmd: string) {
      const command = getCommand(cmd);

      if (!command) {
         return null;
      }

      return command.args;
   }

   function existsArgInCommand(cmd: string, arg: string) {
      const args = getCommandArgs(cmd);

      if (!args) {
         return false;
      }

      return args.some((a) => a.name === arg);
   }

   function autocompleteCommand(input: string): {
      formatted: string[] | null;
      raw: string[];
      suggestion: string | null;
   } | null {
      const { cmd, args } = formatInput(input);
      const cmds = Object.keys(registeredCommands);

      if (!cmd) {
         return {
            formatted: null,
            raw: cmds,
            suggestion: null,
         };
      }

      if (cmd && !args.length) {
         const rawAutocompleteResults = cmds
            .filter((c) => c.startsWith(cmd))
            .sort();
         const formattedAutocomplete = rawAutocompleteResults.map((c) =>
            c.replace(cmd, ''),
         );

         if (
            Object.keys(registeredCommands).length ===
               rawAutocompleteResults.length ||
            !rawAutocompleteResults.length
         )
            return null;

         if (rawAutocompleteResults[0] === cmd) return null;

         return {
            formatted: formattedAutocomplete,
            raw: rawAutocompleteResults,
            suggestion: formattedAutocomplete[0],
         };
      } else {
         const command = getCommand(cmd);
         if (!command) return null;

         const commandArgs = command.args;
         if (!commandArgs || command.options?.args?.autoComplete === false)
            return null;

         const currentArg = args[args.length - 1];

         const rawAutocompleteResults = commandArgs
            .filter((arg) => arg.name.startsWith(currentArg))
            .map((arg) => `${cmd} ${arg.name}`);

         const formattedAutocomplete = rawAutocompleteResults.map((arg) => {
            return arg.replace(cmd, '').replace(currentArg, '');
         });

         return {
            formatted: formattedAutocomplete,
            raw: rawAutocompleteResults,
            suggestion: formattedAutocomplete[0],
         };
      }
   }

   return {
      registeredCommands,
      executeCommand,
      existsCommand,
      getCommand,
      autocompleteCommand,
      formatInput,
      getCommandArgs,
      existsArgInCommand,
   };
}

function unknownCommandError(
   cmd: string,
   terminal: TerminalStore,
): TerminalMessage {
   return {
      type: terminalMessageType.ERROR,
      message: (
         <>
            Command &apos;{cmd}&apos; not found. Type{' '}
            <TerminalGlow
               pointer
               onClick={() => {
                  terminal.input.set('help');
               }}
            >
               &apos;help&apos;
            </TerminalGlow>{' '}
            for a list of commands.
         </>
      ),
   };
}

function unknownArgumentError(
   cmd: string,
   arg: string,
   terminal: TerminalStore,
): TerminalMessage {
   return {
      type: terminalMessageType.ERROR,
      message: (
         <>
            Argument &apos;{arg}&apos; not found for command &apos;{cmd}&apos;.
            Type{' '}
            <TerminalGlow
               pointer
               onClick={() => {
                  terminal.input.set('help');
               }}
            >
               &apos;help&apos;
            </TerminalGlow>{' '}
            for a list of commands with available arguments.
         </>
      ),
   };
}

function noArgumentError(
   cmd: string,
   terminal: TerminalStore,
): TerminalMessage {
   return {
      type: terminalMessageType.ERROR,
      message: (
         <>
            You havn&apos;t specify an argument for the command &apos;{cmd}
            &apos;. Type{' '}
            <TerminalGlow
               pointer
               onClick={() => {
                  terminal.input.set('help');
               }}
            >
               &apos;help&apos;
            </TerminalGlow>{' '}
            for a list of commands with available arguments.
         </>
      ),
   };
}

export default useCommands;
