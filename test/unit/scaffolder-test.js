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

    fs.writeFile.resolves();
  });

  teardown(() => sandbox.restore());

  test('that the test file is written', async () => {
    const projectName = any.word();
    const projectRoot = any.word();
    const description = any.sentence();

    await scaffold({description, projectName, projectRoot})
      .then(() => {
        assert.calledWith(
          fs.writeFile,
          `${projectRoot}/tests.sh`,
          sinon.match(`pytest --cov=${projectName}`),
          {mode: 755}
        );
        assert.calledWith(
          fs.writeFile,
          `${projectRoot}/tests.sh`,
          sinon.match(`flake8 ${projectName}`),
          {mode: 755}
        );
        assert.calledWith(fs.writeFile, `${projectRoot}/Pipfile`);
        assert.calledWith(
          fs.writeFile,
          `${projectRoot}/setup.cfg`,
          sinon.match(`version_variable = ${projectName}/__init__.py:__version__`)
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
          {mode: 755}
        );
        assert.calledWith(
          fs.writeFile,
          `${projectRoot}/deploy_to_gemfury.sh`,
          sinon.match.any,
          {mode: 755},
        );
        assert.calledWith(
          fs.writeFile,
          `${projectRoot}/notify_dependabot.sh`,
          sinon.match.any,
          {mode: 755},
        );
        assert.calledWith(fs.writeFile, `${projectRoot}/.gitignore`);
      });
  });
});
