pipeline {
    agent {
        docker {
            image 'node:18'
            args '--userns=host \
                  -v /home/ci/.cache/yarn:/.cache/yarn \
                  -v /home/ci/.npm:/.npm'
        }
    }
    parameters {
        booleanParam(name: 'PUBLISH', defaultValue: false)
    }
    stages {
        stage('Build') {
            steps {
                sh 'yarn install --non-interactive --frozen-lockfile'
                sh 'yarn typecheck'
                sh 'yarn lint'
                sh 'yarn test'
                sh 'yarn build'
            }
        }
        stage ('Publish') {
            when {
                expression { params.PUBLISH == true }
            }
            steps {
                withCredentials([string(credentialsId: 'NPM_TOKEN_MANUSCRIPTS_OSS', variable: 'NPM_TOKEN')]) {
                    sh 'npx @manuscripts/publish'
                }
            }
        }
    }
}
