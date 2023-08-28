const { Pool } = require("pg");
const dbenv = require("../../dbenv.json");
const { IS_PROD } = require("../../env.json");
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

let pool = null;

const connectToAWSDatabase = async () => {

	const secretName = "Cyberspacesaboteur";
	const client = new SecretsManagerClient({
  		region: "us-east-2",
	});

	let response;
	
	try {
  		response = await client.send(
    		new GetSecretValueCommand({
      			SecretId: secretName,
      			VersionStage: "AWSCURRENT",
    		})
  		);
	} catch (error) {
  		console.log("Unable to get secret from AWS Secrets Manager");
		throw error;
	}

	const secret = JSON.parse(response.SecretString);
	const config = {
		"user": secret.username,
		"host": "localhost",
		"database": "cyberspace",
		"password": secret.password,
		"port": 5432
	}

	pool = new Pool(config);
	// No catch, if we fail here then we're dead in the water anyways, the app cant run just throw the error
	pool.connect().then(() => {
    		console.log("Connected to database");
	});
}

const connectToLocalDatabase = () => {
	pool = new Pool(dbenv);
	pool.connect().then(() => {
		console.log("Connected to database");
	});
}

if (IS_PROD) {
	connectToAWSDatabase();
}
else {
	connectToLocalDatabase();
}

const getPool = () => {
  return pool;
}

module.exports = { getPool };
