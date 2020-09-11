import { define } from "./web_modules/heresy.js";

const boolAttrs = [
  "audio",
  "background",
  "chat",
  "people",
  "embed",
  "emptyRoomInvitation",
  "help",
  "leaveButton",
  "precallReview",
  "recording",
  "screenshare",
  "video"
];

define("WherebyEmbed", {
  onconnected() {
    window.addEventListener("message", this);
  },
  ondisconnected() {
    window.removeEventListener("message", this);
  },
  observedAttributes: [
    "displayName",
    "minimal",
    "room",
    "subdomain",
    ...boolAttrs
  ].map(a => a.toLowerCase()),
  onattributechanged({ attributeName, oldValue }) {
    if (["room", "subdomain"].includes(attributeName) && oldValue == null) return;
    this.render();
  },
  style(self) {
    return `
    ${self} {
      display: block;
    }
    ${self} iframe {
      border: none;
      height: 100%;
      width: 100%;
    }
    `;
  },
  onmessage({ origin, data }) {
    const url = new URL(this.room, `https://${this.subdomain}.whereby.com`);
    if (origin !== url.origin) return;
    const { type, payload: detail } = data;
    this.dispatchEvent(new CustomEvent(type, { detail }));
  },
  render() {
    const { displayname: displayName, minimal, room } = this;
    if (!room) return this.html`Whereby: Missing room attr.`;
    // Get subdomain from room URL, or use it specified
    let subdomain = /https:\/\/([^.]+)\.whereby.com\/.+/.exec(room)?.[1] || this.subdomain;
    if (!subdomain) return this.html`Whereby: Missing subdomain attr.`;
    const url = new URL(room, `https://${subdomain}.whereby.com`);
    Object.entries({
      iframeSource: subdomain,
      ...(displayName && { displayName }),
      // the original ?embed name was confusing, so we give minimal
      ...(minimal != null && { embed: minimal }),
      ...boolAttrs.reduce(
        // add to URL if set in any way
        (o, v) => (this[v.toLowerCase()] != null ? { ...o, [v]: this[v.toLowerCase()] } : o),
        {}
      )
    }).forEach(([k, v]) => {
      if (!url.searchParams.has(k)) {
        url.searchParams.set(k, v);
      }
    });
    this.html`
      <iframe
        src=${url}
        allow="camera; microphone; fullscreen; speaker; display-capture" />
      `;
  }
});
