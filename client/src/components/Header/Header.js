import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { loadComposition, saveComposition } from "../../redux/actions"
import { NavWrapper } from "./Header.styles"
import { bundleComposition } from "../../helpers/helpers"


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

        <div onClick={()=>this.props.loadComposition('34fsh98h2dj3')}>
          Load
        </div>

        <div onClick={()=>this.props.saveComposition(bundleComposition(this.props.state))}>
          Save
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

function mapStateToProps(state) {
  return {
    auth: state.auth,
    state: state
  }
}

export default connect(
  mapStateToProps,
  { loadComposition, saveComposition }
)(Header);