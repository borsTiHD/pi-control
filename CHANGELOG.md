# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2021-09-13
### Added
- App: New user menu displaying users gravatar, if it exists. For that, a hashed email address will be send to [gravatar.com](https://gravatar.com)
- App: New donation button integrated. Small enough to hopefully not be distracting.

### Changed
- App: Removing settingsbar and integrated all functionality into new user menu and normal sidebar.
- App: Changing default font to poppins.
- App: Changing icons from icon-font to '@mdi/js' for better treeshaking and smaller build size.
- App: Changing default theme colors.
- App: Changing styles for switch inputs.
- App: Changing page title to represent the current module.
- App: Changing hidden dev page position (only for dev).
- App: Upgraded a bunch of dependencies.

### Refactor
- Dashboard: Completely rebuilt. Data will be collected over sockets. Added CPU Usage / Temperatur charts for history data.
- Processes: Completely rebuilt. Checks running processes with 'ps'. In addition, windows is now supported. 🤷‍♀️
- Backend: Alot was rewritten on the backend.

## [0.2.0] - 2021-08-05
### Added
- Terminal: New page to start terminals on the host system.

### Changed
- App: Update dependencies.

## [0.1.0] - 2021-07-31
### Added
- Themes: New default theme has been added, moreover users can choose between several themes and even create their own.
- App: Adding new icons.
- PWA: Adding pwa functionality. User can install the app on their devices (add to home screen).
- Swagger: Adding Swagger documentation for the backends REST Api. Only for developer mode.
- Developing: New '.env' variable added. Set 'DEV_USER' to 'true' and you can login with default user for developing purpose.

### Changed
- App: Update dependencies.

## [0.0.2] - 2021-07-09
### Added
- Socket.IO: Adding socket functionality.
- Processes: New page for watching running processes.

### Changed
- Persisted settings: Using new way to save settings with vuex instead of indexeddb
- Better release process (just for development)
- Bringing dependencies up to date

## [0.0.1] - 2021-06-13
### Added
- First official release of pi-control 🥳

[Unreleased]: https://github.com/borsTiHD/pi-control/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/borsTiHD/pi-control/releases/tag/v0.3.0
[0.2.0]: https://github.com/borsTiHD/pi-control/releases/tag/v0.2.0
[0.1.0]: https://github.com/borsTiHD/pi-control/releases/tag/v0.1.0
[0.0.2]: https://github.com/borsTiHD/pi-control/releases/tag/v0.0.2
[0.0.1]: https://github.com/borsTiHD/pi-control/releases/tag/v0.0.1