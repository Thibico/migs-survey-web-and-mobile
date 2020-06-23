import React from 'react'
import { shallow } from 'enzyme'

import OptionsQuestion from './OptionsQuestion'

describe('OptionsQuestion', () => {
  let component, props

  beforeEach(() => {
    props = {}
    component = shallow(<OptionsQuestion {...props} />)
  })

  it('should', () => {
    expect(component).toMatchSnapshot()
  })
})