import { DefaultTheme } from 'styled-components';

const defaultTheme: DefaultTheme = {
   fonts: {
      primary: 'Monospace',
   },
   colors: {
      primary: '#E1E4E8',
      background: '#24292E',

      selection: {
         background: '#263749',
         color: '#E1E4E8',
      },
      terminal: {
         prefix: {
            host: '#32c455',
            pathname: '#ffea7f',
         },
         commands: {
            error: '#ff4d4f',
            normal: '#8dafce',
         },
         autocomplete: '#8dafce',
      },
   },
   breakpoints: {
      desktop: 1024,
      tablet: 768,
      mobile: 376,
   },
};

export default defaultTheme;
