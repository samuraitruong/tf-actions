var http = require('./request');

function headers(token) {
  return {
    'Content-Type': 'application/vnd.api+json',
    'Authorization': 'Bearer ' + token,
  };
}
const apiUrl = 'https://app.terraform.io/api/v2';

async function getOrgs(token) {
  const url = `${apiUrl}/organizations`;

  const res = http.getAsync({ url, headers: headers(token) });
  return res.data || res;
}

async function getWorkspaces(token, organization_name) {
  const url = `${apiUrl}/organizations/${organization_name}/workspaces`;
  const results = await http.getAsync({ url, headers: headers(token) });
  return results.data;
}

async function getWorkspace(token, organization_name, name) {
  const url = `${apiUrl}/organizations/${organization_name}/workspaces/${name}`;
  const results = await http.getAsync({ url, headers: headers(token) });
  return results.data;
}

async function getWorkspaceVars(token, ws_id) {
  const url = `${apiUrl}/workspaces/${ws_id}/vars`;
  const results = await http.getAsync({ url, headers: headers(token) });
  return results.data;
}

async function updateVar(token, currentVar, value) {
  console.log('Update var ', currentVar.id, currentVar.attributes.key, value);
  const wsid = currentVar.links.self.split('/')[4];
  const url = `${apiUrl}/workspaces/${wsid}/vars/${currentVar.id}`;
  if (value && typeof value === 'string' && value.match(/^regex\|/gi)) {
    const arr = value.split('|');
    console.log('Update existing value using regex: ', arr);
    console.log('Current value: ', currentVar.attributes.value);
    currentVar.attributes.value = currentVar.attributes.value.replace(
      new RegExp(arr[1], 'ig'),
      arr[2],
    );
    console.log('New value: ', currentVar.attributes.value);
  } else currentVar.attributes.value = value;
  const results = await http.patchAsync({
    url,
    headers: headers(token),
    data: { data: currentVar },
  });
  return results.data;
}

async function createVar(token, wsId, name, value, hcl, sensitive) {
  console.log('Create new  var %s, value = %s', name, value);
  const url = `${apiUrl}/workspaces/${wsId}/vars`;
  const results = await http.postAsync({
    url,
    headers: headers(token),
    data: {
      data: {
        type: 'vars',
        attributes: {
          category: 'terraform',
          description: 'tf-actions-auto-created',
          key: name,
          value,
          hcl,
          sensitive,
        },
      },
    },
  });
  return results;
}

async function run(token, wsid) {
  const url = `${apiUrl}/runs`;

  return await http.postAsync({
    url,
    headers: headers(token),
    data: {
      data: {
        type: 'runs',
        relationships: {
          workspace: {
            data: {
              type: 'workspaces',
              id: wsid,
            },
          },
        },
        attributes: {
          message: 'Queued manually via the tf-actions',
          refresh: true,
        },
      },
    },
  });
}

module.exports = {
  run,
  getOrgs,
  getWorkspaces,
  getWorkspace,
  getWorkspaceVars,
  updateVar,
  createVar,
};
