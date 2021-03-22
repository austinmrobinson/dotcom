import { useContext } from "react"

import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from "next/router";
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
            display: flex;
            align-items: center;
            .logo {
                padding: 0.25rem;
                border-radius: 0.25rem;
                svg {
                    width: 2rem;
                    height: 2rem;
                    fill: var(--transparent50);
                    transition: fill var(--transitionFast), opacity var(--transitionFast);
                }
                &:hover {
                    svg {
                        opacity: 0.75;
                    }
                }
            }
            .skip-nav {
                margin-left: 1rem;
                transform: translateY(-5rem);
                opacity: 0;
                color: var(--foregroundMid);
                padding: 0.5rem 0.75rem;
                border-radius: 0.5rem;
                transition: color var(--transitionFast), background var(--transitionFast);
                &:hover {
                    background: var(--bgLight);
                    color: var(--foreground);
                }
                &:focus {
                    transform: unset;
                    opacity: 1;
                }
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
                        &.active {
                            color: var(--foreground);
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

    const router = useRouter();

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
                        <Link href="/" passHref><a className="logo"><svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M26.75 0H2C0.89543 0 0 0.89543 0 2V26.5625H26.75C34.0625 26.5625 40 20.625 40 13.3125C40 6 34.0625 0 26.75 0Z"></path><path d="M0 2.85723V38.0001C0 39.1046 0.895431 40.0001 2 40.0001H36.9822C38.0959 40.0001 38.6536 38.6536 37.8661 37.8662L20 20.0001L0.58 0.590088V0.590088C0.209346 0.947905 0 1.44098 0 1.95616V2.85723Z"></path></svg></a></Link>
                        {/* <Link href="#main-content" passHref><a className="skip-nav">Skip to navigation</a></Link> */}
                    </div>
                    <div className="trailing">
                        <ul>
                            {navItems.map(item => (
                                <li key={uuidv4()}><Link href={item.href} passHref><a className={router.pathname == `/${item.href}` ? "active" : ""}>{item.label}</a></Link></li>
                            ))}
                            <li><ThemePicker theme={theme ? theme : 'theme-light'} setTheme={switchTheme} /></li>
                        </ul>
                    </div>
                </nav>
            </StyledHeader>
            <StyledMain tabIndex="-1" id="main-content">
                {children}
            </StyledMain>
            {/* <footer>
                Footer
            </footer> */}
        </>
    )
}

export default Layout