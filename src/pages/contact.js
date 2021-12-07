import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

const Contact = () => (
  <Layout>
    <SEO
      title="Contact"
      meta={[{ name: 'robots', content: 'noindex, nofollow' }]}
    />
    <h1 className="heading heading--level-1 util--text-align-c util--padding-bxxl">
      Contact
    </h1>
    <p>
      If you want to get in touch, I'm more likely to respond on{' '}
      <a
        href="https://twitter.com/Tracidini"
        target="_new"
        rel="noopener noreferrer"
      >
        Twitter
      </a>
      .
    </p>
  </Layout>
)

export default Contact
