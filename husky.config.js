module.exports = {
  "hooks": {
    "pre-push": "npm-run-all --parallel typecheck lint"
  }
}
