import { useContext, useState, useEffect } from "react"

import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from "next/router";
import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'

import useSystemTheme from 'react-use-system-theme';

import { ThemeContext } from 'use-theme-switcher';
import { v4 as uuidv4 } from 'uuid';

import { Sun, Moon, Menu, X } from 'react-feather';

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
    transition: color var(--transitionFast) background var(--transitionFast);
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
            display: flex;
            align-items: center;
            .nav-links {
                list-style-type: none;
                padding: unset;
                margin: unset;
                display: flex;
                align-items: center;
                li {
                    margin-right: 1rem;
                    a {
                        color: var(--foregroundMid);
                        padding: 0.5rem 0.75rem;
                        border-radius: 0.5rem;
                        transition: color var(--transitionFast), background var(--transitionFast);
                        &:hover, &.active {
                            color: var(--foreground);
                            background: var(--bgLight);
                        }
                    }
                }
            }
            button {
                padding: 0.5rem;
                color: var(--foregroundMid);
                svg {
                    color: currentColor;
                }
                span {
                    display: flex;
                }
                &:hover {
                    color: var(--foreground);
                    background: var(--bgLight);
                }
            }
            .hamburger-menu {
                display: none;
            }
        }
    }
    @media screen and (max-width: 576px) {
        padding: 0.75rem 1rem 0.75rem 0.75rem;
        nav {
            .leading {
                .logo {
                    svg {
                        width: 1.75rem;
                        height: 1.75rem;
                    }
                }
            }
            .trailing {
                position: relative;
                ul:first-of-type {
                    display: none;
                }
                .hamburger-menu {
                    margin-left: 0.5rem;
                    display: flex;
                }
            }
        }
    }
`

const StyledMain = styled(motion.main)`
    top: var(--headerHeight);
    position: relative;
`

const MobileNavLinks = styled(motion.ul)`
    display: none;
    list-style-type: none;
    padding: unset;
    margin: unset;
    display: flex;
    align-items: center;
    @media screen and (max-width: 576px) {
        display: flex;
        overflow-y: hidden;
        flex-direction: column;
        align-items: center;
        z-index: var(--zFixed);
        position: fixed;
        top: calc(var(--headerHeight) + 1px);
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: calc(100vh - var(--headerHeight));
        background: var(--bg);
        /* backdrop-filter: blur(3rem) !important; */
        padding: 1rem 1rem 4.5rem 1rem;
        align-items: center;
        justify-content: center;
        /* display: ${props => props.open ? 'flex' : 'none'}; */
        li {
            margin: unset;
            display: flex;
            &:not(:last-of-type) {
                margin-bottom: 0.75rem;
            }
            a {
                color: var(--foregroundMid);
                border-radius: 0.5rem;
                font-size: 1.25rem;
                transition: color var(--transitionFast), background var(--transitionFast);
                padding: 0.75rem 1.5rem;
                &:hover, &.active {
                    color: var(--foreground);
                    background: var(--bgLight);
                }
            }
        }
    }

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

    const variants = {
        initial: { opacity: 0, rotate: 0 },
        animate: { opacity: 1, rotate: 0 },
        exit: { opacity: 0, rotate: 0 },
    }

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
                        <AnimatePresence>
                            {item.name === 'Light'
                                ? <motion.span variants={variants} initial="initial" animate="animate" exit="exit"><Moon size={20} /></motion.span>
                                : <motion.span variants={variants} initial="initial" animate="animate" exit="exit"><Sun size={20} /></motion.span>
                            }
                        </AnimatePresence>
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

const Layout = ({ children, title, description, currentURL }) => {

    const systemTheme = useSystemTheme();

    const router = useRouter();

    const [open, setOpen] = useState(false);

    useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [open]);

    const { theme, switchTheme } = useContext(ThemeContext);

    const navItems = [
        {
            href: 'work',
            label: 'Work',
        },
        // {
        //     href: 'blog',
        //     label: 'Blog',
        // },
        {
            href: 'about',
            label: 'About Me',
        },
    ]

    const fadeInUp = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 0 },
        transition: { ease: 'easeInOut', duration: 2 },
    }

    const variants = {
        initial: { opacity: 0, rotate: 0 },
        animate: { opacity: 1, rotate: 0 },
        exit: { opacity: 0, rotate: 0 },
    }

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charSet="utf-8" />

                {/* General */}
                <meta name="description" content={description} />
                <title>{title ?? "Page"} | Austin Robinson</title>

                {/* Open Graph */}
                <meta property="og:url" content={`https://www.austinmrobinson.com/${currentURL}`} key="ogurl" />
                <meta property="og:image" content="/images/meta/og-image.jpg" key="ogimage" />
                <meta property="og:site_name" content="Austin Robinson" key="ogsitename" />
                <meta property="og:title" content={title} key="ogtitle" />
                <meta property="og:description" content={description ?? "Austin Robinson's website, showing a timeline of his work, a gallery of his work, and not much else. Check it out if you want to learn more about him or if you need someone who builds apps, websites, or specializes in design systems."} key="ogdesc" />

                {/* Favicons */}
                <link rel="icon" type="image/png" href="/images/meta/favicon-16.png" sizes="16x16" />
                <link rel="icon" type="image/png" href="/images/meta/favicon-32.png" sizes="32x32" />
                <link rel="icon" type="image/png" href="/images/meta/favicon-96.png" sizes="96x96" />
            </Head>
            <StyledHeader>
                <nav>
                    <div className="leading">
                        <Link href="/" passHref><a className="logo"><svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M26.75 0H2C0.89543 0 0 0.89543 0 2V26.5625H26.75C34.0625 26.5625 40 20.625 40 13.3125C40 6 34.0625 0 26.75 0Z"></path><path d="M0 2.85723V38.0001C0 39.1046 0.895431 40.0001 2 40.0001H36.9822C38.0959 40.0001 38.6536 38.6536 37.8661 37.8662L20 20.0001L0.58 0.590088V0.590088C0.209346 0.947905 0 1.44098 0 1.95616V2.85723Z"></path></svg></a></Link>
                        {/* <Link href="#main-content" passHref><a className="skip-nav">Skip to navigation</a></Link> */}
                    </div>
                    <div className="trailing">
                        <ul className="nav-links">
                            {navItems.map(item => (
                                <li key={uuidv4()}><Link href={item.href} passHref><a className={router.pathname == `/${item.href}` ? "active" : ""}>{item.label}</a></Link></li>
                            ))}
                        </ul>
                        <ThemePicker theme={theme ? theme : 'theme-light'} setTheme={switchTheme} />
                        <div className="hamburger-menu">
                            <Button variant="tertiary" open={open} onClick={() => setOpen(!open)}>
                                <AnimatePresence>
                                    {open
                                        ? <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><X /></motion.span>
                                        : <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Menu /></motion.span>
                                    }
                                </AnimatePresence>
                            </Button>
                        </div>
                        <AnimatePresence>
                            {open && (
                                <MobileNavLinks key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {navItems.map(item => (
                                        <li key={uuidv4()}><Link href={item.href} passHref><a className={router.pathname == `/${item.href}` ? "active" : ""}>{item.label}</a></Link></li>
                                    ))}
                                </MobileNavLinks>
                            )}
                        </AnimatePresence>
                    </div>

                </nav>
            </StyledHeader>
            <StyledMain variants={fadeInUp} transition={{ ease: 'easeInOut', duration: 0.5 }} initial="initial" animate="animate" exit="exit" tabIndex="-1" id="main-content">
                {children}
            </StyledMain>
            {/* <footer>
                Footer
            </footer> */}
        </>
    )
}

export default Layout