import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    hmr: process.env.PORT ? { clientPort: Number(process.env.PORT) } : undefined,
  },
})

/**
 * For dev:
 *    vercel dev
 * 
 * The vercel process kicks off, and with 'dev' it will spawn a vite process with yarn run dev using package.json
 * It will also set up an unnamed process running on node (translates JS to machine code) to handle api same way Vercel does
 * You may need to run: vercel login
 * This hooks up vercel to my account so that when I use vercel dev it will let me select a corresponding vercel project
 * to read the config set-up there.
 * My use-case does not have any relevant config to grab from the actual Vercel service, but it still asks because
 * it does this for ALL projects since many do need it.
 * 
 * The vercel process is a proxy that listens on localhost:3000 and either hits up Vite or api child-process 
 * based on whatever the incoming request is.
 * As part of process set-up, vercel will set up the child process Vite and try to start it on a specific port by
 * setting an Env var within it's own process scope, since a child process inherits parent Env vars unless the child
 * specifies its own var values.
 * It needs to do this so that it knows how to forward "network" requests to this process, since the process has
 * a localhost URL + port, that it listens on, so vercel will use whatever it configured as the endpoint specification
 * Issue is, by default Vite will listen on port 5173 unless specified in THIS config file, hence why we did it
 * 
 * The port Vite is on also receives socket messages for hot-reload on code-saving
 * The browser sends the request for websocket upgrade to Vite because the JS that the browser has tells it to.
 * Each connection is identified by two address-and-port pairs, one is the Vite one (localhost:3000), and the browser
 * also has an address and port, where each separate connection the browser makes may use its own browser port and addy
 * So the browser may have one port for websocket messages and one for http GET requests.
 * 
 * When the browser requests /, Vite reads index.html from disk and edits it in memory before replying:
 * It inserts this tag into <head>:
 * <script type="module" src="/@vite/client"></script>

/@vite/client is a file inside Vite itself
The browser sees the tag and requests GET /@vite/client. There's no such file in your project: 
Vite recognises that path and serves its own file instead:
node_modules/vite/dist/client/client.mjs     (33 KB)

Vite fills in settings before sending it
That file contains placeholders, words like __HMR_PORT__ that aren't real values yet. 
Before sending it, Vite does a find-and-replace using values from your config (vite.config.js)
The browser runs it, and it opens the WebSocket.

 * The reason we need the hmr line is because that is where the browser gets the port to connect to for the socket,
 * The browser will default to the port that the JS it got from Vite on the page load sends the request for the script for
 * Since the browser sends this request based on its JS: http://localhost:3000/@vite/client,
 * then its default port to run the script WITH is port 3000 with localhost since it assumes that's where Vite is, not
 * knowing that's a vercel proxy forwarding to Vite
 * Without hmr, this @vite/client file gets filled in with defaults, which is this localhost:3000, since that's where the
 * src="/@vite/client" request goes with the base URL prepended, goes to Vercel, forwards to Vite, gets file, sends back
 * to vercel, sends back to browser, browser thinks localhost:3000 is Vite as a fallback, runs the script using that since
 * the script tells it that it should default to that, and then it runs

Within @vite/client:
port = hmrPort || importMetaUrl.port

- metaURL is the URL where <script type="module" src="/@vite/client"></script> sends to http://localhost:3000/@vite/client
to get the file which the browser saves and can then import into the file's logic within the @vite/client file itself
- hmrPort is configured by Vercel when it gets the request for @vite/client using vite.config in the hmr: field,
which would default to undefined if unset, hence the @vite/client gets sent without it, so browser runs 
undefined || importMetaUrl.port, and:
import.meta.url   // "http://localhost:3000/@vite/client"


Flow:

browser                          Vite
   │── GET / Upgrade: websocket ──►│
   │◄── 101 Switching Protocols ───│
   │                               │   (connection stays open)
   │                               │
   │       ...you save a file...   │
   │◄── {"type":"update",...} ─────│
   │                               │
   │── GET /src/GuessArea.jsx ────►│   (separate, normal HTTP request)
   │◄── new code ──────────────────│
   │                               │
   │── close ─────────────────────►│

 */