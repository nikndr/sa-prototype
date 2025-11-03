#!/bin/bash

# Rollback SA Demo to version 0.1
# This script reverts the ConfigMap and rolls back the deployment

set -e

echo "Rolling back SA Demo from v0.2 to v0.1..."
echo ""

# Revert ConfigMap to version 0.1
echo "Reverting ConfigMap to version 0.1..."
kubectl create configmap sa-demo-config \
  --from-literal=app-version=0.1 \
  --dry-run=client -o yaml | kubectl apply -f -

# Rollback deployment (goes to previous revision)
echo "Executing rollback..."
kubectl rollout undo deployment/sa-demo

# Wait for rollout to complete
echo "Waiting for rollback to complete..."
kubectl rollout status deployment/sa-demo --timeout=5m

echo ""
echo "Rollback complete! SA Demo is now running version 0.1"
echo ""
echo "Deployment status:"
kubectl get pods -l app=sa-demo -o wide

echo ""
echo "Check the version in the sidebar - it should show 0.1 again"
echo ""
echo "To update to v0.2 again, run: ./update-to-v0.2.sh"

