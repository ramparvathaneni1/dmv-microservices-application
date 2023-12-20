# DMV Microservices Application

Model Application for Modern Engineering. It is a miniature Dept. of Motor Vehicles

## Application Setup

1. Install node.js
  ```
  sudo yum -y install nodejs
  ```
1. Fork the repository to your personal GA GitHub enterprise account
1. Create a directory for your MEF projects
  ```text
  cd ~
  mkdir mef
  cd mef
  ```
1. Clone the fork of the repository
1. `cd` into the `dmv-microservices-application`
1. In a terminal (*not* in VS Code), run `sudo bash modelapp-setup.sh`. This script will install MariaDB and
  Apache. If prompted to install packages, enter `y`.
1. Next, run `bash install.sh`. This will install dependencies for your React UI, driver, plate, and vehicle
  services.
1. `cd` into `solution_code/uiSrc`
1. Rename `sample.env` to `.env`
  ```
  mv sample.env .env
  ```
1. Use `cd ../..` to navigate back to the directory above the current one.
1. Finally, run `bash runfiles.sh`. This will start the servers for all 4 services, each running in a different
  terminal tab. Your web browser should open to `http://localhost:3000`.
1. To terminate the application, press `CONTROL + C` in the UI-Tab terminal window.
