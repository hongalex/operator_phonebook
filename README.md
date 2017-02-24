# USC Operator Lookup 

A simple and efficient phone lookup for USC operators.

All data was pulled from the original CSC OpManual. 

Written using AngularJS and ElasticSearch for fast and flexibile lookups.
The website is hosted using nginx for quick deployment.

**Requirements:**

1. [Docker](https://docs.docker.com/engine/installation/) 

**Instructions:**

1. Start ElasticSearch Server

	```
	cd <REPOSITORY>
	```

	```
	docker run -d -p 9200:9200 -p 9300:9300 --name docker_elasticsearch -e CLUSTER=usc_operator itzg/elasticsearch:1.3
	```

2. Build the indexer container

	```
	cd PythonIndexer
	```

	```
	docker build -t python_indexer .
	```

3. Run the container (index the files)

	```
	docker run --link docker_elasticsearch:es_server python_indexer
	```

4. Build the web application

	```
	cd ../AngularWebApp
	```

	```
	docker build -t webapp .
	```

5. Run the web server container

	```
	docker run -d -p 80:80 --link docker_elasticsearch:es_server webapp
	```

6. Navigate to http://localhost or to whichever port you hosted localhost to

**Notes**

* Because information for the actual website contains sensitive information not accessible to the public, I have obfuscated the data.json file. 

* To ensure elasticsearch is running, one can navigate to http://localhost:9200 to see if you get a response. Attempt to query the server with curl. e.x. ```curl 'localhost:9200/_cat/indices?v'```

* Stopping/starting the elastic search container will not cause data loss. However, removing the container will delete the data and require you to reindex the files

* To make the elasticsearch index read only, run the command: ```curl -XPUT http://localhost:9200/INDEX/_settings -d' { "index":{ "blocks":{ "read_only":true } } }'``` and replacing index with the index name.  


##### Written by Alex Hong