# Manually Update gRPC API 

To keep up the SDK with the latest API changes it requires frequent update of
the generated client code.

## Steps to generate new client

To make the flow simpler all the API definitions are published  to
[buf.build/indykite/indykiteapis](https://buf.build/indykite/indykiteapis) and
will be publicly available soon.

### Install the `buf` CLI

The buf CLI enables you to create consistent Protobuf APIs that preserve
compatibility and comply with best practices.

Follow the [Installation](https://docs.buf.build/installation) instructions.

#### With Homebrew

```shell
brew install bufbuild/buf/buf
```

```shell
buf generate buf.build/indykite/indykiteapis
buf generate buf.build/envoyproxy/protoc-gen-validate 
```

## Get Started

Now as every tool are in place, let's get started. We need to download the
latest proto definitions from the registry. Current registry is private and
login required. You have to [Sign Up](https://buf.build) first.

### Log into the BSR

You can find the detailed description of
[Login](https://docs.buf.build/tour/log-into-the-bsr) but in short. You have to
create a new API Token under [User Setting](https://buf.build/settings/user) and
locally run the login command.

```shell
buf registry login
```

### Generate the client code

```shell
buf generate buf.build/indykite/indykiteapis
```
