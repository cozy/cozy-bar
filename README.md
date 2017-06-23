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
  appEditor: APP_EDITOR
  iconPath: PATH_TO_SVG_ICON,
  lang: LOCALE
})
```

`appName` param in hash is mandatory when `appEditor`, `lang` and `iconPath` are optionals. If not passed, their values are detected into the DOM:

- `appEditor` is extracted from the manifest. Originally used for apps maintained by Cozy Cloud teams.
- `lang` is extracted from the `lang` attribute of the `<html>` tag. Defaults to 'en'
- `iconPath` uses the favicon 32px. Defaults to a blank GIF

Coming Soon application
---
Coming Soon applications (or apps) are defined in your Cozy's [configuration file](https://github.com/cozy/cozy-stack/blob/master/docs/config.md#main-configuration-file). See the `cozy.example.yaml` file [provided by the stack](https://github.com/cozy/cozy-stack/blob/master/cozy.example.yaml#L80).

Claudy actions list
---
Claudy actions are declared in `src/config/claudy.yaml` with a slug as property name and some options (icon name and link options for example). The slugs list that will be used for Claudy is defined in your Cozy's [configuration file](https://github.com/cozy/cozy-stack/blob/master/docs/config.md#main-configuration-file). See the `cozy.example.yaml` file [provided by the stack](https://github.com/cozy/cozy-stack/blob/master/cozy.example.yaml#L101).
If no `claudy_actions` property is defined in the configuration, Claudy won't be displayed.

Contribute
----------

If you want to work on cozy-client-js itself and submit code modifications, feel free to open pull-requests! See the [contributing guide][contribute] for more information about this repository structure, testing, linting and how to properly open pull-requests.


Community
---------

### Maintainer

The lead maintainer for cozy-bar.js is @m4dz, send him/her a :beers: to say hello!


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
[twitter]: https://twitter.com/mycozycloud
[mocha]: https://mochajs.org/
[should]: npmjs.com/package/should
[checkbox]: https://help.github.com/articles/basic-writing-and-formatting-syntax/#task-lists
