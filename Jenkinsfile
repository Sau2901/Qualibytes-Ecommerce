@Library('Shared') _

pipeline {
    agent any
    
    environment {
        // Updated image names for QBShop project (DEV)
        DOCKER_IMAGE_NAME = 'satyamsri/qbshop-app'
        DOCKER_MIGRATION_IMAGE_NAME = 'satyamsri/qbshop-migration'
        DOCKER_IMAGE_TAG = "${BUILD_NUMBER}"
        GITHUB_CREDENTIALS = credentials('github-credentials')
        GIT_BRANCH = "dev"
    }
    
    stages {

        stage('Cleanup Workspace') {
            steps {
                script {
                    clean_ws()
                }
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    clone("https://github.com/Satyams-git/Qualibytes-Ecommerce.git", "dev")
                }
            }
        }

        //  NEW STAGE: Cleanup old Docker images to avoid disk full issues
        stage('Cleanup Old Docker Images') {
            steps {
                script {
                    echo "Cleaning up old Docker images, containers & volumes..."

                    // Remove dangling images
                    sh "docker image prune -f"

                    // Remove unused images older than 12 hours
                    sh "docker image prune -a --force --filter \"until=12h\""

                    // Remove stopped containers
                    sh "docker container prune -f"

                    // Remove unused volumes (safe)
                    sh "docker volume prune -f"

                    echo "Cleanup completed successfully!"
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                
                stage('Build Main App Image') {
                    steps {
                        script {
                            docker_build(
                                imageName: env.DOCKER_IMAGE_NAME,
                                imageTag: env.DOCKER_IMAGE_TAG,
                                dockerfile: 'Dockerfile',
                                context: '.'
                            )
                        }
                    }
                }
                
                stage('Build Migration Image') {
                    steps {
                        script {
                            docker_build(
                                imageName: env.DOCKER_MIGRATION_IMAGE_NAME,
                                imageTag: env.DOCKER_IMAGE_TAG,
                                dockerfile: 'scripts/Dockerfile.migration',
                                context: '.'
                            )
                        }
                    }
                }
            }
        }
        
        stage('Run Unit Tests') {
            steps {
                script {
                    run_tests()
                }
            }
        }
        
        stage('Security Scan with Trivy') {
            steps {
                script {
                    trivy_scan()
                }
            }
        }
        
        stage('Push Docker Images') {
            parallel {
                
                stage('Push Main App Image') {
                    steps {
                        script {
                            docker_push(
                                imageName: env.DOCKER_IMAGE_NAME,
                                imageTag: env.DOCKER_IMAGE_TAG,
                                credentials: 'docker-hub-credentials'
                            )
                        }
                    }
                }
                
                stage('Push Migration Image') {
                    steps {
                        script {
                            docker_push(
                                imageName: env.DOCKER_MIGRATION_IMAGE_NAME,
                                imageTag: env.DOCKER_IMAGE_TAG,
                                credentials: 'docker-hub-credentials'
                            )
                        }
                    }
                }
            }
        }
        
        stage('Update Kubernetes Manifests') {
            steps {
                script {
                    update_k8s_manifests(
                        imageTag: env.DOCKER_IMAGE_TAG,
                        manifestsPath: 'kubernetes',
                        gitCredentials: 'github-credentials',
                        gitUserName: 'Jenkins CI',
                        gitUserEmail: 'jenkins@ci.local'
                    )
                }
            }
        }
    }
}
