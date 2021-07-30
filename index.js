const core = require('@actions/core');
const github = require('@actions/github');
const inputs = ['token', org_id, 'ws_name', 'var_names', 'var_values', 'hcl'];
const tf = require('./lib/tf');

async function main() {
  try {
    const [
      token = '',
      org_id,
      ws_name,
      var_names = '',
      var_values,
      hcl = false,
    ] = inputs.map((prop) => core.getInput(prop));

    if (!token) {
      throw new Error('Missing tf token');
    }
    const orgs = await tf.getOrgs(token);
    if (!orgs || !orgs.data.find((x) => x.id === org_id)) {
      throw new Error('Org ID not found');
    }

    const org = orgs.data.find((x) => x.id === org_id);

    consnole.log({ token, ws_name, var_names, var_values, hcl });
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
