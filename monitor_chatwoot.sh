#!/bin/bash

CONTAINER_NAME="chatwoot-rails-1"
ERROR_MESSAGE="WebSocket error occurred: Broken pipe"
LOG_CHECK_INTERVAL=60  # Cada cuántos segundos revisar logs

while true; do
    if docker logs --tail 50 $CONTAINER_NAME 2>&1 | grep -q "$ERROR_MESSAGE"; then
        echo "$(date): Error detectado, reiniciando $CONTAINER_NAME..."
        docker restart $CONTAINER_NAME
    fi
    sleep $LOG_CHECK_INTERVAL
done