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
    this.state = {
      query: ``,
      results: [],
    }
  }

  componentDidMount() {
    this.index = this.findOrCreateIndex()
    const query = this.parseQueryString(this.props.location.search)
    this.setState({
      query: query,
      results: this.search(query),
    })
  }

  parseQueryString(searchParams) {
    const query = qs.parse(searchParams).q
    return !!query ? query : ''
  }

  findOrCreateIndex() {
    return this.index
      ? this.index
      : Index.load(this.props.data.siteSearchIndex.index)
  }

  componentWillReceiveProps(nextProps) {
    this.index = this.findOrCreateIndex()
    const query = this.parseQueryString(nextProps.location.search)
    this.setState({
      query: query,
      results: this.search(query),
    })
  }

  search(query) {
    return this.index
      .search(query)
      .map(({ ref }) => this.index.documentStore.getDoc(ref))
  }

  render() {
    return (
      <Layout>
        <h1 className="heading heading--level-1 util--text-align-c util--padding-bxxl">
          Search Results for "{this.state.query}"
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
