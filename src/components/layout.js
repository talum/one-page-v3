import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import Menu from './menu'
import './layout.css'

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      searchExpanded: false,
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.toggleSearch = this.toggleSearch.bind(this)
  }

  toggleMenu() {
    this.setState({ open: !this.state.open })
  }

  toggleSearch() {
    this.setState({ searchExpanded: !this.state.searchExpanded })
  }

  render() {
    const children = this.props.children
    return (
      <StaticQuery
        query={graphql`
          query SiteTitleQuery {
            site {
              siteMetadata {
                title
              }
            }
          }
        `}
        render={data => (
          <>
            <Header
              siteTitle={data.site.siteMetadata.title}
              toggleMenu={this.toggleMenu}
              toggleSearch={this.toggleSearch}
              searchExpanded={this.state.searchExpanded}
            />
            <Menu toggleMenu={this.toggleMenu} open={this.state.open} />
            <div
              id="js--site-overlay"
              className="site-overlay"
              data-open={this.state.open}
              onClick={this.toggleMenu}
            />
            <section className="grid">
              <main className="main">{children}</main>
            </section>
          </>
        )}
      />
    )
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
