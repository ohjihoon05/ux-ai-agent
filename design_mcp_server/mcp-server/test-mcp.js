/**
 * Simple MCP Server Test
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'dist', 'index.js');

console.log('🧪 Testing MCP Server...\n');

// Test 1: List tools
console.log('Test 1: List available tools');
const testListTools = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'inherit'],
});

testListTools.stdin.write(
  JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
  }) + '\n'
);

testListTools.stdout.on('data', (data) => {
  const output = data.toString();
  try {
    const response = JSON.parse(output);
    if (response.result && response.result.tools) {
      console.log(`✅ Found ${response.result.tools.length} tools:`);
      response.result.tools.forEach((tool) => {
        console.log(`   - ${tool.name}: ${tool.description}`);
      });
    }
  } catch (e) {
    console.log('Response:', output);
  }
});

testListTools.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Test 1 passed\n');
  } else {
    console.log(`\n❌ Test 1 failed with code ${code}\n`);
  }

  // Test 2: Search components
  console.log('Test 2: Search for button components');
  const testSearch = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'inherit'],
  });

  testSearch.stdin.write(
    JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'search-components',
        arguments: {
          query: 'button',
          limit: 3,
        },
      },
    }) + '\n'
  );

  testSearch.stdout.on('data', (data) => {
    const output = data.toString();
    try {
      const response = JSON.parse(output);
      if (response.result && response.result.content) {
        console.log('✅ Search results:');
        console.log(response.result.content[0].text.substring(0, 500) + '...');
      }
    } catch (e) {
      console.log('Response:', output);
    }
  });

  testSearch.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Test 2 passed\n');
      console.log('🎉 All tests completed!');
    } else {
      console.log(`\n❌ Test 2 failed with code ${code}\n`);
    }
    process.exit(0);
  });
});
