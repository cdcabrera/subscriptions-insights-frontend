import axios from 'axios';
import { serviceConfig, axiosConfig } from '../serviceConfig';
import { serviceCall } from '../api';

describe('ServiceConfig', () => {
  it('should have specific functions', () => {
    expect(serviceConfig).toMatchSnapshot('serviceConfig');
  });

  it('should do things consistently', () => {
    expect(serviceCall({})).toMatchSnapshot('001, original');
    // expect(new AxiosConfig({}).serviceCall()).toMatchSnapshot('001, class');
    expect(axiosConfig({})).toMatchSnapshot('001, funcs');
  });

  it('should pass a configuration to Axios', () => {
    // expect(serviceCall({})).toMatchSnapshot('001, original');
    // expect(new AxiosConfig({}).serviceCall()).toMatchSnapshot('001, class');
    const mockAxiosInstance = jest.fn();
    // const spy = jest.spyOn(axios, 'create').mockImplementation(config => ({ config }));
    // const spy = jest.spyOn(axios, 'create').mockImplementation(() => config => ({ config }));
    // const spy = jest.spyOn(axios, 'create').mockImplementation(() => config => jest.fn(config));
    const spy = jest.spyOn(axios, 'create').mockImplementation(() => {
      console.log('TEST >>> 001');
      return config => {
        console.log('TEST >>> 002', config);
        return {
          ...config
        };
      };
    });

    axiosConfig({ url: '/', cache: true, cancel: true, schema: [() => {}], transform: [() => {}] });
    expect(mockAxiosInstance.mock).toMatchSnapshot('002, function');
    // expect(spy.mock.calls).toMatchSnapshot('002, function');

    // mockAxiosInstance.mockClear();

    // new AxiosConfig({ url: '/', cache: true, cancel: true, schema: [() => {}], transform: [() => {}] }).serviceCall();
    // expect(mockAxiosInstance.mock.calls).toMatchSnapshot('002, class');

    // mockAxiosInstance.mockClear();
    spy.mockClear();
  });
});
