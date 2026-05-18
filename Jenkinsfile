pipeline {
    agent any

    environment {

        IMAGE_NAME = "room404web"

        TAG = "${BUILD_NUMBER}"

        OKD_PROJECT = "room404web"

        OKD_API = "https://api.crc.testing:6443"

        REGISTRY_URL = "default-route-openshift-image-registry.apps-crc.testing"

        OKD_TOKEN_CREDENTIALS_ID = "okd-token"
    }

    stages {

        stage('Docker Build') {
            steps {
                sh '''
                docker build -t $REGISTRY_URL/$OKD_PROJECT/$IMAGE_NAME:$TAG .
                '''
            }
        }

        stage('Registry Login') {
            steps {

                withCredentials([
                    string(
                        credentialsId: "${OKD_TOKEN_CREDENTIALS_ID}",
                        variable: 'OKD_TOKEN'
                    )
                ]) {

                    sh '''
                    echo $OKD_TOKEN | docker login $REGISTRY_URL \
                    -u developer --password-stdin
                    '''
                }
            }
        }

        stage('Push Image') {
            steps {
                sh '''
                docker push $REGISTRY_URL/$OKD_PROJECT/$IMAGE_NAME:$TAG
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
                    oc login \
                    --token=$OKD_TOKEN \
                    --server=$OKD_API \
                    --insecure-skip-tls-verify=true

                    oc project $OKD_PROJECT

                    oc set image deployment/room404web \
                    room404web=$REGISTRY_URL/$OKD_PROJECT/$IMAGE_NAME:$TAG

                    oc rollout restart deployment/room404web

                    oc rollout status deployment/room404web --timeout=300s
                    '''
                }
            }
        }

        stage('Deployment Verification') {
            steps {
                sh '''
                oc get pods -n $OKD_PROJECT
                oc get svc -n $OKD_PROJECT
                oc get route -n $OKD_PROJECT
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