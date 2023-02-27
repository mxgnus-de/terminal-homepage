import 'styled-components';

declare module 'styled-components' {
   export interface DefaultTheme {
      fonts: {
         primary: string;
      };
      colors: {
         primary: string;
         background: string;

         selection: {
            background: string;
            color: string;
         };

         terminal: {
            prefix: {
               host: string;
               pathname: string;
            };
            commands: {
               error: string;
               normal: string;
            };
            autocomplete: string;
         };
      };
      breakpoints: {
         mobile: number;
         tablet: number;
         desktop: number;
      };
   }
}
