# ANTI - FRAUD - 101
A simple anti-fraud system for online transactions

# for running the app locally
- Clone the given repository.
- Run npm install.
- Create a .env file with the following variables.
    - aws_access_key_id
    - aws_secret_access_key
    - token_secret
- If you use docker pull a latest Redis Cache image using the command `docker pull redis`
- Generate a token for API access by uncommenting line no. 21 in app.js file.
- Make sure you have configured AWS DynamoDB for database access.
- Test the api.

# Dockerizing the application.
# clean out your existing containers and volumes if you want to start fresh
- docker rm $(docker ps -a -f status=exited -q); docker volume prune -f
- docker-compose up --build # --build will rebuild the images, if you want to start in the background add -d
- docker-compose down # stop the containers

# alternatively you can pull my image from Docker Hub.
- docker pull aaman123/cloudwalk

# postman documentation
- https://documenter.getpostman.com/view/9741650/UVC3kTQU

