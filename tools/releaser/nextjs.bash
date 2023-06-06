#!/usr/bin/env bash

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "${SCRIPT}")

. ${SCRIPTPATH}/helpers.bash

clone_and_checkout "git@github.com:CrystallizeAPI/furniture-nextjs.git" ${GITHUB_REF}

# We rsync everything first
rsync -avz --delete --exclude .git ${ROOT_FOLDER}/frameworks/nextjs/ ${WORKING_DIR}/

# We copy the `tenant` folder for CLI to have the data
rm -rf ${WORKING_DIR}/provisioning/tenant
cp -r ${SHARED_FOLDER}/provisioning/tenant ${WORKING_DIR}/provisioning/

# We copy the `.github` for github read-only warnings and actions 
rm -rf ${WORKING_DIR}/.github
cp -r ${SHARED_FOLDER}/provisioning/.github ${WORKING_DIR}/

# We copy the shared folder to the application
for FOLDER in `ls -1 ${SHARED_FOLDER}/application`
do
    rm -rf ${WORKING_DIR}/application/src/${FOLDER}
    cp -r ${SHARED_FOLDER}/application/${FOLDER} ${WORKING_DIR}/application/src/${FOLDER}
done

forward_and_push_to_standalone_repo ${GITHUB_REF} ${GITHUB_SHA}
