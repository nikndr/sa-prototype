#!/bin/bash

# Update SA Demo to version 0.2
# This script updates the ConfigMap and triggers a rolling update

set -e

echo "Updating SA Demo from v0.1 to v0.2..."
echo ""

# Update ConfigMap with new version
echo "Updating ConfigMap with version 0.2..."
kubectl create configmap sa-demo-config \
  --from-literal=app-version=0.2 \
  --dry-run=client -o yaml | kubectl apply -f -

# Update deployment annotation to trigger rollout
echo "Triggering rolling update..."
kubectl patch deployment sa-demo -p \
  '{"spec":{"template":{"metadata":{"annotations":{"version":"0.2"}}}}}'

# Wait for rollout to complete
echo "Waiting for rollout to complete..."
kubectl rollout status deployment/sa-demo --timeout=5m

echo ""
echo "Update complete! SA Demo is now running version 0.2"
echo ""
echo "Deployment status:"
kubectl get pods -l app=sa-demo -o wide

echo ""
echo "Check the version in the sidebar at your ingress/service URL"
echo ""
echo "To rollback to v0.1, run: ./rollback-to-v0.1.sh"

