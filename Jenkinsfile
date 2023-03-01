#!groovy
node {
    REFSPEC="+refs/pull/*:refs/remotes/origin/pr/*"
    stage("Checkout") {
        if (params != null && params.ghprbPullId == null) {
            echo 'Checking out from master'
            // master needs to be substituted with the release branch.
            REFSPEC="+refs/heads/master:refs/remotes/origin/master"
        }
        VARS = checkout(scm:[$class: 'GitSCM', branches: [[name: "${sha1}"]],
            doGenerateSubmoduleConfigurations: false,
            submoduleCfg: [],
            userRemoteConfigs: [
                [credentialsId: 'atyponci-ssh',
                name: 'origin',
                refspec: "${REFSPEC}",
                url: 'git@github.com:Atypon-OpenSource/manuscripts-article-editor.git']
            ]]
        )
    }

    stage("Build") {
        nodejs(nodeJSInstallationName: 'node_16_14_2') {
            sh (script: "yarn install --network-timeout 300000 --frozen-lockfile --non-interactive", returnStdout: true)
            sh (script: "yarn typecheck", returnStdout: true)
            sh (script: "yarn lint", returnStdout: true)
            sh (script: "yarn test", returnStdout: true)
            sh (script: "yarn build", returnStdout: true)
        }
    }
}
