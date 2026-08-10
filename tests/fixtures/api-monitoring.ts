import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface FailedRequest {
  url: string;
  method: string;
  status: number;
  error: string;
  timestamp: Date;
  testFile: string;
  testCase: string;
  requestBody?: any;
  responseBody?: any;
}

const failedRequests: FailedRequest[] = [];

/**
 * Documented API contracts that respond 4xx during normal app operation —
 * production traffic produces these too, so they are not failures. Keep this
 * list narrow: method + path + status + exact body.
 */
function isExpectedContractResponse(
  method: string,
  url: string,
  status: number,
  responseBody: unknown,
): boolean {
  // GET /api/v2/cloud-devices/{particleId} returns 400 "Device does not
  // exist" until the Brewskey device record is created (the NUX/WiFi screens
  // poll online status before creation) — the legacy-pinned contract.
  return (
    method === 'GET' &&
    /\/api\/v2\/cloud-devices\/[^/]+\/?(\?|$)/.test(url) &&
    status === 400 &&
    responseBody === 'Device does not exist'
  );
}

export function setupAPIMonitoring(
  page: Page,
  testFile: string,
  testCase: string,
): void {
  page.on('response', async (response) => {
    const url = response.url();
    if (!response.ok() && url.includes('/api/v2/')) {
      let requestBody: any = undefined;
      let responseBody: any = undefined;

      try {
        const request = response.request();
        const postData = request.postData();
        if (postData) {
          requestBody = JSON.parse(postData);
        }
      } catch (e) {
        // Ignore parsing errors
      }
      try {
        responseBody = await response.json();
      } catch (e) {
        try {
          // Plain-text error bodies (e.g. ASP.NET Core BadRequest(string))
          responseBody = await response.text();
        } catch (textError) {
          // Ignore body-read errors
        }
      }

      if (
        isExpectedContractResponse(
          response.request().method(),
          url,
          response.status(),
          responseBody,
        )
      ) {
        return;
      }

      failedRequests.push({
        url,
        method: response.request().method(),
        status: response.status(),
        error: response.statusText(),
        timestamp: new Date(),
        testFile,
        testCase,
        requestBody,
        responseBody,
      });
    }
  });
}

export function getFailedRequests(): FailedRequest[] {
  return failedRequests;
}

export function clearFailedRequests(): void {
  failedRequests.length = 0;
}

export function generateFailureReport(): string {
  if (failedRequests.length === 0) {
    return '# API Request Failures\n\nNo failures detected.\n';
  }

  const criticalFailures = failedRequests.filter((f) => f.status >= 500);
  const highPriorityFailures = failedRequests.filter(
    (f) => f.status >= 400 && f.status < 500,
  );
  const mediumPriorityFailures = failedRequests.filter(
    (f) => f.status >= 300 && f.status < 400,
  );

  let report = `# API Request Failures\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `Total Failures: ${failedRequests.length}\n`;
  report += `- Critical (5xx): ${criticalFailures.length}\n`;
  report += `- High Priority (4xx): ${highPriorityFailures.length}\n`;
  report += `- Medium Priority (3xx): ${mediumPriorityFailures.length}\n\n`;

  if (criticalFailures.length > 0) {
    report += `## Critical Failures\n\n`;
    criticalFailures.forEach((failure, index) => {
      report += `### ${index + 1}. ${failure.method} ${failure.url}\n\n`;
      report += `- **Test File:** \`${failure.testFile}\`\n`;
      report += `- **Test Case:** ${failure.testCase}\n`;
      report += `- **Status Code:** ${failure.status}\n`;
      report += `- **Error:** ${failure.error}\n`;
      report += `- **Timestamp:** ${failure.timestamp.toISOString()}\n`;
      if (failure.requestBody) {
        report += `- **Request Body:**\n\`\`\`json\n${JSON.stringify(failure.requestBody, null, 2)}\n\`\`\`\n`;
      }
      if (failure.responseBody) {
        report += `- **Response Body:**\n\`\`\`json\n${JSON.stringify(failure.responseBody, null, 2)}\n\`\`\`\n`;
      }
      report += `- **Fix Status:** Pending\n\n`;
    });
  }

  if (highPriorityFailures.length > 0) {
    report += `## High Priority Failures\n\n`;
    highPriorityFailures.forEach((failure, index) => {
      report += `### ${index + 1}. ${failure.method} ${failure.url}\n\n`;
      report += `- **Test File:** \`${failure.testFile}\`\n`;
      report += `- **Test Case:** ${failure.testCase}\n`;
      report += `- **Status Code:** ${failure.status}\n`;
      report += `- **Error:** ${failure.error}\n`;
      report += `- **Timestamp:** ${failure.timestamp.toISOString()}\n`;
      report += `- **Fix Status:** Pending\n\n`;
    });
  }

  if (mediumPriorityFailures.length > 0) {
    report += `## Medium Priority Failures\n\n`;
    mediumPriorityFailures.forEach((failure, index) => {
      report += `### ${index + 1}. ${failure.method} ${failure.url}\n\n`;
      report += `- **Test File:** \`${failure.testFile}\`\n`;
      report += `- **Test Case:** ${failure.testCase}\n`;
      report += `- **Status Code:** ${failure.status}\n`;
      report += `- **Error:** ${failure.error}\n`;
      report += `- **Timestamp:** ${failure.timestamp.toISOString()}\n`;
      report += `- **Fix Status:** Pending\n\n`;
    });
  }

  return report;
}

export async function writeFailureReport(filePath: string): Promise<void> {
  const report = generateFailureReport();
  await fs.promises.writeFile(filePath, report, 'utf-8');
}
