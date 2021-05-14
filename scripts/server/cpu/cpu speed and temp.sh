#!/bin/bash
#
# Usage:       sh-pi-get_cpu_temp
#
# Monitors CPU clock speed and temperature.
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#

cpu_freq=/sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq
cpu_temp=/sys/class/thermal/thermal_zone0/temp
if [ -e $cpu_freq ] ; then
  if [ -e $cpu_temp ] ; then
    clk=$(cat $cpu_freq)
    cpu=$(cat $cpu_temp)
    echo -ne $(($clk/1000))" Mhz / "$(($cpu/1000))" C \r" 
  fi
fi