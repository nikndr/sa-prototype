#!/bin/bash

# Check SA Demo deployment status and current version

echo "SA Demo Deployment Status"
echo "=============================="
echo ""

# Get current version from ConfigMap
echo "Current ConfigMap Version:"
kubectl get configmap sa-demo-config -o jsonpath='{.data.app-version}' 2>/dev/null
echo ""
echo ""

# Get deployment status
echo "Deployment Info:"
kubectl get deployment sa-demo -o wide 2>/dev/null
echo ""

# Get pod status
echo "Pods:"
kubectl get pods -l app=sa-demo -o wide 2>/dev/null
echo ""

# Get rollout history
echo "Rollout History:"
kubectl rollout history deployment/sa-demo 2>/dev/null
echo ""

# Get service info
echo "Service:"
kubectl get svc sa-demo-service 2>/dev/null
echo ""

# Show how to access
echo "To access the app:"
echo "   Port-forward: kubectl port-forward svc/sa-demo-service 8080:80"
echo "   Then visit: http://localhost:8080"

