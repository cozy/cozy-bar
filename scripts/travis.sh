#!/usr/bin/env bash

set -euxo pipefail

yarn lint
yarn test
yarn transpile
yarn build     
yarn shasum     
yarn test     
yarn bundlesize  
