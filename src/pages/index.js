import React from 'react'

import Layout from '../components/layout'
import Intro from '../components/intro'
import SEO from '../components/seo'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={['Tracy Lum', 'software engineer']} />
    <Intro />
  </Layout>
)

export default IndexPage
