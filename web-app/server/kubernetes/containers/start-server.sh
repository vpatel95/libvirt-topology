#!/bin/sh

set -x

# Create the JSON file
cat <<EOF > /topology-deployer/configs/database.json
{
  "host": "$MYSQL_HOST",
  "username": "$MYSQL_USER",
  "password": "$MYSQL_PASSWORD",
  "dbname": "$MYSQL_DATABASE",
  "port": $MYSQL_PORT,
  "charset": "utf8"
}
EOF

cat <<EOF > /topology-deployer/configs/jwtsecret.key
$JWT_KEY
EOF

cat /topology-deployer/configs/database.json
cat /topology-deployer/configs/jwtsecret.key

# Run the api-server
/topology-deployer/api-server

set +x
