import Link from 'next/link'

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


export default function Work ({ content }) {

    const _ = require("lodash");

    // Sorts all items by date, with most recent first (desc)
    const sortedContent = _.sortBy(content, function(o) { return new moment(o.data.timelineDate); }).reverse();

    const filteredContent = sortedContent.filter(function(item){
        return item.data.timelineType == 'Project';
    });
    
    // Takes array item in and formats the date into a year using moment
    const yearName = item => moment(item.data.timelineDate, 'YYYY-MM-DD').format('YYYY');

    // Uses that month to group the array items together
    const sortedMonthResult = _.groupBy(filteredContent, yearName);

    // Converts arrays back to objects
    const arrayMonths = Object.entries(sortedMonthResult)

    console.log(arrayMonths)

    return (
        <Layout>
            <section>
                <Container>
                    <Row>
                        <Col xs={12} md={{ span: '8', offset: '2'}}>
                            <div className="top">
                                <TitleMD as="h1">Work gallery</TitleMD>
                            </div>
                            <div className="items">
                                {arrayMonths.map(arrayMonth => (
                                    <Row key={uuidv4()}>
                                        <Col xs={12}>
                                            <div className="year"><TitleSM as="h2">{arrayMonth[0]}</TitleSM></div>
                                        </Col>
                                        {arrayMonth[1].map(item => (
                                            <Col key={uuidv4()} xs={12} md={6} lg={4}>
                                                <div className="item-top">
                                                    <img src="" alt=""/>
                                                </div>
                                                <div className="item-bottom">
                                                    <div className="title-subtitle">
                                                        <TitleXS>{item.data.title}</TitleXS>
                                                        <Body>{item.data.description}</Body>
                                                    </div>
                                                    <Link href={item.data.link}><Button variant="secondary">Visit website</Button></Link>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
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