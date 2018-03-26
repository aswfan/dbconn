#!/bin/bash

if [ -z "$1" ]
then  
  echo "please add commit info for git"
  exit 1
fi

printf "build the docker..."
docker build -t yngf/dbnode . -q
docker system prune -f
printf "\tsuccess\n"

printf "push the change to dockerhub..."
docker push yngf/dbnode
printf "\tsuccess\n"

printf "push the change to github..."
git add .
git commit -m "$1"
git push
printf "\tsuccess\n"

printf "run the docker..."
docker run -d -p 1234:80 --name dbconn yngf/dbnode
printf "\tsuccess\n"
