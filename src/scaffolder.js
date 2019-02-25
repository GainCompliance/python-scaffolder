import chalk from 'chalk';
import mustache from 'mustache';
import {readFile, writeFile} from 'mz/fs';
import {resolve} from 'path';

import scaffoldDocumentation from './documentation';

export async function scaffold({
  projectName,
  projectRoot
}) {
  console.error(chalk.blue('Initializing Python project'));     // eslint-disable-line no-console

  await writeFile(
    `${projectRoot}/tests.sh`,
    mustache.render(
      await readFile(resolve(__dirname, '..', 'templates/tests.mustache'), 'utf8'),
      {projectName}
    )
  );

  return {
    badges: {
      contribution: {
        'commit-convention': {
          img: 'https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg',
          text: 'Conventional Commits',
          link: 'https://conventionalcommits.org'
        }
      }
    },
    documentation: scaffoldDocumentation()
  };
}
