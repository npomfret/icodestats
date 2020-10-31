#!/usr/bin/env bash

echo 'deploying website for firebase'

(cd ../website && npm run build)

firebase deploy --debug --only hosting
