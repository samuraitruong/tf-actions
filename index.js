const core = require('@actions/core');
const github = require('@actions/github');
const tf = require('./lib/tf');

const inputs = [
  'token',
  'org_id',
  'ws_name',
  'var_names',
  'var_values',
  'hcl',
  'auto_create',
  'apply',
  'separator',
];

async function main() {
  try {
    const [
      token = '',
      org_id,
      ws_name,
      var_names = '',
      var_values,
      hcl = false,
      auto_create = true,
      apply = false,
      separator = ',',
    ] = inputs.map((prop) => core.getInput(prop));
    core.startGroup('Validation');
    if (!token) {
      throw new Error('Missing tf token');
    }

    const ws = await tf.getWorkspace(token, org_id, ws_name);
    if (!ws) {
      throw new Error('Workspaces name doest not exist name = ' + ws_name);
    }
    const names = var_names.split(separator);
    const values = var_values.split(separator);
    if (names.length !== values.length) {
      throw new Error(
        'Values and Names are mismatch, The length of 2  inputs (split by comma) need to be the same',
      );
    }
    core.info('All input are valid');
    core.info('var_values = ' + var_values);
    core.info('var_names = ' + var_names);
    core.endGroup();

    core.startGroup('Fetching variables');
    const vars = await tf.getWorkspaceVars(token, ws.id);
    vars.forEach((item) =>
      core.info(`Found var id = ${item.id} name = ${item.attributes.key}`),
    );
    core.info(`Found ${vars.length} variables in workspace ${ws_name}`);
    core.endGroup();

    let index = 0;
    for await (const varname of names) {
      core.startGroup('Update var: ' + varname);
      core.info(`New value: [${values[index]}]`);
      const currentVar = vars.find((x) => x.attributes.key === varname);
      if (!currentVar) {
        core.warning('Var not existing in the workspace ', varname);
        if (auto_create === 'true') {
          core.info('auto_create is on, create new var in workspaces');
          const res = await tf.createVar(
            token,
            ws.id,
            varname,
            values[index],
            hcl,
          );
          core.info('create var result', res);
        }
      } else {
        const currentVarValue = currentVar.attributes.value;
        if (currentVarValue === values[index]) {
          core.info(
            `Skip updating var ${varname} because old value and new value are identical`,
          );
        } else {
          const res = await tf.updateVar(token, currentVar, values[index]);
          core.info(
            `Updated var ${varname} from current value current value [${currentVarValue}] to new value [${res.attributes.value}]`,
            varname,
            currentVarValue,
            res.attributes.value,
          );
        }
      }
      index++;
      core.endGroup();
    }

    if (apply === 'true') {
      core.startGroup('TF run');
      core.info('Trigger terraform run via API');
      const applyResult = await tf.run(token, ws.id);
      core.info('TF run result', applyResult);

      core.endGroup();
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
