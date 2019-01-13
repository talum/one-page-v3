import React, { Component } from 'react'
import { Index } from 'elasticlunr'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import qs from 'query-string'

export const query = graphql`
  query SearchIndexExampleQuery {
    siteSearchIndex {
      index
    }
  }
`

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.index = Index.load(props.data.siteSearchIndex.index)
    this.query = this.parseQueryString(props.location.search)
    this.state = {
      results: this.index
        .search(this.query)
        .map(({ ref }) => this.index.documentStore.getDoc(ref)),
    }
  }

  parseQueryString(searchParams) {
    const query = qs.parse(searchParams).q
    return !!query ? query : ''
  }

  render() {
    return (
      <Layout>
        <h1 className="heading heading--level-1 util--text-align-c util--padding-bxxl">
          Search Results for "{this.query}"
        </h1>
        {this.state.results.map((result, i) => (
          <div key={i} className="util--padding-bxl">
            <Link to={result.url}>
              <h3 className="heading heading--level-4">{result.title}</h3>
            </Link>
          </div>
        ))}
      </Layout>
    )
  }
}
