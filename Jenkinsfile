pipeline {
agent any

```
environment {

    // Nexus Registry
    REGISTRY_URL = "192.168.21.116:8082"

    IMAGE_NAME = "room404web"

    TAG = "${BUILD_NUMBER}-${GIT_COMMIT.take(7)}"

    // OKD
    OKD_PROJECT = "room404"

    OKD_API = "https://api.lab.okd.local:6443"

    // Jenkins Credentials
    NEXUS_CREDENTIALS_ID = "nexus-registry-creds"

    OKD_TOKEN_CREDENTIALS_ID = "okd-token"
}

options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
}

stages {

    stage('Source Checkout') {
        steps {
            checkout scm

            script {
                env.SHORT_COMMIT = sh(
                    script: "git rev-parse --short HEAD",
                    returnStdout: true
                ).trim()

                env.TAG = "${BUILD_NUMBER}-${SHORT_COMMIT}"

                echo "Image Tag: ${TAG}"
            }
        }
    }

    stage('Docker Build') {
        steps {
            sh '''
            docker build \
            -t $REGISTRY_URL/$IMAGE_NAME:$TAG .
            '''
        }
    }

    stage('Nexus Login') {
        steps {
            withCredentials([
                usernamePassword(
                    credentialsId: "${NEXUS_CREDENTIALS_ID}",
                    usernameVariable: 'REG_USER',
                    passwordVariable: 'REG_PASS'
                )
            ]) {
                sh '''
                echo $REG_PASS | docker login \
                $REGISTRY_URL \
                -u $REG_USER \
                --password-stdin
                '''
            }
        }
    }

    stage('Push Image to Nexus') {
        steps {
            sh '''
            docker push \
            $REGISTRY_URL/$IMAGE_NAME:$TAG
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
                room404web=$REGISTRY_URL/$IMAGE_NAME:$TAG

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
            echo "===== PODS ====="
            oc get pods -n $OKD_PROJECT

            echo "===== SERVICES ====="
            oc get svc -n $OKD_PROJECT

            echo "===== ROUTES ====="
            oc get route -n $OKD_PROJECT

            echo "===== ROLLOUT HISTORY ====="
            oc rollout history deployment/room404web -n $OKD_PROJECT

            echo "===== DEPLOYMENT STATUS ====="
            oc get deployment room404web -n $OKD_PROJECT
            '''
        }
    }

    stage('Route Validation') {
        steps {
            sh '''
            ROUTE_URL=$(oc get route room404web \
              -n $OKD_PROJECT \
              -o jsonpath='{.spec.host}' || true)

            if [ ! -z "$ROUTE_URL" ]; then
              echo "Route URL: https://$ROUTE_URL"
              curl -k -I https://$ROUTE_URL || true
            else
              echo "Route not found"
            fi
            '''
        }
    }
}

post {

    success {

        echo "Deployment Successful"

        sh '''
        docker logout $REGISTRY_URL || true
        '''
    }

    failure {

        echo "Pipeline Failed"

        sh '''
        echo "===== POD DESCRIPTION ====="
        oc describe pods -n $OKD_PROJECT || true

        echo "===== RECENT EVENTS ====="
        oc get events -n $OKD_PROJECT --sort-by=.metadata.creationTimestamp | tail -20 || true
        '''
    }

    always {
        cleanWs()
    }
}
```

}
