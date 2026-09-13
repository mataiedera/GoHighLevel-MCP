/**
 * Unit Tests for Form Tools
 * Tests both forms MCP tools
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { FormTools } from '../../src/tools/form-tools.js';
import { MockGHLApiClient } from '../mocks/ghl-api-client.mock.js';

describe('FormTools', () => {
  let formTools: FormTools;
  let mockGhlClient: MockGHLApiClient;

  beforeEach(() => {
    mockGhlClient = new MockGHLApiClient();
    formTools = new FormTools(mockGhlClient as any);
  });

  describe('getToolDefinitions', () => {
    it('should return 2 form tool definitions', () => {
      const tools = formTools.getToolDefinitions();
      expect(tools).toHaveLength(2);

      const toolNames = tools.map((tool) => tool.name);
      expect(toolNames).toEqual(['get_forms', 'get_form_submissions']);
    });

    it('should have proper schema definitions for all tools', () => {
      const tools = formTools.getToolDefinitions();

      tools.forEach((tool) => {
        expect(tool.name).toBeDefined();
        expect(tool.description).toBeDefined();
        expect(tool.inputSchema).toBeDefined();
        expect(tool.inputSchema.type).toBe('object');
        expect(tool.inputSchema.properties).toBeDefined();
      });
    });
  });

  describe('executeTool', () => {
    it('should route get_forms to getForms', async () => {
      const spy = jest.spyOn(formTools as any, 'getForms');
      await formTools.executeTool('get_forms', {});
      expect(spy).toHaveBeenCalled();
    });

    it('should route get_form_submissions to getFormSubmissions', async () => {
      const spy = jest.spyOn(formTools as any, 'getFormSubmissions');
      await formTools.executeTool('get_form_submissions', {});
      expect(spy).toHaveBeenCalled();
    });

    it('should throw error for unknown tool', async () => {
      await expect(formTools.executeTool('unknown_tool', {})).rejects.toThrow('Unknown form tool: unknown_tool');
    });
  });

  describe('get_forms', () => {
    it('should return forms from the client', async () => {
      const result = await formTools.executeTool('get_forms', {});
      expect(result.success).toBe(true);
      expect(result.forms).toHaveLength(1);
      expect(result.forms[0].name).toBe('Contact Us');
      expect(result.message).toBe('Retrieved 1 forms');
    });
  });

  describe('get_form_submissions', () => {
    it('should return submissions from the client', async () => {
      const result = await formTools.executeTool('get_form_submissions', { formId: 'form_1' });
      expect(result.success).toBe(true);
      expect(result.submissions).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });
});
