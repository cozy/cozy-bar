# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).


## [Unreleased] - XXXX-XX-XX
### Changed
- none yet

### Fixed
- none yet

### Added
- none yet

### Removed
- none yet


## [v4.3.7] - 2017-11-08
### Fixed
- Remove a typo causing a bug in the search bar component :ambulance: [[390ff7b]](https://github.com/cozy/cozy-bar/commit/390ff7bb34f5d0aa082bcf10acf65a1205ba69ce)


## [v4.3.6] - 2017-11-08
### Changed
- styl: Remove unnecessary space on mobile application :art: [[bbea1bd]](https://github.com/cozy/cozy-bar/commit/bbea1bd44b768883784dd81f2bfeb0f1e241f841)
- lint: fix lint issues + add config file using eslint-config-cozy-app :rotating_light: [[587ae08]](https://github.com/cozy/cozy-bar/commit/587ae08a9773830e2559054c577cc7cf518e55ee)
- fix: use data-tutorial attribute for buttons targeted by app tutorials :art: [[564d7b8]](https://github.com/cozy/cozy-bar/commit/564d7b8b97f2625a1b3a1a9eaa16086cd06c7901)
- chore: use eslint for linting (cozy-app standard config) :rotating_light: [[d688455]](https://github.com/cozy/cozy-bar/commit/d688455d219e0f2bffa63f7232a23576203c69bb)
- styl: reduce item size in apps lists :lipstick: [[af83f45]](https://github.com/cozy/cozy-bar/commit/af83f45f3040f7426b606d710b1d03354a17b202)


## [v4.3.5] - 2017-11-3
### Fixed
- Uncaught error on Safari mobile caused blank screens


## [v4.3.4] - 2017-11-2
### Fixed
- Drawer can be opened on mobile
- Languages are working again


## [v4.3.3] - 2017-10-31
### Added
- API to set content of the Bar (setBar{Right,Left,Center} and <Bar{Left,Right, Center} />)

v4.3.0, v4.3.2, v4.3.3 are only there because of build problems on Travis.

### Removed
- none yet


## [v4.2.6] - 2017-10-25
### Add
- Add ability to display on mobile
- Expose a new method `setLocale` to change the bar locale without reloading the app page

### Changed
- Update intents library
- Remove useless then() for support intent
- Remove some unused styles
- Update dependencies
- Change `Apps` button icon


## [v4.2.5] - 2017-10-04
### Added
- Modal allowing to send email to support when click on "Help" link


## [v4.2.4] - 2017-09-26
### Fixed
- Re-instaured spacer between the app title and navigation icons


## [v4.2.3] - 2017-09-26
### Fixed
- Fucked up the previous release


## [v4.2.2] - 2017-09-26
### Fixed
- Temporarily disable the searchbar


## [v4.2.1] - 2017-09-21
### Fixed
- Prevent the search bar from taking up too much space


## [v4.2.0] - 2017-09-19
### Changed
- Updated cozy-client-js

### Added
- Added the search bar


## [v4.1.4] - 2017-08-08
### Changed
- Update intent lib according to new cozy-client-js update to handle `resizeClient()` css transition
- Better handling Claudy active status (desktop version)


## [v4.1.3] - 2017-07-26
### Fixed
- Bug about coming soon apps filtering


## [v4.1.2] - 2017-07-24
### Changed
-  Better claudy loading CSS animation

### Removed
-  Some now unused tx locales


## [v4.1.1] - 2017-07-21
### Fixed
-  Do not hijack click outside the nav for react apps


## [v4.1.0] - 2017-07-21
### Changed
- Now the Claudy menu is displayed as an intent using a `cozy-settings` service.


## [v4.0.2] - 2017-07-12
### Fixed
- Apps are now opened in the same tab


## [v4.0.1] - 2017-07-11
### Fixed
- Fix `__SERVER__ is not defined` error


## [v4.0.0] - 2017-07-10
### Changed
- Rewrited entirely using preact/preact-compat with JSX components
- Better popups and drawer displaying/hidding transition

### Fixed
- Bug about displaying blue spinner at apps/settings loading
- Bug about duplicated items in settings menu

### Added
- Dependencies due to Preact usage

### Removed
- SvelteJS usage and dependency
- Some now unused dependencies


## [v3.2.2] - 2017-07-06
### Fixed
- filter coming soon app


## [v3.2.1] - 2017-07-06 [YANKED]
### Fixed
- filter coming soon app


## [v3.2.0] - 2017-07-05
### Changed
- Help link is now fetched from stack context

### Fixed
- Avoid apps being displayed twice


## [v3.1.1] - 2017-06-27
### Fixed
- Force claudy to rerender when the locale changes
- Fix bug about others apps category not alwayes at the end of the list
- Don't allow to close the drawer when Claudy is opened
- Fix bug when app detection for Claudy app links

### Added
- Piwik environment variables for production build


## [v3.1.0] - 2017-06-26
### Changed
- The 'others' apps category will always be displayed at the end of the apps list

### Fixed
- Long app name are correctly handled using ellipsis in the apps list of the desktop view

### Added
- Claudy: a list of actions available for the Cozy and suggested to the user (according the Cozy context setting), in desktop and mobile views


## [v3.0.1] - 2017-06-23
### Fixed
- Fixed wrong path for Cozy Store icon


## [v3.0.0] - 2017-06-20
### Changed
- Support link href

[Unreleased]: https://github.com/cozy/cozy-bar/compare/v4.3.7...HEAD
[v4.3.7]: https://github.com/cozy/cozy-bar/compare/v4.3.6...v4.3.7
[v4.3.6]: https://github.com/cozy/cozy-bar/compare/v4.3.5...v4.3.6
[v4.3.5]: https://github.com/cozy/cozy-bar/compare/v4.3.4...v4.3.5
[v4.3.4]: https://github.com/cozy/cozy-bar/compare/v4.3.3...v4.3.4
[v4.3.3]: https://github.com/cozy/cozy-bar/compare/v4.2.6...v4.3.3
[v4.2.6]: https://github.com/cozy/cozy-bar/compare/v4.2.5...v4.2.6
[v4.2.5]: https://github.com/cozy/cozy-bar/compare/v4.2.4...v4.2.5
[v4.2.4]: https://github.com/cozy/cozy-bar/compare/v4.2.3...v4.2.4
[v4.2.3]: https://github.com/cozy/cozy-bar/compare/v4.2.2...v4.2.3
[v4.2.2]: https://github.com/cozy/cozy-bar/compare/v4.2.1...v4.2.2
[v4.2.1]: https://github.com/cozy/cozy-bar/compare/v4.2.0...v4.2.1
[v4.2.0]: https://github.com/cozy/cozy-bar/compare/v4.1.4...v4.2.0
[v4.1.4]: https://github.com/cozy/cozy-bar/compare/v4.1.3...v4.1.4
[v4.1.3]: https://github.com/cozy/cozy-bar/compare/v4.1.2...v4.1.3
[v4.1.2]: https://github.com/cozy/cozy-bar/compare/v4.1.1...v4.1.2
[v4.1.1]: https://github.com/cozy/cozy-bar/compare/v4.1.0...v4.1.1
[v4.1.0]: https://github.com/cozy/cozy-bar/compare/v4.0.2...v4.1.0
[v4.0.2]: https://github.com/cozy/cozy-bar/compare/v4.0.1...v4.0.2
[v4.0.1]: https://github.com/cozy/cozy-bar/compare/v4.0.0...v4.0.1
[v4.0.0]: https://github.com/cozy/cozy-bar/compare/v3.2.1...4.0.0
[v3.2.1]: https://github.com/cozy/cozy-bar/compare/v3.2.0...v3.2.1
[v3.2.0]: https://github.com/cozy/cozy-bar/compare/v3.1.1...v3.2.0
[v3.1.1]: https://github.com/cozy/cozy-bar/compare/v3.1.0...v3.1.1
[v3.1.0]: https://github.com/cozy/cozy-bar/compare/v3.0.1...v3.1.0
[v3.0.1]: https://github.com/cozy/cozy-bar/compare/v3.0.0...v3.0.1
