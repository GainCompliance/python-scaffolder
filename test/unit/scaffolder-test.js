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

    await scaffold({projectName, projectRoot})
      .then(() => {
        assert.calledWith(
          fs.writeFile,
          `${projectRoot}/tests.sh`,
          sinon.match(`--cover-package=${projectName}`)
        );
        assert.calledWith(
          fs.writeFile,
          `${projectRoot}/tests.sh`,
          sinon.match(`flake8 ./${projectName}`)
        );
      });
  });
});
