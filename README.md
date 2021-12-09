# TheMoodyBlues

Read-only Twitter client built on electron.
![screenshot](/readme/screenshot.png)

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
*Currently, only the unpacked directory on mac is supported.*
```bash
yarn dist
```
