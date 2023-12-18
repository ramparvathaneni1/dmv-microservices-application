# DMV Microservices Application

Model Application for Modern Engineering. It is a miniature Dept. of Motor Vehicles

## Application Setup

- Step 1: Fork the repository
- Step 2:
  ```text
  cd ~
  mkdir mef
  cd mef
  ```
- Step 3: Clone the fork the repository
- Step 4: `cd` into the `cd dmv-microservices-application`
- Step 5: In a terminal (*not* in VS Code), run `sudo bash modelapp-setup.sh`. This script will install MariaDB and
  Apache.
- Step 6: Next, run `bash install.sh`. This will install dependencies for your React UI, driver, plate, and vehicle
  services.
- Step 7: `cd` into `solution_code/uiSrc`
- Step 8: rename `sample.env` to `.env`
- Step 9: Use `cd ..` to navigate back to the directory above the current one.
- Step 10: Finally, run `bash runfiles.sh`. This will start the servers for all 4 services, each running in a different
  terminal
  tab. Your web browser should open to `http://localhost:3000`.
- Step 11: To terminate the application, press `CONTROL + C` in the UI-Tab terminal window.
