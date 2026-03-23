# Remove Redux & Stack Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Redux entirely from cozy-bar, replacing it with cozy-client hooks (`useQuery`, `useInstanceInfo`, `RealTimeQueries`), and delete the legacy `stack.js`/`stack-client.js` abstraction layer.

**Architecture:** Each Redux reducer (settings, context, apps) is removed in its own commit. Data fetching moves to cozy-client hooks. The legacy stack proxy layer is deleted last since the reducer removals progressively eliminate its consumers. The `barReducers` public export and `disableInternalStore` prop are removed as breaking changes.

**Tech Stack:** React hooks, cozy-client (`useQuery`, `useInstanceInfo`, `useClient`, `RealTimeQueries`, `Q`, `fetchPolicies`), cozy-ui

---

## File Structure

### Files to delete (by end of plan)
- `src/lib/reducers/settings.js` (Task 1)
- `src/lib/reducers/context.js` (Task 2)
- `src/lib/reducers/apps.js` (Task 3)
- `src/lib/reducers/apps.spec.js` (Task 3)
- `src/lib/reducers/index.js` (Task 3)
- `src/lib/store/index.js` (Task 3)
- `src/config/persistWhitelist.json` (Task 3)
- `test/store/index.spec.js` (Task 3)
- `test/store/__snapshots__/index.spec.js.snap` (Task 3)
- `src/lib/stack.js` (Task 5)
- `src/lib/stack-client.js` (Task 5)
- `src/lib/realtime.js` (Task 5)
- `src/lib/exceptions.js` (Task 5)
- `test/lib/stack.spec.js` (Task 5)
- `test/lib/stack-client/` (entire directory) (Task 5)
- `test/lib/__snapshots__/stack.spec.js.snap` (Task 5)
- `test/lib/mockStackClient.js` (Task 5)

### Files to modify
- `src/components/Bar.jsx` (Tasks 1, 2, 3)
- `src/components/Bar.spec.jsx` (Tasks 1, 2, 3)
- `src/components/BarComponent.jsx` (Task 3)
- `src/components/utils/HelpLink.jsx` (Task 2)
- `src/components/AppsMenu/index.jsx` (Task 3)
- `src/components/AppsMenu/AppsMenuContent.jsx` (Task 3)
- `src/components/UserMenu/index.jsx` (Task 3)
- `src/components/UserMenu/UserMenuContent.jsx` (Task 3)
- `src/index.jsx` (Task 3)
- `test/lib/BarLike.jsx` (Task 3)
- `src/components/AppsMenu/components/AppItem.jsx` (Task 4)
- `package.json` (Task 5)

---

## Task 1: Remove `settings` reducer (dead code)

The settings reducer manages `storageData`, `isFetching`, `isBusy` state. No component ever reads these values — `UserMenuContent` gets disk data from `useInstanceInfo()`, and the real logout lives in `src/components/UserMenu/helpers.js`. The `fetchSettingsData` action is called from `Bar.jsx` but its result is never consumed.

**Files:**
- Delete: `src/lib/reducers/settings.js`
- Modify: `src/lib/reducers/index.js`
- Modify: `src/components/Bar.jsx`
- Modify: `src/components/Bar.spec.jsx`

- [ ] **Step 1: Remove settings reducer from reducers/index.js**

In `src/lib/reducers/index.js`:
- Remove `import settingsReducer, * as settings from 'lib/reducers/settings'`
- Remove `const fetchSettingsData = settings.fetchSettingsData`
- Remove `const logOut = settings.logOut`
- Remove `fetchSettingsData, logOut` from the named exports
- Remove `export const getStorageData = proxy('settings', settings.getStorageData)`
- Remove `export const isSettingsBusy = proxy('settings', settings.isSettingsBusy)`
- Remove `export const isFetchingSettings = proxy('settings', settings.isFetchingSettings)`
- Remove `settings: settingsReducer` from the `reducers` object

The file should look like:
```js
import { combineReducers } from 'redux'
import appsReducer, * as apps from 'lib/reducers/apps'
import contextReducer, * as context from 'lib/reducers/context'

const proxy = (attr, method) => {
  return (state, ...args) => {
    return method(state.cozyBar[attr], ...args)
  }
}

const fetchApps = apps.fetchApps
const setInfos = apps.setInfos
const fetchContext = context.fetchContext
export { fetchApps, setInfos, fetchContext }

export const getIsSettingsAppInstalled = proxy(
  'apps',
  apps.getIsSettingsAppInstalled
)
export const getApps = proxy('apps', apps.getApps)
export const getHomeApp = proxy('apps', apps.getHomeApp)
export const isFetchingApps = proxy('apps', apps.isFetchingApps)
export const isCurrentApp = proxy('apps', apps.isCurrentApp)
export const hasFetched = proxy('apps', apps.hasFetched)
export const getHelpLink = proxy('context', context.getHelpLink)

// realtime handlers
export const onRealtimeCreate = apps.receiveApp
export const onRealtimeDelete = apps.deleteApp

export const reducers = {
  cozyBar: combineReducers({
    apps: appsReducer,
    context: contextReducer
  })
}

export default combineReducers(reducers)
```

- [ ] **Step 2: Remove fetchSettingsData from Bar.jsx**

In `src/components/Bar.jsx`:
- Remove `fetchSettingsData` from the import of `lib/reducers`
- Remove `fetchSettingsData` from destructured props of the `Bar` component
- Remove `fetchSettingsData(false)` call inside `fetchInitialData`
- Remove `fetchSettingsData` from the `useCallback` dependency array
- Remove `fetchSettingsData: displayBusy => dispatch(fetchSettingsData(displayBusy))` from `mapDispatchToProps`

The import becomes:
```js
import {
  getHomeApp,
  hasFetched,
  fetchApps,
  fetchContext
} from 'lib/reducers'
```

The `Bar` component destructuring removes `fetchSettingsData`:
```js
export const Bar = ({
  fetchContext,
  fetchApps,
  isPublic,
  // ... rest unchanged
```

`fetchInitialData` becomes:
```js
const fetchInitialData = useCallback(() => {
  if (!isPublic) {
    fetchContext()
    if (!hasFetchedApps) {
      fetchApps()
    }
  }
}, [fetchApps, fetchContext, hasFetchedApps, isPublic])
```

`mapDispatchToProps` becomes:
```js
export const mapDispatchToProps = dispatch => ({
  fetchApps: () => dispatch(fetchApps()),
  fetchContext: () => dispatch(fetchContext())
})
```

- [ ] **Step 3: Update Bar.spec.jsx**

In `src/components/Bar.spec.jsx`:
- Remove `mockFetchSettingsData` and all references to `fetchSettingsData`
- Remove `fetchSettingsData` from the `setup` function's destructuring and from the `<Bar>` render
- Remove assertions about `mockFetchSettingsData` in all tests

The setup becomes:
```jsx
const mockFetchContext = jest.fn().mockResolvedValue({})
const mockFetchApps = jest.fn().mockResolvedValue([])

const setup = ({
  fetchContext = mockFetchContext,
  fetchApps = mockFetchApps,
  isPublic = false,
  hasFetchedApps = false
} = {}) => {
  const mockClient = createMockClient({
    clientOptions: {
      uri: 'http://cozy.localhost:8080'
    }
  })

  const result = render(
    <BarLike client={mockClient}>
      <Bar
        fetchContext={fetchContext}
        fetchApps={fetchApps}
        isPublic={isPublic}
        hasFetchedApps={hasFetchedApps}
        onDrawer={jest.fn()}
        searchOptions={{ enabled: false }}
      />
    </BarLike>
  )

  return {
    ...result,
    client: mockClient
  }
}
```

Assertions change — remove all `mockFetchSettingsData` expectations:
- `'should fetch data when mounted'`: remove `expect(mockFetchSettingsData).toHaveBeenCalled()`
- `'should not fetch data if public'`: remove `expect(mockFetchSettingsData).not.toHaveBeenCalled()`
- `'should call re-fetch data when token is refreshed'`: remove `expect(mockFetchSettingsData).toHaveBeenCalledTimes(2)`

- [ ] **Step 4: Fix context.js dependency on settings.js**

`src/lib/reducers/context.js` imports `LOG_OUT` from `lib/reducers/settings` (line 2). Since we're deleting `settings.js`, inline the constant to avoid a module-not-found error.

In `src/lib/reducers/context.js`, replace:
```js
import { LOG_OUT } from 'lib/reducers/settings'
```
with:
```js
const LOG_OUT = 'LOG_OUT'
```

- [ ] **Step 5: Delete settings reducer file**

Delete `src/lib/reducers/settings.js`.

- [ ] **Step 6: Run tests**

Run: `yarn test`
Expected: All tests pass.

- [ ] **Step 7: Run lint**

Run: `yarn lint:js`
Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add src/lib/reducers/settings.js src/lib/reducers/index.js src/lib/reducers/context.js src/components/Bar.jsx src/components/Bar.spec.jsx
git commit -m "feat: remove settings reducer (dead code)

fetchSettingsData result was never consumed by any component.
Storage data comes from useInstanceInfo, logout from client.logout()."
```

---

## Task 2: Remove `context` reducer — use `useInstanceInfo`

The context reducer fetches `/settings/context` to extract `help_link`. `useInstanceInfo` from cozy-client already fetches `io.cozy.settings.context` and returns the data. We reuse it in `HelpLink.jsx`.

**Files:**
- Delete: `src/lib/reducers/context.js`
- Modify: `src/lib/reducers/index.js`
- Modify: `src/components/utils/HelpLink.jsx`
- Modify: `src/components/Bar.jsx`
- Modify: `src/components/Bar.spec.jsx`

- [ ] **Step 1: Update HelpLink.jsx to use useInstanceInfo**

Replace the entire file `src/components/utils/HelpLink.jsx` with:

```jsx
import React from 'react'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import HelpOutlinedIcon from 'cozy-ui/transpiled/react/Icons/HelpOutlined'

import { useInstanceInfo } from 'cozy-client'

const HelpLink = () => {
  const { context } = useInstanceInfo()
  const helpLink = context.data?.attributes?.help_link || null

  if (!helpLink) return null

  return (
    <IconButton
      component="a"
      href={helpLink}
      target="_blank"
      rel="noopener, noreferrer"
      className="u-p-half"
    >
      <Icon icon={HelpOutlinedIcon} size="18" />
    </IconButton>
  )
}

export default HelpLink
```

Note: The old version always rendered even without a helpLink. The new version returns `null` when there's no help link, which is a UX improvement.

- [ ] **Step 2: Remove fetchContext from Bar.jsx**

In `src/components/Bar.jsx`:
- Remove `fetchContext` from the import of `lib/reducers`
- Remove `fetchContext` from the destructured props
- Remove `fetchContext()` call from `fetchInitialData`
- Remove `fetchContext` from `useCallback` dependency array
- Remove `fetchContext: () => dispatch(fetchContext())` from `mapDispatchToProps`

The import becomes:
```js
import {
  getHomeApp,
  hasFetched,
  fetchApps
} from 'lib/reducers'
```

`fetchInitialData` becomes:
```js
const fetchInitialData = useCallback(() => {
  if (!isPublic) {
    if (!hasFetchedApps) {
      fetchApps()
    }
  }
}, [fetchApps, hasFetchedApps, isPublic])
```

`mapDispatchToProps` becomes:
```js
export const mapDispatchToProps = dispatch => ({
  fetchApps: () => dispatch(fetchApps())
})
```

- [ ] **Step 3: Update Bar.spec.jsx**

Remove all `fetchContext` references:
- Remove `mockFetchContext`
- Remove `fetchContext` from setup destructuring and `<Bar>` props
- In `'should fetch data when mounted'`: remove `expect(mockFetchContext).toHaveBeenCalled()`
- In `'should not fetch data if public'`: remove `expect(mockFetchContext).not.toHaveBeenCalled()`
- In `'should call re-fetch data when token is refreshed'`: remove `expect(mockFetchContext).toHaveBeenCalledTimes(2)`
- **Important:** Add `context: { data: {} }` to the `useInstanceInfo` mock in `beforeEach` — `HelpLink` now calls `useInstanceInfo()` and reads `context.data`, which would throw `TypeError` if `context` is `undefined`.

The `beforeEach` mock becomes:
```js
useInstanceInfo.mockReturnValue({
  isLoaded: true,
  diskUsage: { data: { used: 0 } },
  instance: { data: {} },
  context: { data: {} }
})
```

The setup becomes:
```jsx
const mockFetchApps = jest.fn().mockResolvedValue([])

const setup = ({
  fetchApps = mockFetchApps,
  isPublic = false,
  hasFetchedApps = false
} = {}) => {
  const mockClient = createMockClient({
    clientOptions: {
      uri: 'http://cozy.localhost:8080'
    }
  })

  const result = render(
    <BarLike client={mockClient}>
      <Bar
        fetchApps={fetchApps}
        isPublic={isPublic}
        hasFetchedApps={hasFetchedApps}
        onDrawer={jest.fn()}
        searchOptions={{ enabled: false }}
      />
    </BarLike>
  )

  return {
    ...result,
    client: mockClient
  }
}
```

- [ ] **Step 4: Remove context reducer from reducers/index.js**

In `src/lib/reducers/index.js`:
- Remove `import contextReducer, * as context from 'lib/reducers/context'`
- Remove `const fetchContext = context.fetchContext`
- Remove `fetchContext` from the exports
- Remove `export const getHelpLink = proxy('context', context.getHelpLink)`
- Remove `context: contextReducer` from the `reducers` object

The file becomes:
```js
import { combineReducers } from 'redux'
import appsReducer, * as apps from 'lib/reducers/apps'

const proxy = (attr, method) => {
  return (state, ...args) => {
    return method(state.cozyBar[attr], ...args)
  }
}

const fetchApps = apps.fetchApps
const setInfos = apps.setInfos
export { fetchApps, setInfos }

export const getIsSettingsAppInstalled = proxy(
  'apps',
  apps.getIsSettingsAppInstalled
)
export const getApps = proxy('apps', apps.getApps)
export const getHomeApp = proxy('apps', apps.getHomeApp)
export const isFetchingApps = proxy('apps', apps.isFetchingApps)
export const isCurrentApp = proxy('apps', apps.isCurrentApp)
export const hasFetched = proxy('apps', apps.hasFetched)

// realtime handlers
export const onRealtimeCreate = apps.receiveApp
export const onRealtimeDelete = apps.deleteApp

export const reducers = {
  cozyBar: combineReducers({
    apps: appsReducer
  })
}

export default combineReducers(reducers)
```

- [ ] **Step 5: Delete context reducer file**

Delete `src/lib/reducers/context.js`.

- [ ] **Step 6: Run tests**

Run: `yarn test`
Expected: All tests pass.

- [ ] **Step 7: Run lint**

Run: `yarn lint:js`
Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add src/lib/reducers/context.js src/lib/reducers/index.js src/components/utils/HelpLink.jsx src/components/Bar.jsx src/components/Bar.spec.jsx
git commit -m "feat: remove context reducer, use useInstanceInfo for helpLink

HelpLink now uses useInstanceInfo from cozy-client to get
context.data.attributes.help_link instead of Redux state."
```

---

## Task 3: Remove `apps` reducer — use `useQuery` + `RealTimeQueries`

This is the largest task. The apps reducer manages:
- App list fetching and storage
- Home app detection
- `isFetching` / `hasFetched` status
- `appSlug` / `appName` / `appNamePrefix` (set via `setInfos`)
- `isSettingsAppInstalled`
- Realtime app create/delete

All of this moves to `useQuery(Q('io.cozy.apps'))` + `RealTimeQueries` + props.

**Files:**
- Delete: `src/lib/reducers/apps.js`
- Delete: `src/lib/reducers/apps.spec.js`
- Delete: `src/lib/reducers/index.js`
- Modify: `src/components/Bar.jsx`
- Modify: `src/components/Bar.spec.jsx`
- Modify: `src/components/BarComponent.jsx`
- Modify: `src/components/AppsMenu/AppsMenuContent.jsx`
- Modify: `src/components/UserMenu/UserMenuContent.jsx`

- [ ] **Step 1: Rewrite Bar.jsx to use useQuery instead of Redux**

Replace `src/components/Bar.jsx` entirely. Key changes:
- Replace `connect()` with direct hook usage
- Use `useQuery(Q('io.cozy.apps'))` to fetch apps
- Add `<RealTimeQueries doctype="io.cozy.apps" />` for realtime
- Derive `homeApp`, `isSettingsAppInstalled`, filtered apps from query result
- Pass apps data as props to children
- `appSlug` is already a prop from `BarComponent`, no longer from Redux

```jsx
import React, { useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import Grid from 'cozy-ui/transpiled/react/Grid'
import Divider from 'cozy-ui/transpiled/react/Divider'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import AppTitle from 'cozy-ui/transpiled/react/AppTitle'
import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'
import Banner from 'components/Banner'
import AppsMenu from 'components/AppsMenu'
import UserMenu from 'components/UserMenu'
import ButtonCozyHome from 'components/utils/ButtonCozyHome'
import SearchButton from 'components/utils/SearchButton'
import HelpLink from 'components/utils/HelpLink'
import {
  useClient,
  useFetchHomeShortcuts,
  Q,
  useQuery,
  RealTimeQueries
} from 'cozy-client'
import { AssistantDesktop } from 'cozy-search'
import cx from 'classnames'

const appsQuery = {
  definition: Q('io.cozy.apps'),
  options: {
    as: 'io.cozy.apps',
    fetchPolicy: null
  }
}

// cozy-client's useQuery normalizes JSON:API responses — attributes are
// spread to the top level (e.g. app.slug, app.name exist directly).
// The old camelCasify/mapApp from the reducer is no longer needed.
// We only ensure `href` is derived from `links.related` for AppLinker.
const mapApp = app => ({
  ...app,
  href: (app.links && app.links.related) || app.href
})

export const Bar = ({
  isPublic,
  barLeft,
  barRight,
  barCenter,
  barSearch,
  onLogOut,
  userActionRequired,
  appIcon,
  appTextIcon,
  searchOptions,
  isInvertedTheme,
  appSlug,
  componentsProps
}) => {
  const client = useClient()
  const { isMobile } = useBreakpoints()
  const shortcuts = useFetchHomeShortcuts()

  const appsResult = useQuery(appsQuery.definition, {
    ...appsQuery.options,
    enabled: !isPublic
  })

  const rawApps = appsResult.data || []
  const isFetchingApps = appsResult.fetchStatus === 'loading'
  const hasFetchedApps = appsResult.fetchStatus === 'loaded'

  const excludedApps = flag('apps.hidden') || []
  const isSettingsAppInstalled = rawApps.some(
    app => app.slug === 'settings'
  )

  const apps = useMemo(() => {
    return rawApps
      .map(mapApp)
      .filter(app => !excludedApps.includes(app.slug))
      .map(app => ({
        ...app,
        isCurrentApp: app.slug === appSlug
      }))
  }, [rawApps, excludedApps, appSlug])

  const homeApp = useMemo(() => {
    const home = apps.find(app => app.slug === 'home')
    if (!home) return null
    return home.slug === appSlug
      ? { ...home, isCurrentApp: true }
      : home
  }, [apps, appSlug])

  const isSearchEnabled = searchOptions.enabled && !isPublic

  const renderCenter = () => {
    return null
  }

  const renderLeft = () => {
    if (isFlagshipApp() || flag('flagship.debug')) {
      return <ButtonCozyHome isInvertedTheme={isInvertedTheme} />
    }

    const homeHref = !isPublic && homeApp && homeApp.href

    if (isMobile) {
      return <ButtonCozyHome homeHref={homeHref} />
    }

    const isHome = appSlug === 'home'

    return (
      <Grid container alignItems="center" className="u-w-auto">
        {!isHome && (
          <>
            <ButtonCozyHome homeHref={homeHref} />
            <Divider orientation="vertical" className="u-mr-half" flexItem />
          </>
        )}
        <AppTitle appIcon={appIcon} appTextIcon={appTextIcon} />
      </Grid>
    )
  }

  const renderTwakeRight = () => {
    if (appSlug === 'drive' && isMobile && barSearch) return null

    return (
      <>
        <HelpLink />
        <AppsMenu
          apps={apps}
          homeApp={homeApp}
          isFetchingApps={isFetchingApps}
          shortcuts={shortcuts}
        />
        <UserMenu
          onLogOut={onLogOut}
          isSettingsAppInstalled={isSettingsAppInstalled}
        />
      </>
    )
  }

  const renderSearch = () => {
    return isSearchEnabled && !isMobile ? (
      <div className="u-flex-grow u-mh-2">
        <AssistantDesktop
          componentsProps={{ SearchBarDesktop: { size: 'small' } }}
        />
      </div>
    ) : null
  }

  return (
    <div
      {...componentsProps?.Wrapper}
      className={cx('coz-bar-wrapper', componentsProps?.Wrapper?.className)}
      data-testid="coz-bar-wrapper"
    >
      {!isPublic && <RealTimeQueries doctype="io.cozy.apps" />}
      <div id="cozy-bar-modal-dom-place" />
      <div className="coz-bar-container">
        {barLeft || renderLeft()}
        {barCenter || renderCenter()}
        <div className="u-flex-grow">{barSearch || renderSearch()}</div>
        {isSearchEnabled && isMobile ? <SearchButton /> : null}
        {barRight}
        {!isPublic && renderTwakeRight()}
      </div>
      {userActionRequired && <Banner {...userActionRequired} />}
    </div>
  )
}

Bar.propTypes = {
  appSlug: PropTypes.string,
  isPublic: PropTypes.bool,
  isInvertedTheme: PropTypes.bool,
  onLogOut: PropTypes.func,
  userActionRequired: PropTypes.object,
  componentsProps: PropTypes.shape({
    Wrapper: PropTypes.shape({
      className: PropTypes.string
    })
  })
}

export default Bar
```

Key differences:
- No more `connect()`, `mapStateToProps`, `mapDispatchToProps`
- No more `fetchInitialData` / `useEffect` for data fetching — `useQuery` handles it
- No more `tokenRefreshed` listener for re-fetching — `useQuery` handles cache invalidation
- Apps data derived with `useMemo` from query result
- `<RealTimeQueries>` handles realtime instead of manual dispatch

- [ ] **Step 2: Update AppsMenu to receive apps as props**

Replace `src/components/AppsMenu/index.jsx` entirely:

```jsx
import React, { useRef, useState } from 'react'

import AppsMenuContent from 'components/AppsMenu/AppsMenuContent'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Menu from 'cozy-ui/transpiled/react/Menu'
import MosaicIcon from 'cozy-ui/transpiled/react/Icons/Mosaic'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles({
  root: {
    '& .dialogContentInner': {
      '& .dialogContentWrapper': {
        paddingBottom: '0 !important'
      }
    }
  }
})

const AppsMenu = ({ shortcuts, apps, homeApp, isFetchingApps }) => {
  const [isOpen, setOpen] = useState(false)
  const containerRef = useRef()
  const buttonRef = useRef()

  const { isMobile } = useBreakpoints()

  const toggleMenu = () => {
    setOpen(!isOpen)
  }

  const styles = useStyles()

  return (
    <nav ref={containerRef}>
      <IconButton ref={buttonRef} onClick={toggleMenu} className="u-p-half">
        <Icon icon={MosaicIcon} size="18" />
      </IconButton>
      {isMobile ? (
        <ConfirmDialog
          open={isOpen}
          onClose={toggleMenu}
          content={
            <AppsMenuContent
              apps={apps}
              homeApp={homeApp}
              isFetchingApps={isFetchingApps}
              shortcuts={shortcuts}
              closeMenu={toggleMenu}
            />
          }
          componentsProps={{
            dialogContent: {
              classes: styles
            }
          }}
          classes={{
            paper: 'u-bdrs-7'
          }}
        />
      ) : (
        <Menu
          open={isOpen}
          anchorEl={buttonRef.current}
          container={containerRef.current}
          getContentAnchorEl={null}
          onClose={toggleMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: -10,
            horizontal: 0
          }}
          classes={{
            paper: 'u-bdrs-7'
          }}
        >
          <AppsMenuContent
            apps={apps}
            homeApp={homeApp}
            isFetchingApps={isFetchingApps}
            shortcuts={shortcuts}
            closeMenu={toggleMenu}
          />
        </Menu>
      )}
    </nav>
  )
}

export default AppsMenu
```

- [ ] **Step 3: Update AppsMenuContent.jsx — remove connect()**

Replace `src/components/AppsMenu/AppsMenuContent.jsx`:

```jsx
import React from 'react'
import PropTypes from 'prop-types'

import flag from 'cozy-flags'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { sortApplicationsList } from 'cozy-client/dist/models/applications'

import AppItem from 'components/AppsMenu/components/AppItem'
import ShortcutItem from 'components/AppsMenu/components/ShortcutItem'
import EntrypointItem from 'components/AppsMenu/components/EntrypointItem'
import AppItemPlaceholder from 'components/AppsMenu/components/AppItemPlaceholder'
import useI18n from 'components/useI18n'
import styles from 'styles/apps-menu.styl'
import { getEntrypoints } from 'components/AppsMenu/helper'

const AppsMenuContent = ({
  isFetchingApps,
  apps,
  shortcuts,
  homeApp,
  closeMenu
}) => {
  const { t } = useI18n()

  if (!isFetchingApps && (!apps || !apps.length)) {
    return (
      <Typography className="u-mh-half" color="error">
        {t('no_apps')}
      </Typography>
    )
  }

  if (isFetchingApps) {
    return (
      <div className={styles['apps-menu-grid']}>
        <AppItemPlaceholder key="1" />
        <AppItemPlaceholder key="2" />
        <AppItemPlaceholder key="3" />
      </div>
    )
  }

  const homeSlug = homeApp && homeApp.slug

  const displayedApps = apps.filter(app => app.slug !== homeSlug)

  const sortedApps = flag('apps.sort')
    ? sortApplicationsList(displayedApps, flag('apps.sort'))
    : displayedApps

  const entrypoints = getEntrypoints(apps)

  return (
    <div className={styles['apps-menu-grid']}>
      {sortedApps.map(app => (
        <AppItem key={app.slug} app={app} onAppSwitch={closeMenu} />
      ))}
      {shortcuts.map((shortcut, index) => (
        <ShortcutItem key={index} shortcut={shortcut} />
      ))}
      {entrypoints.map(entrypoint => (
        <EntrypointItem key={entrypoint.name} entrypoint={entrypoint} />
      ))}
    </div>
  )
}

AppsMenuContent.propTypes = {
  isFetchingApps: PropTypes.bool.isRequired,
  apps: PropTypes.array,
  homeApp: PropTypes.shape({
    isCurrentApp: PropTypes.bool,
    slug: PropTypes.string,
    href: PropTypes.string
  }),
  closeMenu: PropTypes.func
}

export default AppsMenuContent
```

Key change: removed `connect()` and `mapStateToProps`. The component is now a pure presentational component receiving all data via props.

- [ ] **Step 4: Update UserMenu to pass isSettingsAppInstalled as prop**

Replace `src/components/UserMenu/index.jsx` entirely:

```jsx
import React, { useRef, useState } from 'react'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Menu from 'cozy-ui/transpiled/react/Menu'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'
import { useInstanceInfo } from 'cozy-client'

import UserMenuContent from 'components/UserMenu/UserMenuContent'
import AvatarMyself from './components/AvatarMyself'

const useStyles = makeStyles({
  root: {
    '& .dialogContentInner': {
      '& .dialogContentWrapper': {
        paddingBottom: '0 !important'
      }
    }
  }
})

const UserMenu = ({ onLogOut, isSettingsAppInstalled }) => {
  const [isOpen, setOpen] = useState(false)
  const containerRef = useRef()
  const buttonRef = useRef()

  const { isMobile } = useBreakpoints()

  const { isLoaded, instance, diskUsage } = useInstanceInfo()

  const toggleMenu = () => {
    setOpen(!isOpen)
  }

  const styles = useStyles()

  return (
    <nav ref={containerRef}>
      <IconButton
        ref={buttonRef}
        onClick={toggleMenu}
        disabled={!isLoaded}
        className="u-p-0 u-ml-half"
      >
        <AvatarMyself size={isMobile ? 's' : 'm'} />
      </IconButton>
      {isMobile ? (
        <ConfirmDialog
          open={isOpen}
          onClose={toggleMenu}
          content={
            <UserMenuContent
              onLogOut={onLogOut}
              instance={instance}
              diskUsage={diskUsage}
              isSettingsAppInstalled={isSettingsAppInstalled}
              closeMenu={toggleMenu}
            />
          }
          componentsProps={{
            dialogContent: {
              classes: styles
            }
          }}
          classes={{
            paper: 'u-bdrs-7'
          }}
        />
      ) : (
        <Menu
          open={isOpen}
          anchorEl={buttonRef.current}
          container={containerRef.current}
          getContentAnchorEl={null}
          onClose={toggleMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: -10,
            horizontal: 0
          }}
          classes={{
            paper: 'u-bdrs-7'
          }}
        >
          <UserMenuContent
            onLogOut={onLogOut}
            instance={instance}
            diskUsage={diskUsage}
            isSettingsAppInstalled={isSettingsAppInstalled}
            closeMenu={toggleMenu}
          />
        </Menu>
      )}
    </nav>
  )
}

export default UserMenu
```

- [ ] **Step 5: Update UserMenuContent.jsx — remove connect()**

In `src/components/UserMenu/UserMenuContent.jsx`:
- Remove `import { connect } from 'react-redux'`
- Remove `import { getIsSettingsAppInstalled } from 'lib/reducers'`
- Remove the `mapStateToProps` function
- Change the default export from `connect(mapStateToProps)(UserMenuContent)` to just `export default UserMenuContent`

The component already receives `isSettingsAppInstalled` as a prop — it just used to come from Redux. Now it comes from the parent.

- [ ] **Step 6: Clean up BarComponent.jsx — remove Redux Provider, store, stack.init**

**Critical:** `lib/reducers/index.js` is deleted in Step 8 of this task, and `lib/store/index.js` depends on it. We must remove all Redux/store usage from `BarComponent.jsx` now, not in a later task.

In `src/components/BarComponent.jsx`:
- Remove `import { onRealtimeCreate, onRealtimeDelete, setInfos } from 'lib/reducers'`
- Remove `import { Provider } from 'react-redux'`
- Remove `import stack from 'lib/stack'`
- Remove `const getOrCreateStore = require('lib/store').default`
- Remove the `let store` / `if (disableInternalStore)` block entirely
- Remove the `disableInternalStore` prop from the component signature
- Remove the entire `useEffect` that called `store.dispatch(setInfos(...))` and `stack.init({...})`
- Remove the `Provider` wrapper — render `<Bar>` directly in both branches (then merge into one since there's no conditional anymore)

The render section becomes:
```jsx
return (
  <ReactPortal
    wrapperElement={wrapperElement}
    setWrapperElement={setWrapperElement}
  >
    <CozyTheme variant={themeVariant} ignoreCozySettings={options.isPublic}>
      <Bar
        {...options}
        barSearch={barSearch}
        barLeft={barLeft}
        barCenter={barCenter}
        barRight={barRight}
      />
    </CozyTheme>
  </ReactPortal>
)
```

- [ ] **Step 6b: Remove barReducers from public API**

In `src/index.jsx`:
- Remove `export { reducers as barReducers } from './lib/reducers'`

- [ ] **Step 6c: Update BarLike test helper — remove Redux Provider**

Replace `test/lib/BarLike.jsx`:

```jsx
import React from 'react'

import I18n from 'twake-i18n'
import { CozyProvider, createMockClient } from 'cozy-client'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'

import enLocale from 'locales/en.json'

const TestI18n = ({ children }) => {
  return (
    <I18n dictRequire={() => enLocale} lang="en">
      {children}
    </I18n>
  )
}

const BarLike = ({ children, client }) => {
  const mockClient = createMockClient({
    clientOptions: {
      uri: 'http://cozy.localhost:8080'
    }
  })

  return (
    <CozyProvider client={client || mockClient}>
      <CozyTheme>
        <BreakpointsProvider>
          <TestI18n>{children}</TestI18n>
        </BreakpointsProvider>
      </CozyTheme>
    </CozyProvider>
  )
}

export { TestI18n, BarLike }
```

- [ ] **Step 7: Update Bar.spec.jsx**

Rewrite the test since `Bar` no longer uses `connect()`:

```jsx
import React from 'react'
import { isFlagshipApp } from 'cozy-device-helper'
import { BarLike } from 'test/lib/BarLike'

import { Bar } from './Bar'
import { render } from '@testing-library/react'
import { createMockClient } from 'cozy-client'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { useInstanceInfo, useQuery } from 'cozy-client'
import { shouldDisplayOffers } from 'cozy-client/dist/models/instance'

jest.mock('cozy-device-helper', () => ({
  ...require.requireActual('cozy-device-helper'),
  isFlagshipApp: jest.fn()
}))

jest.mock('cozy-client', () => ({
  ...require.requireActual('cozy-client'),
  useInstanceInfo: jest.fn(),
  useQuery: jest.fn()
}))

jest.mock('cozy-client/dist/models/instance', () => ({
  ...require.requireActual('cozy-client/dist/models/instance'),
  shouldDisplayOffers: jest.fn()
}))

jest.mock('cozy-ui/transpiled/react/providers/Breakpoints', () => ({
  ...require.requireActual('cozy-ui/transpiled/react/providers/Breakpoints'),
  __esModule: true,
  useBreakpoints: jest.fn()
}))

describe('Bar', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    useBreakpoints.mockReturnValue({ isMobile: true })
    shouldDisplayOffers.mockReturnValue(false)
    useInstanceInfo.mockReturnValue({
      isLoaded: true,
      diskUsage: { data: { used: 0 } },
      instance: { data: {} },
      context: { data: {} }
    })
    useQuery.mockReturnValue({
      data: [],
      fetchStatus: 'loaded'
    })
  })

  afterEach(() => {
    isFlagshipApp.mockClear()
  })

  const setup = ({
    isPublic = false
  } = {}) => {
    const mockClient = createMockClient({
      clientOptions: {
        uri: 'http://cozy.localhost:8080'
      }
    })

    const result = render(
      <BarLike client={mockClient}>
        <Bar
          isPublic={isPublic}
          onDrawer={jest.fn()}
          searchOptions={{ enabled: false }}
        />
      </BarLike>
    )

    return {
      ...result,
      client: mockClient
    }
  }

  it('should render the bar', () => {
    setup()
    expect(useQuery).toHaveBeenCalled()
  })

  it('should not fetch apps if public', () => {
    setup({ isPublic: true })
    // useQuery is still called but with enabled: false
    expect(useQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ enabled: false })
    )
  })
})
```

- [ ] **Step 8: Delete reducer and store files**

Delete:
- `src/lib/reducers/apps.js`
- `src/lib/reducers/apps.spec.js`
- `src/lib/reducers/index.js`
- `src/lib/store/index.js`
- `src/config/persistWhitelist.json`
- `test/store/index.spec.js`
- `test/store/__snapshots__/index.spec.js.snap`

- [ ] **Step 9: Run tests**

Run: `yarn test`
Expected: All tests pass.

- [ ] **Step 10: Run lint**

Run: `yarn lint:js`
Expected: No errors.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: remove apps reducer, use useQuery + RealTimeQueries

Apps are now fetched via useQuery(Q('io.cozy.apps')) from cozy-client.
Realtime updates handled by RealTimeQueries component.
All connect() calls removed from AppsMenuContent and UserMenuContent."
```

---

## Task 4: Remove `stack.get.iconProps()` from AppItem.jsx

**Files:**
- Modify: `src/components/AppsMenu/components/AppItem.jsx`

- [ ] **Step 1: Replace stack.get.iconProps() with useClient()**

In `src/components/AppsMenu/components/AppItem.jsx`:
- Remove `import stack from 'lib/stack'`
- Add `import { useClient } from 'cozy-client'`
- Inside the component, add:
```js
const client = useClient()
const cozyURL = new URL(client.getStackClient().uri)
const iconProps = {
  domain: cozyURL.host,
  secure: cozyURL.protocol === 'https:'
}
```
- Replace `{...stack.get.iconProps()}` with `{...iconProps}`

- [ ] **Step 2: Run tests**

Run: `yarn test`
Expected: All tests pass.

- [ ] **Step 3: Run lint**

Run: `yarn lint:js`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/AppsMenu/components/AppItem.jsx
git commit -m "feat: replace stack.get.iconProps() with useClient() in AppItem"
```

---

## Task 5: Remove stack layer and Redux dependencies

After Tasks 1-4, all Redux consumers and store/reducer files are gone. This task removes the legacy stack abstraction layer and the npm dependencies.

**Files:**
- Delete: `src/lib/stack.js`
- Delete: `src/lib/stack-client.js`
- Delete: `src/lib/realtime.js`
- Delete: `src/lib/exceptions.js`
- Delete: `test/lib/stack.spec.js`
- Delete: `test/lib/__snapshots__/stack.spec.js.snap`
- Delete: `test/lib/stack-client/` (entire directory)
- Delete: `test/lib/mockStackClient.js`
- Modify: `package.json`

- [ ] **Step 1: Delete stack layer files**

Delete:
- `src/lib/stack.js`
- `src/lib/stack-client.js`
- `src/lib/realtime.js`
- `src/lib/exceptions.js`
- `test/lib/stack.spec.js`
- `test/lib/__snapshots__/stack.spec.js.snap`
- `test/lib/mockStackClient.js`
- `test/lib/stack-client/` (entire directory)

- [ ] **Step 2: Remove Redux and dead dependencies from package.json**

In `package.json`, remove from `dependencies`:
- `react-redux`
- `redux`
- `redux-logger`
- `redux-persist`
- `redux-thunk`
- `lodash.unionwith`

Also remove `cozy-interapp` from both `devDependencies` and `peerDependencies` (only imported by the now-deleted `stack-client.js`).

Keep `lodash.set` (used in `src/lib/logger.js`, not Redux-related).

The `dependencies` object becomes:
```json
"dependencies": {
  "lodash.set": "^4.3.2",
  "prop-types": "15.7.2"
}
```

- [ ] **Step 3: Reinstall dependencies**

Run: `yarn install`
Expected: Clean install with no errors.

- [ ] **Step 4: Run tests**

Run: `yarn test`
Expected: All tests pass.

- [ ] **Step 5: Run lint**

Run: `yarn lint:js`
Expected: No errors.

- [ ] **Step 6: Verify no remaining Redux/stack references**

Run:
```bash
grep -r "redux\|react-redux\|redux-thunk\|redux-logger\|redux-persist\|lib/store\|lib/stack\|lib/realtime\|lib/exceptions\|lib/reducers\|barReducers\|disableInternalStore" src/ test/ --include="*.js" --include="*.jsx"
```

Expected: No matches.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: remove stack layer and Redux dependencies

Delete lib/stack, lib/stack-client, lib/realtime, lib/exceptions.
Remove redux, react-redux, redux-thunk, redux-logger, redux-persist,
lodash.unionwith, cozy-interapp dependencies."
```
