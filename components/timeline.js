import { useState } from 'react'

import Image from 'next/image'
import { variant } from 'styled-system'
import { AnimatePresence, motion } from "framer-motion"
import styled from '@emotion/styled'

import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { Star, Briefcase, Plus, Link, ChevronDown } from 'react-feather';

import { TitleSM, TitleXS, Caption } from '../components/typography'


const Type = styled('div')(
    {
        width: '4rem',
        height: '4rem',
        borderRadius: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: '0',
        '@media screen and (max-width: 576px)': {
          width: '3rem',
          height: '3rem',
          'svg': {
            width: '1.25rem',
            height: '1.25rem',
          }
        }
    },
    variant({
        prop: 'type',
        variants: {
            Life: {
                color: 'var(--foregroundOrange)',
                bg: 'var(--bgOrange)',
            },
            Project: {
                color: 'var(--foregroundGreen)',
                bg: 'var(--bgGreen)',
            },
            Job: {
                color: 'var(--foregroundBlue)',
                bg: 'var(--bgBlue)',
            },
        }
    })
)

const StyledTimelineItem = styled.div`
    display: flex;
    .leading {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 1.5rem;
        &:after {
            content: '';
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            width: 0.125rem;
            height: 100%;
            background: var(--bgLight);
            border-radius: 1px;
        }
    }
    .trailing {
        margin-bottom: 2rem;
        .top {
            margin-top: 0.75rem;
            margin-bottom: 1rem;
            h2, p {
                margin: 0;
            }
            h2 {
                margin-bottom: 0.25rem;
            }
            .project-date {
              display: flex;
              p {
                color: var(--transparent50);
                display: flex;
                align-items: center;
              }
              span {
                font-size: 0.625rem;
                margin: 0 0.25rem;
              }
            }
        }
        .info-card {
            background: var(--bg3);
            transition: background var(--transitionFast);
            padding: 1.25rem;
            border-radius: 1rem;
            display: flex;
            align-items: center;
            .card-leading {
                position: relative;
                flex-shrink: 0;
                width: 9.25rem;
                height: 9.25rem;
                border-radius: 0.75rem;
                background: var(--bg2);
                box-shadow: 0 0.25rem 1.25rem rgba(15,15,15,0.05);
                margin-right: 1.25rem;
                overflow: hidden;
                img {
                  object-position: top center;
                  object-fit: cover;
                }
            }
            .card-trailing {
                .card-trailing-top {
                  h4 {
                    margin-bottom: 0.5rem;
                  }
                  p {
                    color: var(--foregroundMid);
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;  
                    overflow: hidden;
                    margin-bottom: 0;
                    transition: color var(--transitionFast);
                  }
                }
                .card-trailing-bottom {
                  margin-top: 0.75rem;
                  a {
                    color: var(--foreground);
                    transition: color var(--transitionFast);
                    display: flex;
                    align-items: center;
                    border-radius: 0.5rem;
                    svg {
                      margin-right: 0.25rem;
                    }
                    &:hover {
                      color: var(--foregroundMid);
                    }
                  }
                }
            }
        }
    }
    &:last-of-type {
      .leading {
        /* &:after {
          display: none;
        } */
      }
      .trailing {
        margin-bottom: 0.5rem;
      }
    }
    @media screen and (max-width: 576px) {
      flex-direction: column;
      .leading {
        margin: unset;
        position: relative;
        &:after {
          height: 1rem;
          margin-bottom: 0;
        }
      }
      .trailing {
        display: flex;
        flex-direction: column;
        margin-bottom: 0.5rem;
        .top {
          text-align: center;
          margin-top: 0.5rem;
          .project-date {
            justify-content: center;
          }
        }
        .info-card {
          flex-direction: column;
          .card-leading {
            width: 100%;
            margin: unset;
            margin-bottom: 1.25rem;
          }
          .card-trailing {
            .card-trailing-top {
              h4 {
                margin-bottom: 0.25rem;
              }
            }
          }
        }
        &:after {
            align-self: center;
            content: '';
            margin-top: 0.5rem;
            width: 0.125rem;
            height: 1.75rem;
            background: var(--bgLight);
            border-radius: 1px;
        }
      }
      &:last-of-type {
        .leading {
          &:after {
            display: block;
          }
        }
        .trailing {
          &:after {
            display: none;
          }
        }
      }
    }
`

const TimelineItem = ({ content, className }) => {

  const typeIcon = {
    'Life': <Star />,
    'Job': <Briefcase />,
    'Project': <Plus />
  }

  const date = moment(content.data.timelineDate).format('MMMM Do, YYYY');

  return (
    <StyledTimelineItem className={className}>
      <div className="leading">
        <Type type={content.data.timelineType}>
          {typeIcon[content.data.timelineType]}
        </Type>
      </div>
      <div className="trailing">
        <div className="top">
          <TitleXS as="h3">{content.data.timelineTitle}</TitleXS>
          <div className="project-date">
            {content.data.timelineProject && (
              <Caption as="p">{content.data.timelineProject}<span>•</span></Caption>
            )}
            <Caption as="p">{date}</Caption>
          </div>
        </div>
        {content.data.title && (
          <div className="info-card">
            {content.data.image && (
              <div className="card-leading">
                <Image layout="fill" src={content.data.image} alt={content.data.imageAlt}/>
              </div>
            )}
            <div className="card-trailing">
              <div className="card-trailing-top">
                <TitleXS as="h4">{content.data.title}</TitleXS>
                <p>{content.data.description}</p>
              </div>
              {content.data.link && (
                <div className="card-trailing-bottom">
                  <a href={content.data.link}><Link size={16} />Website</a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </StyledTimelineItem>
  )
}

const Date = styled.button`
  width: 100%;
  border: unset;
  background: unset;
  padding: 0.75rem 0.5rem 0.75rem 0.5rem;
  border-bottom: ${props => props.isOpen === true ? '1px solid var(--bgLight)' : 'none'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  transition: border var(--transitionFast);
  cursor: pointer;
  h2, svg {
    position: relative;
    z-index: 1;
    color: var(--foreground);
  }
  svg {
    transition: all var(--transitionFast);
    transform: ${props => props.isOpen === true ? 'rotate(0deg)' : 'rotate(180deg)'};
  }
  &:after {
    z-index: 0;
    content: '';
    position: absolute;
    left: -0.5rem;
    right: -0.5rem;
    top: 0;
    bottom: 0;
    border-radius: 1rem;
    background: transparent;
    transition: background var(--transitionFast);
  }
  &:hover {
    &:after {
      background: var(--bg);
    }
    border-bottom-color: transparent;
  }
  &:focus-visible {
    box-shadow: unset;
    &:after {
      box-shadow: 0 0 0 0.125rem var(--transparent50);
    }
  }
`

const StyledTimeline = styled.div`
  .month {
    padding: 0.75rem 1.25rem;
    border-radius: 1.25rem;
    background: var(--bg2);
    transition: background var(--transitionFast);
    &:not(:last-of-type) {
      margin-bottom: 1.5rem;
    }
    .items {
      margin-top: 1.75rem;
      &.single {
        .timeline-item {
          .leading {
            /* &:after {
              display: none;
            } */
          }
          .trailing {
            /* margin-bottom: unset; */
          }
        }
      }
    }
  }
  @media screen and (max-width: 576px) {
    .month {
      padding: 0.325rem 0.75rem;
      &:not(:last-of-type) {
        margin-bottom: 1.5rem;
      }
      .date {
        h2 {
          text-align: center;
        }
      }
      .items {
        &.single {
          .timeline-item {
            .leading {
              &:after {
                display: block;
              }
            }
            .trailing {
              &:after {
                display: none;
              }
            }
          }
        }
      }
    }
  }
`

const Month = ({ content }) => {

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="month">
      <Date onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}>
        <TitleSM as="h2">{content[0]}</TitleSM>
        <ChevronDown />
      </Date>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="child"
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
                open: { opacity: 1, height: "auto" },
                closed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.5 }}
            className={`items ${content[1].length === 1 ? 'single' : ''}`}>
              {content[1].map(item => (
                <TimelineItem key={item.filePath} className="timeline-item" content={item} />
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Timeline = ({ content }) => {

  return (
    <StyledTimeline>
      {content.map(content => (
        <Month content={content} key={uuidv4()} />
      ))}
    </StyledTimeline>
  )
}

export default Timeline