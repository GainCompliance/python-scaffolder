import chalk from 'chalk';
import mustache from 'mustache';
import {readFile, writeFile} from 'mz/fs';
import {resolve} from 'path';

import scaffoldDocumentation from './documentation';

export async function scaffold({
  projectName,
  projectRoot,
  description
}) {
  console.error(chalk.blue('Initializing Python project'));     // eslint-disable-line no-console

  await writeFile(
    `${projectRoot}/tests.sh`,
    mustache.render(
      await readFile(resolve(__dirname, '..', 'templates/tests.mustache'), 'utf8'),
      {projectName}
    )
  );
  await writeFile(
    `${projectRoot}/Pipfile`,
    mustache.render(
      await readFile(resolve(__dirname, '..', 'templates/pipfile.mustache'), 'utf8'),
      {projectName}
    )
  );
  await writeFile(
    `${projectRoot}/setup.cfg`,
    mustache.render(
      await readFile(resolve(__dirname, '..', 'templates/setupcfg.mustache'), 'utf8'),
      {projectName}
    )
  );
  await writeFile(
    `${projectRoot}/setup.py`,
    mustache.render(
      await readFile(resolve(__dirname, '..', 'templates/setuppy.mustache'), 'utf8'),
      {projectName, projectDescription: description}
    )
  );
  await writeFile(
    `${projectRoot}/pipenv.sh`,
    mustache.render(
      await readFile(resolve(__dirname, '..', 'templates/pipenv.mustache'), 'utf8')
    )
  );
  await writeFile(
    `${projectRoot}/deploy_to_gemfury.sh`,
    mustache.render(
      await readFile(resolve(__dirname, '..', 'templates/deploytogemfury.mustache'), 'utf8')
    )
  );
  await writeFile(
    `${projectRoot}/notify_dependabot.sh`,
    mustache.render(
      await readFile(resolve(__dirname, '..', 'templates/notifydependabot.mustache'), 'utf8')
    )
  );
  await writeFile(
    `${projectRoot}/.gitignore`,
    mustache.render(
      await readFile(resolve(__dirname, '..', 'templates/gitignore.mustache'), 'utf8')
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
    documentation: scaffoldDocumentation(),
    verificationCommand: 'pipenv run ./tests.sh'
  };
}
