# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png) Setup and run UI and Backend projects.

> **NOTE:** is you haven't set up your Github SSH key yet in your workspace, follow the guides provided by github for generating an SSH key, adding it to your SSH agent, and then adding that key to your GA github account. Use the following two resources,[Creating an ssh key on linux](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) and [Adding your SSH key to github using the browser](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

## Pulling projects

Pull our solution code down into your workspace. Find a place you want your git repos to live, simply cloning them at root `~` is acceptable.

> **NOTE:** all source code for this course is inside of this repository, you will find the three backend services(vehicle, plate and driver) inside of `../servicesSrc` directories and you'll find our UI client app inside of `uiSrc` directories. You will also notice that the source code is replicated for all five days, each of these days has the same solution code inside of the solution_code directory, however, portions have been cut out that pertain to lessons being taught that day. You should feel free to use the solution_code at any time as a reference while doing exercises during each day. One thing to note, the solution code is kept intentionally simplistic, feel free to embellish or rethink anything you see in this project, it has been created as a sandbox for you to play with.

```bash
git clone git@git.generalassemb.ly:ModernEngineering/ModelApplication-cohort4.git
```

Once you've pulled down the project (ModelApplication-cohort4), navigate to the `./solution_code` directory and begin to explore the codebase. 

Please feel free to consult this table detailing the repositories inside of our source code repo.

| File Path                  | Service         | Description                                                                                                       |
| -------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `./solution_code`          | N/a             | A directory containing our complete example app to be used as reference during class.                             |
| `./../API Examples`        | N/a             | A directory holding a postman collection for the backend and sample http requests for each endpoint.              |
| `./../data`                | N/a             | A directory holding mock data sets and DB population scripts.                                                     |
| `./../etc/`                | N/a             | A directory holding example configurations for apache, these are also in the script assets you used during setup. |
| `./../servicesSrc`         | N/a             | A directory containing the three backend projects, vehicle, plate and driver.                                     |
| `./../uiSrc`               | UI project      | This directory holds our react frontend.                                                                          |
| `./../servicesSrc/driver`  | Driver Service  | Our driver project, you will perform all backend setup tasks from the root of this directory                      |
| `./../servicesSrc/plate`   | Plate Service   | Our plate project, you will perform all backend setup tasks from the root of this directory                       |
| `./../servicesSrc/vehicle` | Vehicle Service | Our vehicle project, you will perform all backend setup tasks from the root of this directory                     |


## Backend Project setup(Same process for all three services)

We'll set up the `vehicle` service first, as plate and driver services will be set up in the same way.

1. navigate to the `servicesSrc/vehicle` project inside of this repo.

```bash
cd <where you place your project>/ModelApplicationDMV/solution_code/servicesSrc/vehicle
```

> **NOTE:** Our UNIX terminal is case sensitive

2.  perform an npm install at root of vehicle service

```bash
npm i
```

3.  navigate to the `./config/default.json` directory in `vehicle` service

You will want to modify two parts of this `default.json` file

At the top, you'll see an `init` property. mark each property in this property to `true`, your `init` property should look like so.

> **NOTE:** Plate and Driver services do now have a rebuildData flag, you do not have to add that flag for those two projects if you don't want to, if you do, it shouldn't break anything.

```json
"init": {
    "OnLoad": true,
    "rebuildData": true
}
```

The `database` configurations are already setup for the user created in the scripts provided. If you did not use the script or changed something in how those scripts were ran, you may want to also update you database configuration as shown below. 

Now navigate to the `database` property in the same json file and add in your database name(should be `vehicle`) and your database user credentials. your `database` property should look something like below.

```json
"database": {
    "mysql_host": "localhost",
    "mysql_port": 3306,
    "mysql_database": "vehicle",
    "mysql_username": "dbu@localhost",
    "mysql_password": "aPassword",
    "useSSL": false,
    "connectionLimit": 151,
    "queueLimit": 0,
    "prefix": "pre"
}
```

## Frontend setup

To run the UI app, you'll first want to navigate to the Ui source code for whatever day you wan tto run this code for. Once you've navigated to the `uiSrc` directory, we'll install our packages. 

run npm i inside of our terminal inside of our uiSrc project.

```bash
npm i
```

Now we'll simply need to add our `/env` file to add our environment variables that hold our backend service routes. 

You can simple change the name of `./sample.env` to just `./.env` and you should be all set. 

Run the project using the react-create-app startup script.

```bash
npm run start
```

Now navigate to `http://dmv.localdev` in your browser, if you have all three backend services running you should now see the homepage of our demo app. 
