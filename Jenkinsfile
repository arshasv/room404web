pipeline {
    agent any

    environment {
        IMAGE_NAME = "room404web"
        TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Source Checkout') {
            steps {
                git branch: 'main',
                git 'https://github.com/arshasv/room404web.git'
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                docker build -t $REGISTRY_URL/$NAMESPACE/$IMAGE_NAME:$TAG .
                '''
            }
        }

        stage('Registry Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${NEXUS_CREDENTIALS_ID}",
                        usernameVariable: 'REG_USER',
                        passwordVariable: 'REG_PASS'
                    )
                ]) {
                    sh '''
                    echo $REG_PASS | docker login $REGISTRY_URL -u $REG_USER --password-stdin
                    '''
                }
            }
        }

        stage('Push Image') {
            steps {
                sh '''
                docker push $REGISTRY_URL/$NAMESPACE/$IMAGE_NAME:$TAG
                '''
            }
        }

        stage('Deploy to OKD') {
            steps {

                withCredentials([
                    string(
                        credentialsId: "${OKD_TOKEN_CREDENTIALS_ID}",
                        variable: 'OKD_TOKEN'
                    )
                ]) {

                    sh '''
                    oc login --token=$OKD_TOKEN --server=$OKD_API --insecure-skip-tls-verify=true

                    oc project $OKD_PROJECT

                    oc set image deployment/room404web \
                    room404web=$REGISTRY_URL/$NAMESPACE/$IMAGE_NAME:$TAG

                    oc rollout restart deployment/room404web

                    oc rollout status deployment/room404web --timeout=300s
                    '''
                }
            }
        }

        stage('Deployment Verification') {
            steps {
                sh '''
                oc get pods
                oc get svc
                oc get route
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful!'
        }

        failure {
            echo 'Pipeline Failed!'
        }
    }
}