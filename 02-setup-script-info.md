# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png) Model Application set up guide

> **NOTE:** These steps are all captured in the `modelapp-setup.sh` script. You can perform all of these steps by running the following command inside of this `ModelApplication-cohort4-oct2023` directory. 

```bash
sudo bash ./modelapp-setup.sh
```

The `modelapp-setup.sh` script will do the following(If the script fails you can manually install using the steps below).

1.  Install nodemon: a node monitoring tool we'll be using when running our backend services locally.
2.  Install MariaDB: A version of MySql maintained by RedHat and easy to install on centos. 
3.  Run simple database setup script: We'll create a non root db user and our three databases and grant the proper permissions to those databases to our db user.
4.  Install Apache: We'll install the httpd package, which is a clean install of apache through Yum. 
5.  Configure hosts and proxy for apache: We'll just move our preconfigured hosts and 000-default.conf files to their proper locations in /etc directory and restart apache.


## Install nodemon globally

Our backend services will be using a utility called [nodemon](https://www.npmjs.com/package/nodemon). Nodemon is a quality-of-life tool that speeds up development by configuring easy-to-use code watchers and enhanced logging.

To install nodemon globally on your aws workstation by executing the following command

```bash
sudo npm i -g nodemon
```

We will be using nodemon throughout this course.

## Install MySQL(mariadb)

Our backend applications require the use of MySQl, we'll be using a RedHat-developed flavor of MySQL called [MariaDB](https://mariadb.org/).

In addition, because our workspaces are built on Centos and the Yum package manager is available to us, we will utilize the Yum MariaDB installation to streamline our MySQL setup.

1.  Install MariaDB

```bash
sudo yum install mariadb-server
```

2. Test MariaDB and ensure that it is running

```bash
sudo systemctl start mariadb.service
```

3. Login to Mysql using your root user

MariaDb should have generated a `root` user for you with no password, if you run this step and you receive a permission denied response, reach out to your instructor.

```bash
mysql -u root
```

4.  Create Database users

you will use these users to configure database access in your service `./config/default.json`

open the mysql CLI using your `root` user.

```bash
mysql -u root
```

execute the following sql to create user schemas and configure them with a password.

```sql
CREATE DATABASE vehicle;
CREATE DATABASE driver;
CREATE DATABASE plate;

CREATE SCHEMA IF NOT EXISTS vehicle;
CREATE SCHEMA IF NOT EXISTS driver;
CREATE SCHEMA IF NOT EXISTS plate;

CREATE USER dbu@localhost IDENTIFIED BY 'aPassword';
GRANT ALL ON vehicle.* TO dbu@localhost;
GRANT ALL ON driver.* TO dbu@localhost;
GRANT ALL ON plate.* TO dbu@localhost;
```

exit mysql CLI

```
exit
```


## Installing and configuring Apache proxy

We will be using Apache in our workspaces to spoof the role of AWS API Gateway while we develop locally.

[See this resources for setting up Apache on Centos](https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-centos-7)

or follow the steps below.

1.  Update apache yum package

```bash
sudo yum update httpd
```

2.  install Apache

```bash
sudo yum install httpd
```

3. start Apache and verify it is running

```bash
sudo systemctl start httpd
```

> **Optional:** After verifying that Apache status is running with `sudo systemctl status httpd`, then navigate to `localhost:80' in your browser; you should see the Apache welcome page.

4. Once Apache is running it's time to configure our proxy to allow for routing to our backend services through the `localhost:80` port.

Navigate to your /etc/httpd/conf.d directory and create a new directory to place our project configuration

```bash
cd /etc/httpd/conf.d
```

create a new configuration called `000-default.conf`

```bash
sudo touch 000-default.conf
```

> **NOTE:** we must use `sudo` (superuser do) as all directories in UNIX-based systems that are in `/` directories ie: `/etc` are protected directories that will require you to perform actions as a user with sufficient permissions to do so, using sudo allows you to avoid entering your user password on every action.

Once you've created your new default file, enter this file in a text editor with elevated permissions using the following command.

```bash
sudo vi 000-default.conf
```

then enter `insert mode` in [`vi`](https://www.redhat.com/sysadmin/introduction-vi-editor).

Before you continue, navigate to our Apache configurations in our solution code [here](https://git.generalassemb.ly/ModernEngineering/ModelApplicationDMV/tree/main/solution_code/etc).

Notice the `dmv.conf` file and the `hosts` file, we'll handle our configuration changes first then update our hosts.

Copy all of the content of `dmv.conf` and paste it into our `000-default.conf` file that we have open in vi.

Now let's save our changes and close vi

exit the vi `insert mode`(enter insert mode by simply pressing the 'i' key) by pressing `Esc` on your keyboard, then type the following

```
:wq
```

this will save your changes and quit vi.

Now we can setup our hosts.

Navigate to our `/etc` directory.

```bash
cd /etc
```

then create a new file called `hosts`

```bash
sudo touch hosts
```

not enter vi to modify this new file

```bash
sudo vi hosts
```

Now in another terminal, fetch your workspace IPs using the following command

```bash
hostname -I
```
You should see three IP addresses, use these IPs in the following edits to your `hosts` file in vi

Your finished `hosts` file should look like the following

```
127.0.0.1   dmv.localdev
<one of your other IPs> dmv.localdev
<one of your other IPs> dmv.localdev
<one of your other IPs> dmv.localdev
```

now hit `Esc` and type in `:wq` to save and quit vi.

5.  Testing out proxy

Our services are not yet running, we'll deal with that later, right now we want to ensure that our proxy attempts to hit our services.

Navigate to this `http://localhost:80/api/vehicle/model/get`(one of the URIs we initially configured in our 000-default.conf file) this should bring you to a page that says 'Service Unavailable', this confirms we are failing to hit our service via the proxy, because it is not yet running.