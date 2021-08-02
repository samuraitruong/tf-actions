# tf-actions

A simple TF action to update TF vars. below are few features the action supports

- update single var
- update multiple var
- update var using regrex value
- trigger TF run after update var

Note: the action using TF API V2

## Usage

### Update multiple vars

```yaml
- name: Run test action
  id: test
  uses: samuraitruong/tf-actions@main
  with:
    token: ${{secrets.TF_TOKEN}}
    org_id: 'tnguyen'
    ws_name: 'tf-actions'
    var_names: 'var1,var2,var3'
    var_values: 'value1_1,value2_2,value3_3'
    hcl: false
    auto_create: true
```

### Update var using regex replace

```yaml
- name: Update Hcl sub-field
  id: test
  uses: samuraitruong/tf-actions@main
  with:
    token: ${{secrets.TF_TOKEN}}
    org_id: 'tnguyen'
    ws_name: 'tf-actions'
    var_names: 'hcl_var'
    var_values: 'regex|image_tag\\s+=\\s+"([^"]*)"|image_tag = "${{github.run_number}}"'
    hcl: false
    auto_create: true
    apply: true
```

Above action will replace the image_tag field in hcl var in the sample below

```
{
  ignore = 1
  image_tag = "current value"

}
```

Check sample action here - (https://github.com/samuraitruong/tf-actions/blob/main/.github/workflows/sample.yaml)[https://github.com/samuraitruong/tf-actions/blob/main/.github/workflows/sample.yaml]

## Options

- token: Terraform API token
- org_name: Name of the terraform organization
- ws_name: workspace name
- var_names: List of variables name to update, multiple support by comma separator (or custom using `separator` input)
- var_values: list of values that map to the `var_names` list.
- hcl: If the var is HCL, using in combine with `auto_create` option
- auto_create: Create var with new values if var does not existing in workspace
- separator: the separator use to split `var_names` and `var_values`
- sensitive: set new created var to sensitive
- apply: trigger TF run after all the var were updated
