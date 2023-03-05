import React, { Fragment } from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import Seo from '../components/seo'

const publicationsList = [
  {
    title: 'Polygon',
    url: 'https://www.polygon.com/',
    featured: [
      {
        title: "The refreshing cockiness of Mythic Quest's Poppy Li",
        url: 'https://www.polygon.com/22698659/mythic-quest-poppy-li-appreciation'
      }
    ],
  },
  {
    title: 'Shenandoah',
    url: 'https://shenandoahliterary.org/',
    featured: [
      {
        title: "An American Name",
        url: 'https://shenandoahliterary.org/711/an-american-name/',
        awards: ['Nominated for the Pushcart Prize 2021', 'Notable in Best American Essays 2022']
      }
    ],
  },
  {
    title: 'Bustle',
    url: 'https://www.bustle.com/authors/1151-tracy-lum',
    featured: [
      {
        title: "Other Shows Love 'Downton Abbey' As Much As You",
        url: 'https://www.bustle.com/articles/131216-downton-abbey-gets-as-much-love-from-other-tv-series-as-it-does-from-fans'
      },
      {
        title: "9 Reasons You'll Absolutely Love Ross Poldark",
        url: 'https://www.bustle.com/articles/96970-ross-poldark-is-the-ultimate-period-drama-gentleman-here-are-9-reasons-hes-your-next-big'
      },
    ],
  },
  {
    title: 'Entropy Magazine',
    url: 'https://entropymag.org/',
    featured: [
      {
        title: 'What to Love About Love Island',
        url: 'https://entropymag.org/what-to-love-about-love-island/'
      },
    ],
  },
  {
    title: 'Journal of Compressed Creative Arts',
    url: 'http://matterpress.com/',
    featured: [
      {
        title: 'The Old Lady',
        url: 'http://matterpress.com/journal/2021/03/18/cnf-the-old-lady/'
      },
    ],
  },
  {
    title: 'HerStry',
    url: 'https://herstryblg.com/',
    featured: [
      {
        title: 'Crafting My Way Toward Accomplishment',
        url: 'https://herstryblg.com/true/2021/3/25/crafting-my-way-toward-accomplishment',
        awards: ['Nominated for the Best of Net 2021']
      },
    ],
  },
  {
    title: 'Feed',
    url: 'https://feedlitmag.com/',
    featured: [
      {
        title: 'Fei Mui',
        url: 'https://feedlitmag.com/2021/09/11/issue-2-20/'
      },
    ],
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
    <Seo title="Writing" />
    <h1 className="heading heading--level-1 util--text-align-c util--padding-bxxl">
      Writing
    </h1>
    <p>
      In my free time, I like to write! Here are some places I've been published. To read other things by me, check out my <Link to={'/blog'}>blog</Link>.
    </p>
    {publicationsList.map((publication, i) => (
      <div key={i} className="module module--newsy util--padding-bxl">
        <div className="module__head flex-container flex-align-items-center flex-justify-content-space-between">
          <h2 className="heading heading--level-3 util--padding-bm">
            { publication.title }
          </h2>
          <h3 className=" heading heading--level-5 util--display-inline util--padding-bm">
            [<a
              href={publication.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Link
            </a>]
          </h3>
        </div>
        <div className="module__body">
          { !!publication.featured.length &&
            <Fragment>
              <h3>Featured</h3>
              <ul>
                {publication.featured.map(({title, url, forthcoming = false, awards = []}) => {
                  if (!forthcoming) {
                    return <li>
                      <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
                      { awards.length > 0 && ` *${awards.join(', ')}` }
                      </li>
                  } else {
                    return <li>{title}
                      { awards.length > 0 && ` *${awards.join(', ')}` }</li>
                  }
                })}
              </ul>
            </Fragment>
          }
        </div>
      </div>
    ))}
  </Layout>
)

export default Writing
