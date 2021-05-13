#!/bin/sh
echo "CPU Cores: $(cat /proc/cpuinfo | grep processor | wc -l)"