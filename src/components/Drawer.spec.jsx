import React from 'react'

import { render, screen, fireEvent, act } from '@testing-library/react'

import { useInstanceInfo } from 'cozy-client'

import { Drawer } from './Drawer'
import { BarLike } from 'test/lib/BarLike'

jest.mock('cozy-client', () => ({
  ...require.requireActual('cozy-client'),
  useInstanceInfo: jest.fn()
}))

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

describe('bar', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    useInstanceInfo.mockReturnValue({
      isLoaded: true,
      diskUsage: { data: { used: 0 } },
      instance: { data: {} }
    })
  })

  describe('logout', () => {
    const findLogoutButton = () => {
      return screen.getByText('Log out')
    }
    const setup = ({ onLogOut }) => {
      render(
        <BarLike>
          <Drawer onLogOut={onLogOut} />
        </BarLike>
      )
    }

    const clickLogout = () => {
      const logoutButton = findLogoutButton()
      fireEvent(
        logoutButton,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
      )
    }

    it('should await the onLogOut', async () => {
      let prom
      const callOrder = []

      const onLogOut = jest.fn().mockImplementation(async () => {
        prom = sleep(100)
        callOrder.push('onLogOut')
        await prom
      })

      setup({ onLogOut })

      act(() => {
        clickLogout()
      })

      await prom
      await sleep(0)

      expect(onLogOut).toHaveBeenCalled()
      expect(callOrder).toEqual(['onLogOut'])
    })

    it('should work if onLogOut does not return a promise', () => {
      const onLogOut = jest.fn()
      setup({ onLogOut })
      act(() => {
        clickLogout()
      })

      expect(onLogOut).toHaveBeenCalled()
    })
  })
})
