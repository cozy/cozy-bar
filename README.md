[![Travis build status shield](https://img.shields.io/travis/cozy/cozy-bar/master.svg)](https://travis-ci.org/cozy/cozy-bar)
[![NPM release version shield](https://img.shields.io/npm/v/cozy-bar.svg)](https://www.npmjs.com/package/cozy-bar)
[![NPM Licence shield](https://img.shields.io/npm/l/cozy-bar.svg)](https://github.com/cozy/cozy-bar/blob/master/LICENSE)


[Cozy] Bar Library
==================


What's Cozy?
------------

![Cozy Logo](https://cdn.rawgit.com/cozy/cozy-guidelines/master/templates/cozy_logo_small.svg)

[Cozy] is a platform that brings all your web services in the same private space.  With it, your webapps and your devices can share data easily, providing you with a new experience. You can install Cozy on your own hardware where no one's tracking you.


What's cozy-bar.js?
----------------

`cozy-bar.js` is a javascript library made by Cozy. It enables the _CozyBar_ component in your application. This component is a banner on the top of your application, responsible of cross-apps navigation, user facilities, intents, etc.


Use
---

`cozy-bar.js` is an asset directly served by the [cozy-stack](https://github.com/cozy/cozy-stack). To use it, simply add `<script src="/js/cozy-bar.js" defer></script>` in the `<head>` section of the `index.html` of your application. It exposes an API behind the `window.cozy.bar` namespace, that let you interact with the _CozyBar_ itself.

The library requires your markup to contain an element with `role=application` and attributes `data-cozy-domain` and `data-cozy-token`. The DOM of the banner will be added before this element.


Once you have the library included in your application, starts by intialize it in your app bootstrap:

```js
window.cozy.bar.init({
  appName: MY_APP_NAME,
  appNamePrefix: MY_APP_NAME_PREFIX
  iconPath: PATH_TO_SVG_ICON,
  lang: LOCALE
})
```

`appName` param in hash is mandatory when `appNamePrefix`, `lang` and `iconPath` are optionals. If not passed, their values are detected into the DOM:

- `appNamePrefix` is extracted from the manifest. Originally used for apps maintained by Cozy Cloud teams.
- `lang` is extracted from the `lang` attribute of the `<html>` tag. Defaults to 'en'
- `iconPath` uses the favicon 32px. Defaults to a blank GIF

To make the icon of Cozy(`icon-cozy-home.svg`) compatible with an inverted theme, please set the parameter `isInvertedTheme` to `true`

Help link
---
Help link is defined in your Cozy's [configuration file](https://github.com/cozy/cozy-stack/blob/master/docs/config.md#main-configuration-file), in the `context` section. See the `cozy.example.yaml` file [provided by the stack](https://github.com/cozy/cozy-stack/blob/master/cozy.example.yaml#L80).

Coming Soon application
---
Coming Soon applications (or apps) are defined in your Cozy's [configuration file](https://github.com/cozy/cozy-stack/blob/master/docs/config.md#main-configuration-file). See the `cozy.example.yaml` file [provided by the stack](https://github.com/cozy/cozy-stack/blob/master/cozy.example.yaml#L80).

Claudy actions list
---
Claudy actions are declared in `src/config/claudy.yaml` with a slug as property name and some options (icon name and link options for example). The slugs list that will be used for Claudy is defined in your Cozy's [configuration file](https://github.com/cozy/cozy-stack/blob/master/docs/config.md#main-configuration-file). See the `cozy.example.yaml` file [provided by the stack](https://github.com/cozy/cozy-stack/blob/master/cozy.example.yaml#L101).
If no `claudy_actions` property is defined in the configuration, Claudy won't be displayed.

Customizing the content of the bar
---
From within your app, you can decide to take over certain areas of the cozy-bar. This might especially be useful on mobile where the area it occupies is prime real estate — we generally don't recommend to use this option on larger screen resolutions.

The bar is divided in 3 areas that you can control individually : left, center and right:

![cozy-bar-triplet](https://user-images.githubusercontent.com/2261445/33609298-de4d379e-d9c7-11e7-839d-f5ab6155c902.png)

To do this, you need to call one of the 3 exposed functions like this:

```jsx
const setBarLeft = cozy.bar.setBarLeft
setBarLeft('<div>Hello!</div>')
// there's also cozy.bar.setBarCenter and cozy.bar.setBarRight
```

If you're using React, you can use the component form instead:

```jsx
const { BarLeft, BarCenter, BarRight } = cozy.bar

// then, somewhere in a render function
<BarLeft>
  <div>Hello!</div>
</BarLeft>
```

If you're using Redux and include a connected component in the bar, it might not work as expected since inside `<BarLeft>` and friends, the redux store is different.

```jsx
const MyConnectedComponent = connect(mapStateToProps, mapDispatchToProps, MyComponent)

// … in a render function
<BarLeft>
  <MyConnectedComponent /> // … you won't get the expected props from redux
</BarLeft>
```

Instead, you can do something like this:

```jsx
const MyWrappedComponent = (props) => (
<BarLeft>
  <MyComponent {...props} />
</BarLeft>
)

const MyConnectedComponent = connect(mapStateToProps, mapDispatchToProps, MyWrappedComponent)

// …in a render function
<MyConnectedComponent />
```

Change theme bar
---

It's possible to update theme on the cozy-bar with `setTheme` function.

```jsx
const { setTheme } = cozy.bar

setTheme('default')
setTheme('primary')
```

Development mode
----------

In order to add new features to the cozy-bar v7 while working on another cozy-app:

* Please ensure your app has the latest v7-stable `cozy-bar` version

* Please ensure your app has at least the 6.3.4 `cozy-scripts` version

* Then, follow these steps:

`$ yarn link` // in cozy-bar
`$ rlink cozy-bar` // in the cozy-app
`$ yarn start` // in cozy-bar
`$ yarn start` // in the cozy-app

### How does it work?

When an app (like Drive) is building, the cozy-bar assets are defined dynamically if __STACK_ASSETS__ = true
[inside the browser file](https://github.com/cozy/cozy-drive/blob/master/src/drive/targets/browser/index.ejs#L27-L32)

In [dev mode on webpack, __STACK_ASSETS__ = false](https://github.com/cozy/create-cozy-app/blob/532dc9848526d48b749a8fd4fecdce1c9a6880c2/packages/cozy-scripts/config/webpack.environment.dev.js#L27)

[In that case, the cozy-bar is injected](https://github.com/cozy/create-cozy-app/blob/532dc9848526d48b749a8fd4fecdce1c9a6880c2/packages/cozy-scripts/config/webpack.environment.dev.js#L35-L57)

Contribute
----------

If you want to work on cozy-client-js itself and submit code modifications, feel free to open pull-requests! See the [contributing guide][contribute] for more information about this repository structure, testing, linting and how to properly open pull-requests.


Community
---------

### Maintainer

The lead maintainer for cozy-bar.js is [@CPatchane](https://github.com/CPatchane), send him/her a :beers: to say hello!

### Localization

Localization and translations are handled by [Transifex][tx], which is used by all Cozy's apps.

As a _translator_, you can login to [Transifex][tx-signin] (using your Github account) and claim an access to the [app repository][tx-app]. Locales are pulled when app is build before publishing.

As a _developer_, you just have to modify json in `/src/locales`. New locales will be automatically added to Transifex. If you need to pull or push manually locales, you can use [Transifex CLI](tx-cli). If you were using a [transifex-client](tx-client), you must move to [Transifex CLI](tx-cli) to be compatible with the v3 API.

### Get in touch

You can reach the Cozy Community by:

- Chatting with us on IRC [#cozycloud on Freenode][freenode]
- Posting on our [Forum][forum]
- Posting issues on the [Github repos][github]
- Say Hi! on [Twitter][twitter]


Licence
-------

cozy-bar.js is developed by Cozy Cloud and distributed under the [MIT].



[cozy]: https://cozy.io "Cozy Cloud"
[setup]: https://dev.cozy.io/#set-up-the-development-environment "Cozy dev docs: Set up the Development Environment"
[doctypes]: https://dev.cozy.io/#main-document-types
[bill-doctype]: https://github.com/cozy-labs/konnectors/blob/master/server/models/bill.coffee
[konnector-doctype]: https://github.com/cozy-labs/konnectors/blob/master/server/models/konnector.coffee
[konnectors]: https://github.com/cozy-labs/konnectors
[MIT]: https://opensource.org/licenses/MIT
[contribute]: CONTRIBUTING.md
[freenode]: http://webchat.freenode.net/?randomnick=1&channels=%23cozycloud&uio=d4
[forum]: https://forum.cozy.io/
[github]: https://github.com/cozy/
[twitter]: https://twitter.com/cozycloud
[mocha]: https://mochajs.org/
[should]: npmjs.com/package/should
[checkbox]: https://help.github.com/articles/basic-writing-and-formatting-syntax/#task-lists
