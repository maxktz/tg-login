import type { ProxyInterface } from "telegram/network/connection/TCPMTProxy";

export function mapTelegramProxyString(
  proxy?: string
): ProxyInterface | undefined {
  const { protocol, hostname, port, username, password } = proxy
    ? new URL(proxy!)
    : {};

  if (proxy) {
    // validate
    if (!protocol || !hostname || !port)
      throw new Error("Invalid PROXY format");
    if (protocol !== "socks4:" && protocol !== "socks5:")
      throw new Error(
        "Invalid PROXY format, only socks4 and socks5 protocols are supported"
      );
    // map
    return {
      socksType: protocol === "socks5:" ? 5 : 4,
      ip: hostname,
      port: Number(port),
      password: password || undefined,
      username: username || undefined,
    };
  }
}
