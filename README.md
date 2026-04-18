# k8s-devsecops-demo

A minimal Kubernetes + DevSecOps project for KCNA exam preparation.

## Architecture
<img width="1384" height="930" alt="image" src="https://github.com/user-attachments/assets/0cad98c9-e504-49a8-8945-aecc587ed3b2" />


## What's inside

```
.
├── app/
│   ├── index.js           # Node.js HTTP server
│   ├── test.js            # Smoke tests
│   └── package.json
├── k8s/
│   ├── deployment.yaml    # Deployment + security context + probes
│   ├── service.yaml       # NodePort Service
│   ├── networkpolicy.yaml # Ingress/egress rules
│   └── rbac.yaml          # ServiceAccount + Role + RoleBinding
├── .github/workflows/
│   └── ci.yml             # Test → Build → Trivy scan → Deploy to kind
└── Dockerfile             # Multi-stage, non-root, Alpine image
```

## Quickstart

```bash
# Run locally
cd app && node index.js

# Build + scan
docker build -t hello-app:latest .
trivy image --severity HIGH,CRITICAL hello-app:latest

# Deploy to minikube
minikube start
eval $(minikube docker-env)
docker build -t hello-app:latest .
kubectl apply -f k8s/
kubectl rollout status deployment/hello-app
minikube service hello-app-svc --url
```
