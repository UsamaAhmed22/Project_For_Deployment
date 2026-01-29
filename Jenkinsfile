@Library('Shared') _
pipeline {
    agent any

    environment {
        SONAR_HOME = tool "Sonar"
    }

    parameters {
        string(
            name: 'BACKEND_DOCKER_TAG',
            defaultValue: '',
            description: 'Docker image tag to deploy (e.g., latest, 12, v1.0.3)'
        )
    }

    stages {
        stage("Workspace cleanup") {
            steps {
                cleanWs()
            }
        }

        stage('Git: Code Checkout') {
            steps {
                git(
                    url: 'https://github.com/UsamaAhmed22/Project_For_Deployment.git',
                    branch: 'main',
                    credentialsId: 'github'
                )
            }
        }

        stage("Trivy: Filesystem scan") {
            steps {
                script {
                    trivy_scan()
                }
            }
        }

        stage("OWASP: Dependency check") {
            steps {
                script {
                    owasp_dependency()
                }
            }
        }

        stage("SonarQube: Code Analysis") {
            steps {
                script {
                    sonarqube_analysis("Sonar", "demo-project-sorting", "demo-project-sorting")
                }
            }
        }

        stage("SonarQube: Code Quality Gates") {
            steps {
                script {
                    sonarqube_code_quality()
                }
            }
        }

        stage("Docker: Build Images") {
            steps {
                script {
                    sh 'docker build -t demo-project-sorting .'
                }
            }
        }

        stage("Docker: Push to DockerHub") {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "docker",
                    usernameVariable: "dockerHubUser",
                    passwordVariable: "dockerHubPass"
                )]) {
                    sh 'echo $dockerHubPass | docker login -u $dockerHubUser --password-stdin'
                    sh "docker image tag demo-project-sorting:latest ${env.dockerHubUser}/demo-project-sorting:latest"
                    sh "docker push ${env.dockerHubUser}/demo-project-sorting:latest"
                }
            }
        }

        stage("Update: Kubernetes manifests") {
            steps {
                script {
                    if (!params.BACKEND_DOCKER_TAG?.trim()) {
                        error("BACKEND_DOCKER_TAG is empty/null. Aborting to prevent corrupting YAML.")
                    }

                    dir('kubernetes') {
                        sh """
                          echo "Updating image tag to ${params.BACKEND_DOCKER_TAG}"
                          sed -i -E 's|(image:\\s*[^ ]*/demo-project-sorting:).*|\\1${params.BACKEND_DOCKER_TAG}|' main.yml
                        """
                    }
                }
            }
        }

        stage("Git: Code update and push to GitHub") {
            steps {
                script {
                    withCredentials([
                        gitUsernamePassword(
                            credentialsId: 'github',
                            gitToolName: 'Default'
                        )
                    ]) {

                        sh '''
                          git config user.name "usama"
                          git config user.email "osamaosto@yahoo.com"
                        '''

                        def changesExist = sh(
                            script: "git status --porcelain",
                            returnStdout: true
                        ).trim()

                        if (changesExist) {
                            sh '''
                              echo "Changes detected. Committing and pushing to GitHub."
                              git add kubernetes/main.yml
                              git commit -m "chore: update image tag"
                              git push https://github.com/UsamaAhmed22/Project_For_Deployment.git main
                            '''
                        } else {
                            echo "No changes detected. Skipping commit and push."
                        }
                    }
                }
            }
        }
    }
}
