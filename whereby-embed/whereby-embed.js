import { define } from "./web_modules/heresy.js";

define("WherebyEmbed", {
  observedAttributes: ["room", "background", "embed", "subdomain", "displayName"],
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
  render() {
    const { 
      background,
      chat,
      displayName,
      embed,
      emptyRoomInvitation,
      help,
      precallReview,
      recording,
      room,
      subdomain,
    } = this;
    if (!subdomain) return this.html`Whereby: Missing subdomain attr.`;
    if (!room) return this.html`Whereby: Missing room attr.`;
    const url = new URL(room, `https://${subdomain}.whereby.com`);
    url.search = new URLSearchParams({
      iframeSource: subdomain,
      ...(displayName && { displayName }),
      ...(background !== undefined && { background }),
      ...(chat !== undefined && { chat }),
      ...(embed !== undefined && { embed }),
      ...(emptyRoomInvitation !== undefined && { emptyRoomInvitation }),
      ...(help !== undefined && { help }),
      ...(precallReview !== undefined && { precallReview }),
      ...(recording !== undefined && { recording }),
      roomIntegrations: "off",
    });
    this.html`
      <iframe
        src=${url}
        allow="camera; microphone; fullscreen; speaker; display-capture" />
      `;
  }
});
