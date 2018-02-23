import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Container,
  Col,
  Row,
  Table,
  Button,
  Input
} from 'reactstrap'
import './Styles/App.css'
import MainNav from '../Components/MainNav'
import Sidebar from '../Components/Sidebar'
import {omit} from 'ramda'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  onHover () {
    console.log('HOVERRR')
  }

  render () {
    console.log('RENDERING APP PAGE')
    return (
      <div className='App'>
        <MainNav />
        <Container fluid>
          <Row>
            <Col className='Sidebar' md='2'>
              <Sidebar />
            </Col>
            <Col md={{ size: 9, offset: 2 }} />
          </Row>
          <Row>
            <Col />
          </Row>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
