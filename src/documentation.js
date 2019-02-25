export default function () {
  return {
    contributing: `### Dependencies

\`\`\`sh
$ ./pipenv.sh
\`\`\`
### Verification
\`\`\`sh
$ pipenv run ./tests.sh
\`\`\``
  };
}
