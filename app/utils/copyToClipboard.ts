export default async function copyToClipboard(text: string) {
  try {
    const permissions = await navigator.permissions.query({
      // @ts-expect-error
      name: "clipboard-write",
    });
    if (permissions.state === "granted" || permissions.state === "prompt") {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard!");
    } else {
      throw new Error(
        "Can't access the clipboard. Check your browser permissions."
      );
    }
  } catch (error) {
    alert("Error copying to clipboard");
  }
}
