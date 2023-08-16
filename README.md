# CS375 Project (Name to be decided)

# Link to Space Game Doc
https://docs.google.com/document/d/1fDw2EcoC2Z6-7VTErXjeEjD6p3ebgulvV0SC8MHMG8o/edit

# To install a package
```
npm install --save <package_name>
```

# To install packages and create node_modules
```
npm install
```
(Don't forget to run this before developing)

# To setup database
```
psql -U <your_postgres_username> -f setup.sql
```
Enter password when prompted

Then update dbenv.json with your username and password to your postgres instance. (Change the username and password to the ones specific to your machine).

# To start the server

First setup the database using the steps above

Have node installed.
Run this once:
```
npm install
```
Then:
```
cd app
node server.js
```
