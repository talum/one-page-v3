import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'

const menuItems = [
  { title: 'About', path: '/' },
  { title: 'Projects', path: '/projects' },
  { title: 'Blog', path: '/blog' },
  { title: 'Contact', path: '/contact' },
]

const Menu = ({ toggleMenu, toggleDarkMode, open }) => (
  <menu id="js--menu" className="menu" data-open={open}>
    <div className="menu__container">
      <div id="js--menu-close" className="menu__close" onClick={toggleMenu}>
        <button className="button button--with-svg button--color-menu button--small">
          <svg viewBox="0 0 24 24" color="currentColor">
            <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z" />
          </svg>
        </button>
      </div>
      {menuItems.map(item => (
        <div key={item.title} className="menu__item">
          <Link to={item.path} className="link--color-contrast">
            {item.title}
          </Link>
        </div>
      ))}
    </div>
    <div className="menu__footer">
      <div className="menu__item" onClick={toggleDarkMode}>
        toggle dark mode
      </div>
    </div>
  </menu>
)

export default Menu

Menu.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
}
