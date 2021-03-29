import Image from 'next/image'
import styled from '@emotion/styled'

import { v4 as uuidv4 } from 'uuid';

import { Container, Row, Col } from 'react-bootstrap';
import { Globe, Twitter } from 'react-feather';

import Layout from '../components/layout';
import { TitleMD, TitleSM, BodyLG, Overline, Label, Title } from '../components/typography'


const AboutSection = styled.section`
    padding: var(--topSectionPadding) 0 6rem 0;
    .top {
        margin-bottom: 4.5rem;
        .selfie {
            width: 12rem;
            height: 12rem;
            border-radius: 0.75rem;
            overflow: hidden;
            position: relative;
            margin-bottom: 3rem;
        }
        .title-bio {
            h1 {
                margin-bottom: 1rem;
            }
            p {
                color: var(--foregroundMid);
            }
        }
    }
    .contact {
        h2 {
            margin-bottom: 1rem;
        }
        .cta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
            border-radius: 0.75rem;
            background: var(--bg2);
            color: unset;
            transition: background var(--transitionFast);
            &:hover {
                background: var(--bg3);
            }
            &:not(:last-of-type) {
                margin-bottom: 0.75rem;
            }
            .leading {
                color: var(--foregroundMid);
            }
        }
    }
    @media screen and (max-width: 768px) {
        .top {
            margin-bottom: 3rem;
            .selfie {
                margin-bottom: 2rem;
            }
            .title-bio {
                h1 {
                    margin-bottom: 0.75rem
                }
            }
        }
        .contact {
            h2 {
                margin-bottom: 0.75rem;
            }
            .cta {
                &:not(:last-of-type) {
                    margin-bottom: 0.5rem;
                }
            }
        }
    }
`

const About = () => {

    var birthdate = new Date("1995/12/27");
    var cur = new Date();
    var diff = cur-birthdate;
    var age = Math.floor(diff/31536000000);

    const aboutData = {
        intro: {
            img: {
                src: '/images/austin-erin-prof-pic.jpg',
                alt: 'Austin and Erin (his lovely other half) smiling at you. Erin looks so sweet, while Austin looks a tad maniacal.',
            },
            title: 'About me',
            bio: <BodyLG>I am a {age} year old dude who loves creating things. As cliche as that is, it is what sums up my passions and hobbies. My 9 to 5 hours are spent at HP in Houston, Texas working on our design system. I also work as a freelance front-end developer for Paper Crowns, an agency in the gaming space. <br/><br/> I’ve been designing all sorts of things for 10 years now, starting out with logos and graphics for a gaming team that my friend and I started. <br/><br/> My hobbies outside of design include more creative pursuits; I have been into photography for a few years now. I am still in search of the perfect chocolate shake and I regularly rant about how The Lord of the Rings (book and film) series is the greatest creative work of all time.</BodyLG>,    
        },
        contact: {
            title: 'Contact',
            ctas: [
                {
                    name: 'Email',
                    ref: 'austinrobinsondesign@gmail.com',
                    link: 'mailto:austinrobinsondesign@gmail.com'
                },
                {
                    name: 'Twitter',
                    ref: '@austinmrobinson',
                    link: 'https://twitter.com/AustinMRobinson'
                },
                {
                    name: 'LinkedIN',
                    ref: '/robinsonaustin',
                    link: 'https://www.linkedin.com/in/robinsonaustin/'
                },
            ]
        }
    }

    return (
        <Layout title="About Me">
            <AboutSection>
                <Container>
                    <Row>
                        <Col xs={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                            <div className="top">
                                <div className="selfie">
                                    <Image layout="fill" src={aboutData.intro.img.src} alt={aboutData.intro.img.alt} />
                                </div>
                                <div className="title-bio">
                                    <TitleMD as="h1">{aboutData.intro.title}</TitleMD>
                                    {aboutData.intro.bio}
                                </div>
                            </div>
                            <div className="contact">
                                <Title as="h2">{aboutData.contact.title}</Title>
                                {aboutData.contact.ctas.map(cta => (
                                    <a key={uuidv4()} className="cta" href={cta.link}>
                                        <div className="leading">
                                            <Overline>{cta.name}</Overline>
                                        </div>
                                        <div className="trailing">
                                            <Label>{cta.ref}</Label>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </AboutSection>
        </Layout>
    )
}

export default About