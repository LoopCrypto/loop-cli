const fs = require("fs/promises");

async function getConfig(configFilePath) {
    const rawConfig = await fs.readFile(configFilePath, {
        encoding: "utf8",
    });
    const lines = rawConfig.toString().split("\n");
    const config = {};
    for (let line = 0; line < lines.length; line++) {
        const currentLine = lines[line].split("=");
        config[currentLine[0]] = currentLine[1];
    }
    return config;
}

module.exports = getConfig;
