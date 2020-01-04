import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { NavWrapper } from "./Header.styles"


class Header extends Component {
  renderContent() {
     switch (this.props.auth) {
       case null:
          // return
          return <li>Waiting for connection...</li>
       case false:
          return <li><a href="/auth/google">Login With Google</a></li>
       default:
         return <li><a href="/api/logout">Logout</a></li>
     }
  }

  render() {
    // console.log(this.props)
    return (
      <NavWrapper>

        <div>
          <Link
            to={this.props.auth ? '/compose' : '/'}
            className="left brand-logo"
          >
            Tone Gems
          </Link>
        </div>

        <div>
          <ul>
            { this.renderContent() }
          </ul>
        </div>

      </NavWrapper>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps)(Header);