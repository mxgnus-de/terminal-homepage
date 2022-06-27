import * as styled from 'styled-components';

export function GlobalStyle() {
   return (
      <>
         <Global />
         <Terminal />
      </>
   );
}

const Terminal = styled.createGlobalStyle``;

const Global = styled.createGlobalStyle`
   * {
      box-sizing: border-box;
      color: #fff;
      margin: 0;
      padding: 0;
      font-family: ${({ theme }) => theme.fonts.primary}, sans-serif;
   }

   *:focus {
      outline: none;
   }

   body {
      margin: 0;
      padding: 0;
      background-color: ${({ theme }) => theme.colors.background};
      overflow-y: auto;
   }

   html,
   body {
      min-height: 100vh;
   }

   ::selection {
      color: ${({ theme }) => theme.colors.selection.color};
      background-color: ${({ theme }) => theme.colors.selection.background};
   }

   #__next {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
   }

   li {
      list-style: none;
   }

   a {
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      font-size: 1rem;
   }

   button {
      border: none;
      background-color: transparent;
      cursor: pointer;
      font-size: 1rem;
      button:focus {
         outline: none;
      }
   }

   input {
      border: none;
      background-color: transparent;
   }

   input:focus {
      outline: none;
   }

   select {
      border: none;
      background-color: transparent;
   }

   select:focus {
      outline: none;
   }

   textarea {
      border: none;
      overflow: auto;
      outline: none;
      resize: none;
   }

   .button {
      height: auto;
      width: auto;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      border: none;
      min-width: 3rem;

      &-white {
         background-color: #000;
         color: #fff;
      }

      &-red {
         background-color: #a01c29;
         color: #e8e6e3;
      }

      &-green {
         background-color: #1a6d2d;
         color: #e8e6e3;
         border: 1px solid #28a845;
      }

      &-yellow {
         background-color: #fff000;
         color: #000000;
      }

      &-blue {
         background-color: #0054ae;
         color: #fff;
      }

      &-grey {
         background-color: #333232;
         color: #fff;
      }
   }
`;
