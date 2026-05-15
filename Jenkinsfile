pipeline {
    agent any

    environment {
        IMAGE_NAME = "room404web"
        IMAGE_TAG = "v1"
        ARTIFACT_DIR = "/home/user/docker-artifacts"
    }

    stages {

        stage('Checkout Source') {
            steps {
                git 'https://github.com/arshasv/room404web.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Generate Artifact') {
            steps {
                sh '''
                mkdir -p $ARTIFACT_DIR
                docker save $IMAGE_NAME:$IMAGE_TAG > $ARTIFACT_DIR/$IMAGE_NAME.tar
                '''
            }
        }

        stage('Push Artifact Repository') {
            steps {
                echo 'Artifact stored locally'
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }
    }
}