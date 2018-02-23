import React, { Component } from 'react'
import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink
} from 'reactstrap'
import './MainNav.css'

class MainNav extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: true
    }
  }

  render () {
    return (
      <Navbar color='faded' light expand='md'>
        <NavbarBrand href='/'>Cray Cray</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className='ml-auto' navbar>
            <NavItem>
              <NavLink href='/link'>Cray Cray</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}

export default MainNav
