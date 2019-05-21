import {assert} from 'chai';
import fs from 'mz/fs';
import sinon from 'sinon';
import any from '@travi/any';

import {scaffold} from '../../src/scaffolder';

suite('scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(fs, 'mkdir');

    fs.writeFile.resolves();
    fs.mkdir.resolves();
  });

  teardown(() => sandbox.restore());

  test('that the test file is written', async () => {
    const projectName = 'blah-some-kebab-project';
    const projectNameSnakeCase = 'blah_some_kebab_project';
    const projectRoot = any.word();
    const description = any.sentence();

    const result = await scaffold({description, projectName, projectRoot});

    assert.isEmpty(result.projectDetails);

    assert.calledWith(fs.mkdir, `${projectRoot}/.circleci`);
    assert.calledWith(fs.writeFile, `${projectRoot}/.circleci/config.yml`);

    assert.calledWith(fs.mkdir, `${projectRoot}/${projectNameSnakeCase}`);
    assert.calledWith(fs.writeFile, `${projectRoot}/${projectNameSnakeCase}/__init__.py`);

    assert.calledWith(fs.mkdir, `${projectRoot}/test`);
    assert.calledWith(fs.writeFile, `${projectRoot}/test/__init__.py`);
    assert.calledWith(fs.writeFile, `${projectRoot}/test/test_first.py`);

    assert.calledWith(fs.writeFile, `${projectRoot}/${projectNameSnakeCase}/__init__.py`);
    assert.calledWith(
      fs.writeFile,
      `${projectRoot}/tests.sh`,
      sinon.match(`pytest --cov=${projectNameSnakeCase}`),
      {mode: 0o755}
    );
    assert.calledWith(
      fs.writeFile,
      `${projectRoot}/tests.sh`,
      sinon.match(`flake8 ${projectNameSnakeCase}`),
      {mode: 0o755}
    );
    assert.calledWith(fs.writeFile, `${projectRoot}/Pipfile`);
    assert.calledWith(
      fs.writeFile,
      `${projectRoot}/setup.cfg`,
      sinon.match(`version_variable = ${projectNameSnakeCase}/__init__.py:__version__`)
    );
    assert.calledWith(
      fs.writeFile,
      `${projectRoot}/setup.py`,
      sinon.match(`description='${description}'`)
    );
    assert.calledWith(
      fs.writeFile,
      `${projectRoot}/pipenv.sh`,
      sinon.match.any,
      {mode: 0o755}
    );
    assert.calledWith(
      fs.writeFile,
      `${projectRoot}/deploy_to_gemfury.sh`,
      sinon.match.any,
      {mode: 0o755},
    );
    assert.calledWith(
      fs.writeFile,
      `${projectRoot}/notify_dependabot.sh`,
      sinon.match.any,
      {mode: 0o755},
    );
    assert.calledWith(fs.writeFile, `${projectRoot}/.gitignore`);
  });
});
