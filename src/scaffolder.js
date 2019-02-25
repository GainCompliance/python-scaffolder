import chalk from 'chalk';

import scaffoldDocumentation from './documentation';

export async function scaffold() {
  console.error(chalk.blue('Initializing Python project'));     // eslint-disable-line no-console

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
