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

import Layout from '../components/layout'
import { TitleLG, BodyXL } from '../components/typography'
import Timeline from '../components/timeline'
import Button from '../components/button'


const Intro = styled.section`
  padding: 8rem 0 3rem 0;
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    .prof-pic {
      width: 15rem;
      height: 15rem;
      border-radius: 50%;
      margin-bottom: 2.5rem;
      position: relative;
      overflow: hidden;
    }
    .title-subtitle {
      margin-bottom: 3.5rem;
      h1 {
        margin-bottom: 1.5rem;
      }
      p {
        color: var(--foregroundMid);
      }
    }
    .button-wrapper {
      display: flex;
      button {
        &:not(:last-of-type) {
          margin-right: 1rem;
        }
      }
    }
  }
  @media screen and (max-width: 576px) {
    padding: 4rem 0 2rem 0;
    .content {
      .prof-pic {
        width: 7.5rem;
        height: 7.5rem;
        margin-bottom: 1.5rem;
      }
      .title-subtitle {
        margin-bottom: 2rem;
        h1 {
          margin-bottom: 0.75rem;
        }
      }
      .button-wrapper {
        flex-direction: column;
        width: 100%;
        button {
          &:not(:last-of-type) {
            margin-right: unset;
            margin-bottom: 0.75rem;
          }
        }
      }
    }
  }
`

const TimelineSection = styled.section`
  padding: 3rem 0;
`


export default function Home({ content }) {

  const _ = require("lodash");    

  // Filters data so only published items are shown
  const filteredContent = content.filter(function(item){
    return item.data.published == true;
  });

  // Sorts all items by date, with most recent first (desc)
  const sortedContent = _.sortBy(filteredContent, function(o) { return new moment(o.data.timelineDate); }).reverse();

  // console.log(sortedContent)
  
  // Takes array item in and formats the date into a month using moment
  const monthName = item => moment(item.data.timelineDate, 'YYYY-MM-DD').format('MMMM YYYY');

  // Uses that month to group the array items together
  const sortedMonthResult = _.groupBy(sortedContent, monthName);

  // Converts arrays back to objects
  const arrayMonths = Object.entries(sortedMonthResult)


  const introData = {
    img: {
      src: '/images/prof-pic.jpg',
      alt: 'Austin smiling at you, albeit a bit awkwardly. Poor guy.',
    },
    title: 'Hi, I’m Austin',
    subtitle: 'I am a software designer and developer living in Houston, Texas. Currently, I am building the design system at HP and moonlighting as a front-end developer at Paper Crowns.',
    ctas: [
      {
        variant: 'primary',
        label: 'Check out my work',
        link: 'work',
      },
      {
        variant: 'secondary',
        label: 'More about me',
        link: 'about',
      },
    ]
  }

  return (
    <Layout title="Home">

      <Intro>
        <Container>
          <Row>
            <Col xs={12} md={{ span: '8', offset: '2'}}>
              <div className="content">
                <div className="prof-pic">
                  <Image layout="fill" src={introData.img.src} alt={introData.img.alt} />
                </div>
                <div className="title-subtitle">
                  <TitleLG as="h1">{introData.title}</TitleLG>
                  <BodyXL>{introData.subtitle}</BodyXL>
                </div>
                <div className="button-wrapper">
                  {introData.ctas.map(cta => (
                    <Link key={uuidv4()} href={cta.link}><Button variant={cta.variant}>{cta.label}</Button></Link>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Intro>

      <TimelineSection>
        <Container>
          <Row>
            <Col xs={12} md={{ span: '10', offset: '1'}} lg={{ span: '8', offset: '2'}} xl={{ span: '6', offset: '3'}}>
              <Timeline content={arrayMonths} />
            </Col>
          </Row>
        </Container>
      </TimelineSection>

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