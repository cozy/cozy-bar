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

[Unreleased]: https://github.com/cozy/cozy-bar/compare/v3.2.1...HEAD
[v3.2.1]: https://github.com/cozy/cozy-bar/compare/v3.2.0...v3.2.1
[v3.2.0]: https://github.com/cozy/cozy-bar/compare/v3.1.1...v3.2.0
[v3.1.1]: https://github.com/cozy/cozy-bar/compare/v3.1.0...v3.1.1
[v3.1.0]: https://github.com/cozy/cozy-bar/compare/v3.0.1...v3.1.0
[v3.0.1]: https://github.com/cozy/cozy-bar/compare/v3.0.0...v3.0.1
