node("cisc && !cisc03") {
    stage("Checkout") {
        VARS = checkout(scm:[$class: 'GitSCM',
            doGenerateSubmoduleConfigurations: false,
            submoduleCfg: [],
            userRemoteConfigs: [
                [credentialsId: '336d4fc3-f420-4a3e-b96c-0d0f36ad12be',
                name: 'origin',
                url: 'git@github.com:Atypon-OpenSource/manuscripts-article-editor.git']
            ]]
        )
        echo "VARS: $VARS"
    }

    stage("Build") {
        nodejs(nodeJSInstallationName: 'node 12.22.1') {
            sh (script: "yarn install --frozen-lockfile --non-interactive",
                label: "yarn install",
                returnStdout: true)

            sh (script: "yarn typecheck",
                label: "yarn typecheck",
                returnStdout: true)

            sh (script: "yarn lint",
                label: "yarn lint",
                returnStdout: true)

            sh (script: "yarn test --ci --coverage --reporters=default --reporters=jest-junit",
                label: "yarn test",
                returnStdout: true)

            env.ALLOW_MISSING_VARIABLES=1
            
            sh "printenv"

            sh (script: "yarn build",
                label: "yarn build",
                returnStdout: true)

            // sh (script: "yarn bundlesize",
            //     label: "yarn bundlesize",
            //     returnStdout: true)
        }
    }

    stage("Tests report") {
        junit "junit.xml"
    }

    if (VARS.GIT_BRANCH == "origin/main") {
        stage ("Publish") {
            withCredentials([string(credentialsId: 'NPM_TOKEN_MANUSCRIPTS_OSS', variable: 'NPM_TOKEN')]) {
                sh ("""cat << EOF >.npmrc \
//registry.npmjs.org/:_authToken=$NPM_TOKEN \
EOF""")
                sh ("npx @manuscripts/publish")
                sh "rm -f .npmrc"
            }
        }
    }
}

