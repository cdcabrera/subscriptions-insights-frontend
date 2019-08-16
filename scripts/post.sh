#!/usr/bin/env bash
#
#
# Update repo with prod branches
#
branches()
{
  local CI_BRANCH=$1
  local CI_COMMIT=$2

  if [[ $CI_BRANCH != "master" ]] || [[ -z "$(${CI_COMMIT} | grep "chore(release):")" ]]; then
    return 0
  fi

  echo "Creating production release branches... "

  # git config, add remote, etc...

  git push -f --quiet origin master:prod-beta
  git push -f --quiet origin master:prod-stable

  echo "SUCCESS"
}
#
#
# Clean up build
#
clean()
{
  echo "Cleaning up build resources..."
  rm ./build/*manifest*.js*
  rm ./build/service-worker.js
}
#
#
# main()
#
{
  clean

  # see .travis.yml globals
  branches ${BRANCH} ${COMMIT_MESSAGE}
}
