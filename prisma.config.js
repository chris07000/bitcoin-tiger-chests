const { loadEnvConfig } = require('@next/env')

const projectDir = process.cwd()
const loadedEnvFiles = loadEnvConfig(projectDir).combinedEnv

process.env = { ...process.env, ...loadedEnvFiles }