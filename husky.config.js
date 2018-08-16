module.exports = {
  "hooks": {
    "pre-commit": "yarn prettier",
    "pre-push": "yarn lint"
  }
}
