import { GHLApiClient } from '../clients/ghl-api-client.js';
import {
  MCPGetFormsParams,
  MCPGetFormSubmissionsParams,
  GHLGetFormsResponse,
  GHLGetFormSubmissionsResponse,
  GHLForm,
  GHLFormSubmission
} from '../types/ghl-types.js';

export interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

/**
 * FormTools class for GoHighLevel Forms API endpoints.
 *
 * UNVERIFIED as of this writing: whether these two endpoints, called with a
 * Private Integration Token rather than an OAuth-connected user token, return
 * the same shape as GHLGetFormsResponse and GHLGetFormSubmissionsResponse in
 * ghl-types.ts (those shapes are copied from an already-live-verified OAuth
 * read in a different repository, Business/Altus-Altitude). This plan's
 * Part B, Task 9 live-probe script is the check that confirms or corrects
 * them against a real location using this exact credential type.
 */
export class FormTools {
  constructor(private ghlClient: GHLApiClient) {}

  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'get_forms',
        description: 'Get the list of forms built in the GoHighLevel location',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Maximum number of forms to return', minimum: 1, maximum: 100 },
            skip: { type: 'number', description: 'Number of forms to skip', minimum: 0 },
            type: { type: 'string', description: 'Filter by form type', enum: ['form', 'survey'] }
          },
          required: []
        }
      },
      {
        name: 'get_form_submissions',
        description: 'Get submissions for a form, or for every form in the location when formId is omitted',
        inputSchema: {
          type: 'object',
          properties: {
            formId: { type: 'string', description: 'Form ID to filter submissions by' },
            limit: { type: 'number', description: 'Maximum number of submissions to return', minimum: 1, maximum: 100 },
            page: { type: 'number', description: 'Page number, 1-based', minimum: 1 }
          },
          required: []
        }
      }
    ];
  }

  async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_forms':
        return this.getForms(args as MCPGetFormsParams);

      case 'get_form_submissions':
        return this.getFormSubmissions(args as MCPGetFormSubmissionsParams);

      default:
        throw new Error(`Unknown form tool: ${name}`);
    }
  }

  /**
   * GET FORMS
   */
  private async getForms(params: MCPGetFormsParams = {}): Promise<{ success: boolean; forms: GHLForm[]; message: string }> {
    try {
      const response = await this.ghlClient.getForms({
        locationId: this.ghlClient.getConfig().locationId,
        limit: params.limit,
        skip: params.skip,
        type: params.type
      });

      if (!response.success || !response.data) {
        const errorMsg = response.error?.message || 'Unknown API error';
        throw new Error(`API request failed: ${errorMsg}`);
      }

      const data = response.data as GHLGetFormsResponse;
      const forms = Array.isArray(data.forms) ? data.forms : [];

      return {
        success: true,
        forms,
        message: `Retrieved ${forms.length} forms`
      };
    } catch (error) {
      throw new Error(`Failed to get forms: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * GET FORM SUBMISSIONS
   */
  private async getFormSubmissions(
    params: MCPGetFormSubmissionsParams = {}
  ): Promise<{ success: boolean; submissions: GHLFormSubmission[]; total: number | null; message: string }> {
    try {
      const response = await this.ghlClient.getFormSubmissions({
        locationId: this.ghlClient.getConfig().locationId,
        formId: params.formId,
        limit: params.limit,
        page: params.page
      });

      if (!response.success || !response.data) {
        const errorMsg = response.error?.message || 'Unknown API error';
        throw new Error(`API request failed: ${errorMsg}`);
      }

      const data = response.data as GHLGetFormSubmissionsResponse;
      const submissions = Array.isArray(data.submissions) ? data.submissions : [];
      const total = typeof data.meta?.total === 'number' ? data.meta.total : null;

      return {
        success: true,
        submissions,
        total,
        message: `Retrieved ${submissions.length} form submissions`
      };
    } catch (error) {
      throw new Error(`Failed to get form submissions: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
