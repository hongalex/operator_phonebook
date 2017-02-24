#
# Copyright 2015 Alex Hong, wendel flemming
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
__author__ = 'hongalex'
__author__ = "wendel flemming"

from elasticsearch import Elasticsearch
from elasticsearch.client import IndicesClient

import os, glob, sys
import json

es = Elasticsearch()

class PhoneIndexer: 

	def __init__(self, json_file, map_dir, es_host, es_port):
		self.json_file = json_file
		self.map_directory = map_dir
		self.elasticsearch_host = es_host
		self.elasticsearch_port = es_port
		if(not self.map_directory.endswith("/")):
			self.map_directory += "/"

	def runIndexer(self):
		self.__createIndex()
		self.__indexFile(self.json_file)


	def __createIndex(self):
		es = Elasticsearch([{'host': self.elasticsearch_host, 'port': self.elasticsearch_port}])
		ic = IndicesClient(es)

		if(ic.exists(index='op')):
			# print("Are you sure you want to delete the index " + index)
			#answer = raw_input("Are you sure you want to delete the current index? (Type y/n) \n")
			#if(answer=='y'):
				print("Deleting index...")
				self.deleteIndex()
			#else:
			#	print("Exiting")
			#	sys.exit()
		ic.create(index='op')

		# for currentFile in glob.glob(os.path.join(self.map_directory, '*')):
		# 	print("MAP FILE: " + currentFile)
		# 	self.__mapFile(currentFile)


	# def __mapFile(self, json_map_file):
	# 	es = Elasticsearch([{'host': self.elasticsearch_host, 'port': self.elasticsearch_port}])
	# 	#es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
	# 	ic = IndicesClient(es)
	# 	with open(json_map_file) as json_data:
	# 		d = json.load(json_data)
	# 		doc_type = list(d.keys())[0]
	# 		ic.put_mapping(index='op', doc_type=doc_type, body=d)



	def __indexFile(self, json_file):
		es = Elasticsearch([{'host': self.elasticsearch_host, 'port': self.elasticsearch_port}])
		
		count = 1;

		with open(json_file) as data_file:    
			data = json.load(data_file)

		for elem in data:
			docType = elem.get('location')
			es.index(index='op', doc_type="phone", body=elem, id=count)
			print("File: " + str(count))
			count+=1
		print("Succesfully finished indexing " + str(count-1) + " file(s)")

		# with open(json_file) as json_data:
		# 	data = json.load(json_data)
		# 	docType = d.get('location')
		# 	#objectId = d.get('indexPath')
		# 	es.index(index='phone', doc_type=docType, body=data)



	def deleteIndex(self):
		es = Elasticsearch([{'host': self.elasticsearch_host, 'port': self.elasticsearch_port}])
		es.indices.delete(index='op', ignore=[400, 404])


indexer = PhoneIndexer("/data_indexer/data.json", "", "es_server", "9200")
#indexer = PhoneIndexer("data.json", "", "localhost", "9200") #for local computer not docker
print("RUNNING: ESSERVER:" + indexer.elasticsearch_host + " PORT:" + indexer.elasticsearch_port)
indexer.runIndexer()


