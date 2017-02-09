
export const DefaultEventTypes = {
  UPDATE: 'WRAMP_UPDATE',
  EFFECT: 'WRAMP_EFFECT',
};

export const isUpdate = name =>
  name[0] === '$' && name[1] !== '$';

export const isEffect = name =>
  name[0] === '$' && name[1] === '$';
