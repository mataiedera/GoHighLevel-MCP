/**
 * Unit Tests for GHLApiClient forms methods
 */

import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import { GHLApiClient } from '../../src/clients/ghl-api-client.js';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn()
    }))
  }
}));

import axios from 'axios';
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('GHLApiClient forms methods', () => {
  let ghlClient: GHLApiClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    };

    mockAxios.create.mockReturnValue(mockAxiosInstance);
    // GHLApiClient's constructor requires an explicit config object (it does
    // not read process.env itself, unlike the pre-existing, already-broken
    // tests/clients/ghl-api-client.test.ts). See callers in src/server.ts and
    // src/http-server.ts for the real construction pattern this mirrors.
    ghlClient = new GHLApiClient({
      accessToken: 'test_api_key_123',
      baseUrl: 'https://test.leadconnectorhq.com',
      version: '2021-07-28',
      locationId: 'test_location_123'
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getForms', () => {
    it('should get forms successfully', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: { forms: [{ id: 'form_1', name: 'Contact Us' }] }
      });

      const result = await ghlClient.getForms({ locationId: 'test_location_123' });

      expect(result.success).toBe(true);
      expect(result.data?.forms).toHaveLength(1);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/forms/', {
        params: { locationId: 'test_location_123' }
      });
    });

    it('should pass limit, skip and type when provided', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: { forms: [] } });

      await ghlClient.getForms({ locationId: 'test_location_123', limit: 20, skip: 5, type: 'survey' });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/forms/', {
        params: { locationId: 'test_location_123', limit: 20, skip: 5, type: 'survey' }
      });
    });

    it('should throw a wrapped error on API failure', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce({
        response: { status: 401, data: { message: 'Invalid Private Integration token' } },
        isAxiosError: true
      });

      await expect(ghlClient.getForms({ locationId: 'test_location_123' })).rejects.toThrow(
        'GHL API Error (401): Invalid Private Integration token'
      );
    });
  });

  describe('getFormSubmissions', () => {
    it('should get form submissions successfully', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: { submissions: [{ id: 'sub_1', formId: 'form_1' }], meta: { total: 1 } }
      });

      const result = await ghlClient.getFormSubmissions({ locationId: 'test_location_123' });

      expect(result.success).toBe(true);
      expect(result.data?.submissions).toHaveLength(1);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/forms/submissions', {
        params: { locationId: 'test_location_123' }
      });
    });

    it('should pass formId, limit and page when provided', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: { submissions: [] } });

      await ghlClient.getFormSubmissions({ locationId: 'test_location_123', formId: 'form_1', limit: 10, page: 2 });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/forms/submissions', {
        params: { locationId: 'test_location_123', formId: 'form_1', limit: 10, page: 2 }
      });
    });
  });
});
