import React from 'react'
import { shallow } from 'enzyme'

import FreeTextQuestion from './FreeTextQuestion'

describe('FreeTextQuestion', () => {
  let component, props

  beforeEach(() => {
    props = {}
    component = shallow(<FreeTextQuestion {...props} />)
  })

  it('should', () => {
    expect(component).toMatchSnapshot()
  })
})