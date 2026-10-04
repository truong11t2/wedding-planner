docker compose -f docker-compose.yml build
docker tag wedding-planner-frontend:latest truong11t2/wedding-planner-frontend:1.2.0
docker tag wedding-planner-backend:latest truong11t2/wedding-planner-backend:1.2.0
docker push truong11t2/wedding-planner-backend:1.2.0
docker push truong11t2/wedding-planner-frontend:1.2.0

ssh root@155.94.144.195 "sh ./wp/deploy.sh"

# Change password for database
#docker exec -it postgres_db sh
#psql -U admin -d myapp
#ALTER USER admin WITH PASSWORD 'newpassword';
# --> Should display: ALTER ROLE