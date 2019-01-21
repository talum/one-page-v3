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
      searchExpanded: null,
      darkMode: false,
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.toggleSearch = this.toggleSearch.bind(this)
    this.toggleDarkMode = this.toggleDarkMode.bind(this)
  }

  componentDidMount() {
    this.setDarkMode()
  }

  toggleMenu() {
    this.setState({ open: !this.state.open })
  }

  toggleSearch() {
    this.setState({ searchExpanded: !this.state.searchExpanded })
  }

  setDarkMode() {
    if (window.localStorage.darkMode === 'true') {
      this.setState({ darkMode: true })
      document.querySelector('body').classList.add('dark')
    } else {
      this.setState({ darkMode: false })
      document.querySelector('body').classList.remove('dark')
    }
  }

  toggleDarkMode() {
    if (this.state.darkMode) {
      window.localStorage.setItem('darkMode', false)
      this.setState({ darkMode: !this.state.darkMode })
      document.querySelector('body').classList.remove('dark')
    } else {
      window.localStorage.setItem('darkMode', true)
      this.setState({ darkMode: !this.state.darkMode })
      document.querySelector('body').classList.add('dark')
    }
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
            <Menu
              toggleMenu={this.toggleMenu}
              open={this.state.open}
              toggleDarkMode={this.toggleDarkMode}
            />
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
