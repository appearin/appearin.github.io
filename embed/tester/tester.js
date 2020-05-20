import { define, html, ref } from "../web_modules/heresy.js";
import "../whereby-embed.js";

const boolAttrs = [
  "audio",
  "background",
  "chat",
  "minimal",
  "emptyRoomInvitation",
  "help",
  "leaveButton",
  "precallReview",
  "recording",
  "video"
];

define("WherebyTester", {
  style(self) {
    return `
    ${self} {
      display: block;
    }
    ${self} .attr-name {
      display: inline-block;
      width: 12em;
      margin-left: 2em;
    }
    ${self} label {
      margin-left: 3em;
    }
    `;
  },
  render({ useState }) {
    const [attrs, setAttrs] = useState(
      boolAttrs.reduce((o, key) => ({ ...o, [key]: null }), {})
    );
    const onchange = e => {
      console.log(e);
      const {
        target: { checked, value, name }
      } = e;
      this.embedRef.current[name.toLowerCase()] = value || null;
      setAttrs({ ...attrs, [name]: value || null });
    };

    this.html`
      <p>Your code:</p>
      <code class=block>
        &lt;script type=module
        src="https://whereby.dev/embed/whereby-embed.js"&gt;&lt;/script&gt;<br>
        &lt;style&gt;whereby-embed { <em>height: 500px;</em> }&lt;/style&gt;<br>
        &lt;whereby-embed
        <em>
        ${Object.entries(attrs)
          .filter(([k, v]) => v != null)
          .map(([k, v]) => (v == "on" ? k : `${k}=off`))
          .join(" ")}
          </em>
        subdomain=<em>yourcompany</em>
        room="<em>/your_room</em>"&gt;&lt;/whereby-embed&gt;
      </code>
      
      <p>${Object.entries(attrs).map(
        ([k, v]) => html`
          <span class="attr-name">${k}</span>
          <label>
            <input
              name=${k}
              type="radio"
              value=""
              data-key=${k}
              onchange=${onchange}
              checked=${!v}
            />
            &ndash;
          </label>

          <label>
            <input
              name=${k}
              type="radio"
              value="on"
              data-key=${k}
              onchange=${onchange}
              checked=${v == "on"}
            />
            on
          </label>

          <label>
            <input
              name=${k}
              type="radio"
              value="off"
              data-key=${k}
              onchange=${onchange}
              checked=${v == "off"}
            />
            off
          </label>
          <br />
        `
      )}
      
      <style>whereby-embed { height: 500px; }</style>
      <p><whereby-embed ref=${ref(this, "embedRef")}
        subdomain=businessdemo
        displayName="Embed demo"
        room="/check-check"></whereby-embed>
      `;
  }
});
