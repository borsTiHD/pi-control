#!/bin/sh
echo "$(cat /proc/cpuinfo | grep processor | wc -l)"