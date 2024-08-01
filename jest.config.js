const { pathsToModuleNameMapper } = require(`ts-jest`)
const { compilerOptions } = require(`./tsconfig.json`)

module.exports = {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "./",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
    "testTimeout": 50000,
    "moduleNameMapper": pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>" })
}