declare module "*.yml" {
  const data: unknown;
  export default data;
}

declare module "*.yaml" {
  const data: unknown;
  export default data;
}

declare module "@content/resources/cloud.yml" {
  const data: { resources: import("../components/ResourceList").Resource[] };
  export default data;
}

declare module "@content/resources/security.yml" {
  const data: { resources: import("../components/ResourceList").Resource[] };
  export default data;
}

declare module "@content/resources/networking.yml" {
  const data: { resources: import("../components/ResourceList").Resource[] };
  export default data;
}

declare module "@content/resources/devops.yml" {
  const data: { resources: import("../components/ResourceList").Resource[] };
  export default data;
}

declare module "@content/resources/data-ai.yml" {
  const data: { resources: import("../components/ResourceList").Resource[] };
  export default data;
}

declare module "@content/resources/linux.yml" {
  const data: { resources: import("../components/ResourceList").Resource[] };
  export default data;
}

declare module "@content/resources/pm-itsm.yml" {
  const data: { resources: import("../components/ResourceList").Resource[] };
  export default data;
}
