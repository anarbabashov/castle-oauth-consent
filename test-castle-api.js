#!/usr/bin/env node

// Simple test script for Castle OAuth API endpoints
// Usage: node test-castle-api.js

const API_BASE_URL = "https://dev.api.savewithcastle.com";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ldGZvcnVtK2N5YnJpZHRlc3RAZ21haWwuY29tIiwiaWQiOjc3LCJvcmdhbml6YXRpb25JZCI6NjYsInJvbGUiOiJvd25lciIsInByb3ZpZGVyIjoibm9uZSIsImlhdCI6MTc0OTc1ODM4NSwiZXhwIjoxNzc1Njc4Mzg1fQ.Drrci1wgqu5HaDgRrkn3S8MwuNtdjFV7IErwz5Mp6h0";

async function testOAuthScopes() {
  console.log("🔌 Testing GET /oauth/scopes...");

  const url = `${API_BASE_URL}/oauth/scopes?client_id=8f9a0002-ae0f-4412-ac4c-902f1e88e5ff&scope=conversion`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: AUTH_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Success! Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function testOAuthAuthorize() {
  console.log("\n🔐 Testing POST /oauth/authorize...");

  const params = new URLSearchParams({
    client_id: "8f9a0002-ae0f-4412-ac4c-902f1e88e5ff",
    redirect_uri:
      "https://zapier.com/dashboard/auth/oauth/return/App222291CLIAPI/",
    response_type: "code",
    scope: "conversion",
    code_challenge: "BSupaW6JDyiPDgU4HM8wkLj94DELW0BvsxPAoO2d5XA",
    code_challenge_method: "S256",
    state: "-G2EoDooYcrJ5p8EF1AM677T8BvnSMxQMU4HtUjoQ4Y",
  });

  const url = `${API_BASE_URL}/oauth/authorize?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: AUTH_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Success! Response:", JSON.stringify(data, null, 2));

    // Test the redirect URL construction
    if (data.code) {
      const redirectUrl = `https://zapier.com/dashboard/auth/oauth/return/App222291CLIAPI/?code=${data.code}&state=-G2EoDooYcrJ5p8EF1AM677T8BvnSMxQMU4HtUjoQ4Y`;
      console.log("🔗 Generated Redirect URL:", redirectUrl);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function main() {
  console.log("🧪 Castle OAuth API Test Script");
  console.log("===============================\n");

  await testOAuthScopes();
  await testOAuthAuthorize();

  console.log("\n✨ Test completed!");
}

main().catch(console.error);
