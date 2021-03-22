import { variant } from 'styled-system'
import styled from '@emotion/styled'


const Button = styled('button')(
    {
        padding: '0.75rem 1.25rem',
        borderRadius: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'unset',
        appearance: 'unset',
        fontWeight: '600',
        transition: 'color var(--transitionFast), background var(--transitionFast), transform var(--transitionFast)',
        '&:hover': {
            transform: 'scale(1.025)',
        },
        '&:active': {
            transform: 'unset',
        }
    },
    variant({
        variants: {
            primary: {
                color: 'var(--bg)',
                bg: 'var(--foreground)',
                '&:hover': {
                    bg: 'var(--foregroundMid)',
                },
            },
            secondary: {
                color: 'var(--foreground)',
                bg: 'var(--bgLight)',
                '&:hover': {
                    bg: 'var(--bgLighter)'
                },
            },
            tertiary: {
                color: 'var(--foreground)',
                bg: 'transparent',
                '&:hover': {
                    bg: 'var(--bgLight)'
                },
            },
        }
    })
)

export default Button