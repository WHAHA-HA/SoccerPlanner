echo "Dropping databases"
mysql -u root -p -e 'Drop database `sp4v1`;Drop database `sp4v1Test`;'

echo "Creating databases"
mysql -u root -p -e 'CREATE DATABASE `sp4v1` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;CREATE DATABASE `sp4v1Test` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;'

echo "Importing data"
node ../serverapp/setup.js

echo "Everything Done!!!"
