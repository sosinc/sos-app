export default (obj: any, isCurrentOrg?: boolean) => {

    if (!obj.issue_link_template?.length) {
      obj = { ...obj, issue_link_template: null };
    }
    if (!obj.pr_link_template?.length) {
      obj = { ...obj, pr_link_template: null };
    }
    if (isCurrentOrg) {
      obj = { ...obj, organization_id: '' };
    }
    return obj;
  };
