import { define } from "./web_modules/heresy.js";

const boolAttrs = [
  "audio",
  "background",
  "chat",
  "embed",
  "emptyRoomInvitation",
  "help",
  "leaveButton",
  "precallReview",
  "recording",
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
    const { displayName, minimal, room, subdomain } = this;
    if (!subdomain) return this.html`Whereby: Missing subdomain attr.`;
    if (!room) return this.html`Whereby: Missing room attr.`;
    const url = new URL(room, `https://${subdomain}.whereby.com`);
    url.search = new URLSearchParams({
      iframeSource: subdomain,
      ...(displayName && { displayName }),
      // the original ?embed name was confusing, so we give minimal
      ...(minimal != null && { embed: minimal }),
      roomIntegrations: "off",
      ...boolAttrs.reduce(
        // add to URL if set in any way
        (o, v) => (this[v.toLowerCase()] != null ? { ...o, [v]: this[v.toLowerCase()] } : o),
        {}
      )
    });
    this.html`
      <iframe
        src=${url}
        allow="camera; microphone; fullscreen; speaker; display-capture" />
      `;
  }
});
