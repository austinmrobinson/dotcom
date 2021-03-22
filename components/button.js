import { variant } from 'styled-system'
import styled from '@emotion/styled'


const StyledButton = styled('button')(
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
        '.leading-icon, .trailing-icon': {
            display: 'flex',
            alignItems: 'center',
            'svg': {
                width: '1.25rem',
                height: '1.25rem'
            }
        },
        '.leading-icon': {
            marginRight: '0.5rem',
        },
        '.trailing-icon': {
            marginLeft: '0.5rem',
        },
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

const Button = ({ onClick, variant, className, leading, trailing, children }) => {
    return (
        <StyledButton variant={variant} onClick={onClick} className={className}>
            {leading && <span className="leading-icon">{leading}</span>}
            {children}
            {trailing && <span className="trailing-icon">{trailing}</span>}
        </StyledButton>
    )
}

export default Button