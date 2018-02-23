import React, { Component } from 'react'
import {
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'
import './Sidebar.css'

class Sidebar extends Component {
  render () {
    return (
      <div className='Sidebar-sticky'>
        <Nav vertical>
          <NavItem>
            <NavLink href='#'>Link</NavLink>
          </NavItem>

          <NavItem>
            <NavLink href='#'>Link</NavLink>
          </NavItem>

          <NavItem>
            <NavLink href='#'>Link</NavLink>
          </NavItem>
        </Nav>
      </div>
    )
  }
}

export default Sidebar
