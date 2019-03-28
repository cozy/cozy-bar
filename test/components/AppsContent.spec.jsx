import React from 'react'
import { AppsContent } from 'components/Apps/AppsContent'
import { shallow } from 'enzyme'
import { tMock } from '../jestLib/I18n'

describe('Apps Content', () => {
  it('should render no App', () => {
    const root = shallow(
      <AppsContent
        t={tMock}
        breakpoints={{ isMobile: true }}
        isFetchingApps={false}
      />
    )
    expect(root.getElement()).toMatchSnapshot()
  })
  it('should render display Drive', () => {
    const apps = [
      {
        slug: 'cozy-drive',
        name: 'Drive'
      }
    ]
    const root = shallow(
      <AppsContent
        t={tMock}
        apps={apps}
        breakpoints={{ isMobile: true }}
        isFetchingApps={false}
      />
    )
    expect(root.getElement()).toMatchSnapshot()
  })

  it('should render Loader when fetching', () => {
    const apps = [
      {
        slug: 'cozy-drive',
        name: 'Drive'
      }
    ]
    const root = shallow(
      <AppsContent
        t={tMock}
        apps={apps}
        breakpoints={{ isMobile: true }}
        isFetchingApps={true}
      />
    )
    expect(root.getElement()).toMatchSnapshot()
  })

  it('should display home in the app items lists, if we are on mobile', () => {
    const apps = [
      {
        slug: 'cozy-home',
        name: 'Home'
      }
    ]
    const root = shallow(
      <AppsContent
        t={tMock}
        apps={apps}
        homeApp={{
          slug: 'cozy-home'
        }}
        breakpoints={{ isMobile: true }}
        isFetchingApps={false}
      />
    )
    expect(root.getElement()).toMatchSnapshot()
  })

  it('should not display home within the app items list, but just a link', () => {
    const apps = [
      {
        slug: 'cozy-home',
        name: 'Home'
      }
    ]
    const root = shallow(
      <AppsContent
        t={tMock}
        apps={apps}
        homeApp={{
          slug: 'cozy-home'
        }}
        breakpoints={{ isMobile: false }}
        isFetchingApps={false}
      />
    )
    expect(root.getElement()).toMatchSnapshot()
  })

  it('should not display home if not on mobile and home is the currentApp', () => {
    const apps = [
      {
        slug: 'cozy-home',
        name: 'Home'
      }
    ]
    const root = shallow(
      <AppsContent
        t={tMock}
        apps={apps}
        homeApp={{
          slug: 'cozy-home',
          isCurrentApp: true
        }}
        breakpoints={{ isMobile: false }}
        isFetchingApps={false}
      />
    )
    expect(root.getElement()).toMatchSnapshot()
  })
})
