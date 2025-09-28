import { useEffect } from "react";

export default function OAuthSuccess() {
  useEffect(() => {
    // Notify parent window
    if (window.opener) {
      window.opener.postMessage(
        { type: "OAUTH_SUCCESS", platform: new URLSearchParams(window.location.search).get("platform") },
        window.location.origin // restrict origin for security
      );
      window.close(); // Close the popup
    }
  }, []);

  return <p>Authentication successful. You can close this window.</p>;
}
