#!/usr/bin/env bash

# Installs and Updates Pi-Control 🐱‍👤
# More infos about this project on Github.
# https://github.com/borsTiHD/pi-control
#
# Script inspiration from pi-hole
# https://pi-hole.net/

# Install with this command (from your Linux machine):
#
# curl -sSL xxx | bash

# -e option instructs bash to immediately exit if any command [1] has a non-zero exit status
# We do not want users to end up with a partially working install, so we exit the script
# instead of continuing the installation with something broken
set -e

# Append common folders to the PATH to ensure that all basic commands are available.
# When using "su" an incomplete PATH could be passed: https://github.com/pi-hole/pi-hole/issues/3209
export PATH+=':/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'

######## VARIABLES #########
# For better maintainability, we store as much information that can change in variables
# This allows us to make a change in one place that can propagate to all instances of the variable
# These variables should all be GLOBAL variables, written in CAPS
# Local variables will be in lowercase and will exist only within functions

# Const Version
readonly INSTALLER_VERSION=1 # Must be identical with online version

# Const URLs
readonly URL_INSTALL_SCRIPT="https://raw.githubusercontent.com/borsTiHD/pi-control/feature/install-script/installer/basic-install.sh" # TODO!!! - Needs to set branch to main in url
readonly URL_VERSION_CHECK="https://raw.githubusercontent.com/borsTiHD/pi-control/feature/install-script/installer/version.txt" # TODO!!! - Needs to set branch to main in url
readonly GIT_REPO="https://github.com/borsTiHD/pi-control"

# Const Paths
readonly PI_CONTROL_INSTALL_DIR="/opt/pi-control/"

# Const Colors (pi-hole)
readonly COL_NC='\e[0m' # No Color
readonly COL_BLUE='\e[1;34m'
readonly COL_LIGHT_GREEN='\e[1;32m'
readonly COL_LIGHT_RED='\e[1;31m'
readonly TICK="[${COL_LIGHT_GREEN}✓${COL_NC}]"
readonly CROSS="[${COL_LIGHT_RED}✗${COL_NC}]"
readonly INFO="[i]"

is_command() {
    # Checks to see if the given command (passed as a string argument) exists on the system.
    # The function returns 0 (success) if the command exists, and 1 if it doesn't.
    # source: pi-hole
    local check_command="$1"
    command -v "${check_command}" >/dev/null 2>&1
}

welcome_message() {
    printf "${COL_BLUE}" # Blue text
    printf "+----------------------------------------------+\n"
    printf "| PUT LOGO HERE                                |\n"
    printf "|                                              |\n"
    printf "| Welcome to install Pi-Control                |\n"
    printf "|                                              |\n"
    printf "| Installer: v%s                                |\n" "${INSTALLER_VERSION}"
    printf "| More Infos:                                  |\n"
    printf "| - ${GIT_REPO}     |\n"
    printf "|                                              |\n"
    printf "+----------------------------------------------+\n\n"
}

check_root() {
    if [ "$(whoami)" != "root" ]
    then
        printf "${COL_NC}%s ${CROSS}\n${COL_NC}%s ${CROSS}\n" "You do not have sufficient permissions to proceed with the installation." "Please repeat the process with root (sudo) privileges!"
        exit 1
    fi
}

check_installer_version() {
    if [[ "$(curl -X GET -L -s "${URL_VERSION_CHECK}")" -le INSTALLER_VERSIONCODE ]]
    then
        printf "${COL_NC}%s ${TICK}\n" "Current install script is used."
    else
        printf "${COL_NC}%s ${CROSS}\n" "Outdated install script is used."
        printf "${COL_NC}%s\n" "Try to run current script..."
        sleep 1
        curl -sSLH 'Cache-Control: no-cache' "${URL_INSTALL_SCRIPT}" # | sudo bash
        exit 1
    fi
}

main() {
    clear # clears terminal
    welcome_message
    check_root
    check_installer_version
}

# Starting...
main
