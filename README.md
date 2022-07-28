# TheMoodyBlues

Read-only Twitter client built on electron.

## NOTE

- [作成目的] React・TypeScript・Electron の練習
- [技術構成] React+Redux+Redux-Saga

## Screenshot

![lightmode](/readme/lightmode.png)

Dark Mode is supported.
![darkmode](/readme/darkmode.png)

## Installation

```bash
yarn
```

## Setup

Add your twitter api key and secret to your .env file in the root:

```
CONSUMER_KEY='Your API Key'
CONSUMER_SECRET='Your API Secret'
```

## Starting Development

Start the app in the `development` environment:

```bash
yarn dev
```

## Packaging for Production

To package apps for the local platform:<br>
_Currently, only the unpacked directory on mac is supported._

```bash
yarn dist
```
