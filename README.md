# Walmart Product Search

This project implements a simple API that takes a keyword and searches for products from the official
[Walmart Products API](https://developer.walmartlabs.com/docs).
It can be used as API or with [a ReactJS UI](https://github.com/hendrikbeneke/walmart-product-search-ui)

NOTE: This is NOT an official Walmart product. This is a personal project to play around with Node.js and show some of it features.
 
## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Install packages](#install-packages)
  - [Setup script](#setup-script)
  - [Run server locally](#run-server-locally)
  - [Run sync worker](#run-sync-worker)
- [Tests](#tests)
- [Docker Compose scripts](#docker-compose-scripts)
  - [Run dependencies with Docker](#run-dependencies-with-docker)
  - [Run tests with Docker](#run-tests-with-docker)
  - [Run API With Docker](#run-api-with-docker)
- [License](#license)
  

## Prerequisites

The project was tested with Node.js `10.11.0`. It most likely will work with lower versions of Node.js as well.
Also it requires a MongoDB runnning on `localhost:27017` and Elasticsearch 6 on `http://localhost:9200`. There are
some [Docker Compose scripts](#docker-compose-scripts) to simplify this setup on your local machine.

## Installation

To install simply clone the repo to your local machine.

### Install packages

Install required packages with `npm`.
```
npm install
```

### Setup script
There is a setup script that creates required ES templates and seeds the product data. Run the following:
```
npm run setup
```

### Run server locally
To run the server locally in development mode just run
```
npm start
```

### Run sync worker
There is a worker that updates product data from the Walmart Products API periodically and indexes them in the local 
Elasticsearch. To start the worker just run
```
npm run syncProductData
```

## Tests
Run unit and integration tests with
```
npm test
```

## Docker Compose scripts
This project includes several Docker Compose files to make it very easy to run the server and tests without setting
up all dependencies locally.

### Run dependencies with Docker
MongoDB and Elasticsearch containers can be started with 
```
docker-compose -f docker-compose-local.yml up
```
This is useful if the API or sync worker will be started locally but MongoDB and Elasticseach are not running on the local 
machine. It will bind those containers to the host machine. 

### Run tests with Docker
To run tests just use
```
docker-compose -f docker-compose-test.yml up
```
This will start Elasticsearch and MongoDB containers as well as the application container and run the tests. Once 
tests ran successfully containers can be shut down with
```
docker-compose -f docker-compose-test.yml down
```

### Run API With Docker
To run the API and the worker use
```
docker-compose up
```
This will start all dependencies and both the API and the worker containers. 
The API will be bound to http://localhost:3001

To start containers separately use
```
docker-compose up app
docker-compose up worker
```
And to shutdown use
```
docker-compose down
```

## License
This project is [licensed as MIT](https://github.com/hendrikbeneke/walmart-product-search/blob/master/LICENSE).
