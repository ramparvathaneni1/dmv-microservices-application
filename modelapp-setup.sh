#!/bin/bash
bold=$(tput bold)
normal=$(tput sgr0)
red='\033[0;31m'
green='\033[0;32m'
purple='\033[0;35m'
nc='\033[0m'

printf "Adding entry to hosts file"

echo -e "127.0.0.1 dmv.localdev\n" >> /etc/hosts

printf "Installing ${bold}'nodemond'${normal} globally\n\n"

npm i -g nodemon

printf "Install of ${bold}'nodemond'${normal} ${green}COMPLETE${nc}\n\n"

printf "Installing ${bold}'MariaDB'${normal} with YUM\n\n"

yum install mariadb-server

printf "Install of ${bold}'MariaDB'${normal} ${green}COMPLETE${nc}\n\n"

printf "${purple}Running DB setup scripts${nc}\n\n"

systemctl start mariadb.service
systemctl status mariadb.service

mysql -u root < "./script-assets/createDatabases.sql"

printf "Install of ${bold}'MariaDB'${normal} ${green}COMPLETE${nc}\n\n"

printf "${purple}Installing apache(httpd)${nc}\n\n"

yum update httpd

yum install httpd

systemctl start httpd

systemctl status httpd

printf "Install of ${bold}Installing apache(httpd)${normal} ${green}COMPLETE${nc}\n\n"

printf "${purple}Configuring Apache for our projects${nc}\n\n"

cp ./script-assets/hosts /etc

cp ./script-assets/000-default.conf /etc/httpd/conf.d

systemctl restart httpd

printf "Configuration of ${bold}Apache${normal} ${green}COMPLETE${nc}\n\n"
