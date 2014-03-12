#!/bin/bash

SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
EXT_LIBS_DIR="${SCRIPTS_DIR}/../public/external_libs"

get_bootstrap() {
  VERSION="3.1.1"
  NAME="bootstrap-${VERSION}-dist"
  if [ -d ${EXT_LIBS_DIR}/${NAME} ] ; then return ; fi
  ARCHIVE=${NAME}.zip
  URL="https://github.com/twbs/bootstrap/releases/download/v${VERSION}/${ARCHIVE}"
  echo "Downloading bootstrap ${VERSION} ..."
  curl -s -O -L ${URL} && \
  unzip -q ${ARCHIVE} && rm ${ARCHIVE}
}

get_jquery() {
  VERSION="1.11.0"
  DIR_JQUERY="jquery"
  if [ -d ${EXT_LIBS_DIR}/${DIR_JQUERY} ] ; then return ; fi
  mkdir ${DIR_JQUERY}
  cd ${DIR_JQUERY}
  URL="http://code.jquery.com/jquery-${VERSION}.min.js"
  echo "Downloading jquery ${VERSION} ..."
  curl -s -O -L ${URL}
  cd ..
}

if [ ! -d ${EXT_LIBS_DIR} ] ; then mkdir -p ${EXT_LIBS_DIR} ; fi

TMP_DIR="`mktemp -d`"
cd ${TMP_DIR}

get_jquery
get_bootstrap

if [ "`ls -1`" != "" ] ; then mv * ${EXT_LIBS_DIR} ; fi
cd && rm -r ${TMP_DIR}