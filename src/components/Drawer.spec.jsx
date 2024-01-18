import React from 'react'

import { render, screen, fireEvent, act } from '@testing-library/react'

import { Drawer } from './Drawer'
import { BarLike } from 'test/lib/BarLike'

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

describe('bar', () => {
  describe('logout', () => {
    const findLogoutButton = () => {
      return screen.getByText('Log out')
    }
    const setup = ({ onLogOut, logOut }) => {
      render(
        <BarLike>
          <Drawer logOut={logOut} onLogOut={onLogOut} />
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
      const logOut = jest.fn().mockImplementation(() => {
        callOrder.push('logOut')
      })
      const onLogOut = jest.fn().mockImplementation(async () => {
        prom = sleep(100)
        callOrder.push('onLogOut')
        await prom
      })

      setup({ logOut, onLogOut })

      act(() => {
        clickLogout()
      })

      expect(logOut).not.toHaveBeenCalled()
      await prom
      await sleep(0)
      expect(logOut).toHaveBeenCalled()
      expect(onLogOut).toHaveBeenCalled()
      expect(callOrder).toEqual(['onLogOut', 'logOut'])
    })

    it('should work if onLogOut has not been passed', () => {
      const logOut = jest.fn()
      setup({ logOut })
      act(() => {
        clickLogout()
      })
      expect(logOut).toHaveBeenCalled()
    })

    it('should work if onLogOut does not return a promise', () => {
      const logOut = jest.fn()
      const onLogOut = jest.fn()
      setup({ logOut, onLogOut })
      act(() => {
        clickLogout()
      })
      expect(logOut).toHaveBeenCalled()
      expect(onLogOut).toHaveBeenCalled()
    })
  })
})
