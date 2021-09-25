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

# Const Installer Version
readonly INSTALLER_VERSION=1 # Must be identical with online version

# Const Required Dependencie Versions
readonly NEEDED_NODE_VERSION="16.0.0"

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
    printf "| More infos:                                  |\n"
    printf "| - ${GIT_REPO}     |\n"
    printf "|                                              |\n"
    printf "+----------------------------------------------+\n\n"
}

check_root() {
    if [ "$(whoami)" != "root" ]; then
        printf "${COL_NC}%s ${CROSS}\n${COL_NC}%s ${CROSS}\n" "You do not have sufficient permissions to proceed with the installation." "Please repeat the process with root (sudo) privileges!"
        exit 1
    fi
}

check_installer_version() {
    # Checks if the used script is equal to the current version hosted on github
    # If it is unequal, it tries to start the newest version from github with sudo rights
    local remote_version=$(curl -sL "${URL_VERSION_CHECK}")
    if [[ "$remote_version" == "$INSTALLER_VERSION" ]]; then
        printf "${COL_NC}%s ${TICK}\n" "Current install script is used."
    else
        printf "${COL_NC}%s ${CROSS}\n" "Outdated install script is used."
        printf "${COL_NC}%s %s\n" "Used Version:" "${INSTALLER_VERSION}"
        printf "${COL_NC}%s %s\n" "Current Version:" "${remote_version}"
        printf "${COL_NC}%s\n" "Try to run current script..."
        sleep 1
        curl -sSL "${URL_INSTALL_SCRIPT}" | sudo bash
        exit 1
    fi
}

check_nodejs() {
    version_greater_equal() {
        printf '%s\n%s\n' "$2" "$1" | sort --check=quiet --version-sort
    }

    # Checks if nodejs is installed
    if is_command node ; then
        local installed_node_version=$(node -v)

        version_greater_equal "${installed_node_version}" "${NEEDED_NODE_VERSION}" || die "need ${NEEDED_NODE_VERSION} or above"

        if [[ $installed_node_version == *"v${NEEDED_NODE_VERSION}"* ]]; then
            printf "${COL_NC}%s ${TICK}\n" "Installed NodeJS: ${installed_node_version}"
        else
            # NodeJS is installed but wrong version
            # Check if installed node is newer or older
            if [[ "xxx" == "yyy" ]]; then
                printf "${COL_NC}%s ${TICK}\n" "Installed NodeJS is newer: ${installed_node_version}"
            else
                printf "${COL_NC}%s ${CROSS}\n" "Installed NodeJS is too old. Need NodeJS v${NEEDED_NODE_VERSION} or newer."
                exit 1
            fi
        fi
    else
        # Otherwise, tell the user they need to install nodejs
        printf "${COL_NC}%s ${CROSS}\n" "NodeJS not installed. Needed at least NodeJS v${NEEDED_NODE_VERSION}"
        exit 1
    fi
}

main() {
    clear # clears terminal
    welcome_message

    printf "${COL_NC}%s\n" "Checking dependencies..."
    check_root
    check_installer_version
    check_nodejs
}

# Starting...
main