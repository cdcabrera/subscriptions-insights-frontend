#!/usr/bin/env bash
#
#
# Clone, build for local development
#
gitProxy()
{
  local REPO=$PROXY_REPO
  local PROXYDIR=$DATADIR
  local PROXYDIR_REPO=$DATADIR_REPO

  mkdir -p $PROXYDIR
  rm -rf $PROXYDIR/temp
  (cd $PROXYDIR && git clone --depth=1 $REPO temp > /dev/null 2>&1)

  if [ $? -eq 0 ]; then
    printf "\n${GREEN}Cloning Proxy repo...${NOCOLOR}"

    rm -rf $PROXYDIR_REPO
    cp -R  $PROXYDIR/temp $PROXYDIR_REPO

    rm -rf $PROXYDIR/temp
    rm -rf $PROXYDIR_REPO/.git

    printf "${GREEN} clone success${NOCOLOR}\n"

  elif [ -d $PROXYDIR_REPO ]; then
    printf "${YELLOW}Unable to connect, using cached Proxy repo...${NOCOLOR}\n"
  else
    printf "${RED}Build Error, cloning Proxy repo, unable to setup Docker${NOCOLOR}\n"
    exit 1
  fi
}
#
#
# Update hosts
#
updateHosts()
{
  local PROXYDIR=$DATADIR
  local PROXYDIR_REPO=$DATADIR_REPO

  if [ $(cat /private/etc/hosts | grep -c "redhat.com") -eq 4 ]; then
    printf "${BLUE}Hosts already up-to-date${NOCOLOR}\n"
  else
    printf "${RED}Updating hosts... you may need to \"allow write access\"...${NOCOLOR}\n"
    sh $PROXYDIR_REPO/scripts/patch-etc-hosts.sh || sudo sh $PROXYDIR_REPO/scripts/patch-etc-hosts.sh
    echo "Hosts file updated $(date)" >> "$PROXYDIR/hosts.txt"
    printf "${GREEN}Hosts file updated${NOCOLOR}\n"
  fi
}
#
#
# Quick check to see if a container is running
#
checkContainerRunning()
{
  local CHECKONE=$1
  local COUNT=1
  local DURATION=10
  local DELAY=0.1

  printf "Check container running..."

  while [ $COUNT -le $DURATION ]; do
    sleep $DELAY
    (( COUNT++ ))
    if [ -z "$(docker ps | grep $CHECKONE)" ]; then
      break
    fi
  done

  if [ ! -z "$(docker ps | grep $CHECKONE)" ]; then
    printf "${GREEN}Container SUCCESS"
    printf "\n\n${NOCOLOR}"
  else
    printf "${RED}Container ERROR"
    printf "\n\n  Error: ${RED}Check container \"${CHECKONE}\""
    printf "${NOCOLOR}\n"
  fi
}
#
#
# Run the proxy
#
runProxy()
{
  local RUN_CONTAINER=$CONTAINER
  local RUN_NAME=$CONTAINER_NAME
  local RUN_DOMAIN=$1
  local RUN_PORT=$2
  local RUN_CONFIG=$3
  #local RUN_HOST="${3:-localhost}"

  docker stop -t 0 $RUN_NAME >/dev/null

  #"insights:proxy": "docker stop -t 0 insightsproxy >/dev/null;
  if [ -z "$(docker images -q $RUN_CONTAINER)" ]; then
    echo "Setting up development Docker proxy container"
    docker pull $RUN_CONTAINER
  fi

  if [ -z "$(docker ps | grep $RUN_CONTAINER)" ]; then
    echo "Starting development proxy..."


    if [ ! -z "$RUN_CONFIG" ]; then
      RUN_CONFIG="-e CUSTOM_CONF=true -v ${RUN_CONFIG}:/config/spandx.config.js"
    fi

    docker run -d --rm -p $RUN_PORT:1337 $RUN_CONFIG -e LOCAL_CHROME -e PLATFORM -e PORT -e LOCAL_API -e SPANDX_HOST -e SPANDX_PORT --name $RUN_NAME $RUN_CONTAINER >/dev/null
  fi

  checkContainerRunning $RUN_NAME

  if [ ! -z "$(docker ps | grep $RUN_CONTAINER)" ]; then
    printf "  ${YELLOW}Container: $(docker ps | grep $RUN_CONTAINER | cut -c 1-50)${NOCOLOR}\n"
    echo "  Development proxy running: http://${RUN_DOMAIN}:${RUN_PORT}/"
    printf "  To stop: $ ${YELLOW}docker stop ${RUN_NAME}${NOCOLOR}\n"
  fi

  exit 0
}
#
#
# main()
#
{
  BLUE="\e[34m"
  RED="\e[31m"
  GREEN="\e[32m"
  YELLOW="\e[33m"
  NOCOLOR="\e[39m"

  DOMAIN="localhost"
  PORT=1337
  CONFIG=""


  PROXY_REPO="https://github.com/RedHatInsights/insights-proxy.git"
  DATADIR="$(pwd)/.proxy"
  DATADIR_REPO="$(pwd)/.proxy/insights-proxy"
  CONTAINER="redhatinsights/insights-proxy"
  CONTAINER_NAME="insightsproxy"

  while getopts p:c:d: option;
    do
      case $option in
        p ) PORT="$OPTARG";;
        c ) CONFIG="$OPTARG";;
        d ) DOMAIN="$OPTARG";;
      esac
  done

  gitProxy
  updateHosts
  runProxy $DOMAIN $PORT $CONFIG
}
