import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import React from 'react'
import qs from 'query-string'

const Header = ({ siteTitle, toggleMenu, toggleSearch, searchExpanded }) => (
  <header className="header">
    <div className="header__item">
      <button
        id="js--menu-link"
        className="button button--with-svg button--small button--color-header"
        onClick={toggleMenu}
      >
        <svg className="svg-container" viewBox="0 0 24 24">
          <path d="M 3 5 A 1.0001 1.0001 0 1 0 3 7 L 21 7 A 1.0001 1.0001 0 1 0 21 5 L 3 5 z M 3 11 A 1.0001 1.0001 0 1 0 3 13 L 21 13 A 1.0001 1.0001 0 1 0 21 11 L 3 11 z M 3 17 A 1.0001 1.0001 0 1 0 3 19 L 21 19 A 1.0001 1.0001 0 1 0 21 17 L 3 17 z" />
        </svg>
      </button>
    </div>
    <div className="header__item">
      <div className="flex-container">
        <div className="flex__item">
          <form
            className="form-group"
            name="searchform"
            onSubmit={e => {
              e.preventDefault()
              navigate(
                `/search/?${qs.stringify({ q: e.target.lastChild.value })}`
              )
            }}
          >
            <div className="form__search" data-open={searchExpanded}>
              <div
                className="button button--with-svg button--small button--color-header"
                onClick={toggleSearch}
              >
                <svg viewBox="0 0 483.083 483.083">
                  <path
                    d="M332.74,315.35c30.883-33.433,50.15-78.2,50.15-127.5C382.89,84.433,298.74,0,195.04,0S7.19,84.433,7.19,187.85
                      S91.34,375.7,195.04,375.7c42.217,0,81.033-13.883,112.483-37.4l139.683,139.683c3.4,3.4,7.65,5.1,11.9,5.1s8.783-1.7,11.9-5.1
                      c6.517-6.517,6.517-17.283,0-24.083L332.74,315.35z M41.19,187.85C41.19,103.133,110.04,34,195.04,34
                      c84.717,0,153.85,68.85,153.85,153.85S280.04,341.7,195.04,341.7S41.19,272.567,41.19,187.85z"
                  />
                </svg>
              </div>
            </div>
            <input
              className="form__input"
              name="search"
              placeholder="Search"
              type="text"
            />
          </form>
        </div>
        <div className="flex__item">
          <button className="button button--with-svg button--small button--with-svg-hover button--color-header">
            <a
              href="https://github.com/talum"
              target="_new"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 32 32">
                <path
                  fill="currentColor"
                  d="M16,0C7.2,0,0,7.2,0,16c0,8.8,7.2,16,16,16s16-7.2,16-16C32,7.2,24.8,0,16,0z M18.3,22.4
    c0,0-1.1,0.1-2.3,0.1s-2.3-0.1-2.3-0.1C10.9,22.1,8,21,8,16.2c0-1.4,0.5-2.5,1.3-3.4c-0.1-0.3-0.6-1.6,0.1-3.3c0,0,1.1-0.3,3.4,1.3
    c1-0.3,2.1-0.4,3.1-0.4c1.1,0,2.1,0.1,3.1,0.4c2.4-1.6,3.4-1.3,3.4-1.3c0.7,1.7,0.3,3,0.1,3.3c0.8,0.9,1.3,2,1.3,3.4
    C24,21,21.1,22.1,18.3,22.4z"
                />
              </svg>
            </a>
          </button>
        </div>
        <div className="flex__item">
          <button
            className="button button--with-svg button--small button--with-svg-hover button--color-header"
            rel="noopener noreferrer"
          >
            <a
              href="https://www.instagram.com/tracidini/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 32 32">
                <path
                  fill="currentColor"
                  d="M28.2,0H3.8C1.7,0,0,1.7,0,3.8v24.4C0,30.3,1.7,32,3.8,32h24.4c2.1,0,3.8-1.7,3.8-3.8V3.8
    C32,1.7,30.3,0,28.2,0z M24,4h3c0.6,0,1,0.4,1,1v3c0,0.6-0.4,1-1,1h-3c-0.6,0-1-0.4-1-1V5C23,4.4,23.4,4,24,4z M16,9.9
    c3.4,0,6.2,2.7,6.2,6.1c0,3.4-2.8,6.1-6.2,6.1c-3.4,0-6.2-2.7-6.2-6.1C9.9,12.6,12.6,9.9,16,9.9z M28,29H4c-0.6,0-1-0.4-1-1V13h4
    c-0.5,0.8-0.7,2.1-0.7,3c0,5.4,4.4,9.7,9.7,9.7c5.4,0,9.7-4.4,9.7-9.7c0-0.9-0.1-2.3-0.8-3h4v15C29,28.6,28.6,29,28,29z"
                />
              </svg>
            </a>
          </button>
        </div>
        <div className="flex__item">
          <button className="button button--with-svg button--small button--with-svg-hover button--color-header">
            <a
              href="https://www.linkedin.com/in/tracylum/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 32 32">
                <path
                  fill="currentColor"
                  d="M30.7,0H1.3C0.6,0,0,0.6,0,1.3v29.3C0,31.4,0.6,32,1.3,32h29.3c0.7,0,1.3-0.6,1.3-1.3V1.3
    C32,0.6,31.4,0,30.7,0z M9.5,27.3H4.7V12h4.8V27.3z M7.1,9.9c-1.5,0-2.8-1.2-2.8-2.8c0-1.5,1.2-2.8,2.8-2.8c1.5,0,2.8,1.2,2.8,2.8
    C9.9,8.7,8.6,9.9,7.1,9.9z M27.3,27.3h-4.7v-7.4c0-1.8,0-4-2.5-4c-2.5,0-2.8,1.9-2.8,3.9v7.6h-4.7V12H17v2.1h0.1
    c0.6-1.2,2.2-2.5,4.5-2.5c4.8,0,5.7,3.2,5.7,7.3V27.3z"
                />
              </svg>
            </a>
          </button>
        </div>
        <div className="flex__item">
          <button className="button button--with-svg button--small button--with-svg-hover button--color-header">
            <a
              href="https://twitter.com/Tracidini"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 32 32">
                <path
                  fill="currentColor"
                  d="M32,6.1c-1.2,0.5-2.4,0.9-3.8,1c1.4-0.8,2.4-2.1,2.9-3.6c-1.3,0.8-2.7,1.3-4.2,1.6C25.7,3.8,24,3,22.2,3
    c-3.6,0-6.6,2.9-6.6,6.6c0,0.5,0.1,1,0.2,1.5C10.3,10.8,5.5,8.2,2.2,4.2c-0.6,1-0.9,2.1-0.9,3.3c0,2.3,1.2,4.3,2.9,5.5
    c-1.1,0-2.1-0.3-3-0.8c0,0,0,0.1,0,0.1c0,3.2,2.3,5.8,5.3,6.4c-0.6,0.1-1.1,0.2-1.7,0.2c-0.4,0-0.8,0-1.2-0.1
    c0.8,2.6,3.3,4.5,6.1,4.6c-2.2,1.8-5.1,2.8-8.2,2.8c-0.5,0-1.1,0-1.6-0.1C2.9,27.9,6.4,29,10.1,29c12.1,0,18.7-10,18.7-18.7
    c0-0.3,0-0.6,0-0.8C30,8.5,31.1,7.4,32,6.1z"
                />
              </svg>
            </a>
          </button>
        </div>
      </div>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
  toggleMenu: PropTypes.func.isRequired,
  toggleSearch: PropTypes.func.isRequired,
  searchExpanded: PropTypes.bool,
}

Header.defaultProps = {
  siteTitle: '',
}

export default Header
