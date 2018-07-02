#!/usr/bin/env bash

export GIT_COMMIT_HASH=`git rev-parse --short HEAD`
export GIT_VERSION=`git describe --always`
