import React from 'react'

import Layout from '../components/layout'
import Intro from '../components/intro'
import Seo from '../components/seo'

const IndexPage = () => (
  <Layout>
    <Seo title="Home" keywords={['Tracy Lum', 'software engineer']} />
    <Intro />
  </Layout>
)

export default IndexPage
