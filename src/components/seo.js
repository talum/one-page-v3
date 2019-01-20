import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import favicon16 from '../images/favicon16x16.png'
import favicon32 from '../images/favicon32x32.png'

import { StaticQuery, graphql } from 'gatsby'

function SEO({ description, lang, meta, keywords, title, darkMode }) {
  return (
    <StaticQuery
      query={detailsQuery}
      render={data => {
        const metaDescription =
          description || data.site.siteMetadata.description
        return (
          <Helmet
            bodyAttributes={{ class: darkMode ? `dark` : '' }}
            htmlAttributes={{
              lang,
            }}
            title={title}
            titleTemplate={`%s | ${data.site.siteMetadata.title}`}
            meta={[
              {
                name: 'description',
                content: metaDescription,
              },
              {
                property: 'og:title',
                content: title,
              },
              {
                property: 'og:description',
                content: metaDescription,
              },
              {
                property: 'og:type',
                content: 'website',
              },
              {
                name: 'twitter:card',
                content: 'summary',
              },
              {
                name: 'twitter:creator',
                content: data.site.siteMetadata.author,
              },
              {
                name: 'twitter:title',
                content: title,
              },
              {
                name: 'twitter:description',
                content: metaDescription,
              },
            ]
              .concat(
                keywords.length > 0
                  ? {
                      name: 'keywords',
                      content: keywords.join(', '),
                    }
                  : []
              )
              .concat(meta)}
            link={[
              {
                rel: 'stylesheet',
                href:
                  'https://fonts.googleapis.com/css?family=Catamaran:400,600,700',
              },
              {
                rel: 'icon',
                type: 'image/png',
                sizes: '16x16',
                href: `${favicon16}`,
              },
              {
                rel: 'icon',
                type: 'image/png',
                sizes: '32x32',
                href: `${favicon32}`,
              },
            ]}
          />
        )
      }}
    />
  )
}

SEO.defaultProps = {
  lang: 'en',
  meta: [],
  keywords: [],
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  darkMode: PropTypes.bool,
}

export default SEO

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`
