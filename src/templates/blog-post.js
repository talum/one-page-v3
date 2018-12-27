import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'

export default ({ data }) => {
  const post = data.markdownRemark
  return (
    <Layout>
      <div className="blog">
        <SEO title={post.frontmatter.title} />
        <h1 className="heading heading--level-1">{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <div className="util--padding-tl">
          <Link to="/blog" className="heading heading--level-4">
            Back to Blog
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
