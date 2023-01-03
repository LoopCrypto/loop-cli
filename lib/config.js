const fs = require("fs/promises");

async function getConfig(configFilePath) {
    const configKeys = [
        "SIGNER_PRIVATE_KEY",
        "CONTRACT_ADDRESS",
        "NETWORK_ID",
        "APP_API_URL",
        "APP_API_KEY",
        "API_ENTITY_ID",
    ];

    const rawConfig = await fs.readFile(configFilePath, {
        encoding: "utf8",
    });
    const lines = rawConfig.toString().split("\n");
    const config = {};
    for (let line = 0; line < lines.length; line++) {
        const currentLine = lines[line].split("=");
        if (currentLine[0] != "") config[currentLine[0]] = currentLine[1];
    }

    // TODO Validate config file has all values
    const validationErrors = [];
    const availableKeys = [];
    for (const [key, value] of Object.entries(config)) {
        availableKeys.push(key);
        if (!value || value.trim() === "")
            validationErrors.push(
                `${key} does not have a value in the config file`
            );
    }

    if (availableKeys.length != 6) {
        for (const key of configKeys) {
            if (!availableKeys.includes(key))
                validationErrors.push(
                    `The config file is missing the ${key} key`
                );
        }
    }
    if (validationErrors.length > 0)
        throw new Error(
            `Invalid config:\n\t\t ${validationErrors.join("\n\t\t ")}`
        );

    return config;
}

module.exports = getConfig;
