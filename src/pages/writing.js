import React, { Fragment } from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const publicationsList = [
  {
    title: 'Bustle',
    url: 'https://www.bustle.com/authors/1151-tracy-lum',
    featured: [],
  },
  {
    title: 'Thought Catalog',
    url: 'http://thoughtcatalog.com/tracy-lum/',
    featured: [],
  },
  {
    title: 'Little Old Lady Comedy',
    url: 'https://littleoldladycomedy.com/author/tlumwriting/',
    featured: [
      {
        title: 'What Your Face Mask Says About You This Pandemic Season',
        url: 'https://littleoldladycomedy.com/2020/03/16/what-your-face-mask-says-about-you-this-pandemic-season/'
      },
      {
        title: 'Group Party Games Repurposed for One (Quarantine Edition)',
        url: 'https://littleoldladycomedy.com/2020/04/23/group-party-games-repurposed-for-one-quarantine-edition/'
      },
    ],
  },
  {
    title: 'Hello Giggles',
    url: 'https://hellogiggles.com/love-sex/friends/time-two-besties-planned-wedding-day/',
    featured: [],
  },
  {
    title: 'Hackernoon',
    url: 'https://hackernoon.com/@tracidini',
    featured: [],
  },
  {
    title: 'dev.to',
    url: 'https://dev.to/talum',
    featured: [],
  },
  {
    title: 'Medium',
    url: 'https://medium.com/@tracidini',
    featured: [],
  },
  {
    title: 'Flatiron Labs Blog',
    url: 'https://medium.com/flatiron-labs',
    featured: [],
  },
]

const Writing = () => (
  <Layout>
    <SEO title="Writing" />
    <h1 className="heading heading--level-1 util--text-align-c util--padding-bxxl">
      Writing
    </h1>
    <p>
      In my free time, I like to write! Here are some places I've been published. To read other things by me, check out my <Link to={'/blog'}>blog</Link>. I am currently working on a memoir about how I went from publishing to coding, so stay tuned for more details!
    </p>
    {publicationsList.map((publication, i) => (
      <div key={i} className="module module--newsy util--padding-bxl">
        <div className="module__head">
          <h2 className="heading heading--level-3 util--padding-bm">
            {publication.title}
          </h2>
        </div>
        <div className="module__body">
          <p>
            <a
              href={publication.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {publication.url}
            </a>
          </p>
          { !!publication.featured.length &&
            <Fragment>
              <h3>Featured</h3>
              <ul>
                {publication.featured.map(({title, url}) => (
                  <li><a href={url} target="_blank" rel="noopener noreferrer">{title}</a></li>
                ))}
              </ul>
            </Fragment>
          }
        </div>
      </div>
    ))}
  </Layout>
)

export default Writing
