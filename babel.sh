#!/usr/bin/env bash
watch=""
if [ "x$1" == "xwatch" ]; then watch="--watch "; fi
eval "./node_modules/babel-cli/bin/babel.js ${watch}-d ./js/ ./_js/"
