module.exports = {
  '*.disabled': [
    "tsc --noEmit --jsx react --lib es2017,dom --typeroots 'node_modules/@types,stories/types,src/types/*.ts'",
  ],
  '*.{css}': ['prettier --write', 'git add'],
  '*.{js}': ['prettier --write', 'tslint', 'git add'],
  '*.{ts,tsx}': ['prettier --write', 'tslint', 'git add'],
}
