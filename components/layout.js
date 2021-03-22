import { useContext } from "react"

import Link from 'next/link'
import Head from 'next/head'
import styled from '@emotion/styled'

import { ThemeContext } from 'use-theme-switcher';
import { v4 as uuidv4 } from 'uuid';

import { Sun, Moon } from 'react-feather';

import Button from '../components/button'


const StyledHeader = styled.header`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    padding: 1rem 1.5rem 1rem 1rem;
    border-bottom: 1px solid var(--bgLight);
    background: var(--bgTransparent);
    backdrop-filter: blur(var(--blurSmall));
    z-index: var(--zFixed);
    nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .leading {
            .logo {
                width: 2.5rem;
                height: 2.5rem;
                object-fit: cover;
            }
        }
        .trailing {
            ul {
                list-style-type: none;
                padding: unset;
                margin: unset;
                display: flex;
                align-items: center;
                li {
                    &:not(:last-of-type) {
                        margin-right: 1rem;
                    }
                    a, button {
                        color: var(--foregroundMid);
                        &:hover {
                            color: var(--foreground);
                        }
                    }
                    a {
                        padding: 0.5rem 0.75rem;
                        border-radius: 0.5rem;
                        transition: color var(--transitionFast), background var(--transitionFast);
                        &:hover {
                            background: var(--bgLight);
                        }
                    }
                    button {
                        padding: 0.5rem;
                    }
                }
            }
        }
    }    
`

const StyledMain = styled.main`
    top: var(--headerHeight);
    position: relative;
`


const myThemes = [
    {
        id: "theme-light",
        name: "Light",
    },
    {
        id: "theme-dark",
        name: "Dark",
    },
]


const ThemePicker = ({ theme, setTheme }) => {

    if (theme) {
        return (
            <div>
            {myThemes.map((item, index) => {
                const nextTheme = myThemes.length -1 === index ? myThemes[0].id : myThemes[index+1].id;
                
                return item.id === theme ? (
                    <div key={item.id} className={item.id}>
                    <Button
                        variant="tertiary"
                        onClick={() => setTheme(nextTheme)}
                    >
                        {item.name === 'Light'
                            ? <Moon size={20} />
                            : <Sun size={20} />
                        }
                    </Button>
                    </div>
                ) : null;
                    }
                )}
            </div>
        );
    }
    return null;
};

const Layout = ({ children }) => {

    const { theme, switchTheme } = useContext(ThemeContext);

    const navItems = [
        {
            href: 'work',
            label: 'Work',
        },
        {
            href: 'blog',
            label: 'Blog',
        },
        {
            href: 'about',
            label: 'About Me',
        },
    ]

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <StyledHeader>
                <nav>
                    <div className="leading">
                        <Link href="/"><img src="" alt="" className="logo"/></Link>
                    </div>
                    <div className="trailing">
                        <ul>
                            {navItems.map(item => (
                                <li key={uuidv4()}><Link href={item.href} passHref><a>{item.label}</a></Link></li>
                            ))}
                            <li><ThemePicker theme={theme ? theme : 'theme-light'} setTheme={switchTheme} /></li>
                        </ul>
                    </div>
                </nav>
            </StyledHeader>
            <StyledMain>
                {children}
            </StyledMain>
            {/* <footer>
                Footer
            </footer> */}
        </>
    )
}

export default Layout