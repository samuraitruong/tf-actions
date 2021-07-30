var http = require('./request');

function headers(token) {
  return {
    Authorization: 'Bearer ' + token,
  };
}
async function getOrgs(token) {
  const url = 'https://app.terraform.io/api/v2/organizations';

  return http.getAsync({ url, headers: headers(token) });
}

async function getWorkspaces(token, organization_name) {
  const url = `https://app.terraform.io/api/v2/organizations/${organization_name}/workspaces`;
  const results = await http.getAsync({ url, headers: headers(token) });
  console.log(results);
  return results.data;
}

async function getWorkspace(token, organization_name, name) {
  const url = `https://app.terraform.io/api/v2/organizations/${organization_name}/workspaces/${name}`;
  const results = await http.getAsync({ url, headers: headers(token) });
  return results.data;
}

async function getWorkspaceVars(token, ws_id) {
  const url = `https://app.terraform.io/api/v2/workspaces/${ws_id}/vars`;
  const results = await http.getAsync({ url, headers: headers(token) });
  return results.data;
}
module.exports = {
  getOrgs,
  getWorkspaces,
  getWorkspace,
  getWorkspaceVars,
};
