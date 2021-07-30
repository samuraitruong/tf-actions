(async () => {
  const env = require('./env');
  const http = require('./lib/request');
  const tf = require('./lib/tf');

  const data = await http.getAsync({
    url: 'https://api64.ipify.org?format=json',
    headers: {},
  });
  console.log(data);

  const orgs = await tf.getOrgs(env.token);

  console.log('orgs', orgs);
  const wss = await tf.getWorkspaces(env.token, env.tf_org);

  console.log('workspaces', wss);

  const ws = await tf.getWorkspace(env.token, env.tf_org, env.ws_name);

  console.log('ws', ws);
})();
