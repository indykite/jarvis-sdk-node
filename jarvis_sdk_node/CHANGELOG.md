# Changelog
## [0.1.13](https://github.com/indykite/jarvis-sdk-node/compare/v0.1.12...v0.1.13) (2022-07-22)


### Features

* add support for oauth2 client management ([878d223](https://github.com/indykite/jarvis-sdk-node/commit/878d223f62d1aa702acea96408c3497e10ddba40))

## [0.1.12](https://github.com/indykite/jarvis-sdk-node/compare/v0.1.11...v0.1.12) (2022-07-20)


### Bug Fixes

* export missing import digital twin classes ([991fc12](https://github.com/indykite/jarvis-sdk-node/commit/991fc12ae706f2b688bd253748603e4c33d0ae37))

## [0.1.11](https://github.com/indykite/jarvis-sdk-node/compare/v0.1.10...v0.1.11) (2022-07-20)


### Features

* add support for importing digital twins ([ec0f737](https://github.com/indykite/jarvis-sdk-node/commit/ec0f73796b4b62c5b5bac9240afacd80f5345f90))

## [0.1.10](https://github.com/indykite/jarvis-sdk-node/compare/v0.1.9...v0.1.10) (2022-07-01)


### Features

* add crud + list ops for app agent and creds ([463f7f3](https://github.com/indykite/jarvis-sdk-node/commit/463f7f3ebc7d2875c4ccf9a743b0faf8b49c109b))
* add crud operations for oauth2 applications ([96a6027](https://github.com/indykite/jarvis-sdk-node/commit/96a6027679d995fff7c9bbbcfbb13d6f7ee9e0e1))
* allow to modify tenants and applications ([7d786a5](https://github.com/indykite/jarvis-sdk-node/commit/7d786a56b5f2a425177a26beccd9b2fa1416c7f1))
* support token enrichment ([2f34f7e](https://github.com/indykite/jarvis-sdk-node/commit/2f34f7eb721b799c41b7d531e9a6259510e1d0e6))


### Bug Fixes

* allow to send empty string request payloads ([3008686](https://github.com/indykite/jarvis-sdk-node/commit/3008686e1a05cfb6829a910a230a2343f3c0d696))
* create app space returns obj instead of id ([c94be99](https://github.com/indykite/jarvis-sdk-node/commit/c94be991d1de6edae665e1688a71f84fcb6dad2b))
* fix interceptor when received message is null ([0434826](https://github.com/indykite/jarvis-sdk-node/commit/0434826de5ce811ae68ee14ef81979806e659e61))
* fix multiple messages from 1 grpc request ([2ebdf68](https://github.com/indykite/jarvis-sdk-node/commit/2ebdf68ea10197c86c8ba97c0dae5ee1b6292ce2))

### [0.1.9](https://github.com/indykite/jarvis-sdk-node/compare/v0.1.8...v0.1.9) (2022-05-04)


### Bug Fixes

* expose config client type ([96bc02a](https://github.com/indykite/jarvis-sdk-node/commit/96bc02a6c6486dadc95a7f88e1d11cb5aaff2900))

### [0.1.8](https://github.com/indykite/jarvis-sdk-node/compare/v0.1.7...v0.1.8) (2022-04-22)


### Features

* support for email invitation ([a690a1b](https://github.com/indykite/jarvis-sdk-node/commit/a690a1baa95b5db93454a8bcd3fcf28919f42d7f))

### [0.1.7](https://github.com/indykite/jarvis-sdk-node/compare/v0.1.6...v0.1.7) (2022-04-13)


### Features

* add support for uuids encoded with 32 chars ([dfa186e](https://github.com/indykite/jarvis-sdk-node/commit/dfa186ec8204e294a973b26192bfe84382ccb2b0))
* parse postal address ([ce65690](https://github.com/indykite/jarvis-sdk-node/commit/ce656902bd74da363af365dbaa8e7ae7dea796f6))


### Bug Fixes

* use new protobuf definitions in code ([04752be](https://github.com/indykite/jarvis-sdk-node/commit/04752be1e7872b837fca4298603258a29e90525a))

### [0.1.6](https://github.com/indykite/jarvis-sdk-node/compare/v0.1.5...v0.1.6) (2022-03-22)


### Features

* add read customer and crud + list app spaces ([0198794](https://github.com/indykite/jarvis-sdk-node/commit/0198794fcff5e2228ca69bd4e25ac1971efc4ae7))


### Bug Fixes

* fix the chanelog path ([40d6cd4](https://github.com/indykite/jarvis-sdk-node/commit/40d6cd4657fd672183d8ef56973f9faa359dc3a9))
* fix the path in readme ([40d6cd4](https://github.com/indykite/jarvis-sdk-node/commit/40d6cd4657fd672183d8ef56973f9faa359dc3a9))
* use the parent path for Changelog ([40d6cd4](https://github.com/indykite/jarvis-sdk-node/commit/40d6cd4657fd672183d8ef56973f9faa359dc3a9))

## 0.1.5

- [FEATURE] Allow to get a digital twin property by ID
## 0.1.4

- [FIX] Fixed  in the patch properties builder
- [TESTS] Added unit tests
## 0.1.3

- [BUILD] Add test coverage report to the pipeline
- [DOCS] Fix Trial link and logo in README file
## 0.1.2

- [Actions] Add automated release pipeline
- [Actions] Remove duplicate step in publish flow
## 0.1.1

- [FIX] Fixed method for consent verifier token creation (createConsentVerifier). Now it accepts list of scopes, list of audiences, session details and details for remembering the authorization.

## 0.1.0

- [RELEASE] Initial Release
