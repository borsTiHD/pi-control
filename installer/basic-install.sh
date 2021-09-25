#!/usr/bin/env bash

# Installs and Updates Pi-Control 🐱‍👤
# More infos about this project on Github.
# https://github.com/borsTiHD/pi-control
#
# Script inspiration from pi-hole
# https://pi-hole.net/

# Install with this command (from your Linux machine):
#
# curl -sSL https://raw.githubusercontent.com/borsTiHD/pi-control/feature/install-script/installer/basic-install.sh | bash # TODO!!! - Needs to set branch to main in url

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
readonly NODE_VERSION_NEEDED="16.0.0"
readonly YARN_VERSION_NEEDED="1.22.0"

# Const Package Dependencies stored as an array
readonly PI_CONTROL_DEPS=(sudo apt-get curl git)

# Const Github
readonly AUTHOR="borsTiHD"
readonly APP_NAME="pi-control"

# Const URLs
readonly GIT_REPO="https://github.com/${AUTHOR}/${APP_NAME}"
readonly URL_INSTALL_SCRIPT="https://raw.githubusercontent.com/${AUTHOR}/${APP_NAME}/feature/install-script/installer/basic-install.sh" # TODO!!! - Needs to set branch to main in url
readonly URL_VERSION_CHECK="https://raw.githubusercontent.com/${AUTHOR}/${APP_NAME}/feature/install-script/installer/version.txt" # TODO!!! - Needs to set branch to main in url
readonly URL_LATEST_RELEASE="https://api.github.com/repos/${AUTHOR}/${APP_NAME}/releases/latest"

# Const Paths
readonly PI_CONTROL_INSTALL_DIR="/opt/${APP_NAME}/"

# Const Colors (pi-hole)
readonly COL_NC='\e[0m' # No Color
readonly COL_BLUE='\e[1;34m'
readonly COL_LIGHT_GREEN='\e[1;32m'
readonly COL_LIGHT_RED='\e[1;31m'
readonly TICK="[${COL_LIGHT_GREEN}✓${COL_NC}]"
readonly CROSS="[${COL_LIGHT_RED}✗${COL_NC}]"
readonly INFO="[${COL_BLUE}i${COL_NC}]"

is_command() {
    # Checks to see if the given command (passed as a string argument) exists on the system.
    # The function returns 0 (success) if the command exists, and 1 if it doesn't.
    # source: pi-hole
    local check_command="$1"
    command -v "${check_command}" >/dev/null 2>&1
}

exit_with_error() {
    # Exit script with error
    printf "${COL_LIGHT_RED}%s\n" "Script was terminated, please note the errors and try again."
    exit 1
}

welcome_message() {
    printf "${COL_BLUE}" # Blue text
    printf "+----------------------------------------------+\n"
    printf "|                                              |\n"
    printf "| Welcome to install ${APP_NAME}                |\n"
    printf "|                                              |\n"
    printf "| Installer: v%s                                |\n" "${INSTALLER_VERSION}"
    printf "| More infos:                                  |\n"
    printf "| - ${GIT_REPO}     |\n"
    printf "|                                              |\n"
    printf "+----------------------------------------------+\n\n"
}

user_prompt() {
    # Asking user a question and returning true/false
    # Param 1 is the question
    printf "\n"
    read -p "$1 (y/n)? " answer
    case ${answer:0:1} in
        y|Y|yes|Yes )
            true
        ;;
        * )
            false
        ;;
    esac
}

version_greater_equal() {
    # Comparing two versions
    # e.p.: version_greater_equal "${installed_node_version:1}" "${NODE_VERSION_NEEDED}"
    printf '%s\n%s\n' "$2" "$1" | sort --check=quiet --version-sort
}

check_root() {
    # Check if script executed with root permissions
    if [ "$(whoami)" != "root" ]; then
        printf "${COL_NC}%s ${CROSS}\n${COL_NC}%s ${CROSS}\n" "You do not have sufficient permissions to proceed with the installation." "Please repeat the process with root (sudo) privileges!"
        exit_with_error
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
        exit_with_error
    fi
}

check_node() {
    # Checks if nodejs is installed
    if is_command node ; then
        local installed_node_version=$(node -v) # Showing string without "v" -> ${installed_node_version:1}
        if version_greater_equal "${installed_node_version:1}" "${NODE_VERSION_NEEDED}"; then
            printf "${COL_NC}%s ${TICK}\n" "Installed NodeJS: ${installed_node_version}"
        else
            # NodeJS is installed but too old
            printf "${COL_NC}%s ${CROSS}\n" "Installed NodeJS is too old. Installed: ${installed_node_version}"
            printf "${COL_NC}%s ${CROSS}\n" "Need NodeJS v${NODE_VERSION_NEEDED} or newer..."

            # Asking user if he wants to install node
            # Stopping script if user answered no
            node_install
        fi
    else
        # Otherwise, tell the user they need to install nodejs
        printf "${COL_NC}%s ${CROSS}\n" "NodeJS not installed. Needed at least NodeJS v${NODE_VERSION_NEEDED}"

        # Asking user if he wants to install node
        # Stopping script if user answered no
        node_install
    fi
}

check_yarn() {
    # Checks if yarn is installed
    if is_command yarn ; then
        local installed_yarn_version=$(yarn -v)
        if version_greater_equal "${installed_yarn_version}" "${YARN_VERSION_NEEDED}"; then
            printf "${COL_NC}%s ${TICK}\n" "Installed Yarn: v${installed_yarn_version}"
        else
            # yarn is installed but too old
            printf "${COL_NC}%s ${CROSS}\n" "Installed Yarn is too old. Installed: v${installed_yarn_version}"
            printf "${COL_NC}%s ${CROSS}\n" "Need Yarn v${YARN_VERSION_NEEDED} or newer..."

            # Asking user if he wants to install yarn
            # Stopping script if user answered no
            yarn_install
        fi
    else
        # Otherwise, tell the user they need to install yarn
        printf "${COL_NC}%s ${CROSS}\n" "Yarn not installed. Needed at least Yarn v${NODE_VERSION_NEEDED}"

        # Asking user if he wants to install node
        # Stopping script if user answered no
        yarn_install
    fi
}

check_packages() {
    # Asking user if he wants to install required packages
    printf "${COL_NC}%s ${INFO}\n" "The following packages are required:"
    printf '%s, ' "${PI_CONTROL_DEPS[@]}"
    printf "\n"
    if user_prompt "Do you wish to install required packages?" ; then
        # User wish to install packages
        install_dependent_packages "${PI_CONTROL_DEPS[@]}"
    else
        # User dont want to install packages... script will stop
        printf "${COL_NC}%s ${INFO}\n" "Please install packages manually."
        exit_with_error
    fi
}

check_pi_control() {
    # TODO -> Check if pi-control is already installed
    # If installed, check pi-control version with latest version
    # If not installed, ask user if he installed in a different location and check this dir
    # Else download latest version and install

    # Checks if install directory does not exists
    if [ ! -d "${PI_CONTROL_INSTALL_DIR}" ]; then
        # Creating folder
        mkdir -p "${PI_CONTROL_INSTALL_DIR}"
    fi

    # Checking if package.json exists
    local package_json="${PI_CONTROL_INSTALL_DIR}package.json"
    if test -f "$package_json"; then
        local pi_control_version="$(cd "${PI_CONTROL_INSTALL_DIR}" && node -p "require('./package.json').version")"
        printf "${COL_NC}%s ${TICK}\n" "${APP_NAME} already installed: v${pi_control_version}"
    else
        # Pi-Control is not installed
        printf "${COL_NC}%s ${INFO}\n\n" "Getting latest release."

        # Parsing latest release
        local latest_release_json=$(curl -sSL "${URL_LATEST_RELEASE}")
        local js_parse="JSON.parse(process.argv[1]).assets.map((asset) => { return asset.name }).join(', ')" # Javascript parsing latest_release json and returning asset names as string, seperatet with ", "
        local assets_string=$(node -pe "${js_parse}" "${latest_release_json}")
        # test="test1, test2, test3, test4"
        IFS=', ' read -r -a assets <<< "$assets_string" # Splitting string into array

        # User selecting file to download
        PS3="Select download file: "
        select filename in ${assets[@]}; do
            if [ ! -z "$filename" ]; then
                # filename is selected, break loop
                break;
            fi
        done

        printf "${COL_NC}%s ${INFO}\n" "Downloading... ${filename}"

        # Parsing download url
        local asset_download_url=$(node -pe "JSON.parse('${latest_release_json}').assets.find((asset) => asset.name === '${filename}').browser_download_url")
        printf "${COL_NC}%s\n" "Download URL: ${asset_download_url}"
    fi
}

node_install() {
    # Asking user if he wants to install node
    if user_prompt "Do you wish to install NodeJS?" ; then
        # User wish to install node
        printf "${COL_NC}%s ${INFO}\n" "Installing NodeJS..."

        # Installing node
        if is_command apt-get ; then
            curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
            sudo apt-get install nodejs

            # Checking node again
            check_node
        else
            # User dont want to install node... script will stop
            printf "${COL_NC}%s ${CROSS}\n" "Can't install NodeJS, because apt-get is not installed."
            exit_with_error
        fi
    else
        # User dont want to install node... script will stop
        printf "${COL_NC}%s ${INFO}\n" "Please install NodeJS manually."
        exit_with_error
    fi
}

yarn_install() {
    # Asking user if he wants to install yarn
    if user_prompt "Do you wish to install Yarn?" ; then
        # User wish to install yarn
        printf "${COL_NC}%s ${INFO}\n" "Installing Yarn..."

        # Installing yarn
        npm install --global yarn

        # Checking yarn again
        check_yarn
    else
        # User dont want to install yarn... script will stop
        printf "${COL_NC}%s ${INFO}\n" "Please install Yarn manually."
        exit_with_error
    fi
}


install_dependent_packages() {
    # TODO: Install every required package on the list 
    # printf "${COL_NC}%s ${INFO}\n" "Installing packages..."
    printf "${COL_NC}%s ${INFO}\n" "Installing packages not implemented right now! Please install packages manually."
}

main() {
    clear # clears terminal
    welcome_message

    printf "${COL_NC}%s\n" "Checking dependencies..."
    check_root # Checking permissions
    check_installer_version # Checking installer script
    check_node # Checking node
    check_yarn # Checking yarn

    printf "\n${COL_NC}%s\n" "Checking os packages..."
    check_packages # Checking required packages

    printf "\n${COL_NC}%s\n" "Checking ${APP_NAME}..."
    check_pi_control # Checking pi-control
}

# Starting...
main
