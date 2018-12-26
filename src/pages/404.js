import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>You lost?</h1>
    <p>Whoops, this page doesn't exist.</p>
  </Layout>
)

export default NotFoundPage
