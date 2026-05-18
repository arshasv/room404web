pipeline {

    agent {
        label 'linux'
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {

        REGISTRY_URL = "default-route-openshift-image-registry.apps.okd.example.com"

        NAMESPACE = "room404web"

        IMAGE_NAME = "room404web"

        OKD_PROJECT = "room404web"

        TAG = "${BUILD_NUMBER}"

        OKD_API = "https://api.okd-cluster-url:6443"
    }

    stages {

        stage('Validate Tools') {

            steps {

                sh '''
                echo "Checking tools..."

                docker --version
                oc version --client
                '''
            }
        }

        stage('Build Docker Image') {

            steps {

                sh '''
                docker build -t \
                ${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:${TAG} .
                '''
            }
        }

        stage('Registry Login') {

            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-creds',
                        usernameVariable: 'USERNAME',
                        passwordVariable: 'PASSWORD'
                    )
                ]) {

                    sh '''
                    echo $PASSWORD | docker login \
                    ${REGISTRY_URL} \
                    -u $USERNAME \
                    --password-stdin
                    '''
                }
            }
        }

        stage('Push Docker Image') {

            steps {

                sh '''
                docker push \
                ${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:${TAG}

                docker tag \
                ${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:${TAG} \
                ${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:latest

                docker push \
                ${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Deploy to OKD') {

            steps {

                withCredentials([
                    string(
                        credentialsId: 'okd-token',
                        variable: 'TOKEN'
                    )
                ]) {

                    sh '''
                    oc login \
                    --token=$TOKEN \
                    --server=${OKD_API} \
                    --insecure-skip-tls-verify=true

                    oc project ${OKD_PROJECT}

                    oc set image deployment/room404web \
                    room404web=${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:${TAG}

                    oc rollout restart deployment/room404web

                    oc rollout status deployment/room404web \
                    --timeout=300s
                    '''
                }
            }
        }

        stage('Deployment Verification') {

            steps {

                sh '''
                oc get pods

                oc get deployment

                oc rollout history deployment/room404web
                '''
            }
        }
    }

    post {

        always {

            sh '''
            docker system prune -f || true
            docker image prune -f || true
            '''

            cleanWs()
        }

        success {

            echo 'Deployment Successful'
        }

        failure {

            echo 'Deployment Failed'
        }
    }
}