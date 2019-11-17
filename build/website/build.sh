#!/usr/bin/env bash

# This script pushing the built copy of the this site to a staging repository

# Enable exit on failure
set -e

echo "Copying shared resources to the website folder"

echo "Copying badges to website img/badges directory"
mkdir -p website/img/badges
cp -r images/badges/256x256/*.png website/img/badges/

echo "Copying flags to website img/flags directory"
mkdir -p website/img/flags
cp -r images/flags/twemoji/png/*.png website/img/flags/

echo "Copying logos to website img/logo directory"
mkdir -p website/img/logo
cp -r images/logo/*.png website/img/logo/

echo "Copying screenshots to website img/screenshots directory"
mkdir -p website/img/screenshots
cp -r images/screenshots/*.png website/img/screenshots/

echo "Copying third party Javascript libraries into the assets directory"
# Copy the required third party libraries from the top level shared project dir
mkdir -p website/assets/js/lib/third-party/
cp -r js/lib/third-party/jquery website/assets/js/lib/third-party/
cp -r js/lib/third-party/leaflet website/assets/js/lib/third-party/
cp -r js/lib/third-party/leaflet-canvasicon website/assets/js/lib/third-party/
cp -r js/lib/third-party/leaflet-extramarkers website/assets/js/lib/third-party/
cp -r js/lib/third-party/leaflet-fullscreen website/assets/js/lib/third-party/
cp -r js/lib/third-party/leaflet-markercluster website/assets/js/lib/third-party/
cp -r js/lib/third-party/leaflet-piechart website/assets/js/lib/third-party/

echo "Copying third party CSS libraries into the assets directory"
# Copy the required third party libraries from the top level shared project dir
mkdir -p website/assets/css/third-party/
cp -r css/third-party/leaflet website/assets/css/third-party/
cp -r css/third-party/leaflet-extramarkers website/assets/css/third-party/
cp -r css/third-party/leaflet-fullscreen website/assets/css/third-party/
cp -r css/third-party/leaflet-markercluster website/assets/css/third-party/

echo "Copying data to website"
mkdir -p website/assets/js/lib/data
export DATA_GEO_JS="website/assets/js/lib/data/geo.js" && echo "var parkrun_data_geo = " > "${DATA_GEO_JS}" && cat running-challenges-data/data/parkrun-geo/parsed/geo.json >> "${DATA_GEO_JS}"
export DATA_SPECIAL_EVENTS_JS="website/assets/js/lib/data/special-events.js" && echo "var parkrun_data_special_events = " > "${DATA_SPECIAL_EVENTS_JS}" && cat running-challenges-data/data/parkrun-special-events/2018-19/parsed/all.json >> "${DATA_SPECIAL_EVENTS_JS}"

# based on https://jekyllrb.com/docs/continuous-integration/travis-ci/

# Move into the website directory
cd website

SITE_DIR=_site

# Clear out the build directory
rm -rf ${SITE_DIR} && mkdir ${SITE_DIR}

# Set the production flag
export JEKYLL_ENV=production

# Build the site
bundle install
bundle exec jekyll build

# Print summary
echo "Built site, total size: `du -sh ${SITE_DIR}`"

# Initialise the git repo
cd ${SITE_DIR}
# Add a file to say that the site doesn't need building
touch .nojekyll

# Setup git to push to the staging repo
git init
# Add the target remote
git remote add production https://${RUNNING_CHALLENGES_GITHUB_TOKEN}@github.com/fraz3alpha/running-challenges.git
# Create a new branch, and commit all the code
git checkout -b gh-pages
git add -A
git commit -m 'Travis build for production'
git log -1
git push --force production gh-pages
