import { Global, css } from '@emotion/react'
import { ThemeProvider } from 'use-theme-switcher';

import 'bootstrap/dist/css/bootstrap.min.css';


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Global 
        styles={css`
          :root {
            /* Transitions */
            --transitionFast: 0.3s ease-in-out;
            --transitionMedium: 0.4s ease-in-out;
            --transitionSlow: 0.5s ease-in-out;

            /* Blurs */
            --blurSmall: 3rem;

            /* Z-Indexes */
            --zBase: 0;
            --zContainer: 1;
            --zAbsolute: 4;
            --zFixed: 6;
            --zOverlay: 8;

            /* Misc */
            --headerHeight: 4.5rem;
          }
          .theme-light {
            --bg: #EBEBEB;
            --bg2: #F3F3F3;
            --bg3: #FFFFFF;
            --bgLight: rgba(15,15,15,0.075);
            --bgLighter: rgba(15,15,15,0.125);
            --bgTransparent: rgba(background: 235,235,235,0.9);
            
            --foregroundLight: #ABABAB;
            --foregroundMid: #505050;
            --foreground: #0F0F0F;
            --transparent50: rgba(15,15,15,0.5);

            --bgOrange: rgba(205, 111, 0, 0.075);
            --foregroundOrange: #CD6F00;
            --bgBlue: rgba(51, 70, 234, 0.075);
            --foregroundBlue: #3346EA;
            --bgGreen: rgba(0, 133, 11, 0.075);
            --foregroundGreen: #00850B;
          }
          .theme-dark {
            --bg: #0F0F0F;
            --bg2: #151515;
            --bg3: #1E1E1E;
            --bgLight: rgba(255,255,255,0.075);
            --bgLighter: rgba(255,255,255,0.125);
            --bgTransparent: rgba(15,15,15,0.9);
            
            --foregroundLight: #737373;
            --foregroundMid: #919191;
            --foreground: #ffffff;
            --transparent50: rgba(255,255,255,0.5);

            --bgOrange: rgba(238, 147, 40, 0.075);
            --foregroundOrange: #EE9328;
            --bgBlue: rgba(81, 99, 253, 0.075);
            --foregroundBlue: #5163FD;
            --bgGreen: rgba(34, 180, 46, 0.075);
            --foregroundGreen: #22B42E;
          }
          * {
              box-sizing: border-box;
              &:focus {
                  outline: none;
                  border: 1px solid dashed currentColor;
              }
          }
          body {
              margin: 0;
              padding: 0;
              font-family: 'Inter', sans-serif;
              background: var(--bg);
              color: var(--foreground);
              transition: color var(--transitionFast), background var(--transitionFast);
          }
          ::selection {
            background: var(--foreground);
            color: var(--bg);
          }
          a {
              text-decoration: none;
          }
          a:hover {
              text-decoration: none;
          }
        `}
      />
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
