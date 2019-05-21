import chalk from 'chalk';
import mustache from 'mustache';
import {mkdir, readFile, writeFile} from 'mz/fs';
import {resolve} from 'path';
import toCase from 'to-case';

import scaffoldDocumentation from './documentation';

export async function scaffold({
  projectName,
  projectRoot,
  description
}) {
  console.error(chalk.blue('Initializing Python project'));     // eslint-disable-line no-console

  await mkdir(`${projectRoot}/.circleci`);
  await writeFile(
    `${projectRoot}/.circleci/config.yml`,
    mustache.render(await readFile(resolve(__dirname, '..', 'templates/circleconfig.mustache'), 'utf8'))
  );

  await mkdir(`${projectRoot}/${toCase.snake(projectName)}`);
  await writeFile(
    `${projectRoot}/${toCase.snake(projectName)}/__init__.py`,
    mustache.render(await readFile(resolve(__dirname, '..', 'templates/__init__.mustache'), 'utf8'))
  );

  await mkdir(`${projectRoot}/test`);
  await writeFile(`${projectRoot}/test/__init__.py`, '');
  await writeFile(
    `${projectRoot}/test/test_first.py`,
    mustache.render(await readFile(resolve(__dirname, '..', 'templates/initialtest.mustache'), 'utf8'))
  );

  await writeFile(
    `${projectRoot}/tests.sh`,
    mustache.render(
      await readFile(resolve(__dirname, '..', 'templates/tests.mustache'), 'utf8'),
      {projectName: toCase.snake(projectName)}
    ),
    {mode: 0o755}
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
      {projectName: toCase.snake(projectName)}
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
    ),
    {mode: 0o755}
  );
  await writeFile(
    `${projectRoot}/deploy_to_gemfury.sh`,
    mustache.render(
      await readFile(resolve(__dirname, '..', 'templates/deploytogemfury.mustache'), 'utf8')
    ),
    {mode: 0o755}
  );
  await writeFile(
    `${projectRoot}/notify_dependabot.sh`,
    mustache.render(
      await readFile(resolve(__dirname, '..', 'templates/notifydependabot.mustache'), 'utf8')
    ),
    {mode: 0o755}
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
    verificationCommand: './pipenv.sh; pipenv run ./tests.sh'
  };
}
