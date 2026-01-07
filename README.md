# ![nitter-redirect](images/icon32.png) Nitter Redirect

[![Donate](https://liberapay.com/assets/widgets/donate.svg)](https://liberapay.com/SimonBrazell/donate) [![Buy me a coffee](images/buy-me-a-coffee.png)](https://www.buymeacoffee.com/SimonBrazell)

[![Firefox Add-on](images/badge-amo.png)](https://addons.mozilla.org/en-US/firefox/addon/nitter-redirect/) [![Chrome Extension](images/badge-chrome.png)](https://chrome.google.com/webstore/detail/nitter-redirect/mohaicophfnifehkkkdbcejkflmgfkof)

A simple browser extension that redirects X (formerly Twitter) requests to [Nitter](https://github.com/zedeus/nitter), a privacy-friendly alternative.

## Features

*   **Comprehensive Redirects:** Automatically handles links from `x.com` (including `www` and `mobile` subdomains), `twitter.com`, `pbs.twimg.com`, and `video.twimg.com`.
*   **Custom Instance Management:** Easily select from a list of active instances or **add and manage your own custom Nitter URLs** directly from the popup.
*   **Privacy Focused:** No unnecessary permissions required. The extension only listens for requests to X/Twitter domains to perform the redirect.
*   **Easy Toggle:** Quickly enable or disable redirects via the toolbar icon.

## Build

1.  `npm install --global web-ext`
2.  `web-ext build`
3.  See `web-ext-artifacts/` for outputs.

## License

Code released under [the MIT license](LICENSE.txt).
