/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigManagementAPIClient } from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { SdkClient } from '../client';
import { SdkError, SdkErrorCode } from '../../error';

jest.mock('fs');
import * as fs from 'fs';
import {
  ChannelCredentials,
  ClientOptions,
  credentials,
  Interceptor,
  Metadata,
} from '@grpc/grpc-js';
import { LIB_VERSION } from '../../../version';
import { IdentityManagementAPIClient } from '../../../grpc/indykite/identity/v1beta1/identity_management_api';

const appCredential = {
  appSpaceId: '696e6479-6b69-4465-8000-010f00000000',
  appAgentId: '696e6479-6b69-4465-8000-050f00000000',
  endpoint: 'jarvis.local:8043',
  privateKeyJWK: {
    kty: 'EC',
    d: 'WNzV013IthOWgjef4eNVXzTQUYy6hb6DD5riu_5SZNI',
    use: 'sig',
    crv: 'P-256',
    kid: 'EfUEiFnOzA5PCp8SSksp7iXv7cHRehCsIGo6NAQ9H7w',
    x: 'sMeLa9xExlGkmo6tr2KSv4rqbYXdAM1RBkTNehZ_XfQ',
    y: 'FqBmruVIbVykGMWjVcv4VhN_XbMxW3rLqRcJ8mAUOdY',
    alg: 'ES256',
  },
};

class IdentityManagementAPIClientMock extends IdentityManagementAPIClient {
  endpoint: string;
  channelCredentials: ChannelCredentials;
  interceptors: Interceptor[];

  constructor(endpoint: string, channelCredentials: ChannelCredentials, options: ClientOptions) {
    super('ENDPOINT', credentials.createInsecure());
    this.endpoint = endpoint;
    this.channelCredentials = channelCredentials;
    this.interceptors = options.interceptors ?? [];
  }
}

describe('application credentials', () => {
  beforeEach(() => {
    delete process.env.INDYKITE_APPLICATION_CREDENTIALS;
    delete process.env.INDYKITE_APPLICATION_CREDENTIALS_FILE;
  });

  it('as string', () => {
    const sdk = SdkClient.createServiceInstance(
      ConfigManagementAPIClient,
      JSON.stringify(appCredential),
    );
    expect(sdk).resolves.toBeInstanceOf(SdkClient);
  });

  it('as env', () => {
    process.env.INDYKITE_APPLICATION_CREDENTIALS = JSON.stringify(appCredential);
    const sdk = SdkClient.createServiceInstance(ConfigManagementAPIClient);
    expect(sdk).resolves.toBeInstanceOf(SdkClient);
  });

  it('as file', () => {
    process.env.INDYKITE_APPLICATION_CREDENTIALS_FILE = 'file';
    const mockFunc = jest.fn(
      (
        path: fs.PathOrFileDescriptor,
        options?:
          | (fs.ObjectEncodingOptions & { flag?: string | undefined })
          | BufferEncoding
          | null
          | undefined,
      ): Buffer => {
        return Buffer.from(JSON.stringify(appCredential));
      },
    );

    jest.spyOn(fs, 'readFileSync').mockImplementation(mockFunc);
    const sdk = SdkClient.createServiceInstance(ConfigManagementAPIClient);
    expect(sdk).resolves.toBeInstanceOf(SdkClient);
  });

  it('missing', () => {
    const sdk = SdkClient.createServiceInstance(ConfigManagementAPIClient);
    expect(sdk).rejects.toEqual(
      new SdkError(SdkErrorCode.SDK_CODE_1, 'missing application credentials'),
    );
  });
});

describe('channel credential', () => {
  const originalNewChannelCredentialsFn = SdkClient['newChannelCredentials'];
  const err = new SdkError(SdkErrorCode.SDK_CODE_1, 'UNKNOWN');
  const staticFunc = jest.fn(() => {
    throw err;
  });

  beforeEach(() => {
    SdkClient['newChannelCredentials'] = staticFunc;
  });

  afterEach(() => {
    SdkClient['newChannelCredentials'] = originalNewChannelCredentialsFn;
  });

  it('identity instance', () => {
    const sdk = SdkClient.createIdentityInstance(ConfigManagementAPIClient, 'TOKEN', 'ENDPOINT');
    expect(sdk).rejects.toEqual(err);
  });

  it('service instance', () => {
    const sdk = SdkClient.createServiceInstance(
      ConfigManagementAPIClient,
      JSON.stringify(appCredential),
    );
    expect(sdk).rejects.toEqual(err);
  });
});

describe('call credential', () => {
  let createFromMetadataGeneratorMock: jest.SpyInstance;
  let createSslMock: jest.SpyInstance;

  beforeEach(() => {
    createFromMetadataGeneratorMock = jest
      .spyOn(credentials, 'createFromMetadataGenerator')
      .mockImplementation();
    createSslMock = jest.spyOn(credentials, 'createSsl').mockImplementation();
  });

  afterEach(() => {
    createFromMetadataGeneratorMock.mockRestore();
    createSslMock.mockRestore();
  });

  it('call credentials creation', async () => {
    try {
      await SdkClient.createIdentityInstance(ConfigManagementAPIClient, 'TOKEN', 'ENDPOINT');
    } catch (err) {
      // The instance can't be created because of invalid configuration,
      // but that's not a problem for this test.
    }
    expect(createFromMetadataGeneratorMock).toBeCalledTimes(1);

    createFromMetadataGeneratorMock.mock.calls[0][0](
      { service_url: '' },
      (err: Error | null, metadata: Metadata | null) => {
        expect(err).toBeNull();
        expect(metadata?.get('authorization')).toEqual(['Bearer TOKEN']);
        expect(metadata?.get('iksdk-version')).toEqual([LIB_VERSION]);
      },
    );
  });

  fit('interceptors', async () => {
    const sdk = await SdkClient.createIdentityInstance(
      IdentityManagementAPIClientMock,
      'TOKEN',
      'ENDPOINT',
    );
    const client = sdk.client as IdentityManagementAPIClientMock;
    expect(client.interceptors).toHaveLength(2);
    const [credentialsInterceptor, unauthenticatedStatusInterceptor] = client.interceptors;
    credentialsInterceptor({}, (options) => {
      
    });
  });
});
