const tf = require('../lib/tf');

jest.setTimeout(30000);
describe('tf tests', () => {
  const token = process.env.TF_TOKEN;
  const ws_name = process.env.WS_NAME || 'tf-actions';
  const org_name = process.env.ORG_NAME || 'tnguyen';

  it('getOrgs should works', async () => {
    const result = await tf.getOrgs(token);
    expect(result.data.length).toBeGreaterThan(1);
  });

  it('getWorkspaces should works', async () => {
    const result = await tf.getWorkspaces(process.env.TF_TOKEN, org_name);
    expect(result.length).toBeGreaterThan(1);
    expect(result[0].type).toEqual('workspaces');
  });

  it('getWorkspace should works', async () => {
    const result = await tf.getWorkspace(token, org_name, ws_name);
    expect(result).not.toBeNull();
    expect(result.type).toEqual('workspaces');
  });

  it('getWorkspaceVars should works', async () => {
    const org = await tf.getWorkspace(token, org_name, ws_name);

    const result = await tf.getWorkspaceVars(token, org.id, ws_name);
    expect(result.length).toBeGreaterThan(1);
    expect(result[0].type).toEqual('vars');
  });

  it('updateVar should update previous value', async () => {
    const org = await tf.getWorkspace(token, org_name, ws_name);

    const [var1] = await tf.getWorkspaceVars(token, org.id, ws_name);

    expect(var1).not.toBeNull();

    await tf.updateVar(token, var1, 'test me');

    const vars = await tf.getWorkspaceVars(token, org.id, ws_name);

    const v = vars.find((x) => x.id === var1.id);

    expect(v.attributes.value).toEqual('test me');
  });

  it('updateVar should update with regex value', async () => {
    const org = await tf.getWorkspace(token, org_name, ws_name);

    const [var1] = await tf.getWorkspaceVars(token, org.id, ws_name);

    expect(var1).not.toBeNull();

    await tf.updateVar(token, var1, 'ABC 12345 BLA');

    let vars = await tf.getWorkspaceVars(token, org.id, ws_name);

    let v = vars.find((x) => x.id === var1.id);

    expect(v.attributes.value).toEqual('ABC 12345 BLA');

    await tf.updateVar(token, var1, 'regex|\\d{5}|00000');

    vars = await tf.getWorkspaceVars(token, org.id, ws_name);

    v = vars.find((x) => x.id === var1.id);

    expect(v.attributes.value).toEqual('ABC 00000 BLA');
  });
});
