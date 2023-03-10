
WORKING_DIR=${SCRIPTPATH}/standalone-repo
ROOT_FOLDER=${SCRIPTPATH}/../../
SHARED_FOLDER=${ROOT_FOLDER}/shared

clone_and_checkout()
{
    BRANCH_NAME=$2
    STANDALONE_REPO=$1

    rm -rf ${WORKING_DIR}
    mkdir -p ${WORKING_DIR}

    echo "Cloning ${STANDALONE_REPO} to ${WORKING_DIR}"
    git clone ${STANDALONE_REPO} ${WORKING_DIR}

    # Create the branch from main if it does not exist
    if ! git show-ref --verify --quiet refs/heads/${BRANCH_NAME}; then
        git branch ${BRANCH_NAME} main
    fi
    git checkout ${BRANCH_NAME}

}

forward_and_push_to_standalone_repo()
{
    BRANCH_NAME=$1
    GIT_SHA=$2

    COMMIT_MESSAGE=$(git log -1 --pretty=format:'%s')
    COMMIT_AUTHOR_NAME=$(git log -1 --pretty=format:'%an')
    COMMIT_AUTHOR_EMAIL=$(git log -1 --pretty=format:'%ae')

    # We actually commit and push as a new commit in the standalone repo
    cd ${WORKING_DIR}
    git config --local user.email "${COMMIT_AUTHOR_EMAIL}"
    git config --local user.name "${COMMIT_AUTHOR_NAME}"
    git add .
    echo "Committing with message: ${COMMIT_MESSAGE} and author ${COMMIT_AUTHOR_NAME} <${COMMIT_AUTHOR_EMAIL}>"
    git commit -m "${COMMIT_MESSAGE}"
    git push -f origin ${BRANCH_NAME}:${BRANCH_NAME}
}
