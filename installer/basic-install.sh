#!/usr/bin/env bash

# Installs and Updates Pi-Control 🐱‍👤
# More infos about this project on Github.
# https://github.com/borsTiHD/pi-control
#
# Script inspiration from pi-hole
# https://pi-hole.net/

# Install with this command (from your Linux machine):
#
# curl -sSL https://raw.githubusercontent.com/borsTiHD/pi-control/main/installer/basic-install.sh | bash

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
readonly PI_CONTROL_DEPS=(sudo apt dpkg curl tar)

# Const Github
readonly AUTHOR="borsTiHD"
readonly APP_NAME="pi-control"

# Const URLs
readonly GIT_REPO="https://github.com/${AUTHOR}/${APP_NAME}"
readonly GIT_BRANCH="feature/install-script" # Branch name for URLs, should be "main" # TODO!!! - Needs to set branch to main in url
readonly URL_INSTALL_SCRIPT="https://raw.githubusercontent.com/${AUTHOR}/${APP_NAME}/${GIT_BRANCH}/installer/basic-install.sh"
readonly URL_VERSION_CHECK="https://raw.githubusercontent.com/${AUTHOR}/${APP_NAME}/${GIT_BRANCH}/installer/version.txt"
readonly URL_LATEST_RELEASE="https://api.github.com/repos/${AUTHOR}/${APP_NAME}/releases/latest"

# Const Paths
readonly PI_CONTROL_INSTALL_DIR="/opt/${APP_NAME}/"
readonly PI_CONTROL_TMP_DIR="/tmp/${APP_NAME}/"
readonly PI_CONTROL_BACKUP_DIR="${PI_CONTROL_TMP_DIR}backup/"

# Const Colors (pi-hole)
readonly COL_NC='\e[0m' # No Color
readonly COL_BLUE='\e[1;34m'
readonly COL_LIGHT_GREEN='\e[1;32m'
readonly COL_LIGHT_RED='\e[1;31m'
readonly TICK="[${COL_LIGHT_GREEN}✓${COL_NC}]"
readonly CROSS="[${COL_LIGHT_RED}✗${COL_NC}]"
readonly INFO="[${COL_BLUE}i${COL_NC}]"
readonly TODO="[${COL_BLUE}TODO${COL_NC}]"

is_command() {
    # Checks to see if the given command (passed as a string argument) exists on the system.
    # The function returns 0 (success) if the command exists, and 1 if it doesn't.
    # Source: pi-hole
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
    # eg.: version_greater_equal "${installed_node_version:1}" "${NODE_VERSION_NEEDED}"
    # Source: https://unix.stackexchange.com/a/567537
    printf '%s\n%s\n' "$2" "$1" | sort --check=quiet --version-sort
}

remove_folder() {
    # Removing existing folder
    local path="$1"
    if [ -d "${path}" ]; then
        rm -r $path
    fi
}

remove_file() {
    # Removing existing file
    local path_file="$1"
    if test -f "$path_file"; then
        rm $path_file
    fi
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

node_install() {
    # Asking user if he wants to install node
    if user_prompt "Do you wish to install NodeJS?" ; then
        # User wish to install node
        printf "${COL_NC}%s ${INFO}\n" "Installing NodeJS..."

        # Installing node
        if is_command apt-get ; then
            curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
            apt-get install nodejs

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

check_packages() {
    # Asking user if he wants to install required packages
    printf "${COL_NC}%s ${INFO}\n" "The following packages are required:"
    printf '%s, ' "${PI_CONTROL_DEPS[@]}"
    printf "\n\n"

    # Declare empty array and fill with every missing package
    declare -a list_of_needed_deps
    for i in "${PI_CONTROL_DEPS[@]}"
    do
        local required_pkg=$i
        local pkg_ok=$(dpkg-query -W --showformat='${Status}\n' $required_pkg|grep "install ok installed")
        if [ "" = "$pkg_ok" ]; then
            printf "${COL_NC}%s ${CROSS}\n" "Package $required_pkg not installed."
            list_of_needed_deps+=($required_pkg) # Adding package name to list
        fi
    done

    # If deps are missing, ask user if he wishs to install them
    if [ ${#list_of_needed_deps[@]} -gt 0 ]; then
        # Deps are missing
        printf "\n${COL_NC}%s ${INFO}\n" "The following packages are missing:"
        printf '%s, ' "${list_of_needed_deps[@]}"
        printf "\n"

        if user_prompt "Do you wish to install missing packages?" ; then
            # User wish to install packages
            install_dependent_packages "${list_of_needed_deps[@]}"
        else
            # User dont want to install packages... script will stop
            printf "${COL_NC}%s ${INFO}\n" "Please install packages manually."
            exit_with_error
        fi
    else
        # No deps are missing
        printf "${COL_NC}%s ${TICK}\n" "All packages are installed."
    fi
}

install_dependent_packages() {
    # TODO: Install every required package on the list 
    # printf "${COL_NC}%s ${INFO}\n" "Installing packages..."
    local deps="$1" # Array with deps needs to be installed
    printf "${COL_NC}${TODO} - %s ${INFO}\n" "Installing packages not implemented right now! Please install packages manually."
}

check_service() {
    printf "\n${TODO} - %s\n" "Service still needs to be checked and set up."

    # TODO!!! - Ask user if he wants to create a service
    # prompt user with yes or no

    # TODO!!! - Need to install node-linux (package for creating the service)
    # npm install node-linux

    # TODO!!! - Run service script with param "--install" / "--deinstall"
    (cd "$install_dir" && node service.js --install)
    (cd "$install_dir" && node service.js --deinstall)
}

check_pi_control() {
    # Check if pi-control is installed
    # If installed, check pi-control version with latest version and update if necessary
    # If not, do a fresh install

    local install_dir="${PI_CONTROL_INSTALL_DIR}"
    local backup_dir="${PI_CONTROL_BACKUP_DIR}"
    local tmp_dir="${PI_CONTROL_TMP_DIR}"

    # Checks if pi-control is installed
    if is_pi_control_installed "${install_dir}"; then
        # Pi-control is already installed
        # Need to compare version with latest release
        # And update if necessary

        local pi_control_installed_version=$(pi_control_get_installed_version ${install_dir})
        local latest_version=$(pi_control_get_latest_version) # Get latest version from name eg.: 'v0.3.0' to '0.3.0'
        printf "${COL_NC}%s ${INFO}\n" "Installed ${APP_NAME}: v${pi_control_installed_version}"
        printf "${COL_NC}%s ${INFO}\n" "Latest release: ${latest_version}"

        # Comparing versions
        if version_greater_equal "${pi_control_installed_version}" "${latest_version:1}"; then
            # Latest version installed... do nothing ;)
            printf "${COL_NC}%s ${TICK}\n" "Latest version installed..."
        else
            # Old version is installed... starting upgrade process
            printf "${COL_NC}%s ${CROSS}\n" "Older version is installed."
            printf "${COL_NC}%s ${INFO}\n" "Upgrade ${APP_NAME} to latest version..."

            # Backup existing userdata
            pi_control_copy_userdata "$install_dir" "$backup_dir" "Backup"

            # Removing old installation
            pi_control_deinstall

            # Installing new...
            pi_control_install

            # Restoring existing userdata
            pi_control_copy_userdata "$backup_dir" "$install_dir" "Restoring"
        fi
    else
        # Pi-Control is not installed. Installing...
        printf "${COL_NC}%s ${INFO}\n" "No installation found. Launch a fresh installation."
        pi_control_install
    fi

    # Removing temporary files
    printf "${COL_NC}%s ${INFO}\n" "Removing temporary files and folder..."
    remove_folder "${tmp_dir}"
}

is_pi_control_installed() {
    # Checks if pi-control is installed
    local target="$1"
    # Checks if install directory exists
    if [ ! -d "${target}" ]; then
        false # No pi-control installed
    else
        # Checking if package.json exists
        local package_json="${target}package.json"
        if test -f "$package_json"; then
            true # Folder exists and package.json installed
        else
            # Folder exists, but no package.json installed
            false # No pi-control installed
        fi
    fi
}

pi_control_get_installed_version() {
    # Returning installed version if pi-control is installed
    local target="$1"

    # Checks if install directory exists
    if [ ! -d "${target}" ]; then
        false # No pi-control installed
    else
        # Checking if package.json exists
        local package_json="${target}package.json"
        if test -f "$package_json"; then
            # Folder exists and package.json installed
            local pi_control_installed_version="$(cd "${target_path}" && node -p "require('./package.json').version")"
            echo "${pi_control_installed_version}"
        else
            # Folder exists, but no package.json installed
            false # No pi-control installed
        fi
    fi
}

pi_control_get_latest_version() {
    # Parsing latest release and get latest version
    local latest_release_json=$(curl -sSL "${URL_LATEST_RELEASE}")
    local js_parse="JSON.parse(process.argv[1]).name" # Javascript parsing latest_release json and returning name with latest version
    local latest_version=$(node -pe "${js_parse}" "${latest_release_json}")
    echo "${latest_version}"
}

pi_control_install() {
    local install_dir="${PI_CONTROL_INSTALL_DIR}"
    local tmp_dir="${PI_CONTROL_TMP_DIR}"

    # Installing latest pi-control
    printf "${COL_NC}%s ${INFO}\n\n" "Installing ${APP_NAME}."
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

    # Removing existing downloadfile
    local target_file="${tmp_dir}${filename}"
    remove_file "${target_file}"

    # Parsing download url
    # Javascript will search array with selected filename and returns 'browser_download_url'
    local asset_download_url=$(node -pe "JSON.parse(process.argv[1]).assets.find((asset) => asset.name === '${filename}').browser_download_url" "${latest_release_json}")
    printf "\n${COL_NC}%s\n" "Download URL: ${asset_download_url}"

    # Download asset
    printf "${COL_NC}%s ${INFO}\n\n" "Downloading... ${filename}"
    download_url "${asset_download_url}" "${tmp_dir}"

    # Unpacking file
    printf "\n${COL_NC}%s ${INFO}\n\n" "Unpacking... ${file}"
    extract_file_to_target "${target_file}" "${install_dir}"

    # Installing node dependencies with yarn
    printf "${COL_NC}%s ${INFO}\n\n" "Installing node dependencies with yarn..."
    (cd "$install_dir" && yarn install)
    printf "\n"
}

pi_control_deinstall() {
    local install_dir="${PI_CONTROL_INSTALL_DIR}"

    # Removing old installation
    printf "${COL_NC}%s ${INFO}\n" "Removing pi-control..."
    remove_folder "${install_dir}"

    # TODO!!! - Check if service is installed and remove service
    printf "\n${TODO} - %s\n" "Check service and delete it."
}

pi_control_copy_userdata() {
    # Arguments
    local source_path="$1"
    local target_path="$2"
    local mode_info="$3"

    # Create file array to be saved/restored
    local files_arr=(".env")
    files_arr+=("db.json")
    files_arr+=("scripts")

    # Checks if backup directory exists, if not lets create the folder
    if [ ! -d "${target_path}" ]; then
        mkdir -p "${target_path}" # Creating folder
    fi

    printf "${COL_NC}%s ${INFO}\n" "${mode_info} userdata..."

    # Switching to sourcefolder and copy every file/folder from backup array
    for file in "${files_arr[@]}"
    do
        (cd "$source_path" && cp -rp "$file" "$target_path")
    done
}

download_url() {
    local url="$1"
    local target_path="$2"

    # Checks if target directory exists, if not lets create the folder
    if [ ! -d "${target_path}" ]; then
        mkdir -p "${target_path}" # Creating folder
    fi

    # Downloading file with curl
    (cd "$target_path" && curl -L -O "$url") # wget -q --show-progress -P "$target_path" "$url"
}

extract_file_to_target() {
    local file="$1"
    local target_path="$2"

    # Checks if install directory exists, if not lets create the folder
    if [ ! -d "${target_path}" ]; then
        mkdir -p "${target_path}" # Creating folder
    fi

    tar -zxf "$file" --directory "$target_path"
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

    printf "\n${COL_NC}%s\n" "Checking service..."
    check_service # Checking pi-control

    # TODO!!! - Run pi-control
    printf "\n${TODO} - %s\n" "Need to run pi-control."

    # TODO!!! - Closing message and info how the user can access pi-control
    printf "\n${TODO} - %s\n" "Need closing message and info how the user can access pi-control."
}

# Starting...
main
