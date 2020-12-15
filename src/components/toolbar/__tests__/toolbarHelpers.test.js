import { toolbarHelpers, getOptionsType } from '../toolbarHelpers';

describe('ToolbarHelpers', () => {
  it('should have specific types', () => {
    expect(toolbarHelpers).toMatchSnapshot('toolbarTypes');
  });

  it('should return an output for options selection', () => {
    expect(getOptionsType('sla')).toMatchSnapshot('getOptionsType:sla');
    expect(getOptionsType('usage')).toMatchSnapshot('getOptionsType:usage');
    expect(getOptionsType()).toMatchSnapshot('getOptionsType');
    expect(getOptionsType(null)).toMatchSnapshot('getOptionsType:null');
  });
});
