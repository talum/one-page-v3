import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'

export default ({ data }) => {
  return (
    <Layout>
      <SEO title="Blog" />
      <h1 className="heading heading--level-1 util--text-align-c util--padding-bl">
        Blog
      </h1>
      <h4 className="heading heading--level-4 util--padding-bxxl util--text-align-c">
        {data.allMarkdownRemark.totalCount} Posts
      </h4>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <h3 className="heading heading--level-3 util--padding-bm">
            <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
          </h3>
          <h4 className="heading heading--level-4">{node.frontmatter.date}</h4>
          <p>{node.excerpt}</p>
        </div>
      ))}
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
          excerpt
          fields {
            slug
          }
        }
      }
    }
  }
`
