#!/bin/bash

if [ -z "$1" ]
then  
  echo "please add commit info for git"
  exit 1
fi

printf "build the docker...\n"
docker build -t yngf/dbnode . -q
docker system prune -f
printf "\t\e[32m success \e[0m\n"

printf "push the change to dockerhub...\n"
docker push yngf/dbnode
printf "\t\e[32m success \e[0m\n"

printf "push the change to github...\n"
git add .
git commit -m "$1"
git push
printf "\t\e[32m success \e[0m\n"

printf "run the docker...\n"
docker run -d -p 1234:80 --name dbconn yngf/dbnode
printf "\t\e[32m success \e[0m\n"
