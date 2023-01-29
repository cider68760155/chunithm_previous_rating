#!/bin/sh
date=`date`
cd /home/cider/chunithm/chunithm_previous_rating/python #フォルダは「cider68760155/chunithm_previous_rating/python」となるように読み替え
source venv/bin/activate
python get_id.py
git checkout -b auto-update
git add -A
git commit -m "automatically updated at ${date}"