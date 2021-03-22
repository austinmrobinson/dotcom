import Link from 'next/link'
import Image from 'next/image'

import styled from '@emotion/styled'

import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { contentFilePaths, CONTENT_PATH } from '../utils/mdx'

import { Container, Row, Col } from 'react-bootstrap';

import Layout from '../components/layout';
import { TitleMD, TitleSM, TitleXS, Body } from '../components/typography'
import Button from '../components/button';
import { Globe, Twitter } from 'react-feather';


const WorkSection = styled.section`
    padding: var(--topSectionPadding) 0 4rem 0;
    .top {
        text-align: center;
        margin-bottom: 3rem;
    }
    .items {
        .year {
            &:not(:last-of-type) {
                margin-bottom: 1rem;
            }
            .date {
                padding: 0.75rem 0.25rem;
                border-bottom: 1px solid var(--bgLight);
                margin-bottom: 1.75rem;
            }
            .item-wrapper {
                margin-bottom: 2rem;
                .item {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    .item-top {
                        border-radius: 0.5rem;
                        overflow: hidden;
                        margin-bottom: 1.5rem;
                        min-height: 12rem;
                        position: relative;
                        background: var(--bg3);
                        img {
                            object-fit: cover;
                            object-position: top center;
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .item-bottom {
                        flex-grow: 1;
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        align-items: stretch;
                        .title-subtitle {
                            margin-bottom: 1.5rem;
                            flex-grow: 1;
                            h3 {
                                margin-bottom: 0.25rem;
                            }
                            p {
                                color: var(--foregroundMid);
                            }
                        }
                        .button-wrapper {
                            display: flex;
                            a {
                                flex-grow: 1;
                                button {
                                    width: 100%;
                                }
                            }
                            a:nth-of-type(2) {
                                margin-left: 1rem;
                            }
                        }
                    }
                }
            }
        }
    }
`

export default function Work ({ content }) {

    const _ = require("lodash");

    // Sorts all items by date, with most recent first (desc)
    // const sortedContent = _.sortBy(content, function(o) { return new moment(o.data.timelineDate); }).reverse();

    const filteredContent = content.filter(function(item){
        return item.data.timelineType == 'Project';
    });
    
    // Takes array item in and formats the date into a year using moment
    const yearName = item => moment(item.data.timelineDate, 'YYYY-MM-DD').format('YYYY');

    // Uses that month to group the array items together
    const sortedYearResult = _.groupBy(filteredContent, yearName)


    // Converts arrays back to objects
    const arrayYears = Object.entries(sortedYearResult).reverse()

    // console.log(arrayMonths)

    return (
        <Layout>
            <WorkSection>
                <Container>
                    <Row>
                        <Col xs={12}>
                            <div className="top">
                                <TitleMD as="h1">Work gallery</TitleMD>
                            </div>
                            <div className="items">
                                {arrayYears.map(arrayYear => (
                                    <Row key={uuidv4()} className="year">
                                        <Col xs={12}>
                                            <div className="date"><TitleSM as="h2">{arrayYear[0]}</TitleSM></div>
                                        </Col>
                                        {arrayYear[1].map(item => (
                                            <Col key={uuidv4()} xs={12} md={6} xl={4} className="item-wrapper">
                                                <div className="item">
                                                    <div className="item-top">
                                                        {item.data.image && <Image layout="fill" src={item.data.image} alt=""/>}
                                                    </div>
                                                    <div className="item-bottom">
                                                        <div className="title-subtitle">
                                                            <TitleXS as="h3">{item.data.title}</TitleXS>
                                                            <Body>{item.data.description}</Body>
                                                        </div>
                                                        <div className="button-wrapper">
                                                            {item.data.link && (
                                                                <a href={item.data.link} tabIndex="-1"><Button variant="secondary" leading={<Globe />}>Website</Button></a>
                                                            )}
                                                            {item.data.tweet && (
                                                                <a href={item.data.tweet} tabIndex="-1"><Button variant="tertiary" leading={<Twitter />}>See Tweet</Button></a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </WorkSection>
        </Layout>
    )
}

export function getStaticProps() {
    const content = contentFilePaths.map((filePath) => {
      const source = fs.readFileSync(path.join(CONTENT_PATH, filePath))
      const { content, data } = matter(source)
  
      return {
        content,
        data,
        filePath,
      }
    })
  
    return { props: { content } }
  }