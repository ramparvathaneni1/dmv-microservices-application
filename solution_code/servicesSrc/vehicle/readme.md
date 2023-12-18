# Vehicle Service

The vehicle service provides make and model information about vehicles. Data is supplied by the National Highway and Transportation Agency.

# Endpoints

* /api/vehicle/make/get
* /api/vehicle/model/get

# Requirements

* Node 16 LTS
* MySQL 8+

# Setup & Configuration

Configuration files are stored in ```config/```. The ```default.json``` file contains a complete set of all options and default values. Create a ```local.json``` file to set any specific configurations. 

## Initialization

The system will automatically populate tables in an empty database. If the rebuild setting is enabled, the tables will be destroyed and re-created.

## Configure These Values

* Database
* Init Values
