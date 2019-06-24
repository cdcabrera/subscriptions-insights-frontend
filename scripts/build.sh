#!/usr/bin/env bash
#
#
# main()
#
{
  echo "Cleaning up build resources..."

  # clean up build output
  rm ./build/*manifest*.js*
  rm ./build/service-worker.js
  rm -rf ./build/apps
}
