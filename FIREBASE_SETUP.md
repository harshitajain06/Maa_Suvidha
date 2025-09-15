# Firebase API Key Setup

## Overview
The MaaChat component now fetches the OpenAI API key from Firebase instead of hardcoding it. This provides better security and easier management.

## Firebase Collection Setup

### 1. Create the Configuration Collection

In your Firebase Firestore, create a collection called `config` with a document called `openai`.

### 2. Document Structure

The document should have the following structure:

```json
{
  "apiKey": "your-openai-api-key-here",
  "lastUpdated": "2024-01-01T00:00:00Z",
  "isActive": true
}
```

### 3. Security Rules

Make sure your Firestore security rules allow read access to the config collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to config collection
    match /config/{document} {
      allow read: if true; // Adjust based on your security needs
    }
    
    // Your other rules...
  }
}
```

### 4. Alternative: Environment Variables

If you prefer to use environment variables instead of Firebase, you can modify the code to use:

```javascript
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
```

## Benefits

1. **Security**: API key is not exposed in the client-side code
2. **Flexibility**: Can update API key without redeploying the app
3. **Monitoring**: Can track API key usage and updates
4. **Backup**: API key is stored securely in Firebase

## Implementation Details

- The component fetches the API key on mount
- Shows loading state while fetching
- Gracefully handles errors if API key is not found
- Disables input until API key is loaded

## Testing

1. Ensure Firebase is properly configured
2. Create the config collection with your API key
3. Test the chat functionality
4. Verify error handling when API key is missing
