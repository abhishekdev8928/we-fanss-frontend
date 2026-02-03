export const OPERATIONS = {
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  PUBLISH: 'publish',
};

export const RESOURCES = Object.freeze({
  PROFESSION: 'profession',
  LANGUAGE: 'language',
  TRIVIA_TYPE: 'triviaType',
  SOCIAL_LINK: 'socialLink',
  GENRE: 'genre',
  CELEBRITY: 'celebrity',
  SECTION_TYPE: 'sectionType',
  SECTION_TEMPLATE: 'sectionTemplate',
  ROLE_MANAGEMENT: 'roleManagement', 
  USER_MANAGEMENT: 'userManagement', 
});

export const RESOURCE_MAPPING = {
  [RESOURCES.LANGUAGE]: "Language",
  [RESOURCES.TRIVIA_TYPE]: "Trivia Types",
  [RESOURCES.SOCIAL_LINK]: "Social Links",
  [RESOURCES.GENRE]: "Genre Master",
  [RESOURCES.CELEBRITY]: "Celebrity",
  [RESOURCES.SECTION_TYPE]: "Section Types",
  [RESOURCES.SECTION_TEMPLATE]: "Section Template",
};

export const ALL_RESOURCES = Object.values(RESOURCES);
