#!/usr/bin/env bash

set -v            # print commands before execution, but don't expand env vars in output
set -o errexit    # always exit on error
set -o pipefail   # honor exit codes when piping
set -o nounset    # fail on unset variables

git clone "https://pacificocean-bot:$GH_TOKEN@github.com/HashimotoYT/e-releases" module
cd module
yarn

yarn build

# bail if nothing changed
if [ "$(git status --porcelain)" = "" ]; then
  echo "no new content found; goodbye!"
  exit
fi

git config user.email "55543306+pacificocean-bot@users.noreply.github.com"
git config user.name "Pacific Ocean Bot"
git add .
git commit -am "update mini-electron-releases"
npm version patch -m "bump patch to %s"
git push -u origin --follow-tags
echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} > .npmrc
npm publish
