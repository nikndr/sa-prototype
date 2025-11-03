#!/bin/bash

# Resilient port-forward script that automatically reconnects
# Usage: ./port-forward.sh [local-port] [remote-port]

LOCAL_PORT=${1:-8080}
REMOTE_PORT=${2:-80}
SERVICE_NAME="sa-demo-service"

echo "Starting resilient port-forward to ${SERVICE_NAME} on localhost:${LOCAL_PORT}"
echo "Press Ctrl+C to stop"
echo ""

# Trap Ctrl+C to clean up
trap 'echo ""; echo "Port-forward stopped"; exit 0' INT

while true; do
    echo "Connecting to ${SERVICE_NAME}..."
    kubectl port-forward svc/${SERVICE_NAME} ${LOCAL_PORT}:${REMOTE_PORT} 2>&1 | while IFS= read -r line; do
        if [[ $line == *"Forwarding from"* ]]; then
            echo "Connected: $line"
        elif [[ $line == *"Handling connection"* ]]; then
            # Suppress connection handling messages to reduce noise
            :
        elif [[ $line == *"error"* ]] || [[ $line == *"Error"* ]]; then
            echo "Error: $line"
        fi
    done
    
    # If port-forward exits, wait a moment and reconnect
    echo "Connection lost. Reconnecting in 2 seconds..."
    sleep 2
done

