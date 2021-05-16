#!/bin/sh
# excludes temporary devices / mountings
echo "$(df -x tmpfs -x devtmpfs -m -T)"