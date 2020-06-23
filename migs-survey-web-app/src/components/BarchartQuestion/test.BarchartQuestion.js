import React from 'react'
import { shallow } from 'enzyme'

import BarchartQuestion from './BarchartQuestion'

describe('BarchartQuestion', () => {
  let component, props

  beforeEach(() => {
    props = {}
    component = shallow(<BarchartQuestion {...props} />)
  })

  it('should', () => {
    expect(component).toMatchSnapshot()
  })
})