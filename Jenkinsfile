pipeline {


    agent any


    environment {


        PROJECT = "room404web"


        IMAGE_NAME = "room404web"


        REGISTRY = "image-registry.openshift-image-registry.svc:5000"


        TAG = "${BUILD_NUMBER}"
    }


    stages {


        stage('Checkout Source') {
            steps {
                git branch: 'main',
                url: 'https://github.com/arshasv/room404web.git'
            }
        }


        stage('Build Docker Image') {
            steps {
                script {


                    docker.build(
                        "${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${TAG}"
                    )
                }
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
                    docker login ${REGISTRY} \
                    -u $USERNAME \
                    -p $PASSWORD
                    '''
                }
            }
        }


        stage('Push Docker Image') {


            steps {


                sh '''
                docker push ${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${TAG}


                docker tag \
                ${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${TAG} \
                ${REGISTRY}/${PROJECT}/${IMAGE_NAME}:latest


                docker push ${REGISTRY}/${PROJECT}/${IMAGE_NAME}:latest
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
                    --server=https://api.okd-cluster-url:6443 \
                    --insecure-skip-tls-verify=true


                    oc project room404web


                    oc set image deployment/room404web \
                    room404web=${REGISTRY}/${PROJECT}/${IMAGE_NAME}:${TAG}


                    oc rollout status deployment/room404web
                    '''
                }
            }
        }


        stage('Deployment Verification') {


            steps {


                sh '''
                oc get pods
                oc get deployments
                oc rollout history deployment/room404web
                '''
            }
        }
    }


    post {


        success {
            echo 'Deployment Successful'
        }


        failure {
            echo 'Deployment Failed'
        }
    }
}
