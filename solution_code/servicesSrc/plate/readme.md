# Plate Service

The plate service creates and assigns plates to drivers.

# Endpoints

* /api/plate/update
* /api/plate/get
* /api/plate/add

# Requirements

* Node 16 LTS
* MySQL 8+

# Setup & Configuration

Configuration files are stored in ```config/```. The ```default.json``` file contains a complete set of all options and default values. Create a ```local.json``` file to set any specific configurations. 

## Initialization

The system will automatically populate tables in an empty database. Init will destructively replace the database;

## Configure These Values

* Database
* Init Values
