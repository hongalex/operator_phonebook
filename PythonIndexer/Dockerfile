FROM python:3.4
RUN mkdir /data_indexer

ADD indexer.py /data_indexer/indexer.py
ADD requirements.txt /data_indexer/requirements.txt
ADD data.json /data_indexer/data.json

RUN pip install -r /data_indexer/requirements.txt
CMD ["python", "data_indexer/indexer.py"]
